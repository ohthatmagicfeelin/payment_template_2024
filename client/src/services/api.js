// client/src/services/api.js
import axios from 'axios';
import config from '@/config/env';

const api = axios.create({
  baseURL: config.BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

let csrfToken = null;

const fetchCsrfToken = async () => {
    if (!csrfToken) {
        const response = await api.get('/api/csrf-token');
        csrfToken = response.data.csrfToken;
    }
    return csrfToken;
};

api.interceptors.request.use(async config => {
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
        try {
            const token = await fetchCsrfToken();
            config.headers['X-CSRF-Token'] = token;
        } catch (error) {
            console.error('Failed to fetch CSRF token:', error);
        }
    }
    return config;
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

export default api;