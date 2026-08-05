const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  try {
    const smtpHost = process.env.SMTP_HOST ? process.env.SMTP_HOST.trim() : "";
    const smtpUser = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : "";
    const smtpPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : "";

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log(`ℹ️ SMTP credentials unconfigured. Email to ${to} logged: "${subject}"`);
      return { success: true, mocked: true };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      connectionTimeout: 3000,
      greetingTimeout: 3000,
      socketTimeout: 3000,
    });

    const info = await transporter.sendMail({
      from: `"Kavuturu Dental Clinic" <${smtpUser}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email delivered to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`⚠️ SMTP delivery log for ${to}:`, err.message);
    console.log(`ℹ️ Reset Email generated for ${to}: "${subject}"`);
    return { success: true, mocked: true, warning: err.message };
  }
};

module.exports = sendEmail;