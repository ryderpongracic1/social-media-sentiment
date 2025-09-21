"use client";

import { motion } from "framer-motion";
import { Loader2, BarChart3, TrendingUp, MessageSquare } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LoadingStateProps = {
  type?: "spinner" | "skeleton" | "pulse" | "dots";
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
};

export const EnhancedLoading = ({ 
  type = "spinner", 
  size = "md", 
  text, 
  className 
}: LoadingStateProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  if (type === "spinner") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        <Loader2 className={cn("animate-spin", sizeClasses[size])} />
        {text && <span className="text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (type === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-1", className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-2 w-2 bg-primary rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  if (type === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <motion.div
          className={cn("bg-primary rounded-full", sizeClasses[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        {text && <span className="ml-2 text-sm text-muted-foreground">{text}</span>}
      </div>
    );
  }

  // Skeleton loading
  return (
    <div className={cn("space-y-3", className)}>
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      {text && <p className="text-sm text-muted-foreground text-center">{text}</p>}
    </div>
  );
};

// Specialized loading components
export const ChartLoading = ({ title }: { title?: string }) => (
  <Card className="p-6 h-64 flex flex-col items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="mb-4"
    >
      <BarChart3 className="h-8 w-8 text-primary" />
    </motion.div>
    <p className="text-sm text-muted-foreground">
      {title ? `Loading ${title}...` : "Loading chart..."}
    </p>
  </Card>
);

export const DataTableLoading = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}
        className="flex space-x-4"
      >
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="rounded-full bg-muted h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

export const TrendLoading = () => (
  <Card className="p-6 h-48 flex flex-col items-center justify-center">
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className="mb-4"
    >
      <TrendingUp className="h-8 w-8 text-primary" />
    </motion.div>
    <p className="text-sm text-muted-foreground">Analyzing trends...</p>
  </Card>
);

export const PostsLoading = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: i * 0.1 }}
      >
        <Card className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <div className="h-4 bg-muted rounded w-20"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-4/5"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-3 bg-muted rounded w-16"></div>
              <div className="h-3 bg-muted rounded w-12"></div>
            </div>
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
);