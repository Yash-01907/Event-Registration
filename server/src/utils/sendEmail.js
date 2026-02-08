import nodemailer from 'nodemailer';

const isEmailConfigured = () => {
  return (
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  );
};

/**
 * Create nodemailer transporter. Returns null if SMTP is not configured.
 */
const createTransporter = () => {
  if (!isEmailConfigured()) return null;

  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Send password reset email to the user.
 * @param {string} to - Recipient email
 * @param {string} resetUrl - Full URL to reset password
 * @param {string} userName - User's name for personalization
 * @returns {Promise<boolean>} - true if sent, false if email not configured
 */
export const sendPasswordResetEmail = async (
  to,
  resetUrl,
  userName = 'User'
) => {
  const transporter = createTransporter();
  if (!transporter) {
    throw new Error(
      'Email service is not configured. Please contact the administrator.'
    );
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const appName = process.env.APP_NAME || 'Event Registration';

  await transporter.sendMail({
    from: `"${appName}" <${from}>`,
    to,
    subject: `Reset your password - ${appName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hi ${userName},</p>
        <p>You requested a password reset for your account. Click the link below to set a new password:</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${resetUrl}</p>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 32px;">
          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
    text: `Hi ${userName},\n\nYou requested a password reset. Visit this link to reset your password: ${resetUrl}\n\nThis link expires in 1 hour.`,
  });

  return true;
};
