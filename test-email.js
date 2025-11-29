require('dotenv').config();
const { checkAndSendWarning } = require('./helpers/expenseHelper');

// Test with your user ID
const userId = process.argv[2];

if (!userId) {
  console.log('Usage: node test-email.js <userId>');
  console.log('Example: node test-email.js 673e5a1b2c4d5e6f7a8b9c0d');
  process.exit(1);
}

console.log('Testing email warning feature...');
console.log('User ID:', userId);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'SET' : 'NOT SET');

checkAndSendWarning(userId)
  .then((result) => {
    console.log('\n✅ Result:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
