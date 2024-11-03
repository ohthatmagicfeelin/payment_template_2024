// server/src/routes/auth.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import {
  validateSignup,
  validateLogin,
  validatePasswordReset,
  validatePasswordResetRequest,
  validateEmailVerification
} from '../middleware/validateInput.js';

const router = express.Router();

router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.get('/validate', requireAuth, authController.validateSession);
router.post('/password-reset-request', validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/password-reset', validatePasswordReset, authController.resetPassword);
router.post('/verify-email', validateEmailVerification, authController.verifyEmail);
router.post('/resend-verification', validatePasswordResetRequest, authController.resendVerification);
router.post('/verify-reset-token', authController.verifyResetToken);

export default router;