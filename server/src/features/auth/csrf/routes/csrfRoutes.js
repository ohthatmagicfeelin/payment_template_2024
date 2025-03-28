import express from 'express';


import * as csrfController from '../csrf/controllers/csrfController.js';
import { csrfProtection } from '../../../../middleware/security/csrf.js';

const router = express.Router();

router.get('/csrf-token', csrfProtection, csrfController.getCsrfToken);

export default router; 