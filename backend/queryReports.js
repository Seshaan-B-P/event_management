const mongoose = require('mongoose');
const Report = require('./models/Report');

mongoose.connect('mongodb://127.0.0.1:27017/bpsevents').then(async () => {
  const reports = await Report.find();
  console.log('Total reports:', reports.length);
  console.log(reports);
  process.exit(0);
}).catch(console.error);
