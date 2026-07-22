const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Leave = require('../models/Leave');
const Staff = require('../models/Staff');

const DATA_DIR = path.join(__dirname, '../data');
const LEAVES_FILE = path.join(DATA_DIR, 'leaves.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LEAVES_FILE)) fs.writeFileSync(LEAVES_FILE, JSON.stringify([], null, 2));
};

// GET all leaves (for admin)
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(LEAVES_FILE, 'utf8');
      const leaves = JSON.parse(fileData);
      return res.json({ success: true, data: leaves });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET leaves by staff ID
router.get('/staff/:staffId', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(LEAVES_FILE, 'utf8');
      const leaves = JSON.parse(fileData).filter(l => l.staffId === req.params.staffId);
      return res.json({ success: true, data: leaves });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const leaves = await Leave.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST new leave request
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(LEAVES_FILE, 'utf8');
      const leaves = JSON.parse(fileData);
      const { staffId, staffName, startDate, endDate, reason } = req.body;
      const newLeave = {
        _id: 'mock_' + Date.now().toString(),
        staffId,
        staffName,
        startDate,
        endDate,
        reason,
        status: 'Pending',
        adminReply: '',
        createdAt: new Date().toISOString()
      };
      leaves.unshift(newLeave);
      fs.writeFileSync(LEAVES_FILE, JSON.stringify(leaves, null, 2));
      return res.status(201).json({ success: true, data: newLeave });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const { staffId, staffName, startDate, endDate, reason } = req.body;
    const leave = new Leave({ staffId, staffName, startDate, endDate, reason });
    await leave.save();

    const Notification = require('../models/Notification');
    await Notification.create({
      title: 'New Leave Request',
      message: `${staffName} has requested leave.`,
      type: 'info',
      targetRole: 'superadmin'
    });

    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create leave request' });
  }
});

// PATCH update leave status
router.patch('/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(LEAVES_FILE, 'utf8');
      const leaves = JSON.parse(fileData);
      const leave = leaves.find(l => l._id === req.params.id);
      if (leave) {
        const { status, adminReply } = req.body;
        if (status) leave.status = status;
        if (adminReply !== undefined) leave.adminReply = adminReply;
        fs.writeFileSync(LEAVES_FILE, JSON.stringify(leaves, null, 2));
        return res.json({ success: true, data: leave });
      }
      return res.status(404).json({ success: false, error: 'Leave not found' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const { status, adminReply } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });

    leave.status = status || leave.status;
    if (adminReply !== undefined) leave.adminReply = adminReply;
    
    await leave.save();

    if (status === 'Approved') {
      await Staff.findByIdAndUpdate(leave.staffId, { status: 'On Leave' });
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update leave request' });
  }
});

module.exports = router;
