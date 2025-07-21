const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const authenticateToken = require('../middleware/authenticateToken');

// Get wishlist for logged-in user
router.get('/me', authenticateToken, wishlistController.getWishlistByToken);
// Add product to wishlist for logged-in user
router.post('/:productId', authenticateToken, wishlistController.addToWishlist);
// Remove product from wishlist for logged-in user
router.delete('/:productId', authenticateToken, wishlistController.removeFromWishlist);

module.exports = router; 
