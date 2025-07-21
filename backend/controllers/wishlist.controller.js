const User = require('../models/User');
const Product = require('../models/Product');

exports.getWishlistByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ products: user.wishlist });
  } catch (err) {
    console.error('Get wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { productId } = req.params;
    if (!productId) return res.status(400).json({ error: 'Missing productId' });
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (!user.wishlist.map(id => String(id)).includes(String(productId))) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error('Add to wishlist error:', err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { productId } = req.params;
    user.wishlist = user.wishlist.filter(id => String(id) !== String(productId));
    await user.save();
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err);
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
}; 

// Get wishlist by userId (for /user/:userId route)
exports.getWishlistByUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('wishlist');
    if (!user) return res.status(404).json({ error: 'User not found' });
    // If wishlist field does not exist, return empty array
    if (!user.wishlist) return res.json([]);
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist by userId' });
  }
}; 
