import { HeatmapChart } from '@/components/charts/HeatmapChart';
import { RealtimeLineChart } from '@/components/charts/RealtimeLineChart';
import { WordCloudChart } from '@/components/charts/WordCloudChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockWordCloudData, mockSentimentTrendData, mockHeatmapData } from '@/lib/mockData';

export default function TrendAnalysisPage() {
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Trend Analysis</h1>
      <p className="text-muted-foreground">
        Identify and analyze emerging trends in social media data.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Trending Topics</CardTitle>
            <CardDescription>Currently popular topics and keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            <WordCloudChart
              data={mockWordCloudData}
              title="Top Trending Topics"
              description="Currently popular topics and keywords."
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Trend Velocity</CardTitle>
            <CardDescription>Rate of change in topic popularity.</CardDescription>
          </CardHeader>
          <CardContent>
            <RealtimeLineChart
              initialData={mockSentimentTrendData}
              title="Trend Velocity"
              description="Rate of change in topic popularity."
              socketEvent="trendVelocityUpdate"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Geographic Trends</CardTitle>
            <CardDescription>Regional distribution of trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapChart
              data={mockHeatmapData}
              title="Geographic Trends"
              description="Regional distribution of trends."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}