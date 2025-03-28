import rateLimit from 'express-rate-limit';
import { AppError } from '../../utils/AppError.js';
import config from '../../config/env.js';

// Helper function to get rate limit based on debug mode
const getRateLimit = (normalLimit, debugLimit) => {
  return config.DEBUG ? debugLimit : normalLimit;
};

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getRateLimit(5, 100), // 5 attempts normally, 100 in debug
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts, please try again after 15 minutes', 429));
  }
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: getRateLimit(100, 1000), // 100 requests normally, 1000 in debug
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP, please try again after 15 minutes', 429));
  }
});

export const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: getRateLimit(3, 50), // 3 submissions normally, 50 in debug
  message: 'Too many feedback submissions, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many feedback submissions from this IP, please try again after an hour', 429));
  }
}); 