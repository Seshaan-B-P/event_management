const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Package = require('../models/Package');

const DATA_DIR = path.join(__dirname, '../data');
const PACKAGES_FILE = path.join(DATA_DIR, 'packages.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(PACKAGES_FILE)) fs.writeFileSync(PACKAGES_FILE, JSON.stringify([], null, 2));
};

// Get all packages
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(PACKAGES_FILE, 'utf8');
      const packages = JSON.parse(fileData);
      return res.json({ success: true, data: packages });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const packages = await Package.find()
      .populate('services')
      .populate('inventoryItems.item')
      .populate('vendors')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Create new package
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(PACKAGES_FILE, 'utf8');
      const packages = JSON.parse(fileData);
      const newPkg = {
        _id: 'mock_' + Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      packages.unshift(newPkg);
      fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
      return res.status(201).json({ success: true, data: newPkg });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const newPackage = await Package.create(req.body);
    const populated = await Package.findById(newPackage._id)
      .populate('services')
      .populate('inventoryItems.item')
      .populate('vendors');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Update package
router.put('/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(PACKAGES_FILE, 'utf8');
      const packages = JSON.parse(fileData);
      const pkg = packages.find(p => p._id === req.params.id);
      if (pkg) {
        Object.assign(pkg, req.body);
        fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
        return res.json({ success: true, data: pkg });
      }
      return res.status(404).json({ success: false, error: 'Package not found' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('services')
      .populate('inventoryItems.item')
      .populate('vendors');
    if (!updatedPackage) return res.status(404).json({ success: false, error: 'Package not found' });
    res.json({ success: true, data: updatedPackage });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Delete package
router.delete('/:id', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(PACKAGES_FILE, 'utf8');
      let packages = JSON.parse(fileData);
      const initialLength = packages.length;
      packages = packages.filter(p => p._id !== req.params.id);
      if (packages.length === initialLength) return res.status(404).json({ success: false, error: 'Package not found' });
      fs.writeFileSync(PACKAGES_FILE, JSON.stringify(packages, null, 2));
      return res.json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) return res.status(404).json({ success: false, error: 'Package not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
