const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    rate: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Use 'wishlist' collection
module.exports = mongoose.model('WishlistItem', WishlistItemSchema); 
