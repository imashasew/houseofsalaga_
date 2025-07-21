const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "Customer"
  },
  image: {
    type: String, // store image URL or file path
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
