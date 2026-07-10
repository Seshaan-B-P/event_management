const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vendor name is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  rating: {
    type: Number,
    default: 0
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
