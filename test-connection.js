const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...');
console.log('📍 MONGO_URL:', process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log('✅ MongoDB Atlas Connected Successfully!');
  process.exit(0);
})
.catch((err) => {
  console.error('❌ Connection Failed!');
  console.error('Error Message:', err.message);
  console.error('\n📋 Checklist:');
  console.error('1. Is 0.0.0.0/0 in Network Access (IP Whitelist)?');
  console.error('2. Is the database user created in Database Access?');
  console.error('3. Is the password correct (no special characters issues)?');
  process.exit(1);
});
