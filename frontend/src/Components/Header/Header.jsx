import React, { useState, useEffect, useRef } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import dropdownIcon from '../../Assets/drop-down.png';
import searchIcon from '../../Assets/magnifyingglass.png';
import userIcon from '../../Assets/user.png';
import cartIcon from '../../Assets/Frame 2609102 (1).png';
import favIcon from '../../Assets/bag-04 (1).png';
import { FaTrash } from 'react-icons/fa';

const AUTO_LOGOUT_TIME = 60 * 60 * 1000; // one hour


function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

function Header() {
  const [showWomenDropdown, setShowWomenDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showActionPrompt, setShowActionPrompt] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // NEW
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showAutoLogoutMessage, setShowAutoLogoutMessage] = useState(false);

  const inactivityTimer = useRef(null);

const handleAutoLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
  setIsLoggedIn(false);
  setUsername('');
  setCartCount(0);
  setCartItems([]);
  setShowUserMenu(false);
  window.dispatchEvent(new Event('cart-updated'));
  window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: 0 } }));
  setShowAutoLogoutMessage(true); // show the message
};

const resetInactivityTimer = () => {
  if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  inactivityTimer.current = setTimeout(() => {
    handleAutoLogout();
  }, AUTO_LOGOUT_TIME);
};

useEffect(() => {
  resetInactivityTimer();
  const activityEvents = ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'];
  activityEvents.forEach(event =>
    window.addEventListener(event, resetInactivityTimer)
  );
  return () => {
    activityEvents.forEach(event =>
      window.removeEventListener(event, resetInactivityTimer)
    );
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
  };
}, []);


  // Update cart count from localStorage
  useEffect(() => {
    async function updateCartCountAndItems() {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/cart', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            const count = data.items
              ? data.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
              : 0;
            setCartCount(count);
            setCartItems(data.items || []);
            return;
          }
        } catch {}
      }
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      let count = 0;
      if (Array.isArray(cart)) {
        count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      }
      setCartCount(count);
      setCartItems(cart);
    }
    updateCartCountAndItems();
    window.addEventListener('cart-updated', updateCartCountAndItems);
    return () => window.removeEventListener('cart-updated', updateCartCountAndItems);
  }, []);

  useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 768) {
      setShowMobileMenu(false);
    }
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('username');

    if (location.pathname === '/signin') {
      setIsLoggedIn(false);
      setUsername('');
    } else if (token && token.trim() !== '') {
      setIsLoggedIn(true);
      setUsername(name || '');
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowWomenDropdown(false);
        setShowMobileMenu(false);
        setShowUserMenu(false);
        setShowActionPrompt(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (type) => {
    if (type === 'women') {
      setShowWomenDropdown((prev) => !prev);
    }
  };

  const handleDropdownItemClick = () => {
    if (!isLoggedIn) {
      setShowActionPrompt(true);
    } else {
      setShowWomenDropdown(false);
      setShowUserMenu(false);
    }
  };

  const handleLogoutRequest = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    setIsLoggedIn(false);
    setUsername('');
    setCartCount(0);
    setCartItems([]);
    setShowUserMenu(false);
    setShowLogoutConfirm(false);
    window.dispatchEvent(new Event('cart-updated'));
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { count: 0 } }));
    navigate('/signup');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handleCartClick = () => {
    setShowCartPopup(true);
  };

  const handleViewCartOrCheckout = (type) => {
    if (!isLoggedIn) {
      setShowActionPrompt(true);
    } else {
      setShowCartPopup(false);
      if (type === 'checkout') {
        navigate('/checkout');
      } else if (type === 'view') {
        window.location.href = 'http://localhost:3000/cart';
      }
    }
  };

  const handleWishlistClick = () => {
    navigate('/wishlistpage');
  };

  // Your async fetchSuggestions function stays here
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      setSearchError('');
      return;
    }

    setSearchLoading(true);
    setSearchError('');
    try {
      // Fetch normal products
      const resProducts = await fetch(
        `http://localhost:5000/api/products/search?query=${encodeURIComponent(query)}`
      );
      if (!resProducts.ok) throw new Error('Failed to fetch products');
      const dataProducts = await resProducts.json();

      // Fetch trending products
      const resTrending = await fetch(
        `http://localhost:5000/api/trending/search?query=${encodeURIComponent(query)}`
      );
      if (!resTrending.ok) throw new Error('Failed to fetch trending products');
      const dataTrending = await resTrending.json();

      // Combine results, avoiding duplicates by _id
      const combinedMap = new Map();

      if (dataProducts.success && Array.isArray(dataProducts.data)) {
        dataProducts.data.forEach((prod) => combinedMap.set(prod._id, prod));
      }

      if (dataTrending.success && Array.isArray(dataTrending.data)) {
        dataTrending.data.forEach((prod) => {
          if (!combinedMap.has(prod._id)) combinedMap.set(prod._id, prod);
        });
      }

      const combinedSuggestions = Array.from(combinedMap.values());

      setSuggestions(combinedSuggestions);
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    }
    setSearchLoading(false);
  };

  // debounce your fetchSuggestions
  const debouncedFetch = useRef(debounce(fetchSuggestions, 300)).current;

  // Fetch wishlist items when popup opens
  useEffect(() => {
    if (!showCartPopup) return;
    const token = localStorage.getItem('token');
    if (!token) {
      // setWishlistItems([]); // This line is removed as per the edit hint
      return;
    }
    fetch('http://localhost:5000/api/wishlist/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        // setWishlistItems(data?.products?.filter(Boolean) || []); // This line is removed as per the edit hint
      });
  }, [showCartPopup]);

  return (
    <header className="header" ref={wrapperRef}>
      <div className="header-container">
        <div className="hamburger" onClick={() => setShowMobileMenu((prev) => !prev)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="left-section">
          <div className="logo">
            <Link to="/home" className="logo-link">
              Salga
            </Link>
          </div>

          <nav className="nav-links">
  <Link to="/home" className="nav-item hover-link">
    Home
  </Link>

  <div className="dropdown-wrapper">
    <span className="nav-item hover-link" onClick={() => toggleDropdown('women')}>
      Women
      <img src={dropdownIcon} alt="dropdown" className="dropdown-icon" />
    </span>

    {showWomenDropdown && (
      <div className="dropdown-menu">
        <div onClick={handleDropdownItemClick}>Kurtha</div>
        <div onClick={handleDropdownItemClick}>Saree</div>
        <div onClick={handleDropdownItemClick}>Shalva</div>
      </div>
    )}
  </div>

  {/* 👇 ADD THIS new Shop link after Women */}
  <Link to="/shop" className="nav-item hover-link">
    Shop
  </Link>
</nav>

        </div>

        <div className="right-section">
          <div className="search-bar" style={{ position: 'relative' }}>
            <img src={searchIcon} alt="search" className="search-icon" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                debouncedFetch(val);
              }}
            />

            {searchQuery && (
              <div className="search-suggestions-box">
                {searchLoading ? (
                  <div className="suggestion-item" onClick={() => {}}>
                    Loading…
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="suggestion-item" onClick={() => {}}>
                    No results found
                  </div>
                ) : (
                  suggestions.map((prod) => (
                    <div
                      key={prod._id}
                      className="suggestion-item"
                      onClick={() => {
                        if (prod._id === 'none') return;
                        navigate(`/product/${prod._id}`);
                        setSearchQuery('');
                        setSuggestions([]);
                      }}
                    >
                      {prod.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>



          {isLoggedIn ? (
            <span
              className="nav-item hover-link"
              onClick={handleLogoutRequest}
              style={{ cursor: 'pointer' }}
            >
              Sign Out
            </span>
          ) : (
            <Link to="/signin" className="nav-item hover-link">
              Login
            </Link>
          )}

          <div className="user-menu-wrapper">
            <img
              src={userIcon}
              alt="User"
              className="icon user-icon"
              onClick={() => setShowUserMenu((prev) => !prev)}
            />
            {showUserMenu && (
              <div className="user-popup-menu">
                {isLoggedIn ? (
                  <>
                    <p className="greeting">Hello {username || 'User'},</p>
                    <p className="subtext">Welcome to your account</p>
                  </>
                ) : (
                  <>
                    <p className="greeting">Hello Guest,</p>
                    <p className="subtext">Please login for full access</p>
                  </>
                )}

                <div className="user-popup-links">
                  {isLoggedIn ? (
                    <>
                      <Link
                        to="/personal-info"
                        className="user-menu-item"
                        onClick={handleDropdownItemClick}
                      >
                        👤 Personal Information
                      </Link>
                      <Link
                        to="/dashboard"
                        className={`user-menu-item ${
                          location.pathname === '/dashboard' ? 'active' : ''
                        }`}
                        onClick={handleDropdownItemClick}
                      >
                        📦 My Orders
                      </Link>
                    </>
                  ) : (
                    <>
                      <div
                        className="user-menu-item"
                        onClick={handleDropdownItemClick}
                      >
                        👤 Personal Information
                      </div>
                      <div
                        className="user-menu-item"
                        onClick={handleDropdownItemClick}
                      >
                        📦 My Orders
                      </div>
                    </>
                  )}
                  <div className="user-menu-item" onClick={handleWishlistClick}>
                    🤍 My Wishlist
                  </div>
                  <Link
  to="/notifications"
  className={`user-menu-item ${location.pathname === '/notifications' ? 'active' : ''}`}
  onClick={handleDropdownItemClick}
>
  🔔 Notifications
</Link>

                  {isLoggedIn && (
                    <div
                      className="user-menu-item"
                      onClick={handleLogoutRequest}
                    >
                      ↩ Sign Out
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Heart icon (wishlist) with badge */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={cartIcon}
              className="icon cart-icon"
              onClick={handleWishlistClick}
              style={{ cursor: 'pointer' }}
              alt="Wishlist"
            />
            <WishlistBadge />
          </div>

          {/* Bag icon (cart) with badge */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={favIcon}
              alt="Cart Bag"
              className="icon fav-icon"
              onClick={handleCartClick}
              style={{ cursor: 'pointer' }}
            />
            {cartCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 7px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 2,
                }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {showMobileMenu && (
  <div className="mobile-menu">
    <Link
  to="/home"
  className="mobile-menu-item"
  onClick={() => setShowMobileMenu(false)}
>
  Home
</Link>


    <div className="dropdown-wrapper">
      <div
        className="mobile-menu-item"
        onClick={() => toggleDropdown('women')}
      >
        Women
        <img
          src={dropdownIcon}
          alt="dropdown"
          className="dropdown-icon"
        />
      </div>

      {showWomenDropdown && (
        <div className="dropdown-menu">
          <div onClick={handleDropdownItemClick}>Dresses</div>
          <div onClick={handleDropdownItemClick}>Shoes</div>
          <div onClick={handleDropdownItemClick}>Accessories</div>
        </div>
      )}
    </div>

    {/* 👇 ADD THIS new Shop link after Women */}
    <Link
  to="/shop"
  className="mobile-menu-item"
  onClick={() => setShowMobileMenu(false)}
>
  Shop
</Link>


    {!isLoggedIn ? (
      <Link
  to="/signin"
  className="mobile-menu-item"
  onClick={() => setShowMobileMenu(false)}
>
  Login
</Link>

    ) : (
      <div
  className="mobile-menu-item"
  onClick={() => {
    handleLogoutRequest();
    setShowMobileMenu(false);
  }}
>
  Sign Out
</div>

    )}
  </div>
)}


      {showLoginPopup && <div className="login-popup">Please login first!</div>}

      {showActionPrompt && (
        <div className="login-popup action-popup">
          <p>Please log in or create an account to access this feature</p>
          <div className="action-buttons">
            <button onClick={() => navigate('/signin')}>Login</button>
            <button onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
      )}

      {showCartPopup && (
        <div
          className="cart-overlay"
          onClick={() => setShowCartPopup(false)}
        >
          <div
            className="cart-popup"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 600, minWidth: 0, maxWidth: '99vw', minHeight: 0, maxHeight: 660, borderRadius: 18, padding: 26 }}
          >
            <div className="cart-header">
              <span
                className="cart-title"
                style={{
                  fontSize: '36px',
                  fontWeight: '700',
                  flex: 1,
                  textAlign: 'center'
                }}
              >
                Shopping Cart
              </span>
              <span
                className="cart-close"
                onClick={() => setShowCartPopup(false)}
                style={{ fontSize: '28px' }}
              >
                ✖
              </span>
            </div>

            <div className="cart-content" style={{ minHeight: 180, maxHeight: 420, overflowY: 'auto', marginBottom: 20 }}>
              {cartItems.length === 0 ? (
                <p
                  style={{
                    color: '#000',
                    textAlign: 'center',
                    marginTop: '5px',
                    fontSize: '18px',
                  }}
                >
                  Cart is empty.
                </p>
              ) : (
                <div>
                  {cartItems.map((item, idx) => (
                    <div key={item._id || item.id || idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 4 }}>
                      <img src={item.product?.images || item.images || (item.images?.[0]) || '/images/placeholder.png'} alt={item.product?.name || item.name} style={{ width: 38, height: 38, objectFit: 'cover', borderRadius: 6, marginRight: 8 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{item.product?.name || item.name}</div>
                        <div style={{ fontSize: 12, color: '#555' }}>Rs. {(item.priceAtTime || item.price)?.toFixed(2)} {item.quantity ? `x${item.quantity}` : ''}</div>
                        <div style={{ fontSize: 12, color: '#555' }}>Size: {item.size || item.selectedSize}</div>
                        <div style={{ fontSize: 12, color: '#555' }}>Color: {item.color || item.selectedColor}</div>
                      </div>
                      <div style={{ fontWeight: 600, color: '#222', minWidth: 48, textAlign: 'right', fontSize: 13 }}>Rs. {((item.priceAtTime || item.price) * (item.quantity || 1)).toFixed(2)}</div>
                      <button onClick={() => {
                        // Remove item logic (immutable)
                        const token = localStorage.getItem('token');
                        if (token) {
                          // Remove from backend
                          fetch(`http://localhost:5000/api/cart/remove/${item._id || item.id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                          }).then(() => {
                            window.dispatchEvent(new Event('cart-updated'));
                          });
                          // Do NOT call setCartItems here; let the event handler update it!
                        } else {
                          // Remove from localStorage (immutable)
                          const updatedCart = cartItems.filter((_, i) => i !== idx);
                          localStorage.setItem('cart', JSON.stringify(updatedCart));
                          window.dispatchEvent(new Event('cart-updated'));
                          // Do NOT call setCartItems here; let the event handler update it!
                        }
                      }} style={{ background: 'none', border: 'none', color: '#ef4444', marginLeft: 8, cursor: 'pointer' }} title="Remove">
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="cart-footer" style={{ borderTop: '1px solid #eee', paddingTop: 8 }}>
              <div
                className="subtotal"
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  textAlign: 'center',
                  width: '100%',
                  marginBottom: '8px'
                }}
              >
                {(() => {
                  const token = localStorage.getItem('token');
                  let subtotal = 0;
                  if (token) {
                    // Logged-in: use cartItems from backend
                    subtotal = cartItems.reduce((sum, item) => sum + ((item.priceAtTime || item.price) * (item.quantity || 1)), 0);
                  } else {
                    // Guest: use localStorage
                    let cart = [];
                    try {
                      cart = JSON.parse(localStorage.getItem('cart')) || [];
                    } catch {}
                    subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
                  }
                  return `Sub Total: Rs. ${subtotal.toFixed(2)}`;
                })()}
              </div>
              <div className="cart-buttons" style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button
                  className="view-cart-btn"
                  style={{ padding: '6px 14px', fontSize: 14 }}
                  onClick={() => handleViewCartOrCheckout('view')}
                >
                  View Cart
                </button>
                <button
                  className="checkout-btn"
                  style={{ padding: '6px 14px', fontSize: 14 }}
                  onClick={() => handleViewCartOrCheckout('checkout')}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
  <div
    className="logout-confirm-overlay"
    onClick={cancelLogout} // dismiss when clicking outside
  >
    <div
      className="logout-confirm-box"
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      <p>Are you sure you want to sign out?</p>
      <div className="logout-confirm-buttons">
        <button onClick={confirmLogout}>Yes</button>
        <button onClick={cancelLogout}>No</button>
      </div>
    </div>
  </div>
)}

{showAutoLogoutMessage && (
  <div
    className="logout-confirm-overlay"
    onClick={() => setShowAutoLogoutMessage(false)}
  >
    <div
      className="logout-confirm-box"
      onClick={(e) => e.stopPropagation()}
    >
      <p>You have been logged out due to inactivity.</p>
      <div className="logout-confirm-buttons">
        <button
          onClick={() => {
            setShowAutoLogoutMessage(false);
            navigate('/signin');
          }}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}

    </header>
   
  );
}

export default Header;

// Move WishlistBadge function here, outside of Header

export function WishlistBadge() {
  const [wishlistCount, setWishlistCount] = React.useState(0);
  React.useEffect(() => {
    // Fetch wishlist count on mount
    function fetchWishlistCount() {
      const token = localStorage.getItem('token');
      if (!token) return;
      fetch('http://localhost:5000/api/wishlist/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          const ids = data?.products?.map(p => p._id) || [];
          setWishlistCount(ids.length);
        })
        .catch(() => {});
    }
    fetchWishlistCount();
    function handleWishlistUpdate(e) {
      setWishlistCount(e.detail.count);
    }
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, []);
  console.log('WishlistBadge rendered, count:', wishlistCount); // Debug log
  return (
    <span
      style={{
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        background: '#111',
        color: '#fff',
        borderRadius: '50%',
        padding: '2px 7px',
        fontSize: '12px',
        fontWeight: 'bold',
        zIndex: 2,
        opacity: wishlistCount === 0 ? 0.5 : 1, // faded if zero
      }}
    >
      {wishlistCount}
    </span>
  );
}

