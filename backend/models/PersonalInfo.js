const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  company: String,
  streetAddress: { type: String, required: true },
  apartment: String,
  city: { type: String, required: true },
  state: { type: String, required: true },
  phone: { type: String, required: true },
  postalCode: { type: String, required: true },
  deliveryInstructions: String,
  defaultShipping: { type: Boolean, default: false },
  defaultBilling: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('PersonalInfo', personalInfoSchema);
