const mongoose = require('mongoose');

const DiscountCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    minOrderAmount: {
        type: Number,
        default: 0,
    },
    maxDiscountAmount: {
        type: Number,
        default: null,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: null,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('DiscountCode', DiscountCodeSchema);