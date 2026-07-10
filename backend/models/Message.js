const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true
  },
  receiverType: {
    type: String,
    enum: ['Staff', 'Vendor', 'Global'],
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverType'
  },
  content: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.models.Message || mongoose.model('Message', MessageSchema);
