const express = require('express'); 
const router = express.Router();

const {
  registerUser,
  loginUser,
  googleAuthUser,
  forgotPassword,
  resetPassword
} = require('../controllers/auth.controller');

// 📝 Register (Sign Up)
router.post('/signup', registerUser);

// 🔐 Login (Sign In)
router.post('/signin', loginUser);

// 🔗 Google Login
router.post('/google', googleAuthUser);

// 🔑 Forgot Password
router.post('/forgot-password', forgotPassword);

// 🔄 Reset Password
router.post('/reset-password/:token', resetPassword);

module.exports = router;
