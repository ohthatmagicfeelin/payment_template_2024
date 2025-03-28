import express from 'express';
import { emailVerificationController } from '../controllers/emailVerificationController.js';
import { csrfProtection } from '../../../../middleware/security/csrf.js';
import { sanitizeAuth } from '../../../../middleware/validation/sanitizeInput.js';
import { validateEmailVerification } from '../../../../middleware/validation/validateInput.js';
import { validatePasswordResetRequest } from '../../../../middleware/validation/validateInput.js';

const router = express.Router();

router.post('/verify-email', csrfProtection, sanitizeAuth, validateEmailVerification, emailVerificationController.verifyEmail);
router.post('/resend-verification', csrfProtection, sanitizeAuth, validatePasswordResetRequest, emailVerificationController.resendVerification);


export default router; 