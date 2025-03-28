import api from '@/api/api';

export const verifyResetTokenApi = async (token) => {
  if (!token) throw new Error('No token provided');
  await api.post('/api/verify-reset-token', { token });
};

export const resetPasswordApi = async (token, newPassword) => {
  await api.post('/api/password-reset', {
    token,
    newPassword
  });
}; 