import { Router } from 'express';
import { FeedbackController } from '../controllers/feedbackController.js';
import { validateFeedback } from '../middleware/validateInput.js';
import { sanitizeFeedback } from '../middleware/sanitizeInput.js';
import { feedbackLimiter } from '../middleware/rateLimiter.js';

const router = Router();

const middleware = [feedbackLimiter, sanitizeFeedback, validateFeedback];

router.post('/', ...middleware, FeedbackController.create);

export default router; 
