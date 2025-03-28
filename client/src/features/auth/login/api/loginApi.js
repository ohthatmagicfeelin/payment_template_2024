import api from '@/api/api';

export const loginApi = async ({ email, password, rememberMe = false }) => {
  const response = await api.post('/api/login', {
    email,
    password,
    rememberMe
  });
  return response.data;
};
