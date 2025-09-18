// Authentication Types
export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: User;
}

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type RefreshTokenRequest = {
  refreshToken: string;
}

// Sentiment Analysis Types
export type SentimentType = 'positive' | 'negative' | 'neutral';

export type SentimentAnalysisResult = {
  overallSentiment: SentimentType;
  positiveScore: number;
  negativeScore: number;
  neutralScore: number;
  confidenceScore: number;
  isSarcastic: boolean;
  sarcasmScore: number;
  extractedKeywords: string[];
  extractedEntities: string[];
  processingTime: string;
}

export type SocialMediaPostMetadata = {
  upvotes?: number;
  downvotes?: number;
  commentCount?: number;
  subreddit?: string;
  // Add other platform-specific metadata as needed
}

export type AnalyzeSentimentRequest = {
  content: string;
  platform: string;
  userId: string;
  userName: string;
  sourceUrl?: string;
  sourceId?: string;
  metadata?: SocialMediaPostMetadata;
}

export type AnalyzeSentimentResponse = {
  postId: string;
  sentimentAnalysis: SentimentAnalysisResult;
  trends: Array<{ keyword: string; relevanceScore: number }>;
}

export type BatchAnalyzeSentimentRequest = {
  posts: Array<Omit<AnalyzeSentimentRequest, 'metadata'>>; // Simplified for batch
  options?: {
    priority?: 'low' | 'normal' | 'high';
    webhookUrl?: string;
    includeKeywords?: boolean;
    includeTrends?: boolean;
  };
}

export type BatchAnalyzeSentimentResponse = {
  batchId: string;
  status: 'processing' | 'completed' | 'failed';
  totalPosts: number;
  estimatedCompletionTime?: string;
  statusUrl?: string;
}

export type BatchResult = {
  postId: string;
  status: 'completed' | 'failed';
  sentimentAnalysis?: SentimentAnalysisResult;
  error?: string;
}

export type BatchStatusResponse = {
  batchId: string;
  status: 'processing' | 'completed' | 'failed';
  totalPosts: number;
  processedPosts: number;
  failedPosts: number;
  completedAt?: string;
  results?: BatchResult[];
}

// Trend Analysis Types
export type TimeWindow = '5m' | '15m' | '1h' | '6h' | '24h' | '7d';
export type Granularity = 'hour' | 'day' | 'week';

export type PlatformTrend = {
  platform: string;
  mentionCount: number;
  avgSentiment: number;
}

export type Trend = {
  keyword: string;
  trendScore: number;
  mentionCount: number;
  avgSentimentScore: number;
  platforms: PlatformTrend[];
  relatedKeywords: string[];
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export type RealtimeTrendsResponse = {
  timeWindow: TimeWindow;
  generatedAt: string;
  trends: Trend[];
  metadata: {
    totalPostsAnalyzed: number;
    platforms: string[];
    nextUpdate: string;
  };
}

export type HistoricalTrendDataPoint = {
  date: string;
  mentionCount: number;
  avgSentiment: number;
  trendScore: number;
}

export type HistoricalTrendsResponse = {
  keyword: string;
  dateRange: {
    start: string;
    end: string;
  };
  granularity: Granularity;
  dataPoints: HistoricalTrendDataPoint[];
}

// Analytics Dashboard Types
export type DashboardSummary = {
  totalPostsProcessed: number;
  avgProcessingTime: string;
  systemUptime: number;
  apiRequestsToday: number;
}

export type DashboardSentimentDistribution = {
  positive: number;
  neutral: number;
  negative: number;
}

export type PlatformBreakdown = {
  platform: string;
  postCount: number;
  avgSentiment: number;
  topSubreddits?: string[];
}

export type DashboardPerformanceMetrics = {
  avgResponseTime: number;
  errorRate: number;
  throughput: number;
}

export type DashboardResponse = {
  timeRange: string;
  generatedAt: string;
  summary: DashboardSummary;
  sentimentDistribution: DashboardSentimentDistribution;
  platformBreakdown: PlatformBreakdown[];
  topTrends: Array<{
    keyword: string;
    trendScore: number;
    change24h: number;
  }>;
  performanceMetrics: DashboardPerformanceMetrics;
}

// Ingestion Types
export type IngestionFilters = {
  minUpvotes?: number;
  maxAge?: string;
  excludeStickied?: boolean;
}

export type TriggerIngestionRequest = {
  subreddits: string[];
  filters?: IngestionFilters;
  priority?: 'low' | 'normal' | 'high';
}

export type PlatformIngestionStatus = {
  platform: string;
  status: 'running' | 'idle' | 'error';
  lastIngestion: string;
  postsIngested: number;
  errors: number;
  nextScheduled: string;
}

export type QueueStatus = {
  pendingAnalysis: number;
  processing: number;
  avgProcessingTime: string;
}

export type IngestionStatusResponse = {
  platforms: PlatformIngestionStatus[];
  queueStatus: QueueStatus;
}

// WebSocket Message Types
export type WebSocketAuthMessage = {
  type: 'auth';
  token: string;
}

export type WebSocketSubscribeMessage = {
  type: 'subscribe';
  channels: Array<'trends' | 'analytics' | 'alerts'>;
}

export type TrendUpdateData = {
  keyword: string;
  newMentions: number;
  sentimentChange: number;
  trendScore: number;
}

export type WebSocketTrendUpdateMessage = {
  type: 'trend_update';
  channel: 'trends';
  timestamp: string;
  data: TrendUpdateData;
}

export type AnalyticsUpdateData = {
  postsProcessedLastMinute: number;
  avgResponseTime: number;
  currentThroughput: number;
}

export type WebSocketAnalyticsUpdateMessage = {
  type: 'analytics_update';
  channel: 'analytics';
  timestamp: string;
  data: AnalyticsUpdateData;
}

export type AlertData = {
  queueSize: number;
  threshold: number;
}

export type WebSocketAlertMessage = {
  type: 'alert';
  channel: 'alerts';
  severity: 'warning' | 'error' | 'info';
  timestamp: string;
  message: string;
  data: AlertData;
}

export type WebSocketMessage =
  | WebSocketAuthMessage
  | WebSocketSubscribeMessage
  | WebSocketTrendUpdateMessage
  | WebSocketAnalyticsUpdateMessage
  | WebSocketAlertMessage;

// Error Handling Types
export type ErrorDetail = {
  field?: string;
  message: string;
  code?: string;
}

export type ErrorResponse = {
  error: {
    code: string;
    message: string;
    details?: ErrorDetail[];
    requestId?: string;
    timestamp: string;
  };
}

export type PaginatedResponse<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export type SocialMediaPost = {
  id: string;
  platform: string;
  author: string;
  content: string;
  timestamp: string;
  sentimentType: SentimentType;
  sentimentScore: number;
  keywords: string[];
  sourceUrl?: string;
  metadata?: SocialMediaPostMetadata;
}