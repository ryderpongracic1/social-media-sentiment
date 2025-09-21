import type {
  TriggerIngestionRequest,
  LoginCredentials,
  AnalyzeSentimentRequest
} from '../../types/api';

import apiClient from './client';

// Authentication Endpoints
export const authEndpoints = {
  login: (credentials: LoginCredentials) => apiClient.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) => apiClient.post('/auth/register', userData),
  profile: () => apiClient.get('/auth/profile'),
  refreshToken: (refreshToken: string) => apiClient.post('/auth/refresh', { refreshToken }),
  logout: () => apiClient.post('/auth/logout'),
};

// Sentiment Analysis Endpoints
export const sentimentEndpoints = {
  analyze: (data: AnalyzeSentimentRequest) => apiClient.post('/sentiment/analyze', data),
  getSentimentById: (id: string) => apiClient.get(`/sentiment/${id}`),
  getRecentSentiments: () => apiClient.get('/sentiment/recent'),
  getSentimentTrends: (timeWindow: string) => apiClient.get(`/sentiment/trends?timeWindow=${timeWindow}`),
};

// Trend Analysis Endpoints
export const trendEndpoints = {
  getTrends: (timeWindow: string) => apiClient.get(`/trends/realtime?timeWindow=${timeWindow}`),
  getKeywords: (timeWindow: string) => apiClient.get(`/trends/keywords?timeWindow=${timeWindow}`), // This needs to be updated to historical trends
  getHistoricalTrends: (keyword: string, startDate: string, endDate: string, granularity: string) =>
    apiClient.get(`/trends/keyword/${keyword}/history`, { params: { startDate, endDate, granularity } }),
};

// Analytics Dashboard Endpoints
export const analyticsEndpoints = {
  getDashboardAnalytics: (timeRange: string) => apiClient.get(`/analytics/dashboard?timeRange=${timeRange}`),
  getSentimentSummaryReport: (startDate: string, endDate: string, groupBy: string, format: string = 'json') =>
    apiClient.get(`/analytics/reports/sentiment-summary`, { params: { startDate, endDate, groupBy, format } }),
};

// Ingestion Endpoints
export const ingestionEndpoints = {
  triggerIngestion: (data: TriggerIngestionRequest) => apiClient.post('/ingestion/reddit/trigger', data),
  getIngestionStatus: () => apiClient.get('/ingestion/status'),
};

// Example of a generic CRUD endpoint structure
export const createCrudEndpoints = <T>(resource: string) => ({
  getAll: () => apiClient.get<T[]>(`/${resource}`),
  getById: (id: string) => apiClient.get<T>(`/${resource}/${id}`),
  create: (data: T) => apiClient.post<T>(`/${resource}`, data),
  update: (id: string, data: T) => apiClient.put<T>(`/${resource}/${id}`, data),
  remove: (id: string) => apiClient.delete(`/${resource}/${id}`),
});

// You can create specific CRUD endpoints like this:
// export const userEndpoints = createCrudEndpoints<User>('users');
// export const postEndpoints = createCrudEndpoints<Post>('posts');