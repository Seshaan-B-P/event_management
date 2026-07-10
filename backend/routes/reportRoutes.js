const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET reports by staff ID
router.get('/staff/:staffId', async (req, res) => {
  try {
    const reports = await Report.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST new report
router.post('/', async (req, res) => {
  try {
    const { staffId, staffName, reportType, content } = req.body;
    const report = new Report({ staffId, staffName, reportType, content });
    await report.save();

    const Notification = require('../models/Notification');
    await Notification.create({
      title: `New ${reportType}`,
      message: `${staffName} has submitted a new ${reportType.toLowerCase()} report.`,
      type: reportType === 'Incident' ? 'warning' : 'info',
      targetRole: 'superadmin'
    });

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to submit report' });
  }
});

// PATCH mark as read
router.patch('/:id/read', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update report' });
  }
});

module.exports = router;
