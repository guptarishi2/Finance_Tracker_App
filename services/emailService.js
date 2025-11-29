const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

// Initialize SendGrid if API key is provided
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create email transporter for Gmail
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send warning email
const sendWarningEmail = async (userEmail, userName, expenseData) => {
  try {
    const { currentExpenses, expenseLimit, exceededBy } = expenseData;

    const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #ff6b6b; color: white; padding: 20px; text-align: center; border-radius: 5px; }
            .content { background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .stats { background-color: white; padding: 15px; margin: 10px 0; border-left: 4px solid #ff6b6b; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ Expense Limit Alert</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p>This is an important notification regarding your monthly expenses.</p>
              
              <div class="stats">
                <p><strong>Your Monthly Expense Limit:</strong> ₹${expenseLimit.toLocaleString()}</p>
                <p><strong>Current Month's Expenses:</strong> ₹${currentExpenses.toLocaleString()}</p>
                <p style="color: #ff6b6b;"><strong>Exceeded By:</strong> ₹${exceededBy.toLocaleString()}</p>
              </div>
              
              <p>Your expenses for this month have exceeded your set limit. We recommend reviewing your spending and adjusting your budget accordingly.</p>
              
              <p style="text-align: center;">
                <a href="${process.env.APP_URL || 'http://localhost:8080'}" class="button">View Dashboard</a>
              </p>
              
              <p>💡 <strong>Tip:</strong> Consider categorizing your expenses to identify areas where you can cut back.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Finance Tracker App</p>
              <p>© 2025 Finance Tracker. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    // Use SendGrid if API key is available (for production)
    if (process.env.SENDGRID_API_KEY) {
      const msg = {
        to: userEmail,
        from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER,
        subject: "⚠️ Monthly Expense Limit Alert - Finance Tracker",
        html: emailHTML,
      };

      const result = await sgMail.send(msg);
      console.log("Warning email sent successfully via SendGrid");
      return { success: true, messageId: result[0].headers["x-message-id"] };
    } else {
      // Fallback to Gmail/SMTP (for local development)
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "⚠️ Monthly Expense Limit Alert - Finance Tracker",
        html: emailHTML,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Warning email sent successfully via Gmail");
      return { success: true, messageId: info.messageId };
    }
  } catch (error) {
    console.error("Error sending warning email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendWarningEmail };
