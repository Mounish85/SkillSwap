import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/skill',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for extracting helpful error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend provided a custom message, pass it through clearly
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    // Attach clean error message to error object
    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default api;

