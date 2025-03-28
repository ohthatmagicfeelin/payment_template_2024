import { catchAsync } from '../../../../utils/catchAsync.js';
import { emailVerificationService } from '../services/emailVerificationService.js';

export const emailVerificationController = {
  verifyEmail: catchAsync(async (req, res) => {
    const { token } = req.body;
    const user = await emailVerificationService.verifyEmail(token);
    
    // Set session after successful verification
    req.session.userId = user.id;
    
    res.json({ message: 'Email verified successfully' });
  }),

  resendVerification: catchAsync(async (req, res) => {
    const { email } = req.body;
    await emailVerificationService.resendVerification(email);
    res.json({ message: 'If an account exists, a verification email will be sent.' });
  })
}; 