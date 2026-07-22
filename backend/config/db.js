const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventdb', {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
    process.env.MOCK_DB = 'false';
  } catch (error) {
    console.warn(`\n⚠️  MongoDB connection failed: ${error.message}`);
    console.warn(`🚀 Server will run in MOCK MODE using local JSON files for persistence.\n`);
    process.env.MOCK_DB = 'true';
    isConnected = false;
  }
};

module.exports = connectDB;
