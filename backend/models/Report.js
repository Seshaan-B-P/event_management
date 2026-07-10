const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  staffName: {
    type: String,
    required: true
  },
  reportType: {
    type: String,
    enum: ['Daily Shift', 'Incident', 'Other'],
    default: 'Daily Shift'
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Unread', 'Read'],
    default: 'Unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.models.Report || mongoose.model('Report', ReportSchema);
