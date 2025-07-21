const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  country: String,
  company: String,
  address: String,
  apt: String,
  city: String,
  state: String,
  postal: String,
  phone: String,
  saveInfo: Boolean,
  shippingAddress: String,
  payment: String,
  cardNumber: String,
  cardName: String,
  cardExpiry: String,
  cardCvc: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema); 