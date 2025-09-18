"use client";

import { Card, Title, Text } from '@tremor/react';
import React from 'react';

import type { HeatmapData } from '@/lib/mockData';

type HeatmapChartProps = {
  data: HeatmapData[];
  title: string;
  description: string;
}

// This is a simplified Heatmap using basic HTML/CSS for demonstration.
// For a more complex and interactive heatmap, D3.js or Observable Plot would be used.
export const HeatmapChart: React.FC<HeatmapChartProps> = ({ data, title, description }) => {
  // Assuming 'x' values are categories (e.g., days) and 'y' values are sub-categories (e.g., hours)
  const xCategories = Array.from(new Set(data.map(d => d.x)));
  const yCategories = Array.from(new Set(data.map(d => d.y)));

  const getCellColor = (value: number) => {
    // Simple color scale from red (low) to green (high)
    const hue = (value * 120).toFixed(0); // 0 (red) to 120 (green)
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Card className="w-full h-full">
      <Title>{title}</Title>
      <Text>{description}</Text>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr>
              <th className="w-24 p-2 text-left text-sm font-medium text-gray-500" />
              {xCategories.map(cat => (
                <th key={cat} className="p-2 text-center text-sm font-medium text-gray-500">{cat}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yCategories.map(yCat => (
              <tr key={yCat}>
                <td className="w-24 p-2 text-left text-sm font-medium text-gray-500">{yCat}</td>
                {xCategories.map(xCat => {
                  const cellData = data.find(d => d.x === xCat && d.y === yCat);
                  const value = cellData ? cellData.value : 0;
                  const backgroundColor = getCellColor(value);
                  return (
                    <td
                      key={`${xCat}-${yCat}`}
                      className="p-2 text-center text-sm text-white"
                      style={{ backgroundColor }}
                    >
                      {cellData ? (value * 100).toFixed(0) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};