import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import {
  useLogin,
  useUserProfile,
  useRecentSentiments,
  useSocialMediaPosts,
} from "../hooks";

// Mock the endpoints
jest.mock("../endpoints", () => ({
  authEndpoints: {
    login: jest.fn(),
    logout: jest.fn(),
    profile: jest.fn(),
  },
  sentimentEndpoints: {
    analyze: jest.fn(),
    getRecentSentiments: jest.fn(),
    getSentimentTrends: jest.fn(),
  },
  trendEndpoints: {
    getTrends: jest.fn(),
    getHistoricalTrends: jest.fn(),
  },
  analyticsEndpoints: {
    getDashboardAnalytics: jest.fn(),
  },
  ingestionEndpoints: {
    triggerIngestion: jest.fn(),
    getIngestionStatus: jest.fn(),
  },
}));

// Mock the auth store
jest.mock("../../../store/authStore", () => ({
  useAuthStore: jest.fn(() => jest.fn()),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const TestWrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
};

describe("API Hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useLogin", () => {
    it("should handle login mutation", () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBe(false);
    });
  });

  describe("useUserProfile", () => {
    it("should return loading state initially", () => {
      const { result } = renderHook(() => useUserProfile(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("useRecentSentiments", () => {
    it("should return loading state initially", () => {
      const { result } = renderHook(() => useRecentSentiments(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("useSocialMediaPosts", () => {
    it("should return loading state initially", () => {
      const { result } = renderHook(() => useSocialMediaPosts(1, 10), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });
});