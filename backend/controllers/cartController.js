const Product = require('../models/Cart');
const mongoose = require('mongoose');
// POST /api/cart/add
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, size, color, priceAtTime, image } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ userId });

    const newItem = {
      product: productId,
      quantity,
      size,
      color,
      priceAtTime,
      image,
      images: product.images || [],
    };

    if (!cart) {
      cart = new Cart({ userId, items: [newItem] });
    } else {
      const existingIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.size === size &&
          item.color === color
      );

      if (existingIndex >= 0) {
        cart.items[existingIndex].quantity += quantity;
      } else {
        cart.items.push(newItem);
      }
    }

    await cart.save();
    cart = await Cart.findOne({ userId }).populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
