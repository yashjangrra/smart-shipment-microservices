import axios from 'axios';

// Create an Axios instance using relative paths so Vite proxy handles CORS
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to inject the JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
