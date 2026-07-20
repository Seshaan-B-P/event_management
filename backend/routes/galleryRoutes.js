const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Gallery = require('../models/Gallery');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images Only (jpg, png)!');
    }
  }
});
const DATA_DIR = path.join(__dirname, '../data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

const defaultGallery = [];

// Helper to seed gallery in JSON file for Mock Mode
const ensureGallerySeeded = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(GALLERY_FILE)) {
    const seededList = defaultGallery.map((item, index) => ({
      _id: 'mock_gal_' + index,
      ...item,
      createdAt: new Date()
    }));
    fs.writeFileSync(GALLERY_FILE, JSON.stringify(seededList, null, 2));
  }
};

// Seed MongoDB if empty
const seedMongoDB = async () => {
  try {
    const count = await Gallery.countDocuments();
    if (count === 0 && defaultGallery.length > 0) {
      await Gallery.create(defaultGallery);
      console.log('MongoDB: Seeded default gallery items.');
    }
  } catch (err) {
    console.error('MongoDB gallery seeding error:', err);
  }
};

// @route   GET api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureGallerySeeded();
      const fileData = fs.readFileSync(GALLERY_FILE, 'utf8');
      const gallery = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: gallery });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    await seedMongoDB();
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: gallery });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST api/gallery
// @desc    Add a gallery item
// @access  Public
router.post('/', upload.single('imageFile'), async (req, res) => {
  const { title, location, category } = req.body;
  let image = req.body.image;

  if (req.file) {
    image = `http://localhost:5000/uploads/${req.file.filename}`;
  }

  if (!title || !location || !category || !image) {
    return res.status(400).json({ success: false, error: 'Please provide all fields' });
  }

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureGallerySeeded();
      const fileData = fs.readFileSync(GALLERY_FILE, 'utf8');
      const gallery = JSON.parse(fileData);

      const newItem = {
        _id: 'mock_gal_' + Math.random().toString(36).substr(2, 9),
        title,
        location,
        category,
        image,
        createdAt: new Date()
      };

      gallery.unshift(newItem);
      fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));
      return res.status(201).json({ success: true, data: newItem });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const item = await Gallery.create({ title, location, category, image });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE api/gallery/:id
// @desc    Delete a gallery item
// @access  Public
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureGallerySeeded();
      const fileData = fs.readFileSync(GALLERY_FILE, 'utf8');
      let gallery = JSON.parse(fileData);
      const initialLength = gallery.length;
      gallery = gallery.filter(item => item._id !== id);

      if (gallery.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Gallery item not found' });
      }

      fs.writeFileSync(GALLERY_FILE, JSON.stringify(gallery, null, 2));
      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }
    await item.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
