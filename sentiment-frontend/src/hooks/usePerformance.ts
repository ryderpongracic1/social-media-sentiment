"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";

// Hook for debouncing expensive operations
export const useDebounce = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        return callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
};

// Hook for throttling expensive operations
export const useThrottle = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        const result = callback(...args);
        lastRun.current = Date.now();
        return result;
      }
      return undefined as unknown as ReturnType<T>;
    }) as T,
    [callback, delay]
  );
};

// Hook for memoizing expensive calculations
export const useExpensiveCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(() => {
    const start = performance.now();
    const result = calculation();
    const end = performance.now();
    
    if (process.env.NODE_ENV === "development") {
      console.log(`Expensive calculation took ${end - start} milliseconds`);
    }
    
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculation, ...dependencies]);
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
};

// Hook for measuring component performance
export const usePerformanceMetrics = (componentName: string) => {
  const renderStart = useRef<number | undefined>(undefined);

  useEffect(() => {
    renderStart.current = performance.now();
  });

  useEffect(() => {
    if (renderStart.current) {
      const renderTime = performance.now() - renderStart.current;
      if (process.env.NODE_ENV === "development") {
        console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  const measureOperation = useCallback((operationName: string, operation: () => void) => {
    const start = performance.now();
    operation();
    const end = performance.now();
    
    if (process.env.NODE_ENV === "development") {
      console.log(`${componentName} - ${operationName}: ${(end - start).toFixed(2)}ms`);
    }
  }, [componentName]);

  return { measureOperation };
};