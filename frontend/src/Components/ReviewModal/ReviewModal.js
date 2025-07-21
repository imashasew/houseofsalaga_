import React, { useState } from "react";
import { FaStar, FaRegStar, FaTimes } from "react-icons/fa";
import "./ReviewModal.css";

export default function ReviewModal({ product, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = () => {
    if (!rating || !reviewText) {
      alert("Please provide a rating and review text.");
      return;
    }

    const formData = {
      orderId: product.orderId || product.id || product._id, // fallback
      productName: product.productName,
      rating,
      review: reviewText,
      image,
    };

    onSubmit(formData);
    onClose();
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="product-summary">
          <img
            src={
              product?.image ||
              product?.productImage ||
              "https://via.placeholder.com/80"
            }
            alt={product?.productName}
            className="product-review-image"
          />
          <h3>{product?.productName}</h3>
        </div>

        <div className="rating-section">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              {star <= (hoverRating || rating) ? (
                <FaStar className="star filled" />
              ) : (
                <FaRegStar className="star" />
              )}
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <h4 className="upload-heading">
          Share a snap of your favorite product! 📸
        </h4>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button className="submit-review-btn" onClick={handleSubmit}>
          Submit Review
        </button>
      </div>
    </div>
  );
}
