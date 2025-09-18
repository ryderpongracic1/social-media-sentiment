import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import type {
  AuthState,
  PostsState,
  AnalyticsState,
  User,
  SocialMediaPost,
  PostFilters,
  DashboardStats,
  SentimentChartData,
  TrendAnalysis,
} from "@/types";

// Auth Store
type AuthStore = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
} & AuthState

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            // TODO: Replace with actual API call
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              throw new Error("Login failed");
            }

            const { user } = await response.json();
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Login failed",
              isLoading: false,
            });
          }
        },

        logout: () => {
          set({ user: null, isAuthenticated: false, error: null });
        },

        register: async (name: string, email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            // TODO: Replace with actual API call
            const response = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name, email, password }),
            });

            if (!response.ok) {
              throw new Error("Registration failed");
            }

            const { user } = await response.json();
            set({ user, isAuthenticated: true, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Registration failed",
              isLoading: false,
            });
          }
        },

        updateUser: (userData: Partial<User>) => {
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, ...userData } });
          }
        },

        clearError: () => {
          set({ error: null });
        },
      }),
      {
        name: "auth-store",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "AuthStore" }
  )
);

// Posts Store
type PostsStore = {
  fetchPosts: () => Promise<void>;
  setFilters: (filters: Partial<PostFilters>) => void;
  clearFilters: () => void;
  selectPost: (post: SocialMediaPost | null) => void;
  setPage: (page: number) => void;
  refreshPosts: () => Promise<void>;
} & PostsState

export const usePostsStore = create<PostsStore>()(
  devtools(
    (set, get) => ({
      posts: [],
      selectedPost: null,
      filters: {},
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
      },
      isLoading: false,
      error: null,

      fetchPosts: async () => {
        set({ isLoading: true, error: null });

        try {
          const { filters, pagination } = get();
          const params = new URLSearchParams({
            page: pagination.page.toString(),
            limit: pagination.limit.toString(),
            ...Object.fromEntries(
              Object.entries(filters).map(([key, value]) => [
                key,
                Array.isArray(value) ? value.join(",") : String(value),
              ])
            ),
          });

          // TODO: Replace with actual API call
          const response = await fetch(`/api/posts?${params}`);
          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }

          const data = await response.json();
          set({
            posts: data.posts,
            pagination: { ...get().pagination, total: data.total },
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch posts",
            isLoading: false,
          });
        }
      },

      setFilters: (newFilters: Partial<PostFilters>) => {
        const currentFilters = get().filters;
        set({
          filters: { ...currentFilters, ...newFilters },
          pagination: { ...get().pagination, page: 1 },
        });
      },

      clearFilters: () => {
        set({
          filters: {},
          pagination: { ...get().pagination, page: 1 },
        });
      },

      selectPost: (post: SocialMediaPost | null) => {
        set({ selectedPost: post });
      },

      setPage: (page: number) => {
        set({ pagination: { ...get().pagination, page } });
      },

      refreshPosts: async () => {
        await get().fetchPosts();
      },
    }),
    { name: "PostsStore" }
  )
);

// Analytics Store
type AnalyticsStore = {
  fetchDashboardStats: () => Promise<void>;
  fetchSentimentTrends: (timeWindow: string) => Promise<void>;
  fetchTrendAnalysis: () => Promise<void>;
  clearError: () => void;
} & AnalyticsState

export const useAnalyticsStore = create<AnalyticsStore>()(
  devtools(
    (set) => ({
      dashboardStats: null,
      sentimentTrends: null,
      trendAnalysis: [],
      isLoading: false,
      error: null,

      fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          const response = await fetch("/api/analytics/dashboard");
          if (!response.ok) {
            throw new Error("Failed to fetch dashboard stats");
          }

          const stats: DashboardStats = await response.json();
          set({ dashboardStats: stats, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch dashboard stats",
            isLoading: false,
          });
        }
      },

      fetchSentimentTrends: async (timeWindow: string) => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/analytics/trends?timeWindow=${timeWindow}`);
          if (!response.ok) {
            throw new Error("Failed to fetch sentiment trends");
          }

          const trends: SentimentChartData = await response.json();
          set({ sentimentTrends: trends, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch sentiment trends",
            isLoading: false,
          });
        }
      },

      fetchTrendAnalysis: async () => {
        set({ isLoading: true, error: null });

        try {
          // TODO: Replace with actual API call
          const response = await fetch("/api/analytics/trend-analysis");
          if (!response.ok) {
            throw new Error("Failed to fetch trend analysis");
          }

          const analysis: TrendAnalysis[] = await response.json();
          set({ trendAnalysis: analysis, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch trend analysis",
            isLoading: false,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    { name: "AnalyticsStore" }
  )
);

// UI Store for global UI state
type UIState = {
  theme: "light" | "dark" | "system";
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    timestamp: string;
  }>;
}

type UIStore = {
  setTheme: (theme: "light" | "dark" | "system") => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<UIState["notifications"][0], "id" | "timestamp">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
} & UIState

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        theme: "system",
        sidebarOpen: true,
        notifications: [],

        setTheme: (theme: "light" | "dark" | "system") => {
          set({ theme });
        },

        toggleSidebar: () => {
          set({ sidebarOpen: !get().sidebarOpen });
        },

        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open });
        },

        addNotification: (notification: Omit<UIState["notifications"][0], "id" | "timestamp">) => {
          const newNotification = {
            ...notification,
            id: Math.random().toString(36).substring(2, 15),
            timestamp: new Date().toISOString(),
          };
          set({ notifications: [...get().notifications, newNotification] });
        },

        removeNotification: (id: string) => {
          set({ notifications: get().notifications.filter((n) => n.id !== id) });
        },

        clearNotifications: () => {
          set({ notifications: [] });
        },
      }),
      {
        name: "ui-store",
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: "UIStore" }
  )
);