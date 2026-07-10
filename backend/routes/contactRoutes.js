const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Contact = require('../models/Contact');

const DATA_DIR = path.join(__dirname, '../data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Helper to check and create data directory and file
const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONTACTS_FILE)) {
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2));
  }
};

// @route   POST api/contacts
// @desc    Submit a contact form query
// @access  Public
router.post('/', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return res.status(400).json({ success: false, error: 'Please provide all fields' });
  }

  // If in Mock Mode, save to JSON file
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(CONTACTS_FILE, 'utf8');
      const contacts = JSON.parse(fileData);

      const newContact = {
        _id: 'mock_' + Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email,
        phone,
        message,
        status: '',
        adminNotes: '',
        eventDate: '',
        budget: 0,
        createdAt: new Date()
      };

      contacts.push(newContact);
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
      console.log('Mock DB: Contact saved successfully.');
      return res.status(201).json({ success: true, data: newContact });
    } catch (err) {
      console.error('Mock DB Error:', err);
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  // Otherwise, use MongoDB
  try {
    const contact = await Contact.create({
      firstName,
      lastName,
      email,
      phone,
      message
    });
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    console.error('MongoDB Error:', err);
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// @route   GET api/contacts
// @desc    Get all contact messages (Admin View)
// @access  Public (Can be protected later)
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(CONTACTS_FILE, 'utf8');
      const contacts = JSON.parse(fileData);
      // Sort desc by createdAt
      contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.status(200).json({ success: true, data: contacts });
    } catch (err) {
      console.error('Mock DB Error:', err);
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE api/contacts/:id
// @desc    Delete a contact message (Admin Action)
// @access  Public
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(CONTACTS_FILE, 'utf8');
      let contacts = JSON.parse(fileData);
      const initialLength = contacts.length;
      contacts = contacts.filter(contact => contact._id !== id);

      if (contacts.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Message not found' });
    }
    await contact.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PATCH api/contacts/:id
// @desc    Update contact inquiry (status, adminNotes, eventDate)
// @access  Public
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, adminNotes, eventDate, budget, totalAmount, paidAmount, paymentStatus } = req.body;

  if (status && !['Pending', 'Contacted', 'Completed'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status value' });
  }

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(CONTACTS_FILE, 'utf8');
      const contacts = JSON.parse(fileData);
      const contact = contacts.find(c => c._id === id);

      if (!contact) {
        return res.status(404).json({ success: false, error: 'Inquiry not found' });
      }

      if (status !== undefined) contact.status = status;
      if (adminNotes !== undefined) contact.adminNotes = adminNotes;
      if (eventDate !== undefined) contact.eventDate = eventDate;
      if (budget !== undefined) contact.budget = Number(budget);
      if (totalAmount !== undefined) contact.totalAmount = Number(totalAmount);
      if (paidAmount !== undefined) contact.paidAmount = Number(paidAmount);
      if (paymentStatus !== undefined) contact.paymentStatus = paymentStatus;

      fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
      return res.status(200).json({ success: true, data: contact });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    if (status !== undefined) contact.status = status;
    if (adminNotes !== undefined) contact.adminNotes = adminNotes;
    if (eventDate !== undefined) contact.eventDate = eventDate;
    if (budget !== undefined) contact.budget = Number(budget);
    if (totalAmount !== undefined) contact.totalAmount = Number(totalAmount);
    if (paidAmount !== undefined) contact.paidAmount = Number(paidAmount);
    if (paymentStatus !== undefined) contact.paymentStatus = paymentStatus;

    await contact.save();
    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
