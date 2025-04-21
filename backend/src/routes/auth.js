const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { auth } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Google authentication routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// Facebook authentication routes
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

// Register new user
router.post('/register', async (req, res) => {
  console.log('Registration request received:', {
    username: req.body.username,
    email: req.body.email,
    hasPassword: !!req.body.password
  });

  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({ 
        message: 'All fields are required',
        details: {
          username: !username ? 'Username is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('Registration failed: User exists', {
        existingEmail: existingUser.email === email,
        existingUsername: existingUser.username === username
      });
      return res.status(400).json({ 
        message: 'User already exists',
        details: {
          email: existingUser.email === email ? 'Email already in use' : null,
          username: existingUser.username === username ? 'Username already taken' : null
        }
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: 'user',
      profileImage: 'default-profile.jpg'
    });

    await user.save();
    console.log('User created successfully:', {
      id: user._id,
      username: user.username,
      email: user.email
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Send more detailed error message
    res.status(500).json({ 
      message: 'Error registering user',
      details: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  console.log('Login request received:', { email: req.body.email, hasPassword: !!req.body.password });
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        details: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'User not found'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Incorrect password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user.email);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in',
      details: error.message
    });
  }
});

module.exports = router; 