import CartItemQuantity from "./cart-quantity";
import { Trash2 } from "lucide-react";
import "./cart-items.css";

export default function CartItems({
  items,
  updateQuantity,
  removeItem,
  loading,
  formatPrice,
}) {
  console.log('Cart items:', items);
  if (!items || items.length === 0) {
    return (
      <div className="cart-container empty-cart">
        <div className="empty-text">Your cart is empty</div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      {items.map((item) => (
        <div key={item._id} className="cart-item">
          <div className="cart-image-container">
            <img
              src={item.product?.images || item.images || (item.images && item.images[0]) || "/placeholder.svg"}
              alt={item.product?.name || item.name}
              className="cart-image"
            />
          </div>

          <div className="cart-details">
            <div className="cart-header">
              <div>
                <h3 className="cart-product-name">
                  {item.product?.name || item.name}
                </h3>
               <p className="cart-product-size">Size: {item.selectedSize || item.size}</p>
                <h3 className="cart-product-color">Color: {item.selectedColor || item.color}</h3>
                <h3 className="cart-product-price">
                  {formatPrice(item.priceAtTime || item.price || 0)}
                </h3>
              </div>
              <button
                onClick={() => removeItem(item._id)}
                className="cart-remove-btn"
                disabled={loading}
              >
                <Trash2 className="cart-trash-icon" />
              </button>
            </div>

            <div className="cart-footer">
              <CartItemQuantity
                quantity={item.quantity}
                onIncrease={() => updateQuantity(item._id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item._id, item.quantity - 1)}
                disabled={loading}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
