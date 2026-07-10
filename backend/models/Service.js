const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required']
  },
  description: {
    type: String,
    required: [true, 'Service description is required']
  },
  iconName: {
    type: String,
    default: 'Star' // Default Lucide icon name
  },
  basePrice: {
    type: Number,
    default: 0
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Service || mongoose.model('Service', ServiceSchema);
