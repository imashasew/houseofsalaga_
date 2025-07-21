const mongoose = require("mongoose");

const orderReviewSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String, // ✅ Add this
    required: true,
  },
  user: {
    type: String,
    default: "guest",
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
}, { collection: "order_review", timestamps: true }); // ✅ Collection explicitly named

module.exports = mongoose.model("OrderReview", orderReviewSchema);
