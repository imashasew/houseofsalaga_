const express = require('express');
const router = express.Router();
const trendingController = require('../controllers/trendingController');

// GET /api/trending
router.get('/', trendingController.getAllTrendingProducts);

// POST /api/trending
router.post('/', trendingController.createTrendingProduct);

// NEW: GET /api/trending/search?query=...
router.get('/search', trendingController.searchTrendingProducts);

module.exports = router;
