const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  avatar: {
    type: String, // Google review letter indicator (e.g. 'P', 'N', 'G') or URL
    default: ''
  },
  source: {
    type: String,
    default: 'Google Review'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
