import api from '@/api/api';

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