const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Service = require('../models/Service');

const DATA_DIR = path.join(__dirname, '../data');
const SERVICES_FILE = path.join(DATA_DIR, 'services.json');

// Ensure data directory and file exist for mock DB
const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(SERVICES_FILE)) {
    fs.writeFileSync(SERVICES_FILE, JSON.stringify([], null, 2));
  }
};

// @route   GET api/services
// @desc    Get all services
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(SERVICES_FILE, 'utf8');
      const services = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: services });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: services });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST api/services
// @desc    Create a service
router.post('/', async (req, res) => {
  const { title, description, iconName, basePrice, features, isActive, imageUrl } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, error: 'Title and description are required' });
  }

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(SERVICES_FILE, 'utf8');
      const services = JSON.parse(fileData);
      
      const newService = {
        _id: 'mock_' + Date.now().toString(),
        title,
        description,
        iconName: iconName || 'Star',
        basePrice: Number(basePrice) || 0,
        features: features || [],
        imageUrl: imageUrl || '',
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date().toISOString()
      };

      services.push(newService);
      fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2));
      return res.status(201).json({ success: true, data: newService });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const service = await Service.create({
      title, description, iconName, basePrice, features, isActive, imageUrl
    });
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   PATCH api/services/:id
// @desc    Update a service
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(SERVICES_FILE, 'utf8');
      const services = JSON.parse(fileData);
      const service = services.find(s => s._id === id);

      if (!service) return res.status(404).json({ success: false, error: 'Service not found' });

      Object.keys(req.body).forEach(key => {
        service[key] = req.body[key];
      });

      fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2));
      return res.status(200).json({ success: true, data: service });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE api/services/:id
// @desc    Delete a service
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(SERVICES_FILE, 'utf8');
      let services = JSON.parse(fileData);
      
      const initialLength = services.length;
      services = services.filter(s => s._id !== id);
      
      if (services.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Service not found' });
      }

      fs.writeFileSync(SERVICES_FILE, JSON.stringify(services, null, 2));
      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ success: false, error: 'Service not found' });
    
    await service.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
