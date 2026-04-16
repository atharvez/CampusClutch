const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  // For production, use actual SMTP settings
  // For development/test, we'll try to use a test account if not configured
  let transporter;

  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Fallback for development (Ethereal Email)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`[Email] Preview URL: ${nodemailer.getTestMessageUrl({ messageId: 'test' })} (Config missing)`);
  }

  const message = {
    from: `${process.env.FROM_NAME || 'CampusClutch'} <${process.env.FROM_EMAIL || 'noreply@campusclutch.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  if (!process.env.SMTP_HOST) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
