import axios from 'axios';

// Centralized axios instance. All requests automatically attach the JWT
// from localStorage and target the backend running on port 5000.
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
