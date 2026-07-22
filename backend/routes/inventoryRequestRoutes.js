const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const InventoryRequest = require('../models/InventoryRequest');
const Inventory = require('../models/Inventory');

const DATA_DIR = path.join(__dirname, '../data');
const INV_REQUESTS_FILE = path.join(DATA_DIR, 'inventory_requests.json');

const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(INV_REQUESTS_FILE)) fs.writeFileSync(INV_REQUESTS_FILE, JSON.stringify([], null, 2));
};

// GET all inventory requests
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INV_REQUESTS_FILE, 'utf8');
      const requests = JSON.parse(fileData);
      return res.json({ success: true, data: requests });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const requests = await InventoryRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET inventory requests by staff ID
router.get('/staff/:staffId', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INV_REQUESTS_FILE, 'utf8');
      const requests = JSON.parse(fileData).filter(r => r.staffId === req.params.staffId);
      return res.json({ success: true, data: requests });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const requests = await InventoryRequest.find({ staffId: req.params.staffId }).sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST new inventory request
router.post('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INV_REQUESTS_FILE, 'utf8');
      const requests = JSON.parse(fileData);
      const { staffId, staffName, itemId, itemName, quantityRequested, reason } = req.body;
      const newReq = {
        _id: 'mock_' + Date.now().toString(),
        staffId,
        staffName,
        itemId,
        itemName,
        quantityRequested,
        reason,
        status: 'Pending',
        adminReply: '',
        createdAt: new Date().toISOString()
      };
      requests.unshift(newReq);
      fs.writeFileSync(INV_REQUESTS_FILE, JSON.stringify(requests, null, 2));
      return res.status(201).json({ success: true, data: newReq });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

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
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(INV_REQUESTS_FILE, 'utf8');
      const requests = JSON.parse(fileData);
      const reqItem = requests.find(r => r._id === req.params.id);
      if (reqItem) {
        const { status, adminReply } = req.body;
        if (status) reqItem.status = status;
        if (adminReply !== undefined) reqItem.adminReply = adminReply;
        fs.writeFileSync(INV_REQUESTS_FILE, JSON.stringify(requests, null, 2));
        return res.json({ success: true, data: reqItem });
      }
      return res.status(404).json({ success: false, error: 'Request not found' });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const { status, adminReply } = req.body;
    const request = await InventoryRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ success: false, error: 'Request not found' });

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
