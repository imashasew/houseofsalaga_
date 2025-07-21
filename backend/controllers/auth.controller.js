const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const client = new OAuth2Client(); // no clientID needed here

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const RESET_TOKEN_EXPIRY = '15m';

// 📧 email transporter (✅ fixed syntax error here)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 🔐 Register New User
const registerUser = async (req, res) => {
  const { email, username, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      username,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// 🔐 Login User (Sign In)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// 🔗 Google Login
const googleAuthUser = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || undefined,
    });
    const payload = ticket.getPayload();

    const { email, name, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        username: name,
        password: '',
        googleId: sub,
      });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Google login successful',
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
};

// 🔐 JWT Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// 🔑 Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: RESET_TOKEN_EXPIRY });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    console.log(process.env.FRONTEND_URL)

    await transporter.sendMail({
      from: `"Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// 🔄 Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Reset link has expired.' });
    }
    res.status(500).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  googleAuthUser,
  authenticateJWT,
  forgotPassword,
  resetPassword,
};
