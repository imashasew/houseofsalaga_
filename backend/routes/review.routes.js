const express = require('express');
const router = express.Router();

const {
  createReview,
  getReviewsForProduct,
  toggleLike,
  addReply,
  getReviewSummary
} = require('../controllers/review.controller');

// POST: Create a review
router.post('/', createReview);

// POST: Like/unlike a review
router.post('/like/:reviewId', toggleLike);

// POST: Add a reply to a review
router.post('/reply/:reviewId', addReply);

// GET: Get review summary (place before :productId route)
router.get('/summary/:productId', getReviewSummary);

// GET: Get all reviews for a product
router.get('/:productId', getReviewsForProduct);



module.exports = router;
