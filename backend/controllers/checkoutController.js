const Order = require('../models/Order');

exports.processOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.json({ success: true, message: 'Order placed successfully!', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to place order. Please try again.', error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};

exports.getOrderSummary = (req, res) => {
  // TODO: Fetch order summary from DB or business logic
  res.json({
    subtotal: 15000,
    tax: 250,
    shipping: 150,
    total: 14000
  });
}; 