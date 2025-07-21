const mongoose = require('mongoose');

const trendingProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  colors: [String],
  sizes: [String],
  images: [String], // Store image URLs or relative paths
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  description: { type: String },
  returnsPolicy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('TrendingProduct', trendingProductSchema);
