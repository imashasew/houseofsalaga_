const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authenticateToken = require('../middleware/authenticateToken');

// Get cart for logged-in user
router.get('/', authenticateToken, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id })
            .populate('items.product');

        if (!cart) {
            cart = new Cart({
                userId: req.user.id,
                items: [],
                subtotal: 0,
                tax: 250,
                deliveryFee: 150,
                total: 400,
            });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add item to cart
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const { productId, quantity, size, color } = req.body;
        const userId = req.user.id;

        // Validate required fields
        if (!productId || !quantity || !size || !color) {
            return res.status(400).json({
                message: 'Missing required fields: productId, quantity, size, color'
            });
        }

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validate size and color if they exist in product
        if (product.sizes && product.sizes.length > 0 && !product.sizes.includes(size)) {
            return res.status(400).json({ message: `Size '${size}' not available for this product` });
        }

        if (product.colors && product.colors.length > 0 && !product.colors.includes(color)) {
            return res.status(400).json({ message: `Color '${color}' not available for this product` });
        }

        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [],
                tax: 250,
                deliveryFee: 150,
            });
        }

        // Check if item with same product, size, and color already exists
        const existingItemIndex = cart.items.findIndex(
            item => item.product.toString() === productId &&
                item.size === size &&
                item.color === color
        );

        if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;

            // Check total quantity against stock
            if (product.stock < newQuantity) {
                return res.status(400).json({ message: 'Insufficient stock for requested quantity' });
            }

            cart.items[existingItemIndex].quantity = newQuantity;
        } else {
            // Add new item to cart - MAKE SURE TO SET priceAtTime
            cart.items.push({
                product: productId,
                quantity: quantity,
                size: size,
                color: color,
                priceAtTime: product.price // THIS IS THE KEY FIX!
            });
        }

        // Save cart (this will trigger the pre-save hook to calculate totals)
        await cart.save();

        // Populate product details for response
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update item quantity
router.put('/update-quantity', authenticateToken, async (req, res) => {
    try {
        const { itemId, quantity } = req.body;
        const userId = req.user.id;

        if (!itemId || quantity === undefined) {
            return res.status(400).json({
                message: 'Missing required fields: itemId, quantity'
            });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.id(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        if (quantity <= 0) {
            cart.items.pull(itemId);
        } else {
            // Check stock availability
            const product = await Product.findById(item.product);
            if (product && product.stock < quantity) {
                return res.status(400).json({ message: 'Insufficient stock' });
            }

            item.quantity = quantity;
        }

        await cart.save();
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        console.error('Update quantity error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Remove item from cart
router.delete('/remove/:itemId', authenticateToken, async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items.pull(itemId);
        await cart.save();
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        console.error('Remove item error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Apply discount code
router.post('/apply-discount', authenticateToken, async (req, res) => {
    try {
        const { discountCode } = req.body;
        const userId = req.user.id;

        if (!discountCode) {
            return res.status(400).json({ message: 'Missing discountCode' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Simple discount validation
        const validDiscounts = {
            'SAVE10': { type: 'percentage', value: 10, minOrder: 1000 },
            'FLAT500': { type: 'fixed', value: 500, minOrder: 2000 },
            'WELCOME20': { type: 'percentage', value: 20, minOrder: 1500 },
        };

        const discount = validDiscounts[discountCode.toUpperCase()];

        if (!discount) {
            return res.status(400).json({ message: 'Invalid discount code' });
        }

        if (cart.subtotal < discount.minOrder) {
            return res.status(400).json({
                message: `Minimum order amount of Rs.${discount.minOrder} required`
            });
        }

        let discountAmount = 0;
        if (discount.type === 'percentage') {
            discountAmount = (cart.subtotal * discount.value) / 100;
        } else {
            discountAmount = discount.value;
        }

        cart.discountCode = discountCode.toUpperCase();
        cart.discountAmount = discountAmount;

        await cart.save();

        res.json({
            ...cart.toObject(),
            message: `Discount of Rs.${discountAmount} applied successfully!`
        });
    } catch (error) {
        console.error('Apply discount error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Remove discount
router.post('/remove-discount', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.discountCode = '';
        cart.discountAmount = 0;

        await cart.save();

        res.json(cart);
    } catch (error) {
        console.error('Remove discount error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get cart count
router.get('/count', authenticateToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        const itemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
        res.json({ count: itemCount });
    } catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Clear cart
router.delete('/clear', authenticateToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (cart) {
            cart.items = [];
            cart.discountCode = '';
            cart.discountAmount = 0;
            await cart.save();
        }
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
