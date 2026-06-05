const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbClient = require('../database/dbClient');
const { getDbType } = require('../config/db');

// Helper to sign JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'avon_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, email, password, role, companyName, industry, assignedService, phone } = req.body;

  try {
    // Check if user exists
    const userExists = await dbClient.users.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password if JSON db fallback is active (Mongoose schema has pre-save hashing)
    let hashedPassword = password;
    if (getDbType() === 'json') {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const assignedRole = role || 'client'; // Default to client for public register

    // Create user
    const user = await dbClient.users.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      avatar: assignedRole === 'client' 
        ? `https://api.dicebear.com/7.x/initials/svg?seed=${(companyName || name).replace(/\s+/g, '')}`
        : `https://api.dicebear.com/7.x/adventurer/svg?seed=${name.replace(/\s+/g, '')}`
    });

    // Create Client Profile if role is client
    if (assignedRole === 'client') {
      await dbClient.clients.create({
        user: user._id || user.id,
        companyName: companyName || `${name}'s Firm`,
        contactPerson: name,
        phone: phone || '',
        industry: industry || 'Consulting',
        assignedService: assignedService || 'Enterprise Software Solutions',
        projectStatus: 'Discovery',
        communicationNotes: [{
          note: `Client profile created on self-registration. Service selected: ${assignedService || 'Enterprise Software Solutions'}`,
          addedBy: 'System'
        }]
      });
    }

    // Generate token
    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    // Find user (select +password manually for mongoose since select: false is specified)
    let user;
    if (getDbType() === 'mongodb') {
      user = await dbClient.users.findOne({ email }).select('+password');
    } else {
      user = await dbClient.users.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user & their profile details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let profile = null;

    if (req.user.role === 'employee') {
      const empProfile = await dbClient.employees.findOne({ user: userId });
      profile = empProfile;
    } else if (req.user.role === 'client') {
      const clientProfile = await dbClient.clients.findOne({ user: userId });
      profile = clientProfile;
    }

    res.json({
      success: true,
      user: {
        id: userId,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        createdAt: req.user.createdAt
      },
      profile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password mock reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await dbClient.users.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Email address not registered' });
    }

    // Mock sending reset link
    res.json({
      success: true,
      message: `Password reset instructions have been mocked and sent to ${email}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
