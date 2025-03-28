import { resetCsrfToken } from '@/common/services/csrfService.js';
import {
  logoutApi,
  validateSessionApi
} from '@/features/auth/api/authApi.js';

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