const mongoose = require('mongoose');

// Cart item schema
const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  priceAtTime: {
    type: Number,
    required: true,
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function (v) {
        return v.every(img => img && img.trim() !== '');
      },
      message: 'Images array cannot contain empty strings',
    },
  },
  image: {
    type: String,
    default: null,
    validate: {
      validator: function (v) {
        return v === null || (typeof v === 'string' && v.trim() !== '');
      },
      message: 'Image cannot be an empty string',
    },
  },
});

// Main cart schema
const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [CartItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
    default: 250,
  },
  deliveryFee: {
    type: Number,
    required: true,
    default: 150,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  discountCode: {
    type: String,
    default: '',
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: String,
    default: 'Rs',
  },
}, {
  timestamps: true,
});

// Pre-save calculation
CartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.priceAtTime * item.quantity), 0);
  this.total = this.subtotal + this.tax + this.deliveryFee - this.discountAmount;
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
