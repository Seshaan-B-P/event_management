const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const StaffSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@bpsevent\.com$/, 'Username must be a valid @bpsevent.com email address']
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: [true, 'Staff name is required']
  },
  role: {
    type: String,
    required: [true, 'Staff role is required']
  },
  contactNumber: {
    type: String,
    required: [true, 'Contact number is required']
  },
  email: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to hash password
StaffSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

StaffSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
