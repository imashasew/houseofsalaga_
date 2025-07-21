const Product = require('../models/Product');
const mongoose = require('mongoose');

// Helper function
const getDefaultProduct = async () => Product.findOne({ isDefault: true });

// @desc Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name,id, description, price, category, stock, colors, sizes, images, inStock, sort , returnsInfo } = req.body;
    if (!name || !price || !id) {
      return res.status(400).json({ 
        success: false,
        error: 'Name and price are required' 
      });
    }
    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ success: false, error: 'Product with this ID already exists' });
    }
    let productImages = [];
    if (Array.isArray(images) && images.length > 0) {
      productImages = images.filter(img => img && img.trim() !== '');
    } else if (image && image.trim() !== '') {
      productImages = [image];
    }

    const newProduct = new Product({
      name,
      id,
      description,
      price,
      category,
      stock,
      colors: colors || [],
      sizes: sizes || [],
      image: productImages.length > 0 ? productImages[0] : null,
      images: productImages,
      inStock: inStock !== undefined ? inStock : true,
      sort: sort || [],
      returnsInfo: returnsInfo || ''
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ 
      success: true, 
      data: savedProduct 
    });
  } catch (err) {
    console.error('Error creating product:', err);
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ success: false, error: 'Validation Error', details: errors });
    }
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Get default product
exports.getDefaultProduct = async (req, res) => {
  try {
    const defaultProduct = await getDefaultProduct();
    if (!defaultProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'No default product configured' 
      });
    }

    res.json({ 
      success: true, 
      data: defaultProduct 
    });
  } catch (err) {
    console.error('Error fetching default product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Set product as default
exports.setDefaultProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.updateMany({}, { $set: { isDefault: false } });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: { isDefault: true } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Default product updated successfully', 
      data: updatedProduct 
    });
  } catch (err) {
    console.error('Error setting default product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Get single product (fallback to default)
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;
    let isDefaultFallback = false;

    if (id && mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id);
    }

    if (!product) {
      product = await getDefaultProduct();
      if (!product) {
        return res.status(404).json({ 
          success: false,
          message: 'Product not found and no default available' 
        });
      }
      isDefaultFallback = true;
    }

    res.json({ 
      success: true,
      data: product,
      isDefaultFallback 
    });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Get all products
/*exports.getAllProducts = async (req, res) => {
  try {
    const { category, size, color, minPrice, maxPrice, inStock, limit } = req.query;
    const query = {};

    // Category filter (multi-value)
    if (category) {
      const categories = category.split(',').map(c => c.trim());
      query.category = { $in: categories };
    }

    // Size filter (multi-value)
    if (size) {
      const sizes = size.split(',').map(s => s.trim());
      query.sizes = { $in: sizes };
    }

    // Color filter (multi-value)
    if (color) {
      const colors = color.split(',').map(c => c.trim());
      query.colors = { $in: colors };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // In stock filter
    if (inStock === 'true') query.stock = { $gt: 0 };

    const products = await Product.find(query).limit(parseInt(limit) || 0);
    res.json({ 
      success: true, 
      data: products 
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}; */
// @desc Get all products with filters
exports.getAllProducts = async (req, res) => {
  try {
    const { category, inStock, limit, minPrice, maxPrice, sizes, colors } = req.query;
    const query = {};

    if (category) query.category = { $in: category.split(',') };
    if (sizes) query.sizes = { $in: sizes.split(',') };
    if (colors) query.colors = { $in: colors.split(',') };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') query.inStock = true;

    const products = await Product.find(query).limit(parseInt(limit) || 0);
    res.json({ success: true, data: products, count: products.length });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// @desc Get new arrivals
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(8);
    
    res.json({ 
      success: true, 
      data: products 
    });
  } catch (err) {
    console.error('Error fetching new arrivals:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID' 
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true, 
      data: updatedProduct 
    });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID' 
      });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({ 
      success: true,
      message: 'Product deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Recommended products
exports.getRecommendedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const current = await Product.findById(productId);
    if (!current) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // First try to get products from the same category
    let recommended = await Product.find({
      _id: { $ne: productId },
      category: current.category
    })
    .sort({ reviewCount: -1, averageRating: -1 })
    .limit(4);

    // If not enough products in same category, get most rated products
    if (recommended.length < 5) {
      const additionalProducts = await Product.find({
        _id: { $ne: productId },
        category: { $ne: current.category }
      })
      .sort({ reviewCount: -1, averageRating: -1 })
      .limit(5 - recommended.length);
      
      recommended = [...recommended, ...additionalProducts];
    }

    res.json({ 
      success: true, 
      data: recommended 
    });
  } catch (err) {
    console.error('Error getting recommended products:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// @desc Search products by name (improved for phrases and spaces)
exports.searchProducts = async (req, res) => {
  try {
    const query = (req.query.query || '').trim();
    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter is required' });
    }

    const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'); // Escape regex special chars
    const regex = new RegExp(escapedQuery.split(/\s+/).join('.*'), 'i'); // match words in order

    const products = await Product.find({
      name: { $regex: regex }
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    console.error('Error searching products:', err);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
// @desc Get trending products
exports.getTrendingProducts = async (req, res) => {
  try {
    const trending = await Product.find({ isTrending: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(trending);
  } catch (err) {
    console.error('Error fetching trending products:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// @desc Create trending product
exports.createTrendingProduct = async (req, res) => {
  try {
    const { 
      name, 
      id, 
      description, 
      price, 
      category, 
      sizes, 
      colors, 
      image,
      images,
      inStock, 
      sort,
      isTrending 
    } = req.body;

    if (!name || !price || !id) {
      return res.status(400).json({ success: false, error: 'Name, price, and id are required' });
    }

    const existingProduct = await Product.findOne({ id });
    if (existingProduct) {
      return res.status(400).json({ success: false, error: 'Product with this ID already exists' });
    }

    let productImages = [];
    if (Array.isArray(images) && images.length > 0) {
      productImages = images.filter(img => img && img.trim() !== '');
    } else if (image && image.trim() !== '') {
      productImages = [image];
    }

    const newProduct = new Product({
      name,
      id,
      description: description || 'Product description',
      price,
      category: category || [],
      sizes: sizes || [],
      colors: colors || [],
      image: productImages.length > 0 ? productImages[0] : null,
      images: productImages,
      inStock: inStock !== undefined ? inStock : true,
      sort: sort || [],
      isTrending: isTrending === true
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    console.error('Error creating trending product:', err);

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ success: false, error: 'Validation Error', details: errors });
    }

    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

