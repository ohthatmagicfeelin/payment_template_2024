import api from '@/api/api';

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