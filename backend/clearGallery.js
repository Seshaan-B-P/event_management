const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Gallery = require('./models/Gallery');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/event-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to DB');
  await Gallery.deleteMany({});
  console.log('Deleted all gallery images');
  mongoose.connection.close();
}).catch(err => console.log(err));
