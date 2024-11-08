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


const router = express.Router();


router.post('/signup', sanitizeAuth, validateSignup, authController.signup);
router.post('/login', sanitizeAuth, validateLogin, loginLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/password-reset-request', sanitizeAuth, validatePasswordResetRequest, authController.requestPasswordReset);
router.post('/password-reset', sanitizeAuth, validatePasswordReset, authController.resetPassword);
router.post('/verify-email', sanitizeAuth, validateEmailVerification, authController.verifyEmail);
router.post('/resend-verification', sanitizeAuth, validatePasswordResetRequest, authController.resendVerification);
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

export default router;