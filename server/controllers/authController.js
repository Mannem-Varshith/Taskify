const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Password validation regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Common weak passwords blacklist
const weakPasswords = [
  'password', '12345678', '123456789', 'qwerty', 'abc123', 
  'password123', 'admin123', 'letmein', 'welcome', 'monkey',
  '1234567890', 'password1', 'qwerty123', 'admin', 'user123'
];

// Validate password strength
const validatePassword = (password) => {
  // Check minimum length
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  // Check against weak passwords
  if (weakPasswords.includes(password.toLowerCase())) {
    return { valid: false, message: 'This password is too common. Please choose a stronger password' };
  }

  // Check regex pattern
  if (!passwordRegex.test(password)) {
    return { 
      valid: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)' 
    };
  }

  return { valid: true };
};

// @desc    Register user
// @route   POST /api/auth/register
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  
  try {
    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false,
        message: passwordValidation.message 
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      return res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        token: generateToken(user._id),
      });
    }
    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => res.json(req.user);

// @desc    Update profile
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Update name (email cannot be changed)
    user.name = req.body.name || user.name;
    
    // Handle password change
    if (req.body.oldPassword && req.body.newPassword) {
      // Verify old password
      const isMatch = await user.comparePassword(req.body.oldPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Validate new password strength
      const passwordValidation = validatePassword(req.body.newPassword);
      if (!passwordValidation.valid) {
        return res.status(400).json({ 
          success: false,
          message: passwordValidation.message 
        });
      }
      
      // Update password
      user.password = req.body.newPassword;
    }
    
    const updated = await user.save();
    res.json({
      _id: updated._id, 
      name: updated.name, 
      email: updated.email, 
      role: updated.role,
      token: generateToken(updated._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile };
