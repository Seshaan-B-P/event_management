const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Staff = require('../models/Staff');

const DATA_DIR = path.join(__dirname, '../data');
const STAFF_FILE = path.join(DATA_DIR, 'staff.json');

// Ensure data directory and file exist for mock DB
const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(STAFF_FILE)) {
    fs.writeFileSync(STAFF_FILE, JSON.stringify([], null, 2));
  }
};

// @route   GET api/staff
// @desc    Get all staff members
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(STAFF_FILE, 'utf8');
      const staff = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: staff });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST api/staff
// @desc    Create a new staff member
router.post('/', async (req, res) => {
  const { name, role, contactNumber, email, status, username, password } = req.body;

  if (!name || !role || !contactNumber || !username || !password) {
    return res.status(400).json({ success: false, error: 'Name, role, contact number, username, and password are required' });
  }

  if (!username.endsWith('@bpsevent.com')) {
    return res.status(400).json({ success: false, error: 'Login ID must be a @bpsevent.com email address' });
  }

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(STAFF_FILE, 'utf8');
      const staff = JSON.parse(fileData);
      
      const newStaff = {
        _id: 'mock_staff_' + Date.now().toString(),
        name,
        role,
        contactNumber,
        email: email || '',
        status: status || 'Active',
        username,
        password, // In real DB this is hashed
        createdAt: new Date().toISOString()
      };

      staff.push(newStaff);
      fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2));
      return res.status(201).json({ success: true, data: newStaff });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const newStaff = await Staff.create({
      name, role, contactNumber, email, status, username, password
    });
    res.status(201).json({ success: true, data: newStaff });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PATCH api/staff/:id
// @desc    Update a staff member
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(STAFF_FILE, 'utf8');
      const staff = JSON.parse(fileData);
      const staffMember = staff.find(s => s._id === id);

      if (!staffMember) return res.status(404).json({ success: false, error: 'Staff member not found' });

      if (req.body.username && !req.body.username.endsWith('@bpsevent.com')) {
        return res.status(400).json({ success: false, error: 'Login ID must be a @bpsevent.com email address' });
      }

      Object.keys(req.body).forEach(key => {
        staffMember[key] = req.body[key];
      });

      fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2));
      return res.status(200).json({ success: true, data: staffMember });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const staffMember = await Staff.findById(id);
    if (!staffMember) return res.status(404).json({ success: false, error: 'Staff member not found' });
    
    // Update fields
    const { name, role, contactNumber, email, status, username, password } = req.body;
    
    if (username && !username.endsWith('@bpsevent.com')) {
      return res.status(400).json({ success: false, error: 'Login ID must be a @bpsevent.com email address' });
    }

    if (name) staffMember.name = name;
    if (role) staffMember.role = role;
    if (contactNumber) staffMember.contactNumber = contactNumber;
    if (email !== undefined) staffMember.email = email;
    if (status) staffMember.status = status;
    if (username) staffMember.username = username;
    if (password) {
      staffMember.password = password; // Will be hashed by pre-save hook
      staffMember.markModified('password');
    }

    await staffMember.save();
    res.status(200).json({ success: true, data: staffMember });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE api/staff/:id
// @desc    Delete a staff member
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(STAFF_FILE, 'utf8');
      let staff = JSON.parse(fileData);
      
      const initialLength = staff.length;
      staff = staff.filter(s => s._id !== id);
      
      if (staff.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Staff member not found' });
      }

      fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2));
      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const staffMember = await Staff.findById(id);
    if (!staffMember) return res.status(404).json({ success: false, error: 'Staff member not found' });
    
    await staffMember.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
