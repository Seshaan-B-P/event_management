const Admin = require('../models/Admin');
const Staff = require('../models/Staff');

const seedInitialData = async () => {
  if (process.env.MOCK_DB === 'true') return;

  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        username: 'admin',
        password: 'admin@bps',
        role: 'superadmin'
      });
      console.log('🔑 Initial default Admin account created (admin / admin@bps)');
    }

    const staffCount = await Staff.countDocuments();
    if (staffCount === 0) {
      await Staff.create({
        name: 'Default Worker',
        username: 'worker@bpsevent.com',
        password: 'worker123',
        role: 'Event Staff',
        contactNumber: '9876543210',
        status: 'Active'
      });
      console.log('👷 Initial default Staff account created (worker@bpsevent.com / worker123)');
    }
  } catch (err) {
    console.error('⚠️ Seeding error:', err.message);
  }
};

module.exports = seedInitialData;
