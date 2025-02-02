// server/src/routes/auth.js
import express from 'express';
import { requireAuth } from '../../../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import { loginLimiter } from '../../../middleware/rateLimiter.js';
import {
  validateSignup,
  validateLogin,
  validatePasswordReset,
  validatePasswordResetRequest,
  validateEmailVerification
} from '../../../middleware/validateInput.js';
import { sanitizeAuth } from '../../../middleware/sanitizeInput.js';
import { csrfProtection } from '../../../middleware/csrf.js';
import config from '../../../config/env.js';
import * as csrfController from '../controllers/csrfController.js';


const router = express.Router();

const log = (message) => (req, res, next) => {
  console.log(message);
  next();
}

router.post('/signup', csrfProtection, validateSignup, authController.signup);
router.post('/login', csrfProtection, sanitizeAuth, validateLogin, loginLimiter, authController.login);
router.post('/logout', csrfProtection, authController.logout);
router.post('/password-reset-request', csrfProtection, sanitizeAuth, validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/password-reset', csrfProtection, sanitizeAuth, validatePasswordReset, authController.resetPassword);
router.post('/verify-email', csrfProtection, sanitizeAuth, validateEmailVerification, authController.verifyEmail);
router.post('/resend-verification', csrfProtection, sanitizeAuth, validatePasswordResetRequest, authController.resendVerification);
router.post('/verify-reset-token', authController.verifyResetToken);
router.get('/validate', requireAuth, authController.validateSession);

router.get('/csrf-token', csrfProtection, csrfController.getCsrfToken);

export default router;

