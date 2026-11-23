import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const AUTH_STORAGE_KEY = 'cmd_library_auth_user';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retrieve JWT from persistent or temporary session storage.
function getStoredToken() {
  try {
    const savedUser =
      localStorage.getItem(AUTH_STORAGE_KEY) ||
      sessionStorage.getItem(AUTH_STORAGE_KEY);

    if (!savedUser) return null;

    const parsed = JSON.parse(savedUser);

    if (
      !parsed?.token ||
      parsed.token === 'demo-session-token' ||
      parsed.token.startsWith('session-')
    ) {
      return null;
    }

    return parsed.token;
  } catch {
    return null;
  }
}

// Attach JWT to requests automatically.
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize API errors.
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
