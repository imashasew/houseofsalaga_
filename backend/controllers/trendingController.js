const TrendingProduct = require('../models/trendingModel'); 

// GET all trending products
exports.getAllTrendingProducts = async (req, res) => {
  try {
    const products = await TrendingProduct.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST create a new trending product
exports.createTrendingProduct = async (req, res) => {
  try {
    const newProduct = new TrendingProduct(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// NEW: Search trending products by name (case-insensitive, partial match)
exports.searchTrendingProducts = async (req, res) => {
  try {
    const query = req.query.query || '';
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }

    const products = await TrendingProduct.find({
      name: { $regex: query, $options: 'i' }
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error searching trending products:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
