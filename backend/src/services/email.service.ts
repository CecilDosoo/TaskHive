import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration - supports multiple providers (Gmail, SendGrid, Mailgun, etc.)
const createTransporter = () => {
  // Check if SMTP credentials are provided
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error(
      'SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in your .env file.\n' +
      'For Gmail: Use an App Password (see EMAIL_SETUP.md for instructions).\n' +
      'For other providers: Set SMTP_HOST, SMTP_PORT, and SMTP_SECURE as needed.'
    );
  }

  // Default to Gmail if no host is specified
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Gmail-specific settings
    ...(host.includes('gmail.com') && {
      service: 'gmail',
    }),
  });
};

// Helper to format "from" email address properly
const formatFromAddress = (): string => {
  const smtpFrom = process.env.SMTP_FROM;
  
  if (!smtpFrom) {
    return '"TaskHive" <noreply@taskhive.com>';
  }
  
  // If already in format "Name <email@domain.com>", use as is
  if (smtpFrom.includes('<') && smtpFrom.includes('>')) {
    return smtpFrom;
  }
  
  // If just email, wrap with TaskHive name
  // Handle both formats: "TaskHive email@domain.com" or just "email@domain.com"
  const emailMatch = smtpFrom.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    return `"TaskHive" <${emailMatch[1]}>`;
  }
  
  // Default fallback
  return '"TaskHive" <noreply@taskhive.com>';
};

export const sendVerificationEmail = async (email: string, name: string, token: string) => {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const mailOptions = {
    from: formatFromAddress(),
    to: email,
    subject: 'Verify your TaskHive account',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify your email</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">TaskHive</h1>
                      <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Team Task Management</p>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px; font-weight: 600;">Hello ${name}!</h2>
                      <p style="color: #4a4a4a; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">Thank you for signing up for TaskHive. To complete your registration and ensure the security of your account, please verify your email address by clicking the button below:</p>
                      
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                        <tr>
                          <td align="center">
                            <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">Verify Email Address</a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #666666; font-size: 14px; margin: 24px 0 12px; line-height: 1.5;">Or copy and paste this link into your browser:</p>
                      <p style="color: #667eea; word-break: break-all; font-size: 13px; margin: 0 0 24px; padding: 12px; background-color: #f8f9fa; border-radius: 4px; font-family: monospace;">${verificationUrl}</p>
                      
                      <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.5;"><strong>Important:</strong> This verification link will expire in 24 hours for security reasons.</p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; border-top: 1px solid #e9ecef;">
                      <p style="color: #666666; font-size: 13px; margin: 0 0 12px; line-height: 1.5;">If you didn't create an account with TaskHive, please ignore this email. The account will not be activated without verification.</p>
                      <p style="color: #999999; font-size: 12px; margin: 20px 0 0; line-height: 1.5; border-top: 1px solid #e9ecef; padding-top: 20px;">
                        <strong>TaskHive</strong><br>
                        Team Task Management Platform<br>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #667eea; text-decoration: none;">Visit our website</a> | 
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/support" style="color: #667eea; text-decoration: none;">Support</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      Hello ${name}!
      
      Thank you for signing up for TaskHive. Please verify your email address by visiting:
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, please ignore this email.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Verification email sent successfully to ${email} (Message ID: ${info.messageId})`);
    
    return info;
  } catch (error: any) {
    console.error(`[Email] Failed to send verification email to ${email}:`, error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error('SMTP authentication failed. Please check your SMTP_USER and SMTP_PASS in .env file.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to SMTP server. Please check your SMTP_HOST and SMTP_PORT settings.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

export const sendNotificationEmail = async (
  email: string,
  name: string,
  subject: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionText?: string
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: formatFromAddress(),
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 20px 0;">
            <tr>
              <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">TaskHive</h1>
                      <p style="color: #ffffff; margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Team Task Management</p>
                    </td>
                  </tr>
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 24px; font-weight: 600;">${title}</h2>
                      <p style="color: #4a4a4a; margin: 0 0 20px; font-size: 16px; line-height: 1.6;">${message}</p>
                      ${actionUrl && actionText ? `
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                          <tr>
                            <td align="center">
                              <a href="${actionUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);">${actionText}</a>
                            </td>
                          </tr>
                        </table>
                      ` : ''}
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 30px; border-top: 1px solid #e9ecef;">
                      <p style="color: #666666; font-size: 13px; margin: 0 0 12px; line-height: 1.5;">You're receiving this notification because you're a member of a TaskHive project.</p>
                      <p style="color: #999999; font-size: 12px; margin: 20px 0 0; line-height: 1.5; border-top: 1px solid #e9ecef; padding-top: 20px;">
                        <strong>TaskHive</strong><br>
                        Team Task Management Platform<br>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="color: #667eea; text-decoration: none;">Visit our website</a> | 
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/support" style="color: #667eea; text-decoration: none;">Support</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
    text: `
      ${title}
      
      ${message}
      
      ${actionUrl ? `Visit: ${actionUrl}` : ''}
      
      You're receiving this because you're a member of a TaskHive project.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Notification email sent successfully to ${email} (Message ID: ${info.messageId})`);
    
    return info;
  } catch (error: any) {
    console.error(`[Email] Failed to send notification email to ${email}:`, error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error('SMTP authentication failed. Please check your SMTP_USER and SMTP_PASS in .env file.');
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to SMTP server. Please check your SMTP_HOST and SMTP_PORT settings.');
    } else {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
};

export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};


