"use client";

import { Card, Title, Text } from '@tremor/react';
import { DonutChart } from '@tremor/react'; // Tremor uses DonutChart for gauge-like visualizations
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { webSocketService } from '@/lib/websocket/service';

type GaugeChartProps = {
  initialData: { name: string; value: number; unit: string; };
  title: string;
  description: string;
  socketEvent: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ initialData, title, description, socketEvent }) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    webSocketService.connect();
    webSocketService.on(socketEvent, (newData: { name: string; value: number; unit: string; }) => {
      setData(newData);
    });

    return () => {
      webSocketService.off(socketEvent);
    };
  }, [socketEvent]);

  return (
    <Card className="w-full h-full flex flex-col items-center justify-center">
      <Title>{title}</Title>
      <Text>{description}</Text>
      <motion.div
        key={data.value} // Animate on data change
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DonutChart
          data={[{ name: data.name, value: data.value }]}
          category="value"
          index="name"
          valueFormatter={(value: number) => `${(value * 100).toFixed(0)}%`}
          variant="donut"
          className="w-32 h-32"
          colors={['blue']}
        />
      </motion.div>
      <Text className="mt-2 text-tremor-metric font-semibold">
        {data.value.toFixed(2)} {data.unit}
      </Text>
    </Card>
  );
};