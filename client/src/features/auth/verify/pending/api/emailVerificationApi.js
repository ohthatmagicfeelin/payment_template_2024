import api from '@/api/api';

export const resendVerificationEmailApi = async (email) => {
  await api.post('/api/resend-verification', { email });
}; 