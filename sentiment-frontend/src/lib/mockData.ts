
export type SentimentTrendData = {
  timestamp: string;
  overallSentiment: number;
  positive: number;
  negative: number;
  neutral: number;
}

export type PlatformSentimentData = {
  platform: string;
  positive: number;
  negative: number;
  neutral: number;
}

export type HeatmapData = {
  x: string; // e.g., hour of day
  y: string; // e.g., day of week or geographic region
  value: number; // sentiment score or count
}

export type WordCloudData = {
  text: string;
  value: number; // frequency or importance
}

export type GaugeData = {
  label: string;
  value: number;
  maxValue: number;
  unit?: string;
}

// Mock data for Real-time Line Chart
export const mockSentimentTrendData = [
  { date: '2023-01-01T00:00:00Z', sentimentScore: 0.1 },
  { date: '2023-01-01T01:00:00Z', sentimentScore: 0.2 },
  { date: '2023-01-01T02:00:00Z', sentimentScore: 0.15 },
  { date: '2023-01-01T03:00:00Z', sentimentScore: 0.3 },
  { date: '2023-01-01T04:00:00Z', sentimentScore: 0.25 },
  { date: '2023-01-01T05:00:00Z', sentimentScore: 0.4 },
  { date: '2023-01-01T06:00:00Z', sentimentScore: 0.35 },
];

// Mock data for Bar/Column Chart
export const mockPlatformSentimentData: PlatformSentimentData[] = [
  { platform: 'Twitter', positive: 50, negative: 20, neutral: 30 },
  { platform: 'Facebook', positive: 60, negative: 15, neutral: 25 },
  { platform: 'Reddit', positive: 40, negative: 30, neutral: 30 },
  { platform: 'Instagram', positive: 70, negative: 10, neutral: 20 },
];

// Mock data for Heatmap
export const mockHeatmapData: HeatmapData[] = [
  { x: 'Mon', y: '9-10 AM', value: 0.6 },
  { x: 'Mon', y: '10-11 AM', value: 0.7 },
  { x: 'Mon', y: '11-12 PM', value: 0.5 },
  { x: 'Tue', y: '9-10 AM', value: 0.4 },
  { x: 'Tue', y: '10-11 AM', value: 0.8 },
  { x: 'Tue', y: '11-12 PM', value: 0.6 },
  { x: 'Wed', y: '9-10 AM', value: 0.7 },
  { x: 'Wed', y: '10-11 AM', value: 0.5 },
  { x: 'Wed', y: '11-12 PM', value: 0.9 },
];

// Mock data for Word Cloud
export const mockWordCloudData: WordCloudData[] = [
  { text: 'positive', value: 100 },
  { text: 'great', value: 80 },
  { text: 'love', value: 70 },
  { text: 'happy', value: 60 },
  { text: 'negative', value: 50 },
  { text: 'bad', value: 40 },
  { text: 'hate', value: 30 },
  { text: 'sad', value: 20 },
  { text: 'neutral', value: 15 },
  { text: 'okay', value: 10 },
];

// Mock data for Gauge Chart
export const mockGaugeData: GaugeData[] = [
  { label: 'Current Sentiment Score', value: 0.65, maxValue: 1, unit: '' },
  { label: 'Processing Rate', value: 85, maxValue: 100, unit: 'posts/min' },
];