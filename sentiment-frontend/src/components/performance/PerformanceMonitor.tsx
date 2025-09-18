"use client";

import { useEffect } from "react";

type PerformanceMetrics = {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
};

export const PerformanceMonitor = () => {
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const metrics: PerformanceMetrics = {};

      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case "paint":
            if (entry.name === "first-contentful-paint") {
              metrics.fcp = entry.startTime;
            }
            break;
          case "largest-contentful-paint":
            metrics.lcp = entry.startTime;
            break;
          case "first-input":
            metrics.fid = (entry as any).processingStart - entry.startTime;
            break;
          case "layout-shift":
            if (!(entry as any).hadRecentInput) {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
            }
            break;
          case "navigation":
            metrics.ttfb = (entry as PerformanceNavigationTiming).responseStart;
            break;
        }
      }

      // Send metrics to analytics service
      if (process.env.NODE_ENV === "production") {
        // In production, send to your analytics service
        console.log("Performance Metrics:", metrics);
      }
    });

    // Observe different performance entry types
    try {
      observer.observe({ entryTypes: ["paint", "largest-contentful-paint", "first-input", "layout-shift", "navigation"] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      observer.observe({ entryTypes: ["paint", "navigation"] });
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

// Web Vitals reporting function
export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === "production") {
    // Send to analytics service
    console.log("Web Vital:", metric);
  }
};