const express = require('express');
const router = express.Router();
const InventoryRequest = require('../models/InventoryRequest');
const Inventory = require('../models/Inventory');

// GET all inventory requests
router.get('/', async (req, res) => {
  try {
    const requests = await InventoryRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET inventory requests by staff ID
router.get('/staff/:staffId', async (req, res) => {
  try {
    const requests = await InventoryRequest.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST new inventory request
router.post('/', async (req, res) => {
  try {
    const { staffId, staffName, itemId, itemName, quantityRequested, reason } = req.body;
    const request = new InventoryRequest({ staffId, staffName, itemId, itemName, quantityRequested, reason });
    await request.save();

    const Notification = require('../models/Notification');
    await Notification.create({
      title: 'Inventory Request',
      message: `${staffName} requested ${quantityRequested} of ${itemName}.`,
      type: 'info',
      targetRole: 'superadmin'
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create inventory request' });
  }
});

// PATCH update request status (Approve/Reject)
router.patch('/:id', async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const request = await InventoryRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' });

    // Handle inventory deduction if approving
    if (status === 'Approved' && request.status !== 'Approved') {
      const inventory = await Inventory.findById(request.itemId);
      if (inventory) {
        if (inventory.quantity < request.quantityRequested) {
          return res.status(400).json({ success: false, error: 'Not enough stock available' });
        }
        inventory.quantity -= request.quantityRequested;
        if (inventory.quantity === 0) inventory.status = 'Out of Stock';
        else if (inventory.quantity < 5) inventory.status = 'Low Stock';
        await inventory.save();
      }
    }

    // Handle inventory return if returned
    if (status === 'Returned' && request.status === 'Approved') {
        const inventory = await Inventory.findById(request.itemId);
        if (inventory) {
            inventory.quantity += request.quantityRequested;
            if (inventory.quantity > 0) inventory.status = 'In Stock';
            await inventory.save();
        }
    }

    request.status = status;
    if (adminReply !== undefined) request.adminReply = adminReply;
    
    await request.save();
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update request' });
  }
});

module.exports = router;
