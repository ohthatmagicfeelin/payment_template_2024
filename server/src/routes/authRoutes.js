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
import { sanitizeAuth } from '../middleware/sanitizeInput.js';
import { csrfProtection, attachCsrfToken } from '../middleware/csrf.js';


const router = express.Router();


router.post('/signup', csrfProtection, validateSignup, authController.signup);
router.post('/login', csrfProtection, sanitizeAuth, validateLogin, loginLimiter, authController.login);
router.post('/logout', csrfProtection, authController.logout);
router.post('/password-reset-request', csrfProtection, sanitizeAuth, validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/password-reset', csrfProtection, sanitizeAuth, validatePasswordReset, authController.resetPassword);
router.post('/verify-email', csrfProtection, sanitizeAuth, validateEmailVerification, authController.verifyEmail);
router.post('/resend-verification', csrfProtection, sanitizeAuth, validatePasswordResetRequest, authController.resendVerification);
router.post('/verify-reset-token', authController.verifyResetToken);
router.get('/validate', requireAuth, authController.validateSession);
router.get('/test-session', async (req, res) => {
  req.session.testData = new Date().toISOString();
  
  await new Promise((resolve, reject) => {
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        reject(err);
      }
      resolve();
    });
  });

  const sessionData = {
    id: req.session.id,
    cookie: req.session.cookie,
    userId: req.session.userId,
    testData: req.session.testData
  };
  
  console.log('Session Test:', {
    sessionData,
    hasStore: !!req.session.store
  });
  
  res.json(sessionData);
});

// Get CSRF token
router.get('/csrf-token', csrfProtection, attachCsrfToken, (req, res) => {
    res.json({ message: 'CSRF token set in cookie' });
});

export default router;