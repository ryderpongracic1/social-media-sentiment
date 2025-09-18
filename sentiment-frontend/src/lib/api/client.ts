import axios from 'axios';

import { useAuthStore } from '../../store/authStore';
import type { AuthResponse } from '../../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for attaching JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and refresh token logic
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore.getState();

    // If the error is 401 Unauthorized and it's not a retry, attempt to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = authStore.refreshToken;
        if (refreshToken) {
          const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
          const { accessToken, refreshToken: newRefreshToken, user } = response.data;

          authStore.login(accessToken, newRefreshToken, user); // Update tokens and user info in store
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Unable to refresh token:', refreshError);
        authStore.logout(); // Clear auth state on refresh failure
        // Optionally redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;