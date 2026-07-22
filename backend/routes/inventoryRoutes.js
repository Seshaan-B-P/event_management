const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Inventory = require('../models/Inventory');

const DATA_DIR = path.join(__dirname, '../data');
const INVENTORY_FILE = path.join(DATA_DIR, 'inventory.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(INVENTORY_FILE)) fs.writeFileSync(INVENTORY_FILE, JSON.stringify([], null, 2));
};

// Get all inventory items
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INVENTORY_FILE, 'utf8');
      const items = JSON.parse(fileData);
      return res.json({ success: true, data: items });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const items = await Inventory.find().sort({ createdAt: -1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new inventory item
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INVENTORY_FILE, 'utf8');
      const items = JSON.parse(fileData);
      const newItem = {
        _id: 'mock_' + Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      items.unshift(newItem);
      fs.writeFileSync(INVENTORY_FILE, JSON.stringify(items, null, 2));
      return res.status(201).json({ success: true, data: newItem });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update inventory item
router.put('/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INVENTORY_FILE, 'utf8');
      const items = JSON.parse(fileData);
      const item = items.find(i => i._id === req.params.id);
      if (item) {
        Object.assign(item, req.body);
        fs.writeFileSync(INVENTORY_FILE, JSON.stringify(items, null, 2));
        return res.json({ success: true, data: item });
      }
      return res.status(404).json({ success: false, error: 'Item not found' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INVENTORY_FILE, 'utf8');
      let items = JSON.parse(fileData);
      const initialLength = items.length;
      items = items.filter(i => i._id !== req.params.id);
      if (items.length === initialLength) return res.status(404).json({ success: false, error: 'Item not found' });
      fs.writeFileSync(INVENTORY_FILE, JSON.stringify(items, null, 2));
      return res.json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, error: 'Item not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
