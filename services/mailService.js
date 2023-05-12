import nodemailer from 'nodemailer';
import config from '../config.js';

const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
    },
});

const Mailer = {
  sendEmail: async (to, subject, content) => {
    try {
      const mailOptions = {
        from: config.smtpUser,
        to,
        subject,
        text: content,
      };

      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  },
};

export default Mailer;
