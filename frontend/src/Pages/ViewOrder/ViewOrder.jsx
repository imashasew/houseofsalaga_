import React from 'react';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import './ViewOrder.css';
import bag from '../../Assets/bag.png';
import doni3 from '../../Assets/ViewOrder.png';
import kolla1 from '../../Assets/R1.png';
import doni4 from '../../Assets/R3.png';
import kolla2 from '../../Assets/R4.png';
import icon from '../../Assets/Frame 2609102 (1).png';
import tharuu from '../../Assets/star.png';
import { Link } from 'react-router-dom';

function ViewOrder() {
  return (
    <div className="signup-page bg-[#F0EADCED] min-h-screen vieworder-body">
      <Header />

      {/* ✅ Centered Thank You Section */}
      <div className="vieworder-thank-you-center flex flex-col items-center justify-center text-center pt-28 pb-12">
        <img src={bag} alt="bag" className="vieworder-thank-bag mt-6" />
        <h1 className="vieworder-thank-title mt-6">THANK YOU!</h1>
        <div className="vieworder-thank-text leading-tight mt-2">
          <p className="vieworder-thank-subtitle">We received your order and will start preparing your package right away.</p>
          <p className="vieworder-thank-subtitle">You will receive a confirmation email in a moment.</p>
        </div>
        <p className="vieworder-order-id mt-4">ORDER DETAILS - #96459761</p>
      </div>

      {/* ✅ Centered Wrapper for Order Info */}
      <div className="vieworder-order-wrapper">
        <div className="vieworder-order-section">
          {/* Image */}
          <div className="vieworder-order-image-box">
            <img src={doni3} alt="product" className="vieworder-order-image" />
          </div>

          {/* Column 1 */}
          <div className="vieworder-info-column vieworder-column-1">
            <h3 className="vieworder-info-title">Classic Top</h3>
            <p className="vieworder-info-subtext vieworder-large-text"><span className="vieworder-badge">Size:</span> small</p>
            <p className="vieworder-info-subtext vieworder-large-text"><span className="vieworder-badge">Color:</span> Blue</p>
            <p className="vieworder-price">Rs. 2500.00</p>
          </div>

          {/* Column 2 */}
          <div className="vieworder-info-column vieworder-column-2">
            <h3 className="vieworder-info-title">Delivery Details</h3>
            <p className="vieworder-info-subhead vieworder-large-text">Shipping address</p>
            <p className="vieworder-info-body vieworder-reduced-line-height">
              No 55,Mawathgama<br />
              Kandy Road,<br />
              Mawatha Gama
            </p>

            <p className="vieworder-info-subhead vieworder-spacing-tight vieworder-large-text">Contact information</p>
            <p className="vieworder-info-body vieworder-reduced-line-height">
              name@gmail.com
            </p>

            <button className="vieworder-cancel-btn">Cancel order</button>
          </div>

          {/* Column 3 */}
          <div className="vieworder-info-column vieworder-column-3">
            <h3 className="vieworder-info-title">Payment method</h3>
            <p className="vieworder-payment-method text-sm vieworder-reduced-line-height vieworder-large-text">Master card</p>
            <p className="text-[#282828] text-sm mb-2 vieworder-reduced-line-height">XXXX XXXX XXXX 5425</p>

            <h3 className="vieworder-info-title vieworder-spacing-tight mt-4">Estimated shipping</h3>
            <p className="text-sm vieworder-reduced-line-height">16 June 2024</p>

            <Link to="/" className="vieworder-continue-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>

      {/* ✅ Recommendations */}
      <div className="recommend-section text-center mt-12 mb-16">
        <h2 className="vieworder-suggest-title">Suggest Item Base On Your Order</h2>
        
        <div className="vieworder-recommendations-container">
          {/* Card 1 */}
          <div className="vieworder-item-card">
            <div className="vieworder-icon-bg"><img src={icon} alt="icon" className="vieworder-icon-img" /></div>
            <img src={kolla1} alt="Over Coat" className="vieworder-item-img" />
            <p className="vieworder-item-title">Over Coat</p>
            <p className="vieworder-item-price">Rs. 8000.00</p>
            <div className="vieworder-rating">
              <img src={tharuu} alt="stars" className="rating-stars" />
              <span className="rating-count">(121)</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="vieworder-item-card">
            <div className="vieworder-icon-bg"><img src={icon} alt="icon" className="vieworder-icon-img" /></div>
            <img src={doni4} alt="Summer Dress" className="vieworder-item-img" />
            <p className="vieworder-item-title">Summer dress</p>
            <p className="vieworder-item-price">Rs. 4500.00</p>
            <div className="vieworder-rating">
              <img src={tharuu} alt="stars" className="rating-stars" />
              <span className="rating-count">(121)</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="vieworder-item-card">
            <div className="vieworder-icon-bg"><img src={icon} alt="icon" className="vieworder-icon-img" /></div>
            <img src={kolla2} alt="Full kit" className="vieworder-item-img" />
            <p className="vieworder-item-title">Full kit</p>
            <p className="vieworder-item-price">Rs. 9000.00</p>
            <div className="vieworder-rating">
              <img src={tharuu} alt="stars" className="rating-stars" />
              <span className="rating-count">(121)</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ViewOrder;
