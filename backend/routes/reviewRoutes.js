const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Review = require('../models/Review');

const DATA_DIR = path.join(__dirname, '../data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

// Helper to ensure data directory and file exist for Mock Mode
const ensureFileExists = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify([], null, 2));
  }
};

// @route   GET api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(REVIEWS_FILE, 'utf8');
      const reviews = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      console.error('Mock DB reviews read error:', err);
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   POST api/reviews
// @desc    Add a review
// @access  Public
router.post('/', async (req, res) => {
  const { name, rating, comment, avatar, source } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).json({ success: false, error: 'Please provide name, rating, and comment' });
  }

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(REVIEWS_FILE, 'utf8');
      const reviews = JSON.parse(fileData);

      const newReview = {
        _id: 'mock_rev_' + Math.random().toString(36).substr(2, 9),
        name,
        rating: Number(rating),
        comment,
        avatar: avatar || name.charAt(0).toUpperCase(),
        source: source || 'Website Submission',
        createdAt: new Date()
      };

      reviews.unshift(newReview);
      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
      return res.status(201).json({ success: true, data: newReview });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const review = await Review.create({
      name,
      rating: Number(rating),
      comment,
      avatar: avatar || name.charAt(0).toUpperCase(),
      source: source || 'Website Submission'
    });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// @route   DELETE api/reviews/:id
// @desc    Delete a review
// @access  Public
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (process.env.MOCK_DB === 'true') {
    try {
      ensureFileExists();
      const fileData = fs.readFileSync(REVIEWS_FILE, 'utf8');
      let reviews = JSON.parse(fileData);
      const initialLength = reviews.length;
      reviews = reviews.filter(rev => rev._id !== id);

      if (reviews.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Review not found' });
      }

      fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }
    await review.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

module.exports = router;
