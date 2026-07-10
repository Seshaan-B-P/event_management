const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['wedding', 'birthday', 'other']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
