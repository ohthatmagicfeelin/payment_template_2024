import express from 'express';
import { loginController } from '../controllers/loginController.js';
import { sanitizeAuth } from '../../../../middleware/validation/sanitizeInput.js';
import { validateLogin } from '../../../../middleware/validation/validateInput.js';
import { loginLimiter } from '../../../../middleware/security/rateLimiter.js';
import { csrfProtection } from '../../../../middleware/security/csrf.js';

const router = express.Router();

router.post(
  '/',
  csrfProtection,
  sanitizeAuth,
  validateLogin,
  loginLimiter,
  loginController.login
);

export default router; 