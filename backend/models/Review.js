const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true },
  title: { type: String, required: true },
  comment: { type: String },
  likes: { type: [String], default: [] },
  replies: { type: [replySchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
