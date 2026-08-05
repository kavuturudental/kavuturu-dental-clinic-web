// src/utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log("SMTP not configured. Email simulation for:", options.to);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `${process.env.FROM_NAME || "Kavuturu Dental Clinic"} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error("Failed to send email:", error.message);
  }
};

module.exports = sendEmail;
