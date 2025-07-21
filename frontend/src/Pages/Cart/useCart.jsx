import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000/api";

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch Cart");
      const data = await response.json();
      console.log('Fetched cart:', data); // Debug log
      setCart({ ...data }); // Force new reference
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cart/update-quantity`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ itemId, quantity }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update quantity");
      }

      setCart(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/cart/remove/${itemId}`,
        {
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      if (!response.ok) throw new Error("Failed to remove item");
      const data = await response.json();
      console.log('Cart after remove:', data); // Debug log
      setCart({ ...data }); // Force new reference
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyDiscount = async (discountCode) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/cart/apply-discount`, {
        method: "POST",
        headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ discountCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCart(data);
      return {
        success: true,
        message: data.message || "Discount applied successfully!",
      };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    updateQuantity,
    removeItem,
    applyDiscount,
    fetchCart, // Expose fetchCart directly
    refetch: fetchCart,
  };
};
