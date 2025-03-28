// client/src/services/authService.js
import { resetCsrfToken } from '@/common/services/csrfService.js';
import {
  signupApi,
  loginApi,
  logoutApi,
  validateSessionApi,
  requestPasswordResetApi,
  resetPasswordApi,
  verifyEmailApi,
  resendVerificationEmailApi,
  verifyResetTokenApi
} from '../api/authApi.js';

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*]/.test(password);

  const errors = [];
  if (password.length < minLength) errors.push(`Must be at least ${minLength} characters`);
  if (!hasUpper) errors.push('Must contain uppercase letter');
  if (!hasLower) errors.push('Must contain lowercase letter');
  if (!hasNumber) errors.push('Must contain number');
  if (!hasSpecial) errors.push('Must contain special character');

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const signup = async ({ email, password, rememberMe = false }) => {
  const { isValid, errors } = validatePassword(password);
  if (!isValid) {
    throw new Error(errors.join(', '));
  }

  return signupApi({ email, password, rememberMe });
};

export const login = async ({ email, password, rememberMe = false }) => {
  return loginApi({ email, password, rememberMe });
};

export const logout = async () => {
  try {
    await logoutApi();
    // Reset the CSRF token cache
    resetCsrfToken();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const validateSession = async () => {
  return validateSessionApi();
};

export const requestPasswordReset = async (email) => {
  return requestPasswordResetApi(email);
};

export const resetPassword = async (token, newPassword) => {
  const { isValid, errors } = validatePassword(newPassword);
  if (!isValid) {
    throw new Error(errors.join(', '));
  }

  return resetPasswordApi(token, newPassword);
};

export const verifyEmail = async (token) => {
  return verifyEmailApi(token);
};

export const resendVerificationEmail = async (email) => {
  return resendVerificationEmailApi(email);
};

export const verifyResetToken = async (token) => {
  return verifyResetTokenApi(token);
};