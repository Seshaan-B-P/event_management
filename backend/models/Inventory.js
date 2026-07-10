const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: [true, 'Item ID is required'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Item name is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 0
  },
  status: {
    type: String,
    enum: ['In Stock', 'Low Stock', 'Out of Stock'],
    default: 'In Stock'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
