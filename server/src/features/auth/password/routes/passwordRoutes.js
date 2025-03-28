import express from 'express';
import { passwordController } from '../controllers/passwordController.js';
import { csrfProtection } from '../../../../middleware/security/csrf.js';
import { sanitizeAuth } from '../../../../middleware/validation/sanitizeInput.js';
import { validatePasswordReset, validatePasswordResetRequest } from '../../../../middleware/validation/validateInput.js';

const router = express.Router();

router.post(
  '/password-reset-request',
  csrfProtection,
  sanitizeAuth,
  validatePasswordResetRequest,
  passwordController.requestPasswordReset
);

router.post(
  '/password-reset',
  csrfProtection,
  sanitizeAuth,
  validatePasswordReset,
  passwordController.resetPassword
);

router.post(
  '/verify-reset-token',
  passwordController.verifyResetToken
);

export default router; 