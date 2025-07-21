// Footer.jsx
import React from "react";
import qualityImg from "../../Assets/quality.PNG";
import safeImg from "../../Assets/safe.PNG";
import deliveryImg from "../../Assets/delivery.PNG";
import supportImg from "../../Assets/support.PNG";
import "./shop-footer.css";

export default function Footer() {
  const features = [
    {
      title: "High Quality",
      description: "Crafted from top materials",
      image: qualityImg,
    },
    {
      title: "Safety Payment",
      description: "Secure",
      image: safeImg,
    },
    {
      title: "Fast Delivery",
      description: "deliver in 2-3 days",
      image: deliveryImg,
    },
    {
      title: "24/7 Support",
      description: "Dedicated support",
      image: supportImg,
    },
  ];

  return (
    <footer className="shop-footer">
      <div className="shop-footer-container">
        {features.map((feature, index) => (
          <div key={index} className="footer-item">
            <img
              src={feature.image}
              alt={feature.title}
              className="feature-icon"
            />
            <div className="feature-text">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}
