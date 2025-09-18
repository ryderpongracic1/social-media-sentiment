"use client";

import { BarChart, Card, Title, Text } from '@tremor/react';
import React from 'react';

import type { PlatformSentimentData } from '@/lib/mockData';

type BarChartProps = {
  data: PlatformSentimentData[];
  title: string;
  description: string;
}

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

export const SentimentBarChart: React.FC<BarChartProps> = ({ data, title, description }) => {
  return (
    <Card className="w-full h-full">
      <Title>{title}</Title>
      <Text>{description}</Text>
      <BarChart
        className="mt-6"
        data={data}
        index="platform"
        categories={['positive', 'negative', 'neutral']}
        colors={['emerald', 'rose', 'amber']}
        valueFormatter={valueFormatter}
        yAxisWidth={40}
      />
    </Card>
  );
};