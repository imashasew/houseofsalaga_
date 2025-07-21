import React, { useEffect, useState } from 'react';
import {
  FaShoppingCart,
  FaChevronLeft,
  FaChevronRight,
  FaHeart,
  FaShoppingBag,
  FaRegHeart,
  FaExclamationTriangle
} from 'react-icons/fa';
import {
  useParams,
  useNavigate,
  useLocation
} from 'react-router-dom';
import axios from 'axios';

import ProductCard from '../../Components/ProductCard/ProductCard';
import RatingStars from '../../Components/RatingStars/RatingStars';
import ProductTabs from '../../Components/ProductTabs/ProductTabs';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';

import styles from './Product.module.css';

const BASE_URL = 'http://localhost:5000/api';
const WISHLIST_URL = `${BASE_URL}/wishlist`;

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Product state
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDefaultFallback, setIsDefaultFallback] = useState(false);

  // Recommended products state
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [recommendedError, setRecommendedError] = useState(null);

  // User selections
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [wishlistIds, setWishlistIds] = useState([]);
  // Fetch user's wishlist IDs on mount and when product changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !product?._id) return;
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
        setIsFavorite(ids.includes(product._id));
      });
  }, [product?._id]);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        
        if (response.data.success && response.data.data) {
          const productData = response.data.data;
          setProduct(productData);
          setIsDefaultFallback(false);
          
          // Set default selections
          setSelectedSize(productData.sizes?.[0] || null);
          setSelectedColor(productData.colors?.[0] || null);
        } else {
          setError(response.data.message || 'Product not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch recommended products when product data is available
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!product?._id) return;
      
      setRecommendedLoading(true);
      setRecommendedError(null);
      
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/recommended/${product._id}`
        );
        
        if (response.data.success) {
          setRecommendedProducts(response.data.data);
        } else {
          setRecommendedError(response.data.message || 'Failed to load recommendations');
        }
      } catch (err) {
        setRecommendedError(
          err.response?.data?.message || 
          err.message || 
          'Error loading recommendations'
        );
      } finally {
        setRecommendedLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, [product]);

  // Handle tab changes based on route
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tabFromRoute = pathParts[pathParts.length - 1];
    
    if (['description', 'reviews', 'returns'].includes(tabFromRoute)) {
      setActiveTab(tabFromRoute);
    } else {
      setActiveTab('description');
    }
  }, [location.pathname]);

  // Image navigation handlers
  const handleImageNavigation = (direction) => {
    setIsImageLoading(true);
    setCurrentImageIndex(prev => {
      const lastIndex = product?.images?.length - 1 || 0;
      return direction === 'next'
        ? prev === lastIndex ? 0 : prev + 1
        : prev === 0 ? lastIndex : prev - 1;
    });
  };

  // Cart and checkout handlers
  const handleAddToCart = async () => {
    if (!product) return;

    const size = selectedSize;
    const color = selectedColor;

    if (!size || !color) {
      alert('Please select size and color.');
      return;
    }

    const token = localStorage.getItem('token');
    if (token) {
      // LOGGED IN: Add to backend cart
      try {
        const res = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product._id,
            quantity,
            size,
            color
          })
        });
        if (!res.ok) {
          alert('Failed to add to cart');
          return;
        }
        window.dispatchEvent(new Event('cart-updated'));
        navigate('/cart');
      } catch (err) {
        alert('Network error while adding to cart');
      }
    } else {
      // GUEST: Add to localStorage
      let cart = [];
      try {
        const storedCart = localStorage.getItem('cart');
        cart = storedCart ? JSON.parse(storedCart) : [];
        if (!Array.isArray(cart)) cart = [];
      } catch (err) {
        cart = [];
      }
      const existingIndex = cart.findIndex(
        item =>
          item._id === product._id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIndex !== -1) {
        cart[existingIndex].quantity += quantity;
      } else {
        const cartItem = {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          selectedSize: size,
          selectedColor: color,
          quantity,
          inStock: product.inStock
        };
        cart.push(cartItem);
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
      navigate('/cart');
    }
  };


  const handleBuyNow = () => {
    navigate('/checkout', {
      state: {
        product: {
          ...product,
          selectedSize,
          selectedColor,
          quantity
        }
      }
    });
  };

  // Wishlist handler (API-based, like ProductCard)
  const handleWishlistToggle = async () => {
    if (!product?._id) return;
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
    } catch (err) {
      alert('Network error while updating wishlist.');
    }
  };

  // Save to recently viewed in localStorage
  useEffect(() => {
    if (!product?._id) return;
    const maxRecentlyViewed = 5;
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(p => p._id !== product._id);
    // Add to front
    recentlyViewed.unshift({
      _id: product._id,
      name: product.name,
      image: product.images?.[0] || '',
      price: product.price,
      // Add more fields if needed
    });
    // Keep only latest 8
    recentlyViewed = recentlyViewed.slice(0, maxRecentlyViewed);
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
  }, [product]);

  // Navigate between tabs
  const navigateToTab = (tab) => {
    if (!product?._id) return;
    navigate(`/product/${product._id}/${tab}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <Header />
        <div className={styles.loadingContent}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading product details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className={styles.errorContainer}>
        <Header />
        <div className={styles.errorContent}>
          <FaExclamationTriangle className={styles.errorIcon} />
          <h2>Product Not Found</h2>
          <p>{error || 'We couldn\'t find the product you\'re looking for.'}</p>
          <button 
            className={styles.continueShopping}
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.productPage}>
        {isDefaultFallback && (
          <div className={styles.defaultProductWarning}>
            <FaExclamationTriangle />
            <span>Showing a similar product as the requested item wasn't found</span>
          </div>
        )}

        <div className={styles.productContainer}>
          <div className={styles.productMain}>
            {/* Image Gallery */}
            <div className={styles.productImages}>
              <div className={styles.mainImage}>
                {isImageLoading && (
                  <div className={styles.imageLoadingOverlay}>
                    <div className={styles.loadingSpinner}></div>
                  </div>
                )}
                {product.images?.length > 0 ? (
                  <img
                    src={product.images[currentImageIndex]}
                    alt={product.name}
                    className={`${styles.productMainImg} ${isImageLoading ? styles.hidden : ''}`}
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                  />
                ) : (
                  <div className={styles.imagePlaceholder}>No Images Available</div>
                )}
                {product.images?.length > 1 && (
                  <>
                    <button
                      className={`${styles.navButton} ${styles.prev}`}
                      onClick={() => handleImageNavigation('prev')}
                      disabled={isImageLoading}
                    >
                      <FaChevronLeft />
                    </button>
                    <button
                      className={`${styles.navButton} ${styles.next}`}
                      onClick={() => handleImageNavigation('next')}
                      disabled={isImageLoading}
                    >
                      <FaChevronRight />
                    </button>
                  </>
                )}
              </div>

              {/* Image Navigation Dots */}
              {product.images?.length > 1 && (
                <div className={styles.imageDotsContainer}>
                  {product.images.map((_, index) => (
                    <span
                      key={index}
                      className={`${styles.dot} ${currentImageIndex === index ? styles.active : ''}`}
                      onClick={() => {
                        if (index !== currentImageIndex) {
                          setIsImageLoading(true);
                          setCurrentImageIndex(index);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className={styles.productDetails}>
              <div className={styles.ratingFavoriteContainer}>
                <RatingStars 
                  productId={product._id} 
                  rating={product.averageRating || product.rating} 
                  size="large" 
                />
                <button
                  className={styles.favoriteButtonTop}
                  onClick={handleWishlistToggle}
                  aria-label="Toggle favorite"
                >
                  {isFavorite ? <FaHeart className={styles.filled} /> : <FaRegHeart />}
                </button>
              </div>

              <h1 className={styles.productTitle}>{product.name}</h1>
              <a href="#!" className={styles.viewSaves}>
                View including taxes
              </a>

              <div className={styles.priceStock}>
                <span className={styles.price}>Rs. {product.price.toFixed(2)}</span>
                <span className={styles.stock}>
                  {product.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>

              <hr className={styles.divider} />

              {/* Color Selector */}
              {product.colors?.length > 0 && (
                <>
                  <div className={styles.colorSelector}>
                    <span className={styles.colorLabel}>Color: {selectedColor}</span>
                    <div className={styles.colorOptions}>
                      {product.colors.map((color) => (
                        <div
                          key={color}
                          className={`${styles.colorOptionWrapper} ${
                            selectedColor === color ? styles.colorOptionWrapperSelected : ''
                          }`}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            borderColor: selectedColor === color ? color.toLowerCase() : undefined
                          }}
                        >
                          <div
                            className={styles.colorOption}
                            style={{
                              backgroundColor: color.toLowerCase(),
                              borderColor: color.toLowerCase()
                            }}
                            aria-label={color}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <hr className={styles.divider} />
                </>
              )}

              {/* Size Selector */}
              {product.sizes?.length > 0 && (
                <div className={styles.sizeSelector}>
                  <span>Size: {selectedSize}</span>
                  <div className={styles.sizeOptions}>
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`${styles.sizeOption} ${
                          selectedSize === size ? styles.sizeOptionSelected : ''
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className={styles.quantityControl}>
                <div className={styles.quantitySelector}>
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.productActions}>
                <button 
                  className={styles.addToCart} 
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isImageLoading}
                >
                  <FaShoppingCart /> Add To Cart
                </button>
                <button 
                  className={styles.buyNow} 
                  onClick={handleBuyNow}
                  disabled={!product.inStock || isImageLoading}
                >
                  <FaShoppingBag /> Buy Now
                </button>
              </div>

              {/* Secure Checkout Badge */}
              <div className={styles.secureCheckout}>
                <div className={styles.secureIcons}>
                  <img 
                    src="/images/product/trustbag.png" 
                    alt="Secure Payment" 
                    loading="lazy" 
                  />
                </div>
                <p>Guarantee safe & secure checkout</p>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className={styles.tabsSection}>
            <ProductTabs 
              activeTab={activeTab} 
              onSelectTab={navigateToTab}
              productId={product._id}
            />
            <div className={styles.tabContent}>
              {activeTab === 'description' && (
                <div className={styles.productDescription}>
                  <h2>Product Description</h2>
                  <p>{product.description}</p>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className={styles.reviewsContent}>
                  <h2>Customer Reviews</h2>
                  {/* Reviews content would go here */}
                </div>
              )}
              {activeTab === 'returns' && (
                <div className={styles.returnsContent}>
                  <h2>Return Policy</h2>
                  <p>{product.returnsInfo || 'Standard return policy applies.'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Products */}
          <div className={styles.recommendedProducts}>
            <h2>Recommended</h2>
            <p className={styles.subtitle}>You might want to take a look at these.</p>
            
            {recommendedLoading ? (
              <div className={styles.loadingRecommendations}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading recommendations...</p>
              </div>
            ) : recommendedError ? (
              <p className={styles.errorText}>{recommendedError}</p>
            ) : (
              <div className={styles.productGrid}>
                {recommendedProducts.length > 0 ? (
                  recommendedProducts.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      variant="small"
                      onClick={() => navigate(`/product/${p._id}`)}
                    />
                  ))
                ) : (
                  <p className={styles.noRecommendations}>
                    No recommendations available at this time.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Product;
