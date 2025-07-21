
import { useCart } from "./useCart";
import CartItems from "./cart-items";
import OrderSummary from "./order-summary";
import Footer from "../../Components/Footer/Footer";
import Header from "../../Components/Header/Header";
import { useCurrency } from "./useCurrency";
import React, { useState, useEffect } from "react";
import "./cart.css";
import Breadcrumb from "../../Components/breadcrumb";


export default function CartPage() {
  const { cart, loading, error, updateQuantity, removeItem, applyDiscount, fetchCart } = useCart();
  const { formatPrice } = useCurrency();
  const [localCart, setLocalCart] = useState([]);
  const [useLocal, setUseLocal] = useState(false);
  const tax = 250;
  const deliveryFee = 150;

  console.log('Cart state in page:', cart); // Debug log

  useEffect(() => {
    // If backend cart is empty, use localStorage cart
    if ((!cart?.items || cart.items.length === 0) && typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]');
      setLocalCart(stored);
      setUseLocal(true);
    } else {
      setUseLocal(false);
    }
  }, [cart]);

  useEffect(() => {
    function handleCartUpdated() {
      if (useLocal) {
        // For guests: re-read from localStorage
        const stored = JSON.parse(localStorage.getItem('cart') || '[]');
        setLocalCart(stored);
      } else {
        // For logged-in: re-fetch from backend
        if (typeof fetchCart === 'function') {
          fetchCart();
        }
      }
    }
    window.addEventListener('cart-updated', handleCartUpdated);
    return () => window.removeEventListener('cart-updated', handleCartUpdated);
  }, [useLocal, fetchCart]);

  // Deduplicate localCart by _id, size, color and sum quantities
  function deduplicateCart(items) {
    const map = new Map();
    for (const item of items) {
      const size = item.selectedSize || item.size || (Array.isArray(item.sizes) ? item.sizes[0] : null) || null;
      const color = item.selectedColor || item.color || (Array.isArray(item.colors) ? item.colors[0] : null) || null;
      const key = `${item._id || ''}|${size || ''}|${color || ''}`;
      if (map.has(key)) {
        map.get(key).quantity += item.quantity || 1;
      } else {
        map.set(key, { ...item, selectedSize: size, selectedColor: color, quantity: item.quantity || 1 });
      }
    }
    return Array.from(map.values());
  }

  let cartItems = useLocal ? deduplicateCart(localCart) : (cart?.items || []);
  let subtotal = useLocal
    ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    : cart?.subtotal || 0;
  let total = subtotal + tax + deliveryFee;

  // Update quantity for localStorage cart
  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    if (useLocal) {
      const updated = localCart.map(item =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setLocalCart(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  // Remove item for localStorage cart
  const handleRemoveItem = (itemId) => {
    if (useLocal) {
      const updated = localCart.filter(item => item._id !== itemId);
      setLocalCart(updated);
      localStorage.setItem('cart', JSON.stringify(updated));
      window.dispatchEvent(new Event('cart-updated'));
    } else {
      removeItem(itemId);
    }
  };

  return (
    <>
      <Header />
      <div className="cart-page-container">
        <div className="cart-page-content-wrapper">
          <Breadcrumb paths={["Home", "Cart"]} />
          <h1 className="cart-page-title">
            My Cart
            <span className="cart-page-title-underline"></span>
          </h1>

          <div className="cart-page-layout">
            <div className="cart-page-items-section">
              <CartItems
                items={cartItems}
                updateQuantity={handleUpdateQuantity}
                removeItem={handleRemoveItem}
                loading={loading} // Pass loading state
                formatPrice={formatPrice}
              />
            </div>
            <div className="cart-page-summary-section">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                deliveryFee={deliveryFee}
                total={total}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
