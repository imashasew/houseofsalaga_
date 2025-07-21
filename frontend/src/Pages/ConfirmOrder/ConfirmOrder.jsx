import React from 'react';
import './ConfirmOrder.css';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

const ConfirmOrder = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/shop');
  };

  const handleViewOrder = () => {
    navigate('/vieworder');
  };

  return (
    <div>
      <Header />

      <div className="confirm-order-wrapper">
        <div className="confirm-order-content">
          <div className="confirm-order-icon">&#10003;</div>
          <h2 className="confirm-order-title">Your order is successfully placed</h2>
          <p className="confirm-order-message">
            Thank you for your purchase! We truly appreciate your support and are thrilled to have you as a valued customer.
            Your order is being processed, and we'll ensure it reaches you promptly. If you have any questions, feel free to reach out.
            Thanks again for choosing us!
          </p>

          <div className="confirm-order-buttons">
            <button className="confirm-order-shop-btn" onClick={handleExploreClick}>
              Go to Shopping
            </button>
            <button className="confirm-order-view-btn" onClick={handleViewOrder}>
              View Order
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ConfirmOrder;
