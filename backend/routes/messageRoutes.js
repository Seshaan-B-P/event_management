const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Message = require('../models/Message');

const DATA_DIR = path.join(__dirname, '../data');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, JSON.stringify([], null, 2));
};

// Get messages for a specific receiver (Staff or Vendor)
router.get('/:type/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
      const { type, id } = req.params;
      const messages = JSON.parse(fileData).filter(m => m.receiverType === type && m.receiverId === id);
      return res.json({ success: true, data: messages });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const { type, id } = req.params;
    const messages = await Message.find({
      receiverType: type,
      receiverId: id
    }).sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Send a new message
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
      const messages = JSON.parse(fileData);
      const { senderName, receiverType, receiverId, content } = req.body;
      const newMessage = {
        _id: 'mock_' + Date.now().toString(),
        senderName,
        receiverType,
        receiverId,
        content,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      messages.push(newMessage);
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
      return res.status(201).json({ success: true, data: newMessage });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const { senderName, receiverType, receiverId, content } = req.body;
    const newMessage = await Message.create({
      senderName,
      receiverType,
      receiverId,
      content
    });
    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Mark messages as read
router.put('/read/:type/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(MESSAGES_FILE, 'utf8');
      const messages = JSON.parse(fileData);
      const { type, id } = req.params;
      messages.forEach(m => {
        if (m.receiverType === type && m.receiverId === id) {
          m.isRead = true;
        }
      });
      fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2));
      return res.json({ success: true });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const { type, id } = req.params;
    await Message.updateMany(
      { receiverType: type, receiverId: id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
