import React from 'react';
import { useParams } from "react-router-dom";
import { Package, Truck, MapPin, CheckCircle, User, Calendar } from 'lucide-react';
import './OrderTracking.css';
import Footer from '../../Components/Footer/Footer';
import Header from '../../Components/Header/Header';
import mockOrders from "../../data/mockOrders";

const OrderTracking = () => {
  const { orderId } = useParams(); // 👈 get order ID from URL
  const order = mockOrders.find((o) => o.id === orderId); // 👈 find order by ID

  // If order not found, show fallback
  if (!order) {
    return (
      <>
        <Header />
        <div className="order-tracking-container">
          <h2>Order Not Found</h2>
        </div>
        <Footer />
      </>
    );
  }

  // Sample static step tracker — customize dynamically later
  const steps = [
    {
      id: 'order-placed',
      label: 'Order Placed',
      icon: CheckCircle,
      status: 'completed'
    },
    {
      id: 'packaging',
      label: 'Packaging',
      icon: Package,
      status: 'completed'
    },
    {
      id: 'on-the-road',
      label: 'On The Road',
      icon: Truck,
      status: order.status === 'Completed' ? 'completed' : 'pending'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: MapPin,
      status: order.status === 'Completed' ? 'completed' : 'pending'
    }
  ];

  const activities = [
    {
      icon: CheckCircle,
      text: "Your order has been delivered. Thank you for shopping at Clicon!",
      time: order.deliveryDate,
      type: "success"
    },
    {
      icon: User,
      text: "Our delivery man (John Wick) has picked up your order for delivery.",
      time: "23 Jan, 2025 at 2:00 PM",
      type: "info"
    },
    {
      icon: MapPin,
      text: "Your order has reached the last mile hub.",
      time: "22 Jan, 2025 at 8:00 AM",
      type: "info"
    },
    {
      icon: Package,
      text: "Your order is on the way to the last mile hub.",
      time: "21 Jan, 2025 at 5:32 AM",
      type: "info"
    },
    {
      icon: CheckCircle,
      text: "Your order is successfully verified.",
      time: "20 Jan, 2025 at 7:32 PM",
      type: "success"
    },
    {
      icon: Calendar,
      text: "Your order has been confirmed.",
      time: "19 Jan, 2025 at 2:30 PM",
      type: "info"
    }
  ];

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const fillWidth = ((completedSteps - 1) / (steps.length - 1)) * 100;

  return (
    <>
      <Header />
      <div className="order-tracking-container">
        {/* Header */}
        <div className="order-header">
          <div className="order-info">
            <div className="order-number">#{order.id}</div>
            <div className="order-details">
              {order.qty} Product{order.qty > 1 ? 's' : ''} • Order Placed on {order.date}
            </div>
          </div>
          <div className="order-total">Rs.{order.price?.toFixed(2)}</div>
        </div>

        {/* Expected Delivery */}
        <div className="delivery-info">
          <span className="delivery-text">Order expected arrival {order.deliveryDate}</span>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar-image-style">
            <div className="progress-bar-track"></div>
            <div className="progress-bar-fill" style={{ width: `${fillWidth}%` }}></div>
            <div className="progress-steps-image-style">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className={`progress-step ${step.status}`}>
                    <div className="progress-step-icon">
                      <Icon size={20} />
                    </div>
                    <span className="progress-step-label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Activity */}
        <div className="activity-section">
          <h3 className="activity-title">Order Activity</h3>
          <div className="activity-list">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.type}`}>
                    <Icon size={20} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-text">{activity.text}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderTracking;
