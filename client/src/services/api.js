import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    try {
      const savedUser = localStorage.getItem('cmd_library_auth_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch {
      // Ignore malformed storage
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Request failed';
    const wrapped = new Error(serverMessage);
    wrapped.status = error.response?.status;
    wrapped.originalError = error;
    return Promise.reject(wrapped);
  }
);

export { API_BASE_URL };
export default api;
