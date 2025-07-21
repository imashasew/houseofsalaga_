const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// ✅ POST /api/orders - Create a new order
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      country,
      company,
      address,
      apt,
      city,
      state,
      postal,
      phone,
      saveInfo,
      shippingAddress,
      payment,
      cardNumber,
      cardName,
      cardExpiry,
      cardCvc,
      products, // ✅ Expecting product array from frontend
    } = req.body;

    const newOrder = new Order({
      firstName,
      lastName,
      country,
      company,
      address,
      apt,
      city,
      state,
      postal,
      phone,
      saveInfo,
      shippingAddress,
      payment,
      cardNumber,
      cardName,
      cardExpiry,
      cardCvc,
      products, // ✅ Include in saved document
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: savedOrder,
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: err.message,
    });
  }
});

// ✅ GET /api/orders - Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: err.message,
    });
  }
});

// ✅ GET /api/orders/:id - Fetch single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: err.message,
    });
  }
});

module.exports = router;
