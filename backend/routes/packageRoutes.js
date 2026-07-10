const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Get all packages
router.get('/', async (req, res) => {
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
  try {
    const deletedPackage = await Package.findByIdAndDelete(req.params.id);
    if (!deletedPackage) return res.status(404).json({ success: false, error: 'Package not found' });
    res.json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
