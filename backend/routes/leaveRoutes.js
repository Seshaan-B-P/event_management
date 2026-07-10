const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');
const Staff = require('../models/Staff');

// GET all leaves (for admin)
router.get('/', async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET leaves by staff ID
router.get('/staff/:staffId', async (req, res) => {
  try {
    const leaves = await Leave.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json({ success: true, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST new leave request
router.post('/', async (req, res) => {
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
  try {
    const { status, adminReply } = req.body;
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, error: 'Leave not found' });

    leave.status = status || leave.status;
    if (adminReply !== undefined) leave.adminReply = adminReply;
    
    await leave.save();

    // If approved, update staff status to "On Leave"
    if (status === 'Approved') {
      await Staff.findByIdAndUpdate(leave.staffId, { status: 'On Leave' });
    } else if (status === 'Rejected' && leave.status === 'Approved') {
       // if it was approved and now rejected, might need to set it back to Active, but let's keep it simple for now
    }

    res.json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update leave request' });
  }
});

module.exports = router;
