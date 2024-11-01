// src/api/auth.js
import axios from 'axios';
import config from '@/config/env';

export const signup = async (email, password) => {
  const response = await axios.post(`${config.BACKEND_URL}/api/signup`, {
    email,
    password
  });
  return response.data;
};