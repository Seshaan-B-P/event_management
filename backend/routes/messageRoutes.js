const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// Get messages for a specific receiver (Staff or Vendor)
router.get('/:type/:id', async (req, res) => {
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
