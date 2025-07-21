const Testimonial = require("../models/Testimonial");

// GET all testimonials
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE a testimonial
exports.createTestimonial = async (req, res) => {
  const { name, role, image, rating, review } = req.body;

  const testimonial = new Testimonial({
    name,
    role,
    image,
    rating,
    review
  });

  try {
    const newTestimonial = await testimonial.save();
    res.status(201).json(newTestimonial);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    const { name, role, image, rating, review } = req.body;

    if (name !== undefined) testimonial.name = name;
    if (role !== undefined) testimonial.role = role;
    if (image !== undefined) testimonial.image = image;
    if (rating !== undefined) testimonial.rating = rating;
    if (review !== undefined) testimonial.review = review;

    const updatedTestimonial = await testimonial.save();
    res.json(updatedTestimonial);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    await testimonial.remove();
    res.json({ message: "Testimonial deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
