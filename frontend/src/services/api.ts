import axios, { AxiosError } from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Extract error message from response
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    
    // Create a new error with the extracted message
    const enhancedError = new Error(errorMessage);
    (enhancedError as any).response = error.response;
    (enhancedError as any).status = error.response?.status;
    
    return Promise.reject(enhancedError);
  }
);

export default api;
