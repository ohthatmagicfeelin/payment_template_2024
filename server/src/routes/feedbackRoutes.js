import { Router } from 'express';
import { FeedbackController }from '../controllers/feedbackController.js';
import { validateFeedback } from '../middleware/validateInput.js';
import { sanitizeFeedback } from '../middleware/sanitizeInput.js';

const router = Router();

router.post('/', sanitizeFeedback, validateFeedback, FeedbackController.create);

export default router; 