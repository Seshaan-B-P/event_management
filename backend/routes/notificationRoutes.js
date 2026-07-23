const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Notification = require('../models/Notification');

const DATA_DIR = path.join(__dirname, '../data');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(NOTIFICATIONS_FILE)) {
    fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify([], null, 2));
  }
};

// Get all notifications (optionally filter by role)
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      let notifications = JSON.parse(fileData);
      const { role } = req.query;
      if (role) {
        notifications = notifications.filter(n => !n.targetRole || n.targetRole === 'all' || n.targetRole === role);
      }
      return res.status(200).json({ success: true, data: notifications });
    } catch (err) {
      return res.status(200).json({ success: true, data: [] });
    }
  }

  try {
    const { role } = req.query;
    let query = {};
    if (role) {
      query.targetRole = { $in: ['all', role] };
    }
    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      let notifications = JSON.parse(fileData);
      const { role } = req.query;
      if (role) {
        notifications = notifications.filter(n => !n.targetRole || n.targetRole === 'all' || n.targetRole === role);
      }
      return res.status(200).json({ success: true, data: notifications });
    } catch (fallbackErr) {
      res.status(200).json({ success: true, data: [] });
    }
  }
});

// Create new notification
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      const notifications = JSON.parse(fileData);
      const newNotif = {
        _id: 'mock_' + Date.now().toString(),
        ...req.body,
        isRead: req.body.isRead || false,
        createdAt: new Date().toISOString()
      };
      notifications.unshift(newNotif);
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
      return res.status(201).json({ success: true, data: newNotif });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const notification = await Notification.create(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Mark as read
router.put('/:id/read', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      const notifications = JSON.parse(fileData);
      const notif = notifications.find(n => n._id === req.params.id);
      if (notif) {
        notif.isRead = true;
        fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
        return res.json({ success: true, data: notif });
      }
      return res.status(404).json({ success: false, error: 'Notification not found' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!notification) return res.status(404).json({ success: false, error: 'Notification not found' });
    res.json({ success: true, data: notification });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Mark all as read
router.put('/read-all', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(NOTIFICATIONS_FILE, 'utf8');
      const notifications = JSON.parse(fileData);
      notifications.forEach(n => { n.isRead = true; });
      fs.writeFileSync(NOTIFICATIONS_FILE, JSON.stringify(notifications, null, 2));
      return res.json({ success: true, message: 'All marked as read' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All marked as read' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
