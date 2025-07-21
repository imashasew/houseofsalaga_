import "./product-card.css";
import { Heart, Star } from "lucide-react";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState } from "react";

const ProductCard = ({ product, isWishlisted, onWishlistClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg?height=300&width=300";
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return imagePath;
    return `/${imagePath}`;
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return "Price unavailable";
    }
    return `Rs.${price.toLocaleString("en-IN")}.00`;
  };

  const safeProduct = {
    name: product?.name || "Unnamed Product",
    price: product?.price || 0,
    rating:
      typeof product?.rating === "number"
        ? Math.max(0, Math.min(5, product.rating))
        : 0,
    reviews: product?.reviews || 0,
    image: product?.image,
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(false);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
    setImageError(false);
  };

  const imageUrl = getImageUrl(safeProduct.image);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {!imageLoaded && !imageError && (
          <div className="loading-overlay">Loading...</div>
        )}
        {imageError && <div className="error-overlay">❌ Image Failed</div>}

        <div className="product-image-container">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={safeProduct.name}
            className="product-image"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        </div>

        <button
          onClick={e => {
            e.stopPropagation();
            onWishlistClick && onWishlistClick(product);
          }}
          className="wishlist-button"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isWishlisted ? <FaHeart color="red" size={22} /> : <FaRegHeart color="#888" size={22} />}
        </button>
      </div>

      <div className="product-info">
        <div className="product-name">
          <h3>{safeProduct.name}</h3>
        </div>

        <div className="product-price">
          <span className="current">{formatPrice(safeProduct.price)}</span>
        </div>

        <div className="product-rating">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`star-icon ${i < safeProduct.rating ? "filled" : ""}`}
            />
          ))}
          <span className="review-count">({safeProduct.reviews})</span>
        </div>
      </div>
      {/* Description */}
      {safeProduct.description && (
        <div className="product-description">
          <p>{safeProduct.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
