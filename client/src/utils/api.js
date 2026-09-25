import axios from 'axios';

// In production the client is served from a different origin than the API, so
// the API base URL is configurable via REACT_APP_API_URL.
//   - If REACT_APP_API_URL is set: use `${REACT_APP_API_URL}/api`
//   - Otherwise: default to '/api' so local dev keeps using the CRA proxy
//     (see "proxy" in client/package.json -> http://localhost:5000).
const API_ROOT = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: API_ROOT,
  timeout: 15000,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
