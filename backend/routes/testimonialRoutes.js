const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");

// GET all
router.get("/", testimonialController.getTestimonials);

// GET by ID
router.get("/:id", testimonialController.getTestimonialById);

// POST create
router.post("/", testimonialController.createTestimonial);

// PUT update
router.put("/:id", testimonialController.updateTestimonial);

// DELETE
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
