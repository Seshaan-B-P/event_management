const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Vendor = require('../models/Vendor');

const DATA_DIR = path.join(__dirname, '../data');
const VENDORS_FILE = path.join(DATA_DIR, 'vendors.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(VENDORS_FILE)) fs.writeFileSync(VENDORS_FILE, JSON.stringify([], null, 2));
};

// Get all vendors
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(VENDORS_FILE, 'utf8');
      const vendors = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: vendors });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });
    res.json({ success: true, data: vendors });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new vendor
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(VENDORS_FILE, 'utf8');
      const vendors = JSON.parse(fileData);
      const newVendor = {
        _id: 'mock_' + Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      vendors.unshift(newVendor);
      fs.writeFileSync(VENDORS_FILE, JSON.stringify(vendors, null, 2));
      return res.status(201).json({ success: true, data: newVendor });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete vendor
router.delete('/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(VENDORS_FILE, 'utf8');
      let vendors = JSON.parse(fileData);
      const initialLength = vendors.length;
      vendors = vendors.filter(v => v._id !== req.params.id);
      if (vendors.length === initialLength) return res.status(404).json({ success: false, error: 'Vendor not found' });
      fs.writeFileSync(VENDORS_FILE, JSON.stringify(vendors, null, 2));
      return res.json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ success: false, error: 'Vendor not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
