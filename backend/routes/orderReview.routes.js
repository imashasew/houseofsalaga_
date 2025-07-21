// backend/routes/orderReview.routes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const OrderReview = require("../models/OrderReview");

const router = express.Router();

// Image Upload Setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Serve uploaded images
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// POST: Submit a review
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { productId, productName, user, review, rating } = req.body;

    if (!productId || !productName || !review || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newReview = new OrderReview({
      productId,
      productName,
      user: user || "guest",
      review,
      rating,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    await newReview.save();
    res.status(201).json({ message: "Review submitted" });
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
