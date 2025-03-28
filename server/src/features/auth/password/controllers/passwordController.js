import { catchAsync } from '../../../../utils/catchAsync.js';
import { passwordService } from '../services/passwordService.js';

export const passwordController = {
  requestPasswordReset: catchAsync(async (req, res) => {
    const { email } = req.body;
    await passwordService.requestPasswordReset(email);
    res.json({ message: 'If an account exists, you will receive a reset email.' });
  }),

  resetPassword: catchAsync(async (req, res) => {
    const { token, newPassword } = req.body;
    await passwordService.resetPassword(token, newPassword);
    res.json({ message: 'Password updated successfully' });
  }),

  verifyResetToken: catchAsync(async (req, res) => {
    const { token } = req.body;
    await passwordService.verifyResetToken(token);
    res.json({ valid: true });
  })
}; 