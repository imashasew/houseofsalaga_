const Review = require('../models/Review');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// ---------------------------
// Create a new review
// ---------------------------
exports.createReview = async (req, res) => {
  try {
    const { productId, user, rating, title, comment } = req.body;

    // Validate product ID and required fields
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    if (!user || !rating || !title) {
      return res.status(400).json({ message: 'User, rating, and title are required' });
    }

    // Check if product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create and save the review
    const review = new Review({
      productId,
      user,
      rating,
      title,
      comment: comment || ''
    });

    await review.save();

    // Recalculate average rating and review count
    const reviews = await Review.find({ productId });
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = total / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      averageRating: average,
      reviewCount: reviews.length
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Create Review Error:', err);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// ---------------------------
// Get all reviews for a specific product
// ---------------------------
exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error('Get Reviews Error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

// ---------------------------
// Like or unlike a review
// ---------------------------
exports.toggleLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { user } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }
    if (!user) {
      return res.status(400).json({ message: 'User is required' });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    const alreadyLiked = review.likes.includes(user);
    if (alreadyLiked) {
      review.likes = review.likes.filter(u => u !== user);
    } else {
      review.likes.push(user);
    }

    await review.save();
    res.json(review);
  } catch (err) {
    console.error('Toggle Like Error:', err);
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};

// ---------------------------
// Add a reply to a review
// ---------------------------
exports.addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { user, comment } = req.body;

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: 'Invalid review ID' });
    }
    if (!user || !comment) {
      return res.status(400).json({ message: 'User and comment are required' });
    }

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.replies.push({ user, comment });
    await review.save();

    res.status(201).json(review);
  } catch (err) {
    console.error('Add Reply Error:', err);
    res.status(500).json({ error: 'Failed to add reply' });
  }
};

// ---------------------------
// Get review summary for a product
// ---------------------------
exports.getReviewSummary = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const reviews = await Review.find({ productId });

    const summary = {
      averageRating: 0,
      totalReviews: reviews.length,
      breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    if (reviews.length > 0) {
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      summary.averageRating = parseFloat((total / reviews.length).toFixed(1));
      reviews.forEach(r => {
        summary.breakdown[r.rating] += 1;
      });
    }

    res.json(summary);
  } catch (err) {
    console.error('Get Review Summary Error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
};
