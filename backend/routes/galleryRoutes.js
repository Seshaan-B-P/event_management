const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const os = require('os');
const multer = require('multer');
const Gallery = require('../models/Gallery');

// Safely configure upload directory
const getUploadDir = () => {
  try {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
  } catch (e) {
    return os.tmpdir();
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getUploadDir());
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|avif|svg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype) || file.mimetype.startsWith('image/');
    if (extname || mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only (jpg, png, webp, gif)!'));
    }
  }
});

// Middleware wrapper to catch Multer errors gracefully
const uploadSingleImage = (req, res, next) => {
  if (req.is('application/json')) {
    return next();
  }
  upload.single('imageFile')(req, res, (err) => {
    if (err) {
      console.warn('Multer upload warning:', err.message);
    }
    next();
  });
};

const DATA_DIR = path.join(__dirname, '../data');
const GALLERY_FILE = path.join(DATA_DIR, 'gallery.json');

// Helper to ensure data directory and file exist for Mock Mode
const ensureFileExists = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(GALLERY_FILE)) {
      fs.writeFileSync(GALLERY_FILE, JSON.stringify([], null, 2));
    }
  } catch (e) {
    console.warn('Data dir write warning:', e.message);
  }
};

// @route   GET api/gallery
// @desc    Get all gallery items
// @access  Public
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(GALLERY_FILE, 'utf8');
      const gallery = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: gallery });
    } catch (err) {
      return res.status(200).json({ success: true, data: [] });
    }
  }

  try {
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: gallery });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST api/gallery
// @desc    Add a gallery item
// @access  Public
router.post('/', uploadSingleImage, async (req, res) => {
  try {
    const { title, location, category } = req.body;
    let image = req.body.image;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Fallback to body image (Data URL or Web URL) if file wasn't written to uploads
    if (!image && req.body.image) {
      image = req.body.image;
    }

    if (!title || !location || !category || !image) {
      return res.status(400).json({ success: false, error: 'Please provide title, location, category, and an image' });
    }

    if (process.env.MOCK_DB === 'true') {
      try {
        ensureFileExists();
        let gallery = [];
        if (fs.existsSync(GALLERY_FILE)) {
          const fileData = fs.readFileSync(GALLERY_FILE, 'utf8');
          gallery = JSON.parse(fileData || '[]');
        }

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
        console.error('Mock gallery save error:', err);
        return res.status(500).json({ success: false, error: 'Failed to save to mock storage' });
      }
    }

    const item = await Gallery.create({ title, location, category, image });
    return res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('Gallery create route error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// @route   DELETE api/gallery/:id
// @desc    Delete a gallery item
// @access  Public
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
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
