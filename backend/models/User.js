const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  mobile: { type: String },
  password: { type: String },
  googleId: { type: String }, // optional
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // ✅ inside the object
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
