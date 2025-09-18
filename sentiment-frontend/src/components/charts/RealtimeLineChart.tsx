"use client";

import { LineChart, Card, Title, Text } from '@tremor/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { webSocketService } from '@/lib/websocket/service';

type RealtimeLineChartProps = {
  initialData: Array<{ date: string; sentimentScore: number; }>;
  title: string;
  description: string;
  socketEvent: string;
}

const valueFormatter = (number: number) =>
  `${Intl.NumberFormat('us').format(number).toString()}`;

export const RealtimeLineChart: React.FC<RealtimeLineChartProps> = ({ initialData, title, description, socketEvent }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    webSocketService.connect();
    webSocketService.on(socketEvent, (newData: Array<{ date: string; sentimentScore: number; }>) => {
      setData(newData);
    });

    return () => {
      webSocketService.off(socketEvent);
    };
  }, [socketEvent]);

  return (
    <Card className="w-full h-full">
      <Title>{title}</Title>
      <Text>{description}</Text>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <LineChart
          className="mt-6"
          data={data}
          index="date"
          categories={['sentimentScore']}
          colors={['blue', 'emerald', 'rose', 'amber']}
          valueFormatter={valueFormatter}
          yAxisWidth={40}
          connectNulls={true}
        />
      </motion.div>
    </Card>
  );
};