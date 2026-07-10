const mongoose = require('mongoose');
const Staff = require('../models/Staff');

const createWorker = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/eventdb', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const username = 'worker';
    const password = 'worker123';

    // Check if worker already exists
    let worker = await Staff.findOne({ username });
    if (worker) {
      console.log('Worker already exists. Deleting it to recreate...');
      await Staff.deleteOne({ username });
    }

    worker = new Staff({
      name: 'Test Worker',
      username: username,
      password: password, // Will be hashed by the pre-save hook
      role: 'staff',
      contactNumber: '1234567890',
      email: 'worker@test.com'
    });

    await worker.save();
    console.log('Worker created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

createWorker();
