// server/src/routes/auth.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/validate', requireAuth, authController.validateSession);
router.post('/password-reset-request', authController.requestPasswordReset);
router.post('/password-reset', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/verify-reset-token', authController.verifyResetToken);

export default router;