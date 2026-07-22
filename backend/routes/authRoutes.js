const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// @desc    Auth admin & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    // Check if we are in mock DB mode
    if (process.env.MOCK_DB === 'true') {
      const { username, password } = req.body;
      if (username === 'admin' && password === 'admin@bps') {
        const token = jwt.sign({ id: 'mock_admin_id', role: 'superadmin' }, process.env.JWT_SECRET || 'fallback_secret', {
          expiresIn: '30d'
        });
        return res.json({ success: true, token, username: 'admin', role: 'superadmin' });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const { username, password } = req.body;
    let admin = await Admin.findOne({ username });

    // Auto-seed default admin if database has no admin records yet
    if (!admin && (await Admin.countDocuments()) === 0 && username === 'admin' && password === 'admin@bps') {
      admin = await Admin.create({ username: 'admin', password: 'admin@bps', role: 'superadmin' });
    }

    if (admin && (await admin.matchPassword(password))) {
      const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d'
      });
      res.json({
        success: true,
        token,
        username: admin.username,
        role: admin.role
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Register a new admin (Run once or restrict access)
// @route   POST /api/auth/register
// @access  Public (for initial setup, can secure later)
router.post('/register', async (req, res) => {
  try {
    if (process.env.MOCK_DB === 'true') {
      return res.status(400).json({ success: false, message: 'Cannot register in Mock DB mode' });
    }

    const { username, password } = req.body;
    const adminExists = await Admin.findOne({ username });
    if (adminExists) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    const admin = await Admin.create({ username, password });
    if (admin) {
      res.status(201).json({
        success: true,
        _id: admin._id,
        username: admin.username,
        role: admin.role
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

const Staff = require('../models/Staff');

// @desc    Auth staff & get token
// @route   POST /api/auth/staff-login
// @access  Public
router.post('/staff-login', async (req, res) => {
  try {
    if (process.env.MOCK_DB === 'true') {
      const { username, password } = req.body;
      if (username === 'worker' && password === 'worker123') {
        const token = jwt.sign({ id: 'mock_staff_id', role: 'staff' }, process.env.JWT_SECRET || 'fallback_secret', {
          expiresIn: '30d'
        });
        return res.json({ success: true, token, username: 'worker', role: 'staff', _id: 'mock_staff_id' });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }

    const { username, password } = req.body;
    let queryUsername = username;
    if (queryUsername && !queryUsername.includes('@')) {
      queryUsername = `${username}@bpsevent.com`;
    }

    let staff = await Staff.findOne({
      $or: [{ username }, { username: queryUsername }]
    });

    // Auto-seed default staff if database has no staff records yet
    if (!staff && (await Staff.countDocuments()) === 0 && (username === 'worker' || username === 'worker@bpsevent.com') && password === 'worker123') {
      staff = await Staff.create({
        name: 'Default Worker',
        username: 'worker@bpsevent.com',
        password: 'worker123',
        role: 'Event Staff',
        contactNumber: '9876543210',
        status: 'Active'
      });
    }

    if (staff && (await staff.matchPassword(password))) {
      const token = jwt.sign({ id: staff._id, role: 'staff' }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d'
      });
      res.json({
        success: true,
        token,
        username: staff.username,
        role: 'staff',
        _id: staff._id
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @desc    Worker Forgot Password Request
// @route   POST /api/auth/staff-forgot-password
// @access  Public
router.post('/staff-forgot-password', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ success: false, message: 'Username is required' });
    }
    
    // Find if staff exists
    const staff = await Staff.findOne({ username });
    if (!staff) {
      // Don't reveal if user exists or not for security, just say request sent
      return res.json({ success: true, message: 'If the username exists, a request has been sent to the admin.' });
    }

    const Notification = require('../models/Notification');
    await Notification.create({
      title: 'Password Reset Request',
      message: `Worker with login ID "${username}" has requested a password reset. Please update their password in the Staff Manager.`,
      type: 'warning',
      targetRole: 'superadmin' // Target the admin
    });

    res.json({ success: true, message: 'Password reset request sent to Admin.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
