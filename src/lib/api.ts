import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors if needed later, e.g., for auth tokens or error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // You can handle global formatting of errors here
    return Promise.reject(error);
  }
);
