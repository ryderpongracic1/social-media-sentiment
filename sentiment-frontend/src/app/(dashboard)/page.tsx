import { Users } from "lucide-react";

import { GaugeChart } from '@/components/charts/GaugeChart';
import { RealtimeLineChart } from '@/components/charts/RealtimeLineChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRealtimeTrends, useDashboardAnalytics } from '@/lib/api/hooks';

export default function DashboardOverviewPage() {
  const { data: realtimeTrendsData, isLoading: isLoadingTrends, isError: isErrorTrends } = useRealtimeTrends('1h');
  const { data: dashboardAnalyticsData, isLoading: isLoadingAnalytics, isError: isErrorAnalytics } = useDashboardAnalytics('24h');

  if (isLoadingTrends || isLoadingAnalytics) {
    return <div>Loading dashboard...</div>;
  }

  if (isErrorTrends || isErrorAnalytics) {
    return <div>Error loading dashboard data.</div>;
  }

  const sentimentTrendData = realtimeTrendsData?.trends.map(trend => ({
    date: realtimeTrendsData.generatedAt, // Use generatedAt as a placeholder for time
    sentimentScore: trend.avgSentimentScore,
  })) || [];

  const overallSentimentScore = dashboardAnalyticsData?.sentimentDistribution.positive ?
    (dashboardAnalyticsData.sentimentDistribution.positive - dashboardAnalyticsData.sentimentDistribution.negative + 1) / 2 : 0.5;

  const processingRate = dashboardAnalyticsData?.summary.avgProcessingTime ?
    (1 / parseFloat(dashboardAnalyticsData.summary.avgProcessingTime?.split(':')[2] || '1')) * 1000 : 0; // posts per second

  const gaugeData = [
    {
      name: "Overall Sentiment",
      value: overallSentimentScore * 100,
      unit: "%",
    },
    {
      name: "Processing Rate",
      value: processingRate,
      unit: "posts/s",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Overall Sentiment Trend</CardTitle>
          <CardDescription>Real-time sentiment trends over time</CardDescription>
        </CardHeader>
        <CardContent>
          <RealtimeLineChart
            initialData={sentimentTrendData}
            title="Overall Sentiment Trend"
            description="Real-time sentiment trends over time"
            socketEvent="sentimentTrendUpdate"
          />
        </CardContent>
      </Card>
      {gaugeData[0] && (
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Current Sentiment Score</CardTitle>
            <CardDescription>Overall sentiment score</CardDescription>
          </CardHeader>
          <CardContent>
            <GaugeChart
              initialData={gaugeData[0]}
              title="Current Sentiment Score"
              description="Overall sentiment score"
              socketEvent="sentimentUpdate"
            />
          </CardContent>
        </Card>
      )}
      {gaugeData[1] && (
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Processing Rate</CardTitle>
            <CardDescription>Current data processing rate</CardDescription>
          </CardHeader>
          <CardContent>
            <GaugeChart
              initialData={gaugeData[1]}
              title="Processing Rate"
              description="Current data processing rate"
              socketEvent="processingRateUpdate"
            />
          </CardContent>
        </Card>
      )}
      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts Processed</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dashboardAnalyticsData?.summary.totalPostsProcessed || 0}</div>
          <p className="text-xs text-muted-foreground">
            {dashboardAnalyticsData?.summary.apiRequestsToday || 0} API requests today
          </p>
        </CardContent>
      </Card>
    </div>
  )
}