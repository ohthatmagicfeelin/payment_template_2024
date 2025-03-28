import express from 'express';
import { signupController } from '../controllers/signupController.js';
import { validateSignup } from '../../../../middleware/validation/validateInput.js';
import { csrfProtection } from '../../../../middleware/security/csrf.js';

const router = express.Router();

router.post(
  '/',
  csrfProtection,
  validateSignup,
  signupController.signup
);

export default router; 