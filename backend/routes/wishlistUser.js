const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');

// const { authenticateJWT } = require('../controllers/auth.controller');


const { authenticateJWT } = require('../controllers/auth.controller');
const { getWishlistByUserId } = require('../controllers/wishlist.controller');


router.get('/', getWishlist);
router.post('/:productId', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/user/:userId', getWishlistByUserId);



module.exports = router; 
