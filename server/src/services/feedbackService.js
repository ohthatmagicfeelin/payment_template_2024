import { AppError } from '../utils/AppError.js';
import { FeedbackRepository } from '../db/repositories/feedbackRepository.js';

export const FeedbackService = {
  createFeedback: async (feedbackData, user = null) => {
    try {
      const data = {
        message: feedbackData.message,
        rating: feedbackData.rating
      };

      if (user) {
        data.userId = user.id;
      } else {
        // Validate email format if provided
        if (feedbackData.email && !feedbackData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          throw new AppError('Invalid email format', 400);
        }
        data.userEmail = feedbackData.email;
        data.userName = feedbackData.name;
      }

      const feedback = await FeedbackRepository.create(data);
      return feedback;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error creating feedback', 500);
    }
  },

  getAllFeedback: async () => {
    try {
      const feedback = await FeedbackRepository.findAll();
      return feedback;
    } catch (error) {
      throw new AppError('Error fetching feedback', 500);
    }
  },

  getUserFeedback: async (userId) => {
    try {
      const feedback = await FeedbackRepository.findByUser(userId);
      return feedback;
    } catch (error) {
      throw new AppError('Error fetching user feedback', 500);
    }
  }
}; 