"use client";

import { Card, Title, Text } from '@tremor/react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import React, { useRef, useEffect } from 'react';

import type { WordCloudData } from '@/lib/mockData';

type WordCloudChartProps = {
  data: WordCloudData[];
  title: string;
  description: string;
  width?: number;
  height?: number;
}

export const WordCloudChart: React.FC<WordCloudChartProps> = ({
  data,
  title,
  description,
  width = 600,
  height = 400,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) {
return;
}

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const layout = cloud()
      .size([width, height])
      .words(data.map(d => ({ text: d.text, size: d.value })))
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font("Impact")
      .fontSize((d: cloud.Word) => (d.size || 1) / 2) // Scale font size based on value, default to 1 if undefined
      .on("end", draw);

    layout.start();

    function draw(words: cloud.Word[]) {
      svg
        .append("g")
        .attr("transform", `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", (d: cloud.Word) => `${d.size || 1}px`)
        .style("font-family", "Impact")
        .style("fill", (_d: cloud.Word, i: number) => d3.schemeCategory10[i % 10] || '#000000') // Default to black if color is undefined
        .attr("text-anchor", "middle")
        .attr("transform", (d: cloud.Word) => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text((d: cloud.Word) => d.text || ''); // Default to empty string if text is undefined
    }
  }, [data, width, height]);

  return (
    <Card className="w-full h-full">
      <Title>{title}</Title>
      <Text>{description}</Text>
      <div className="mt-6 flex justify-center items-center">
        <svg ref={svgRef} width={width} height={height} />
      </div>
    </Card>
  );
};