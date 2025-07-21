import React, { useState, useEffect } from 'react';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import './EmptyWishlist.css';
import {
  FaRegHeart,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaTimes
} from 'react-icons/fa';

export default function EmptyWishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hearted, setHearted] = useState({});

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/wishlist');
        if (!response.ok) {
          throw new Error('Failed to fetch wishlist items');
        }
        const data = await response.json();
        console.log('Fetched wishlist:', data);
        setItems(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching wishlist items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlistItems();
  }, []);

  const removeFromWishlist = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/${itemId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }
      setItems(items.filter(item => item._id !== itemId));
    } catch (err) {
      setError(err.message);
      console.error('Error removing item from wishlist:', err);
    }
  };

  const handleClear = async () => {
    for (const item of items) {
      await removeFromWishlist(item._id);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-layout">
        <Header />
        <div className="wishlist-page"><p>Loading wishlist...</p></div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-layout">
        <Header />
        <div className="wishlist-page">
          <p className="error-text">Error: {error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wishlist-layout">
      <Header />
      <div className="wishlist-content">
        <div className="wishlist-page">
          <div className="wishlist-header">
            <div className="breadcrumb">
              <a href="/" className="breadcrumb-link">Home</a>
              &nbsp;&gt;&nbsp;
              <button
                type="button"
                className="breadcrumb-link active"
                onClick={() => window.location.reload()}
              >
                Shop
              </button>
            </div>
            {items.length > 0 && (
              <button className="clear-link" onClick={handleClear}>
                Clear List
              </button>
            )}
          </div>
          <h2>My wishlist</h2>
          {items.length === 0 ? (
            <>
              <div className="empty-wishlist-header">
                <FaRegHeart className="empty-wishlist-heart" />
              </div>
              <p className="empty-text">Your wishlist is empty.</p>
            </>
          ) : (
            <div className="wishlist-grid">
              {items.map((product) => {
                const isHearted = hearted[product._id] ?? true;
                const HeartIcon = isHearted ? FaHeart : FaRegHeart;
                return (
                  <div className="wishlist-card" key={product._id} style={{ position: 'relative' }}>
                    <FaTimes
                      className="delete-x-icon"
                      style={{
                        color: '#000',
                        cursor: 'pointer',
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        opacity: 0.5,
                        transition: 'opacity 0.2s',
                        fontSize: '0.9rem',
                        background: '#fff',
                        borderRadius: '50%',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                      }}
                      title="Delete"
                      onClick={() => removeFromWishlist(product._id)}
                      onMouseOver={e => (e.currentTarget.style.opacity = 1)}
                      onMouseOut={e => (e.currentTarget.style.opacity = 0.5)}
                    />
                    <img src={product.image} alt={product.title} />
                    <HeartIcon
                      className="card-heart-icon"
                      style={{ color: isHearted ? '#ff2b2b' : '#aaa', cursor: 'pointer' }}
                      onClick={() => setHearted(h => ({ ...h, [product._id]: !isHearted }))}
                    />
                    <h4>{product.title}</h4>
                    <p>Rs {product.price?.toFixed ? product.price.toFixed(2) : product.price}</p>
                    <div className="rating">
                      <FaStar className="star-icon" />
                      <FaStar className="star-icon" />
                      <FaStar className="star-icon" />
                      <FaStar className="star-icon" />
                      <FaStarHalfAlt className="star-icon" />
                      <span>(121)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
