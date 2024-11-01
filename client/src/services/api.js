// client/src/services/api.js
import axios from 'axios';
import config from '@/config/env';

export const api = axios.create({
  baseURL: config.BACKEND_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);