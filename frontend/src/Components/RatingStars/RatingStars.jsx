import React from 'react';
import styles from './RatingStars.module.css';

const RatingStars = ({ rating = 0, reviewCount, size = 'medium' }) => {
  const clampedRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
  const fullStars = Math.floor(clampedRating);
  const hasHalfStar = clampedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const sizeClass = size === 'large'
    ? styles.ratingStarsLarge
    : styles.ratingStarsMedium;

  return (
    <div className={`${styles.ratingStars} ${sizeClass}`}>
      <div className={styles.starsContainer}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className={`${styles.star} ${styles.full}`}>★</span>
        ))}
        {hasHalfStar && (
          <span key="half" className={`${styles.star} ${styles.half}`}>
            <span className={styles.halfFilled}>★</span>
            <span className={styles.halfEmpty}>★</span>
          </span>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className={`${styles.star}`}>★</span>
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className={styles.reviewCount}>({reviewCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
