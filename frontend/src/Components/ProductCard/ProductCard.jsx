import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import RatingStars from '../RatingStars/RatingStars';
import { useNavigate } from 'react-router-dom';
import styles from './ProductCard.module.css';

const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;

const ProductCard = ({ product, variant = 'small' }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch(`${WISHLIST_URL}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/signin';
          return null;
        }
        return res.ok ? res.json() : null;
      })
      .then(data => {
        if (!data) return;
        const ids = data?.products?.map(p => p._id) || [];
        setWishlistIds(ids);
        setIsFavorite(ids.includes(product?._id));
      });
  }, [product?._id]);

  if (!product || typeof product !== 'object') {
    return null;
  }



  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in first.');
      window.location.href = '/signin';
      return;
    }
    const isInWishlist = wishlistIds.includes(product._id);
    const method = isInWishlist ? 'DELETE' : 'POST';
    try {
      const response = await fetch(`${WISHLIST_URL}/${product._id}`, {
        method,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401) {
        alert('Session expired. Please log in again.');
        window.location.href = '/signin';
        return;
      }
      if (!response.ok) {
        const error = await response.json();
        return alert(`Error: ${error.error || response.statusText}`);
      }
      // Refetch wishlist IDs
      const updated = await fetch(`${WISHLIST_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(res => {
        if (res.status === 401) {
          alert('Session expired. Please log in again.');
          window.location.href = '/signin';
          return null;
        }
        return res.json();
      });
      if (!updated) return;
      const updatedIds = updated?.products?.map(p => p._id) || [];
      setWishlistIds(updatedIds);
      setIsFavorite(updatedIds.includes(product._id));
      window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: updatedIds.length } }));
    } catch (err) {
      alert('Network error while updating wishlist.');
    }
  };

  const handleClick = () => {
    const productId = product._id || product.id;
    if (!productId) {
      console.error('Product ID is undefined!', product);
      return;
    }
    navigate(`/product/${productId}`);
  };

  return (
    <div
      className={`${styles.productCard} ${styles[variant] || ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') handleClick(); }}
    >
      <div className={styles.productImageContainer}>
        <img
          src={product.images?.[0] || '/images/placeholder.png'}
          alt={product.name}
          className={`${styles.productImg} ${isHovered ? styles.hoverScale : ''}`}
        />
        <button
          className={`${styles.favoriteButton} ${isHovered ? styles.buttonPop : ''}`}
          onClick={handleWishlistToggle}
          aria-label="Toggle favorite"
        >
          {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
        </button>
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productPrice}>Rs. {product.price?.toFixed(2)}</div>

        <div className={styles.ratingContainer}>
          <RatingStars rating={product.averageRating ?? product.rating} reviewCount={product.reviewCount} />
        </div>
        <button
          className={styles.addToCartButton}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          View
        </button>
      </div>
    </div>
  );
};
export default ProductCard;
