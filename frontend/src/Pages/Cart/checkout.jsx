import React, { useState, useEffect } from "react";
import { ShoppingBag, CreditCard, Truck } from "lucide-react";
import "./checkout.css";

export default function CheckoutModal({
  isOpen,
  onClose,
  cartTotal,
  itemCount,
}) {
  const [personalInfo, setPersonalInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('http://localhost:5000/api/personal-info/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setPersonalInfo(data);
      });
  }, []);

  if (!isOpen) return null;

  const handleProceedToPayment = () => {
    alert("Redirecting to payment gateway...");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-icon">
            <ShoppingBag className="modal-icon-bag" />
          </div>
          <h2 className="modal-title">Ready to Checkout!</h2>
          <p className="modal-subtitle">Review your order details below</p>
        </div>

        {/* Order Summary */}
        <div className="modal-summary">
          <div className="modal-summary-row">
            <span className="modal-label">Items in cart:</span>
            <span className="modal-value">{itemCount} items</span>
          </div>
          <div className="modal-summary-row">
            <span className="modal-label">Total Amount:</span>
            <span className="modal-total">
              Rs.{cartTotal.toLocaleString("en-IN")}.00
            </span>
          </div>
        </div>

        {/* Personal Info (auto-filled) */}
        {personalInfo && (
          <div className="modal-personal-info" style={{ margin: '16px 0', padding: '12px', background: '#f7f7f7', borderRadius: '6px' }}>
            <h3 style={{ marginBottom: 8 }}>Your Details</h3>
            <div><b>Name:</b> {personalInfo.firstName} {personalInfo.lastName}</div>
            <div><b>Address:</b> {personalInfo.streetAddress}, {personalInfo.city}, {personalInfo.state}, {personalInfo.country}</div>
            <div><b>Phone:</b> {personalInfo.phone}</div>
            <div><b>Postal Code:</b> {personalInfo.postalCode}</div>
          </div>
        )}

        {/* Next Steps */}
        <div className="modal-benefits">
          <div className="modal-benefit">
            <CreditCard className="modal-benefit-icon blue" />
            <span>Secure payment processing</span>
          </div>
          <div className="modal-benefit">
            <Truck className="modal-benefit-icon green" />
            <span>Free delivery on orders above Rs.2000</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button onClick={onClose} className="btn-secondary">
            Continue Shopping
          </button>
          <button onClick={handleProceedToPayment} className="btn-primary">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
