
import React, { useEffect, useState } from 'react';
import './NewArrivals.css';
import ProductCard from '../ProductCard/ProductCard';


const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Controls initial fetch
  const [allLoaded, setAllLoaded] = useState(false); // Controls button visibility
  // Add to Cart handler (same as Shop)
  const handleAddToCart = async (product) => {
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
            quantity: 1,
            size: product.size || (product.sizes && product.sizes[0]) || null,
            color: product.color || (product.colors && product.colors[0]) || null
          })
        });
        if (!res.ok) {
          alert('Failed to add to cart');
          return;
        }
        window.dispatchEvent(new Event('cart-updated'));
        alert(`${product.name} added to cart!`);
      } catch (err) {
        alert('Network error while adding to cart');
      }
    } else {
      // GUEST: Add to localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id || item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    alert(`${product.name} added to cart!`);
    }
  };

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products/new-arrivals');
        const data = await res.json();

        if (data.success && data.data) {
          setProducts(data.data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);


  const handleLoadMore = async () => {
  try {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();

    // Check the correct response structure based on your controller
    if (data.success && data.data && Array.isArray(data.data)) {
      setProducts(data.data); // Use data.data instead of just data
      setAllLoaded(true); // Hide the button after load
    } else {
      console.error('Failed to fetch all products');
    }
  } catch (error) {
    console.error('Error loading all products:', error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div>
      <section className="new-arrivals-section" id="new-arrivals">
        <div className="new-arrivals-container">
          <h2 className="new-arrivals-title">
            New <span className="new-arrivals-span">Arrivals</span>
          </h2>

          {!loading && (
            <div className="products-grid1">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          {!loading && !allLoaded && (
            <button
              className="new-arrivals-load-more-button"
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}

          {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
        </div>
      </section>
    </div>
  );
};

export default NewArrivals;
