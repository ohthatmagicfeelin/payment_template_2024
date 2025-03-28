import api from '@/api/api';

export const verifyEmailSuccessApi = async (token) => {
  await api.post('/api/verify-email', { token });
}; 