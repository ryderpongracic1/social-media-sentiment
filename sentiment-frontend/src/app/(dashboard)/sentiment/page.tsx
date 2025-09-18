import { SentimentBarChart } from '@/components/charts/BarChart';
import { RealtimeLineChart } from '@/components/charts/RealtimeLineChart';
import { WordCloudChart } from '@/components/charts/WordCloudChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPlatformSentimentData, mockSentimentTrendData, mockWordCloudData } from '@/lib/mockData';

export default function SentimentAnalysisPage() {
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl font-bold">Sentiment Analysis</h1>
      <p className="text-muted-foreground">
        Analyze sentiment across your social media data.
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Overall Sentiment</CardTitle>
            <CardDescription>Distribution of positive, negative, and neutral sentiment.</CardDescription>
          </CardHeader>
          <CardContent>
            <SentimentBarChart
              data={mockPlatformSentimentData}
              title="Sentiment Across Platforms"
              description="Comparison of sentiment distribution across different social media platforms."
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sentiment Over Time</CardTitle>
            <CardDescription>How sentiment has evolved over a period.</CardDescription>
          </CardHeader>
          <CardContent>
            <RealtimeLineChart
              initialData={mockSentimentTrendData}
              title="Sentiment Trend Over Time"
              description="Evolution of overall sentiment, positive, negative, and neutral counts."
              socketEvent="sentimentTrendUpdate"
            />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Key Phrases</CardTitle>
            <CardDescription>Most impactful phrases driving sentiment.</CardDescription>
          </CardHeader>
          <CardContent>
            <WordCloudChart
              data={mockWordCloudData}
              title="Prominent Keywords"
              description="Most frequently occurring keywords in social media posts."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}