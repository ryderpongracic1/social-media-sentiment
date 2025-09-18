// Base types
export type SentimentType = "positive" | "negative" | "neutral";
export type PostStatus = "pending" | "processing" | "completed" | "failed";
export type UserRole = "admin" | "analyst" | "viewer";
export type Platform = "reddit" | "twitter" | "facebook" | "instagram" | "linkedin";
export type TimeWindow = "1h" | "6h" | "24h" | "7d" | "30d" | "90d";

// API Response types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// User types
export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export type UserProfile = {
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: {
      email: boolean;
      push: boolean;
      trends: boolean;
      reports: boolean;
    };
    dashboard: {
      defaultTimeWindow: TimeWindow;
      autoRefresh: boolean;
      refreshInterval: number;
    };
  };
} & User

// Social Media Post types
export type SocialMediaPost = {
  id: string;
  content: string;
  platform: Platform;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  url?: string;
  timestamp: string;
  status: PostStatus;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Sentiment Analysis types
export type SentimentScore = {
  overall: number;
  positive: number;
  negative: number;
  neutral: number;
  confidence: number;
}

export type SentimentAnalysis = {
  id: string;
  postId: string;
  sentiment: SentimentType;
  score: SentimentScore;
  keywords: string[];
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
    disgust: number;
  };
  topics: string[];
  language: string;
  processedAt: string;
  processingTime: number;
}

// Trend Analysis types
export type TrendKeyword = {
  keyword: string;
  count: number;
  sentiment: SentimentType;
  change: number;
  changePercent: number;
}

export type TrendAnalysis = {
  id: string;
  timeWindow: TimeWindow;
  platform?: Platform;
  totalPosts: number;
  sentimentDistribution: {
    positive: number;
    negative: number;
    neutral: number;
  };
  topKeywords: TrendKeyword[];
  topics: Array<{
    name: string;
    count: number;
    sentiment: SentimentType;
  }>;
  averageScore: SentimentScore;
  createdAt: string;
  updatedAt: string;
}

// Dashboard types
export type DashboardStats = {
  totalPosts: number;
  postsToday: number;
  averageSentiment: number;
  trendingKeywords: string[];
  platformDistribution: Record<Platform, number>;
  sentimentTrend: Array<{
    date: string;
    positive: number;
    negative: number;
    neutral: number;
  }>;
}

// Chart data types
export type ChartDataPoint = {
  x: string | number;
  y: number;
  label?: string;
  color?: string;
}

export type TimeSeriesData = {
  timestamp: string;
  value: number;
  sentiment?: SentimentType;
}

export type SentimentChartData = {
  positive: TimeSeriesData[];
  negative: TimeSeriesData[];
  neutral: TimeSeriesData[];
}

// Filter types
export type PostFilters = {
  platform?: Platform[];
  sentiment?: SentimentType[];
  dateRange?: {
    start: string;
    end: string;
  };
  keywords?: string[];
  minScore?: number;
  maxScore?: number;
}

export type TrendFilters = {
  timeWindow: TimeWindow;
  platform?: Platform[];
  keywords?: string[];
}

// Form types
export type LoginForm = {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export type ForgotPasswordForm = {
  email: string;
}

export type ResetPasswordForm = {
  token: string;
  password: string;
  confirmPassword: string;
}

// Component prop types
export type BaseComponentProps = {
  className?: string;
  children?: React.ReactNode;
}

export type LoadingState = {
  isLoading: boolean;
  error?: string | null;
}

export type AsyncState<T> = {
  data?: T | null;
} & LoadingState

// Store types
export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type PostsState = {
  posts: SocialMediaPost[];
  selectedPost: SocialMediaPost | null;
  filters: PostFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  isLoading: boolean;
  error: string | null;
}

export type AnalyticsState = {
  dashboardStats: DashboardStats | null;
  sentimentTrends: SentimentChartData | null;
  trendAnalysis: TrendAnalysis[];
  isLoading: boolean;
  error: string | null;
}

// Event types
export type AppEvent = {
  type: string;
  payload?: any;
  timestamp: string;
}

export type NotificationEvent = {
  type: "notification";
  payload: {
    id: string;
    title: string;
    message: string;
    type: "info" | "success" | "warning" | "error";
    duration?: number;
  };
} & AppEvent

// Configuration types
export type AppConfig = {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  features: {
    realTimeUpdates: boolean;
    exportData: boolean;
    advancedFilters: boolean;
  };
  ui: {
    theme: "light" | "dark" | "system";
    animations: boolean;
    compactMode: boolean;
  };
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};