// client/src/services/authService.js
import api from '@/api/api';
import { resetCsrfToken } from '@/common/services/csrfService.js';

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

  const response = await api.post('/api/signup', {
    email,
    password,
    rememberMe
  });
  return response.data;
};

export const login = async ({ email, password, rememberMe = false }) => {
  const response = await api.post('/api/login', {
    email,
    password,
    rememberMe
  });
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/api/logout');
    // Reset the CSRF token cache
    resetCsrfToken();
    // Get a fresh CSRF token
    await api.get('/api/csrf-token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const validateSession = async () => {
  try {
    const response = await api.get('/api/validate');
    return response;
  } catch (error) {
    // Handle 401 silently on signup page
    if (error.response?.status === 401 && window.location.pathname === '/signup') {
      return { data: { user: null } };
    }
    
    // For other 401s or other errors, throw the error
    if (error.response?.status === 401) {
      throw new Error('Unauthorized: Session expired');
    }
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  await api.post('/api/password-reset-request', { email });
};

export const resetPassword = async (token, newPassword) => {
  const { isValid, errors } = validatePassword(newPassword);
  if (!isValid) {
    throw new Error(errors.join(', '));
  }

  await api.post('/api/password-reset', {
    token,
    newPassword
  });
};

export const verifyEmail = async (token) => {
  await api.post('/api/verify-email', { token });
};

export const resendVerificationEmail = async (email) => {
  await api.post('/api/resend-verification', { email });
};

export const verifyResetToken = async (token) => {
  if (!token) throw new Error('No token provided');
  await api.post('/api/verify-reset-token', { token });
};