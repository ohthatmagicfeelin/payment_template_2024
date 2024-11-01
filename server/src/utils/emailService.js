// server/src/utils/emailService.js
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

// server/src/utils/emailService.js
export class EmailService {
    async sendVerificationEmail(email, userId) {

      const token = jwt.sign(
        { userId, type: 'email-verification' },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );
      const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;
  
      // Log the details to console
      console.log('\n=== Verification Email ===');
      console.log('To:', email);
      console.log('Verification URL:', verificationUrl);
      // console.log('Token:', token);
      console.log('========================\n');
  
      // Store token in memory for verification
      // In real production, you'd use JWT or database
      global.verificationTokens = global.verificationTokens || new Map();
      global.verificationTokens.set(token, userId);
  
      return { success: true };
    }
  
    async sendPasswordResetEmail(email, userId) {
      const token = jwt.sign(
        { userId, type: 'password-reset' },
        config.JWT_SECRET,
        { expiresIn: '24h' }
      );
      const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;
  
      // Log the details to console
      console.log('\n=== Password Reset Email ===');
      console.log('To:', email);
      console.log('Reset URL:', resetUrl);
      console.log('========================\n');
  
      // Store token in memory for verification
      global.resetTokens = global.resetTokens || new Map();
      global.resetTokens.set(token, userId);
  
      return { success: true };
    }
  }
  
  export const emailService = new EmailService();
  
// export class EmailService {
//   constructor() {
//     this.transporter = nodemailer.createTransport({
//       host: config.SMTP_HOST,
//       port: config.SMTP_PORT,
//       auth: {
//         user: config.SMTP_USER,
//         pass: config.SMTP_PASS
//       }
//     });
//   }

//   async sendVerificationEmail(email, userId) {
//     const token = jwt.sign(
//       { userId, type: 'email-verification' },
//       config.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     const verificationUrl = `${config.BACKEND_URL}/verify-email?token=${token}`;

//     await this.transporter.sendMail({
//       from: config.EMAIL_FROM,
//       to: email,
//       subject: 'Verify your email',
//       html: `
//         <h1>Verify your email</h1>
//         <p>Click the link below to verify your email address:</p>
//         <a href="${verificationUrl}">Verify Email</a>
//       `
//     });
//   }

//   async sendPasswordResetEmail(email, userId) {
//     const token = jwt.sign(
//       { userId, type: 'password-reset' },
//       config.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     const resetUrl = `${config.CLIENT_URL}/reset-password?token=${token}`;

//     await this.transporter.sendMail({
//       from: config.EMAIL_FROM,
//       to: email,
//       subject: 'Reset your password',
//       html: `
//         <h1>Reset Password</h1>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetUrl}">Reset Password</a>
//         <p>This link will expire in 1 hour.</p>
//       `
//     });
//   }
// }

// export const emailService = new EmailService();