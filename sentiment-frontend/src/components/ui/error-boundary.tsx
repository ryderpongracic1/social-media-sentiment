"use client";

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
};

type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  retry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} retry={this.retry} />;
      }

      return <DefaultErrorFallback error={this.state.error!} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
type ErrorFallbackProps = {
  error: Error;
  retry: () => void;
};

export const DefaultErrorFallback = ({ error, retry }: ErrorFallbackProps) => {
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center"
          >
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              We encountered an unexpected error. Please try again or return to the homepage.
            </p>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm font-medium">
                  Error details (development only)
                </summary>
                <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </details>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={retry} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={goHome} size="sm">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </motion.div>
      </Card>
    </div>
  );
};

// Specialized error boundaries
export const ChartErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    fallback={({ retry }) => (
      <Card className="p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <h3 className="font-semibold mb-2">Chart Error</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Unable to load chart data. Please try again.
        </p>
        <Button onClick={retry} size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Card>
    )}
  >
    {children}
  </ErrorBoundary>
);

export const DataErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary
    fallback={({ retry }) => (
      <div className="text-center p-4">
        <AlertTriangle className="h-6 w-6 text-destructive mx-auto mb-2" />
        <p className="text-sm text-muted-foreground mb-2">Failed to load data</p>
        <Button onClick={retry} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    )}
  >
    {children}
  </ErrorBoundary>
);