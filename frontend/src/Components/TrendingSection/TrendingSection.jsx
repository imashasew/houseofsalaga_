import React, { useEffect, useState } from 'react';
import './TrendingSection.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;

const TrendingSection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Fetch trending products from backend
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/trending');
        const updatedProducts = response.data
          .map(product => ({
            ...product,
            images: product.images.map(img => {
              if (typeof img !== 'string') {
                console.warn('Invalid image path:', img);
                return '';
              }
              if (img.startsWith('http') || img.startsWith('/images/')) {
                return img;
              }
              return `/images/${img}`;
            })
          }))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setProducts(updatedProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to load trending products');
        setLoading(false);
      }
    };
    fetchTrendingProducts();
  }, []);

  // Fetch user's wishlist IDs using token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${WISHLIST_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        const ids = data?.products?.map(p => p._id) || [];
        setWishlistIds(ids);
      });
  }, []);

  const handleClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleWishlistToggle = async (e, productId) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in first.');
    const isInWishlist = wishlistIds.includes(productId);
    const method = isInWishlist ? 'DELETE' : 'POST';
    try {
      const response = await fetch(`${WISHLIST_URL}/${productId}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        const error = await response.json();
        return alert(`Error: ${error.error || response.statusText}`);
      }
      // Refetch wishlist IDs
      const updated = await fetch(`${WISHLIST_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => res.json());
      const updatedIds = updated?.products?.map(p => p._id) || [];
      setWishlistIds(updatedIds);
      window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: updatedIds.length } }));
    } catch (err) {
      alert('Network error while updating wishlist.');
    }
  };

  if (loading) return <p>Loading trending products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="trending-section-wrapper">
      <section className="trending-section-main">
        <h2 className="trending-section-title">
          <span className="trending-section-bold">Trending</span> Collections
        </h2>
        <div className="trending-card-grid">
          {products.map(product => {
            const isWishlisted = wishlistIds.includes(product._id);
            return (
              <div
                key={product._id}
                className="trending-product-card"
                onClick={() => handleClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="trending-product-img"
                />
                <h3 className="trending-product-title">{product.name}</h3>
                <p className="trending-product-price">Price: Rs. {product.price.toFixed(2)}</p>
                <div
                  className="trending-heart-icon"
                  onClick={e => handleWishlistToggle(e, product._id)}
                  style={{ color: isWishlisted ? '#e63946' : '#754F23' }}
                >
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="trending-freedom-banner">
        <span className="trending-freedom-text">FREEDOM OVER ANYTHING</span>
        <span className="trending-freedom-icon">★</span>
      </div>
    </div>
  );
};

export default TrendingSection;
