import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — inject JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ghcs-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ghcs-token');
      localStorage.removeItem('ghcs-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
