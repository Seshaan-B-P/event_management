const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Report = require('../models/Report');

const DATA_DIR = path.join(__dirname, '../data');
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(REPORTS_FILE)) fs.writeFileSync(REPORTS_FILE, JSON.stringify([], null, 2));
};

// GET all reports
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(REPORTS_FILE, 'utf8');
      const reports = JSON.parse(fileData);
      return res.json({ success: true, data: reports });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET reports by staff ID
router.get('/staff/:staffId', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(REPORTS_FILE, 'utf8');
      const reports = JSON.parse(fileData).filter(r => r.staffId === req.params.staffId);
      return res.json({ success: true, data: reports });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const reports = await Report.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST new report
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(REPORTS_FILE, 'utf8');
      const reports = JSON.parse(fileData);
      const { staffId, staffName, reportType, content } = req.body;
      const newReport = {
        _id: 'mock_' + Date.now().toString(),
        staffId,
        staffName,
        reportType,
        content,
        status: 'Unread',
        createdAt: new Date().toISOString()
      };
      reports.unshift(newReport);
      fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
      return res.status(201).json({ success: true, data: newReport });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

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
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(REPORTS_FILE, 'utf8');
      const reports = JSON.parse(fileData);
      const report = reports.find(r => r._id === req.params.id);
      if (report) {
        report.status = 'Read';
        fs.writeFileSync(REPORTS_FILE, JSON.stringify(reports, null, 2));
        return res.json({ success: true, data: report });
      }
      return res.status(404).json({ success: false, error: 'Report not found' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const report = await Report.findByIdAndUpdate(req.params.id, { status: 'Read' }, { new: true });
    if (!report) return res.status(404).json({ success: false, error: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update report' });
  }
});

module.exports = router;
