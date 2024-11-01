import express from 'express';
import config from '../config/env.js';
import deployRoutes from './deployRoutes.js';
import apiRoutes from './apiRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import auth from './auth.js';
import { sessionMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Determine whether to use base path based on environment
const isProduction = config.NODE_ENV === 'production';
const basePath = isProduction ? config.APP_ROUTE : '';

router.use(sessionMiddleware);
router.use(`${basePath}/api`, apiRoutes);
router.use(`${basePath}/api`, paymentRoutes)
router.use(`${basePath}/api`, auth)
router.use(`/api/health`, deployRoutes);



export default router;