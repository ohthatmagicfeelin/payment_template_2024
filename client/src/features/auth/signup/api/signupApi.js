import api from '@/api/api';

export const signupApi = async ({ email, password, name, rememberMe = false }) => {
  const response = await api.post('/api/signup', {
    email,
    password,
    name,
    rememberMe
  });
  return response.data;
}; 