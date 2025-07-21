const express = require('express');
const router = express.Router();
const DiscountCode = require('../models/DiscountCode');

// Create discount code
router.post('/', async (req, res) => {
    try {
        const discountCode = new DiscountCode(req.body);
        const savedCode = await discountCode.save();
        res.status(201).json(savedCode);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Validate discount code
router.post('/validate', async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        const discount = await DiscountCode.findOne({
            code: code.toUpperCase(),
            isActive: true,
            expiryDate: { $gt: new Date() }
        });

        if (!discount) {
            return res.status(400).json({ message: 'Invalid or expired discount code' });
        }

        if (orderAmount < discount.minOrderAmount) {
            return res.status(400).json({
                message: `Minimum order amount of Rs.${discount.minOrderAmount} required`
            });
        }

        let discountAmount = 0;
        if (discount.discountType === 'percentage') {
            discountAmount = (orderAmount * discount.discountValue) / 100;
            if (discount.maxDiscountAmount && discountAmount > discount.maxDiscountAmount) {
                discountAmount = discount.maxDiscountAmount;
            }
        } else {
            discountAmount = discount.discountValue;
        }

        res.json({
            valid: true,
            discountAmount,
            code: discount.code,
            message: `Discount of Rs.${discountAmount} applied successfully!`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed sample discount codes
router.post('/seed', async (req, res) => {
    try {
        const sampleCodes = [
            {
                code: 'SAVE10',
                discountType: 'percentage',
                discountValue: 10,
                minOrderAmount: 1000,
                maxDiscountAmount: 1000,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
            {
                code: 'FLAT500',
                discountType: 'fixed',
                discountValue: 500,
                minOrderAmount: 2000,
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
        ];

        await DiscountCode.deleteMany({});
        const codes = await DiscountCode.insertMany(sampleCodes);
        res.json({ message: 'Discount codes seeded successfully', codes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;