const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Review = require('../models/Review');

const DATA_DIR = path.join(__dirname, '../data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

const defaultReviews = [
  {
    name: "Prabhu Jin",
    rating: 5,
    comment: "Excellent decoration and management. They organized my cousin's wedding in Karur. The stage setup was wonderful and flower arrangements were outstanding. Highly professional!",
    avatar: "P",
    source: "Google Review"
  },
  {
    name: "Nirmal Raj",
    rating: 5,
    comment: "Very professional team. They handled a theme-based birthday party for my kid. The balloon decorations and special cake were amazing! Everyone in the family loved it.",
    avatar: "N",
    source: "Google Review"
  },
  {
    name: "Gowri Shankar",
    rating: 5,
    comment: "Best event planner in Karur! The wedding timeline was perfectly executed. Lighting, DJ, and stage decorations were top tier. Very budget friendly. Highly recommend!",
    avatar: "G",
    source: "Google Review"
  },
  {
    name: "Priya Dharshini",
    rating: 5,
    comment: "Booked them for a surprise anniversary event. Extremely creative themes and prompt team. The photography session was beautiful and captured all our sweet moments.",
    avatar: "P",
    source: "Google Review"
  }
];

// Helper to seed reviews in JSON file for Mock Mode
const ensureReviewsSeeded = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(REVIEWS_FILE)) {
    const seededList = defaultReviews.map((rev, index) => ({
      _id: 'mock_rev_' + index,
      ...rev,
      createdAt: new Date()
    }));
    fs.writeFileSync(REVIEWS_FILE, JSON.stringify(seededList, null, 2));
  }
};

// Seed MongoDB if empty and connection active
const seedMongoDB = async () => {
  try {
    const count = await Review.countDocuments();
    if (count === 0) {
      await Review.create(defaultReviews);
      console.log('MongoDB: Seeded default reviews.');
    }
  } catch (err) {
    console.error('MongoDB seeding error:', err);
  }
};

// @route   GET api/reviews
// @desc    Get all reviews
// @access  Public
router.get('/', async (req, res) => {
  if (process.env.MOCK_DB === 'true') {
    try {
      ensureReviewsSeeded();
      const fileData = fs.readFileSync(REVIEWS_FILE, 'utf8');
      const reviews = JSON.parse(fileData);
      return res.status(200).json({ success: true, data: reviews });
    } catch (err) {
      console.error('Mock DB reviews read error:', err);
      return res.status(500).json({ success: false, error: 'Mock database error' });
    }
  }

  try {
    await seedMongoDB();
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
      ensureReviewsSeeded();
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
      ensureReviewsSeeded();
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
