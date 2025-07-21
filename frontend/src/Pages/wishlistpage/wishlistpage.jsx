import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './wishlistpage.css';

// Components
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Sidebar from '../../Components/Sidebar/Sidebar';
import ProductCard from '../../Components/ProductCard/ProductCard';

// Icons
import { FaRegHeart } from 'react-icons/fa6';

// API endpoints (update base URL if needed)
const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;
const RECENTLY_VIEWED_URL = `${BASE_URL}/recentlyview`;

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${WISHLIST_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const products = data?.products?.filter(Boolean) || [];
        setWishlist(products);
        window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: products.length } }));
      });
  }, []);

  useEffect(() => {
    // Fetch recently viewed from localStorage
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(recentlyViewed);
  }, []);

  const handleRemove = async (index) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('No token found. Please log in again.');
    const productId = wishlist[index]._id;
    try {
      const response = await fetch(`${WISHLIST_URL}/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        return alert(`Failed to remove: ${error.error || response.statusText}`);
      }
      // Refresh wishlist
      const res = await fetch(`${WISHLIST_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setWishlist(data?.products?.filter(Boolean) || []);
      window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: (data?.products?.length || 0) } }));
    } catch (err) {
      console.error(err);
      alert('Network error while removing item.');
    }
  };

  const handleAddToWishlist = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in first.');
    if (!product?._id) return alert('Invalid product.');
    const wishlistIds = wishlist.map(item => String(item._id));
    if (wishlistIds.includes(String(product._id))) {
      return alert('Already in wishlist!');
    }
    try {
      const response = await fetch(`${WISHLIST_URL}/${product._id}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        return alert(`Failed to add: ${error.error || response.statusText}`);
      }
      // Refresh wishlist
      const res = await fetch(`${WISHLIST_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setWishlist(data?.products?.filter(Boolean) || []);
      window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: (data?.products?.length || 0) } }));
    } catch (err) {
      console.error(err);
      alert('Network error while adding to wishlist.');
    }
  };

  return (
    <div>
      <Header />

      <div className="wishlist-container page-padding">
        <div className="main-layout">
          <Sidebar />

          <div className="wishlist-content">
            {wishlist.length === 0 ? (
              <div className="wishlist-box">
                <div className="wishlist-heart-circle">
                  <FaRegHeart className="wishlist-heart-icon" />
                </div>
                <h3>Your wishlist is empty.</h3>
                <p>Browse our shop to find products you'll love.</p>
                <button onClick={() => navigate('/shop')}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <h2>My Wishlist</h2>
                {wishlist.map((item, index) => (
                  <div className="wishlist-item" key={item._id || index}>
                    <img
                      src={item?.image || item?.images?.[0]}
                      alt={item?.name}
                      className="wishlist-image"
                    />
                    <div className="wishlist-details">
                      <div className="wishlist-title">{item?.name}</div>
                      <div className="wishlist-text">
                        <span><strong>Sizes:</strong> {Array.isArray(item?.sizes) ? item.sizes.join(', ') : item?.size || '-'}</span>
                        <span><strong>Colors:</strong> {Array.isArray(item?.colors) ? item.colors.join(', ') : item?.color || '-'}</span>
                      </div>
                      <div className="wishlist-price">Rs. {item?.price?.toLocaleString?.() ?? item.price}</div>
                    </div>
                    <button
                      className="wishlist-view-btn"
                      onClick={() => navigate(`/product/${item._id}`)}
                    >
                      View
                    </button>
                    <button
                      className="wishlist-remove-btn"
                      onClick={() => handleRemove(index)}
                      title="Remove from wishlist"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="recently-viewed">
          <h3>Recently Viewed</h3>
          <div className="product-list" style={{ overflowX: 'auto', display: 'flex', gap: '24px', paddingBottom: '8px' }}>
            {recentlyViewed.length === 0 ? (
              <p>No recently viewed products.</p>
            ) : (
              recentlyViewed.map((product, index) => (
                <ProductCard key={product._id || index} product={{
                  ...product,
                  images: [product.image],
                  averageRating: product.averageRating || 4.5, // fallback
                  reviewCount: product.reviewCount || 121 // fallback
                }} variant="small" />
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
