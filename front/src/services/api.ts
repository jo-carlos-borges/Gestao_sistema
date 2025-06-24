import axios from 'axios';

// This would typically point to a real backend API
// For development we'll use a mock API with localStorage
const BASE_URL = 'https://api.example.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 401) {
        // Unauthorized, clear token and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(error.response.data.message || 'An error occurred'));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response from server'));
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(new Error('Error setting up request'));
    }
  }
);

export default api;