import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../../store/authStore';
import type {
  LoginCredentials,
  AuthResponse,
  User,
  AnalyzeSentimentRequest,
  AnalyzeSentimentResponse,
  TimeWindow,
  RealtimeTrendsResponse,
  HistoricalTrendsResponse,
  Granularity,
  DashboardResponse,
  TriggerIngestionRequest,
  IngestionStatusResponse,
} from '../../types/api';

import { authEndpoints, sentimentEndpoints, trendEndpoints, analyticsEndpoints, ingestionEndpoints } from './endpoints';

// --- Authentication Hooks ---
export const useLogin = () => {
  const login = useAuthStore((state) => state.login);
  return useMutation<AuthResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await authEndpoints.login(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      login(data.accessToken, data.refreshToken, data.user);
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();
  return useMutation<void, Error, void>({
    mutationFn: async () => {
      await authEndpoints.logout();
    },
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all queries on logout
    },
  });
};

export const useUserProfile = () => {
  return useQuery<User, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await authEndpoints.profile();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// --- Sentiment Analysis Hooks ---
export const useAnalyzeSentiment = () => {
  return useMutation<AnalyzeSentimentResponse, Error, AnalyzeSentimentRequest>({
    mutationFn: async (data) => {
      const response = await sentimentEndpoints.analyze(data);
      return response.data;
    },
  });
};

export const useRecentSentiments = () => {
  return useQuery<AnalyzeSentimentResponse[], Error>({
    queryKey: ['recentSentiments'],
    queryFn: async () => {
      const response = await sentimentEndpoints.getRecentSentiments();
      return response.data;
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};

export const useSentimentTrends = (timeWindow: TimeWindow) => {
  return useQuery<any, Error>({ // TODO: Define specific type for sentiment trends
    queryKey: ['sentimentTrends', timeWindow],
    queryFn: async () => {
      const response = await sentimentEndpoints.getSentimentTrends(timeWindow);
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// --- Trend Analysis Hooks ---
export const useRealtimeTrends = (timeWindow: TimeWindow) => {
  return useQuery<RealtimeTrendsResponse, Error>({
    queryKey: ['realtimeTrends', timeWindow],
    queryFn: async () => {
      const response = await trendEndpoints.getTrends(timeWindow);
      return response.data;
    },
    refetchInterval: 15 * 1000, // Refetch every 15 seconds for real-time
  });
};

export const useHistoricalTrends = (keyword: string, startDate: string, endDate: string, granularity: Granularity) => {
  return useQuery<HistoricalTrendsResponse, Error>({
    queryKey: ['historicalTrends', keyword, startDate, endDate, granularity],
    queryFn: async () => {
      const response = await trendEndpoints.getHistoricalTrends(keyword, startDate, endDate, granularity);
      return response.data;
    },
    enabled: !!keyword && !!startDate && !!endDate && !!granularity, // Only fetch if all parameters are available
  });
};

// --- Analytics Dashboard Hooks ---
export const useDashboardAnalytics = (timeRange: string) => {
  return useQuery<DashboardResponse, Error>({
    queryKey: ['dashboardAnalytics', timeRange],
    queryFn: async () => {
      const response = await analyticsEndpoints.getDashboardAnalytics(timeRange);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// --- Ingestion Hooks ---
export const useTriggerIngestion = () => {
  return useMutation<any, Error, TriggerIngestionRequest>({ // TODO: Define specific response type
    mutationFn: async (data) => {
      const response = await ingestionEndpoints.triggerIngestion(data);
      return response.data;
    },
  });
};

export const useIngestionStatus = () => {
  return useQuery<IngestionStatusResponse, Error>({
    queryKey: ['ingestionStatus'],
    queryFn: async () => {
      const response = await ingestionEndpoints.getIngestionStatus();
      return response.data;
    },
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  });
};
export const useSocialMediaPosts = (
  page: number,
  pageSize: number,
  fromDate?: string,
  toDate?: string,
  sentimentType?: string,
  platform?: string,
  query?: string
) => {
  return useQuery<any, Error>({ // TODO: Define specific type for social media posts
    queryKey: ['socialMediaPosts', page, pageSize, fromDate, toDate, sentimentType, platform, query],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', pageSize.toString());
      if (fromDate) {
params.append('fromDate', fromDate);
}
      if (toDate) {
params.append('toDate', toDate);
}
      if (sentimentType) {
params.append('sentimentType', sentimentType);
}
      if (platform) {
params.append('platform', platform);
}
      if (query) {
params.append('query', query);
}

      const response = await fetch(`/api/social-media-posts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};