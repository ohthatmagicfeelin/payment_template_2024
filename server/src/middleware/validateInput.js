import { AppError } from '../utils/AppError.js';

const validateEmail = (email) => {
  if (!email) {
    throw new AppError('Email is required', 400);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Invalid email format', 400);
  }
  if (email.length > 255) {
    throw new AppError('Email is too long', 400);
  }
};

const validatePassword = (password) => {
  if (!password) {
    throw new AppError('Password is required', 400);
  }
  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }
  if (password.length > 128) {
    throw new AppError('Password is too long', 400);
  }
  if (!/[A-Z]/.test(password)) {
    throw new AppError('Password must contain at least one uppercase letter', 400);
  }
  if (!/[a-z]/.test(password)) {
    throw new AppError('Password must contain at least one lowercase letter', 400);
  }
  if (!/\d/.test(password)) {
    throw new AppError('Password must contain at least one number', 400);
  }
  if (!/[!@#$%^&*]/.test(password)) {
    throw new AppError('Password must contain at least one special character (!@#$%^&*)', 400);
  }
};

const validateToken = (token) => {
  if (!token) {
    throw new AppError('Token is required', 400);
  }
  if (typeof token !== 'string') {
    throw new AppError('Invalid token format', 400);
  }
  if (token.length > 1000) {
    throw new AppError('Token is too long', 400);
  }
};

export const validateSignup = (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateEmail(email);
    validatePassword(password);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateLogin = (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateEmail(email);
    if (!password) {
      throw new AppError('Password is required', 400);
    }
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePasswordReset = (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    validateToken(token);
    validatePassword(newPassword);
    next();
  } catch (error) {
    next(error);
  }
};

export const validatePasswordResetRequest = (req, res, next) => {
  try {
    const { email } = req.body;
    validateEmail(email);
    next();
  } catch (error) {
    next(error);
  }
};

export const validateEmailVerification = (req, res, next) => {
  try {
    const { token } = req.body;
    validateToken(token);
    next();
  } catch (error) {
    next(error);
  }
}; 