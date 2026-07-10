const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/eventdb';

const runTest = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    // Clean old tests if any
    await Contact.deleteMany({ email: 'test_script@example.com' });

    console.log('Creating test contact...');
    const contact = await Contact.create({
      firstName: 'Test',
      lastName: 'Script',
      email: 'test_script@example.com',
      phone: '1234567890',
      message: 'Hello from test script'
    });
    console.log('Created successfully:', contact);

    console.log('Fetching all contacts...');
    const list = await Contact.find();
    console.log('Total contacts in DB:', list.length);
    console.log('Contacts list:', list.map(c => `${c.firstName} - ${c.status}`));

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Test failed with error:', err);
  }
};

runTest();
