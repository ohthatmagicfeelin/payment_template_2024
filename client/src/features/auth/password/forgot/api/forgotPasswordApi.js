import api from '@/api/api';

export const forgotPasswordApi = async (email) => {
  await api.post('/api/password-reset-request', { email });
}; 