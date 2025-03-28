// client/src/services/authService.js
import { resetCsrfToken } from '@/common/services/csrfService.js';
import {
  logoutApi,
  validateSessionApi
} from '../api/authApi.js';

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