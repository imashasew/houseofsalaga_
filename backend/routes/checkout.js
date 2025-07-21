const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.post('/', checkoutController.processOrder);
router.get('/', checkoutController.getAllOrders);
router.get('/summary', checkoutController.getOrderSummary);

module.exports = router; 