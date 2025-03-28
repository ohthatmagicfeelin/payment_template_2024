// src/api/auth.js
import api from '@/api/api';

export const signupApi = async ({ email, password, rememberMe = false }) => {
  const response = await api.post('/api/signup', {
    email,
    password,
    rememberMe
  });
  return response.data;
};

export const loginApi = async ({ email, password, rememberMe = false }) => {
  const response = await api.post('/api/login', {
    email,
    password,
    rememberMe
  });
  return response.data;
};

export const logoutApi = async () => {
  try {
    await api.post('/api/logout');
    // Get a fresh CSRF token
    await api.get('/api/csrf-token');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const validateSessionApi = async () => {
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

export const requestPasswordResetApi = async (email) => {
  await api.post('/api/password-reset-request', { email });
};

export const resetPasswordApi = async (token, newPassword) => {
  await api.post('/api/password-reset', {
    token,
    newPassword
  });
};

export const verifyEmailApi = async (token) => {
  await api.post('/api/verify-email', { token });
};

export const resendVerificationEmailApi = async (email) => {
  await api.post('/api/resend-verification', { email });
};

export const verifyResetTokenApi = async (token) => {
  if (!token) throw new Error('No token provided');
  await api.post('/api/verify-reset-token', { token });
};