import express from 'express';
import config from '../config/env.js';
import deployRoutes from './deployRoutes.js';
import apiRoutes from './apiRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import authRoutes from './authRoutes.js';
import feedbackRoutes from './feedbackRoutes.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import settingsRoutes from './settingsRoutes.js';
import sessionRoutes from './sessionRoutes.js';

const router = express.Router();

// Determine whether to use base path based on environment
const isProduction = config.NODE_ENV === 'production';
const basePath = isProduction ? config.APP_ROUTE : '';


router.use(`${basePath}/api`, apiLimiter);
router.use(`${basePath}/api`, apiRoutes);
router.use(`${basePath}/api`, paymentRoutes)
router.use(`${basePath}/api`, authRoutes)
router.use(`/api/health`, deployRoutes);
router.use(`${basePath}/api/feedback`, feedbackRoutes);
router.use(`${basePath}/api/settings`, settingsRoutes);
router.use(`${basePath}/api/sessions`, sessionRoutes);


export default router;