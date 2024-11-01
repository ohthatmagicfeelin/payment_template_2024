// src/api/auth.js
import axios from 'axios';
import config from '@/config/env';

export const signup = async (email, password) => {
  try {
    const response = await axios.post(`${config.BACKEND_URL}/api/signup`, {
      email,
      password
    });
    return { success: true, data: response.data };
  } catch (error) {
    throw error;
  }
};