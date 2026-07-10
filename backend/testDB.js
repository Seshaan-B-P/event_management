const mongoose = require('mongoose');
const Staff = require('./models/Staff');

mongoose.connect('mongodb://127.0.0.1:27017/eventdb')
  .then(async () => {
    const staffs = await Staff.find({});
    console.log("=== STAFF USERS IN DB ===");
    staffs.forEach(s => {
      console.log(`Username: ${s.username}`);
      console.log(`Password: ${s.password}`);
      console.log(`ID: ${s._id}`);
      console.log('---');
    });
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
