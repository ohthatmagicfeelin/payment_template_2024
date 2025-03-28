import express from 'express';
import { csrfProtection } from '../../../../middleware/security/csrf.js';
import { logoutController } from '../controllers/logoutController.js';

const router = express.Router();

router.post('/', csrfProtection, logoutController.logout);

export default router; 