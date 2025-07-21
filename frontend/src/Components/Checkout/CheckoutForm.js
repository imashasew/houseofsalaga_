import { useState, useEffect } from 'react';
import styles from './CheckoutForm.module.css';
import CardIcons from './CardIcons';
import { FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import OrderSummary from '../../Pages/Cart/order-summary';

export default function CheckoutForm() {
  // Cart summary state for OrderSummary
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [tax] = useState(250);
  const [deliveryFee] = useState(150);
  const [total, setTotal] = useState(0);

  const location = useLocation();
  const buyNowProduct = location.state?.product;

  useEffect(() => {
    if (buyNowProduct) {
      setCartItems([buyNowProduct]);
      const sub = buyNowProduct.price * (buyNowProduct.quantity || 1);
      setSubtotal(sub);
      setTotal(sub + tax + deliveryFee);
      return;
    }
    const token = localStorage.getItem('token');
    if (token) {
      // Logged in: fetch cart from backend
      fetch('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          const items = data?.items || [];
          setCartItems(items);
          const sub = items.reduce((sum, item) => {
            // Use priceAtTime if available, else product.price
            const price = item.priceAtTime || item.product?.price || 0;
            return sum + price * (item.quantity || 1);
          }, 0);
          setSubtotal(sub);
          setTotal(sub + tax + deliveryFee);
        });
    } else {
      // Guest: use localStorage
    const stored = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(stored);
    const sub = stored.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(sub);
    setTotal(sub + tax + deliveryFee);
    }
  }, [tax, deliveryFee, buyNowProduct]);

  const [form, setForm] = useState({
    firstName: '', lastName: '', country: '', company: '', address: '',
    apt: '', city: '', state: '', postal: '', phone: '',
    saveInfo: false,
    shippingAddress: 'same',
    differentShippingAddress: '',
    payment: 'card',
    cardNumber: '', cardName: '', cardExpiry: '', cardCvc: ''
  });
  const [message, setMessage] = useState('');
  const [showDelivery, setShowDelivery] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in again.');
      return;
    }
    fetch('http://localhost:5000/api/personal-info/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setForm(form => ({
            ...form,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            country: data.country || '',
            company: data.company || '',
            address: data.streetAddress || '',
            apt: data.apartment || '',
            city: data.city || '',
            state: data.state || '',
            phone: data.phone || '',
            postal: data.postalCode || ''
          }));
        } else {
          alert('No personal info found for this user. Please fill out your details.');
        }
      })
      .catch(err => {
        alert('Failed to fetch personal info.');
        console.error(err);
      });
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'phone') {
      // Only allow digits
      const digits = value.replace(/\D/g, '');
      setForm({ ...form, [name]: digits });
      setPhoneError('');
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleContinue = e => {
    e.preventDefault();
    setShowDelivery(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Phone validation
    if (form.phone.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
      return;
    }
    // Prepare order data
    const orderData = {
      ...form,
      shippingAddress: form.shippingAddress === 'different' ? form.differentShippingAddress : form.address
    };

    // Also update personal info in the database
    const token = localStorage.getItem('token');
    if (token) {
      const updatedInfo = {
        firstName: form.firstName,
        lastName: form.lastName,
        country: form.country,
        company: form.company,
        streetAddress: form.address,
        apartment: form.apt,
        city: form.city,
        state: form.state,
        phone: form.phone,
        postalCode: form.postal,
        deliveryInstructions: '', // add if you have this field in your form
        defaultShipping: false,
        defaultBilling: false
      };
      await fetch('http://localhost:5000/api/personal-info/me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(updatedInfo)
      });
    }

    try {
      const res = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Order placed successfully!');
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/ConfirmOrder');
        }, 1500);
      } else {
        setMessage('Failed to place order.');
        setShowMessage(true);
      }
    } catch (err) {
      setMessage('Error placing order.');
      setShowMessage(true);
    }
  };

  return (
    <div className={styles['checkout-layout']}>
      <form className={styles['form-root']} onSubmit={showDelivery ? handleSubmit : handleContinue}>
        {/* Billing Details */}
        <div>
          <div className={styles['checkout-title']}>Billing Details</div>
          <div className={styles['form-grid']}>
          <div className={styles['form-row']}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="country">Country / Region</label>
            <input id="country" name="country" placeholder="Country / Region" value={form.country} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="company">Company Name <span style={{color:'#bbb'}}>(optional)</span></label>
            <input id="company" name="company" placeholder="Company (optional)" value={form.company} onChange={handleChange} />
          </div>
          <div className={styles['form-row']} style={{gridColumn:'1/3'}}>
            <label htmlFor="address">Street Address</label>
            <input id="address" name="address" placeholder="House number and street name" value={form.address} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="apt">Apt, suite, unit</label>
            <input id="apt" name="apt" placeholder="apartment, suite, unit, etc. (optional)" value={form.apt} onChange={handleChange} />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="city">City</label>
            <input id="city" name="city" placeholder="Town / City" value={form.city} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="state">State</label>
            <select id="state" name="state" value={form.state} onChange={handleChange} required>
              <option value="">State</option>
              <option value="State1">State1</option>
              <option value="State2">State2</option>
            </select>
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="postal">Postal Code</label>
            <input id="postal" name="postal" placeholder="Postal Code" value={form.postal} onChange={handleChange} required />
          </div>
          <div className={styles['form-row']}>
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required maxLength={10} />
            {phoneError && <div style={{ color: 'red', fontSize: '0.95em' }}>{phoneError}</div>}
          </div>
        </div>
        {!showDelivery && (
          <button type="submit" className={styles['continue-btn']}>Continue to delivery</button>
        )}
        <div className={styles['save-info']}>
          <input type="checkbox" name="saveInfo" checked={form.saveInfo} onChange={handleChange} />
          Save my information for a faster checkout
        </div>
      </div>

      {/* Only show the rest after Continue to delivery */}
      {showDelivery && <>
        {/* Shipping Address Card */}
        <div className={styles['checkout-title']}>Shipping Address</div>
        <div className={styles['section-subtext']}>
          Select the address that matches your card or payment method.
        </div>
        <div className={styles['card-section']}>
          <div className={styles['shipping-address-options']}>
            <label>
              <input type="radio" name="shippingAddress" value="same" checked={form.shippingAddress === 'same'} onChange={handleChange} />
              Same as Billing address
            </label><hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
            <label>
              <input type="radio" name="shippingAddress" value="different" checked={form.shippingAddress === 'different'} onChange={handleChange} />
              Use a different shipping address
            </label>
            {form.shippingAddress === 'different' && (
              <div style={{
                background: '#f8f9fa',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 16,
                marginTop: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}>
                <FaMapMarkerAlt style={{ color: '#ff6f61', fontSize: 22 }} />
                <div style={{ flex: 1 }}>
                  <label htmlFor="differentShippingAddress" style={{ fontWeight: 500, color: '#333', marginBottom: 4, display: 'block' }}>
                    Enter your shipping address
                  </label>
                  <input
                    id="differentShippingAddress"
                    type="text"
                    name="differentShippingAddress"
                    placeholder="House number, street, city, etc."
                    value={form.differentShippingAddress}
                    onChange={handleChange}
                    className={styles['form-input']}
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                    required
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <hr style={{ color: 'white', borderTop: '2px solid #222', margin: '16px 0' }} />
        {/* Shipping Method Card */}
        <div className={styles['checkout-title']}>Shipping Method</div>
        <div className={styles['card-section']}>
          <div className={styles['shipping-method-box']}>
            <div className={styles['shipping-method-row']}>
              <span className={styles['shipping-method-label']}>Arrives within a week</span>
            </div><hr style={{ color: '#888', borderTop: '2px solid #222', margin: '16px 0' }} />
            <div className={styles['shipping-method-row']}>
              <span className={styles['shipping-method-label']}>Delivery Charge</span>
            </div>
            <div className={styles['shipping-method-note']}>Additional fees may apply</div>
            <span className={styles['shipping-method-fee']}>Rs. 450</span>
          </div>
        </div>
        <hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
        {/* Payment Method Card */}
        <div className={styles['checkout-title']}>Payment Method</div>
        <div className={styles['secure-note']}>
          All transactions are secure and encrypted.
        </div>
        <div className={styles['card-section']}>
          <div className={styles['payment-methods']}>
            <label className={styles['payment-label']}>
              <input type="radio" name="payment" value="card" checked={form.payment === 'card'} onChange={handleChange} />
              Credit Card
              <CardIcons />
            </label>
            {form.payment === 'card' && (
              <div>
                <div className={styles['card-fields-row']}>
                  <div className={styles['card-field']}>
                    <input name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="Card number" required />
                  </div>
                  <div className={styles['card-field']}>
                    <input name="cardName" value={form.cardName} onChange={handleChange} placeholder="Name of card" required />
                  </div>
                </div>
                <div className={styles['card-fields-row']}>
                  <div className={styles['card-field']}>
                    <input name="cardExpiry" value={form.cardExpiry} onChange={handleChange} placeholder="Expiration date (MM/YY)" required />
                  </div>
                  <div className={styles['card-field']}>
                    <input name="cardCvc" value={form.cardCvc} onChange={handleChange} placeholder="Security Code" required />
                  </div>
                </div>
              </div>
            )} <hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
            <label className={styles['payment-label']}>
              <input type="radio" name="payment" value="cod" checked={form.payment === 'cod'} onChange={handleChange} />
              Cash on delivery
            <div className={styles['shipping-method-note']}>Pay on cash Upon the delivery</div>
            </label> <hr style={{ color: 'black', borderTop: '2px solid #222', margin: '16px 0' }} />
            <label className={styles['payment-label']}>
              <input type="radio" name="payment" value="paypal" checked={form.payment === 'paypal'} onChange={handleChange} />
              Paypal
            </label>
          </div>
          {/* Order Summary moved to sidebar */}
          <button className={styles['pay-btn']} type="submit">Pay Now</button>
          {showMessage && (
            <div className="success-message" style={{textAlign: 'center', margin: '20px 0', color: 'green', background: '#fff', border: '1px solid #4BB543', borderRadius: 8, padding: 16, position: 'fixed', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999}}>
              <div style={{ fontSize: 48, color: '#4BB543', marginBottom: 12 }}>✔</div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#222', marginBottom: 8 }}>{message}</div>
              <div style={{ color: '#666', fontSize: 15 }}>Thank you for your order!</div>
            </div>
          )}
        </div>
      </>}
      </form>
      {/* Sidebar Order Summary */}
      <aside className={styles['order-summary-sidebar']}>
        <OrderSummary
          subtotal={subtotal}
          tax={tax}
          deliveryFee={deliveryFee}
          total={total}
          loading={false}
          itemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          hideCheckoutButton={true}
        />
      </aside>
    </div>
  );
} 
