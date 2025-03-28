// server/src/routes/auth.js
import express from 'express';
import { requireAuth } from '../../../middleware/auth/auth.js';

import loginRoutes from '../login/routes/loginRoutes.js';
import logoutRoutes from '../logout/routes/logoutRoutes.js';
import signupRoutes from '../signup/routes/signupRoutes.js';
import emailVerificationRoutes from '../verify/routes/emailVerificationRoutes.js';
import passwordRoutes from '../password/routes/passwordRoutes.js';

import * as authController from '../controllers/authController.js';

import { csrfProtection } from '../../../middleware/security/csrf.js';

import * as csrfController from '../controllers/csrfController.js';


const router = express.Router();

const log = (message) => (req, res, next) => {
  console.log(message);
  next();
}

// Mount feature routes
router.use('/login', loginRoutes);
router.use('/logout', logoutRoutes);
router.use('/signup', signupRoutes);
router.use('/', emailVerificationRoutes);
router.use('/', passwordRoutes);


router.get('/validate', requireAuth, authController.validateSession);

router.get('/csrf-token', csrfProtection, csrfController.getCsrfToken);

export default router;

