const express = require("express")
const router = express.Router()
const Product = require("../models/Product")
const Counter = require("../models/Counter")

// GET /api/products - with filters
router.get("/", async (req, res) => {
    try {
        const { minPrice, maxPrice, category, size, colors,sort } = req.query

        console.log(" Received query params:", req.query) // DEBUG

        // Build filter object
        const filter = {}

        // Price range filter
        if (minPrice || maxPrice) {
            filter.price = {}
            if (minPrice) filter.price.$gte = Number(minPrice)
            if (maxPrice) filter.price.$lte = Number(maxPrice)
        }

        // Category filter (case-insensitive)
        if (category) {
            filter.category = { $regex: new RegExp(category, "i") }
        }

        // Size filter - FIXED: Check if your schema uses 'size' or 'sizes'
        if (size) {
            // If your schema has 'size' field (single value)
            filter.size = { $regex: new RegExp(size, "i") }

        }
        if (sort) {
            // If your schema has 'size' field (single value)
            filter.sort = { $regex: new RegExp(sort, "i") }

        }

        // Colors filter - FIXED: Handle both single color and multiple colors
        if (colors) {
            const colorArray = colors.split(",").map((color) => color.trim())

            // If your schema has 'color' field (single value)
            filter.color = { $in: colorArray }

            // OR if your schema has 'colors' field (array)
            // filter.colors = { $in: colorArray };
        }

        console.log(" Applied filters:", filter) // DEBUG

        const products = await Product.find(filter)

        console.log("Found products:", products.length) // DEBUG

        res.json({
            success: true,
            count: products.length,
            data: products,
        })
    } catch (error) {
        console.error(" Error fetching products:", error)
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        })
    }
})

// GET /api/products/all - all products without filters
router.get("/all", async (req, res) => {
    try {
        const products = await Product.find({})
        console.log(" All products fetched:", products.length) // DEBUG

        res.json({
            success: true,
            count: products.length,
            data: products,
        })
    } catch (error) {
        console.error(" Error fetching all products:", error)
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        })
    }
})

// POST /api/products - Add product with auto-increment ID
router.post("/", async (req, res) => {
    try {
        // Generate unique product ID
        const counter = await Counter.findOneAndUpdate(
            { id: "product_id" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true },
        )

        const newId = `P${counter.seq.toString().padStart(3, "0")}`

        // Check for duplicate (extra safety)
        const existing = await Product.findOne({ id: newId })
        if (existing) {
            return res.status(409).json({
                success: false,
                message: "Product with this id already exists",
                error: "DUPLICATE_ENTRY",
                duplicateField: "id",
                duplicateValue: newId,
            })
        }

        const newProduct = new Product({
            id: newId,
            ...req.body,
        })

        const saved = await newProduct.save()

        res.status(201).json({ success: true, product: saved })
    } catch (err) {
        console.error("Product Save Error:", err)
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message,
        })
    }
})
router.post("/:id/reviews", async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        const { rating, comment, name, user } = req.body;

        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === user
        );
        if (alreadyReviewed) {
            return res.status(400).json({ message: "Product already reviewed" });
        }

        const review = {
            name,
            rating: Number(rating),
            comment,
            user,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.numReviews;

        await product.save();
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

const { searchProducts } = require('../controllers/product.controller');
router.get('/search', searchProducts);



module.exports = router



