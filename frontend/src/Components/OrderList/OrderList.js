import React from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ import useNavigate
import mockOrders from "../../data/mockOrders";
import "./OrderList.css";

export default function OrderList({ selectedStatus, searchQuery, filterType, onWriteReview }) {
  const navigate = useNavigate(); // ✅ init navigate

const handleTrackOrder = (orderId) => {
  navigate(`/order-tracking/${orderId}`); // ✅ This matches your App.jsx route
};

  const results = mockOrders
    .filter(
      (o) =>
        o.status === selectedStatus &&
        (o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
         o.id.toString().includes(searchQuery))
    )
    .sort((a, b) => {
      switch (filterType) {
        case "productName":
          return a.productName.localeCompare(b.productName);
        case "orderNumber":
          return a.id - b.id;
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "price":
          return b.price - a.price;
        case "deliveryDate":
          return new Date(a.deliveryDate) - new Date(b.deliveryDate);
        default:
          return 0;
      }
    });

  return (
    <div className="orders-section">
      {results.length ? (
        results.map((o) => (
          <div key={o.id}>
            {o.status === "In Process" && (
              <div className="order-card">
                <div className="order-top-row">
                  <p className="order-id">Order no: #{o.id}</p>
                  <div className="order-dates default-font">
                    <p>
                      Order Date:{" "}
                      {new Date(o.date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p>
                      Estimated Delivery Date:{" "}
                      {new Date(o.deliveryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="order-details">
              <div className="product-row">
                <div className="image-wrapper">
                  <img
                    src={o.image || o.productImage || "https://via.placeholder.com/80"}
                    alt={o.productName}
                    className="product-image"
                  />
                </div>

                <div className="product-details">
                  <h4 className="product-name">{o.productName}</h4>
                  <p><span className="label">Size</span>: {o.size}</p>
                  <p><span className="label">Color</span>: {o.color}</p>
                  <p><span className="label">Quantity</span>: {o.qty}</p>
                </div>

                <div className="order-cta-wrapper">
                  <div className="order-price-block">
                    <p className="order-price">Rs.{o.price?.toFixed(2)}</p>
                  </div>

                  <div className="order-cta">
                    <Link to="/shop">
                      <button className="continue-btn">Continue Shopping</button>
                    </Link>

                    {o.status === "In Process" && (
                      <button className="track-btn" onClick={() => handleTrackOrder(o.id)}>
                        Track Order
                      </button>
                    )}

                    {o.status === "Completed" && (
                      <button className="track-btn" onClick={() => onWriteReview(o)}>
                        Write a Review
                      </button>
                    )}

                   {o.status === "Cancelled" && (
                     <button className="track-btn" onClick={() => navigate("/checkout")}>
                        Buy Now
                      </button>
                    )}

                  </div>
                </div>
              </div>

              <div className="status-line">
                <span className={`status-badge ${o.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {o.status}
                </span>
                <span className="status-message">{o.message}</span>
              </div>
            </div>

            <hr className="order-divider" />
          </div>
        ))
      ) : (
        <p className="no-orders">No orders found.</p>
      )}
    </div>
  );
}
