"use client";

import { Suspense, lazy } from "react";

import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load chart components for better performance
export const LazyBarChart = lazy(() => 
  import("./BarChart").then(module => ({ default: module.SentimentBarChart }))
);

export const LazyGaugeChart = lazy(() =>
  import("./GaugeChart").then(module => ({ default: module.GaugeChart }))
);

export const LazyWordCloudChart = lazy(() => 
  import("./WordCloudChart").then(module => ({ default: module.WordCloudChart }))
);

export const LazyRealtimeLineChart = lazy(() => 
  import("./RealtimeLineChart").then(module => ({ default: module.RealtimeLineChart }))
);

export const LazyHeatmapChart = lazy(() => 
  import("./HeatmapChart").then(module => ({ default: module.HeatmapChart }))
);

// Chart wrapper with suspense
type ChartWrapperProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const ChartWrapper = ({ children, fallback }: ChartWrapperProps) => (
  <Suspense fallback={fallback || <LoadingSpinner />}>
    {children}
  </Suspense>
);

// Performance optimized chart container
type OptimizedChartProps = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export const OptimizedChart = ({ children, className, ...props }: OptimizedChartProps) => {
  return (
    <div 
      className={`relative min-h-[300px] ${className || ""}`}
      style={{ containIntrinsicSize: "300px" }}
      {...props}
    >
      <ChartWrapper>
        {children}
      </ChartWrapper>
    </div>
  );
};