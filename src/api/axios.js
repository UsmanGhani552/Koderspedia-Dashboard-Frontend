import axios from 'axios';
import { store } from '../store/store';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_PRODUCTION_URL,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const { token } = store.getState().auth;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (!config.headers['Content-Type']) {
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    config.headers['Accept'] = 'application/json';
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear all auth-related storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.clear();
      // Dispatch logout action to clear Redux state
      store.dispatch({ type: 'auth/logout' });
      
      // Redirect to login with return URL
      const currentPath = window.location.pathname;
      if (currentPath !== '/') {
        window.location.href = `/?redirect=${encodeURIComponent(currentPath)}`;
      } else {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;