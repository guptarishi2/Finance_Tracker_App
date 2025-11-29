require('dotenv').config();
const sgMail = require('@sendgrid/mail');

console.log('Testing SendGrid configuration...\n');
console.log('SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET ✅' : 'NOT SET ❌');
console.log('SENDGRID_FROM_EMAIL:', process.env.SENDGRID_FROM_EMAIL);
console.log('\nSending test email...\n');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: process.env.SENDGRID_FROM_EMAIL, // Send to yourself for testing
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: 'SendGrid Test - Finance Tracker',
  text: 'If you receive this email, SendGrid is working correctly!',
  html: '<strong>If you receive this email, SendGrid is working correctly!</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('✅ Test email sent successfully!');
    console.log('Check your inbox:', process.env.SENDGRID_FROM_EMAIL);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error sending test email:');
    if (error.response) {
      console.error('Status:', error.response.statusCode);
      console.error('Body:', error.response.body);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  });
