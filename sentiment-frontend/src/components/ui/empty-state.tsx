"use client";

import { motion } from "framer-motion";
import { Search, TrendingUp, MessageSquare, BarChart3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: "search" | "trends" | "posts" | "analytics";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  } | undefined;
  className?: string;
};

const iconMap = {
  search: Search,
  trends: TrendingUp,
  posts: MessageSquare,
  analytics: BarChart3,
};

export const EmptyState = ({
  icon = "search",
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  const Icon = iconMap[icon];

  return (
    <Card className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="rounded-full bg-muted p-4"
        >
          <Icon className="h-8 w-8 text-muted-foreground" />
        </motion.div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </div>
        
        {action && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={action.onClick} variant="outline">
              {action.label}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
};

// Specialized empty states
export const NoPostsFound = ({ onReset }: { onReset?: () => void }) => {
  const action = onReset ? { label: "Reset filters", onClick: onReset } : undefined;
  return (
    <EmptyState
      icon="posts"
      title="No posts found"
      description="We couldn't find any posts matching your criteria. Try adjusting your filters or search terms."
      action={action}
    />
  );
};

export const NoTrendsData = ({ onRefresh }: { onRefresh?: () => void }) => {
  const action = onRefresh ? { label: "Refresh data", onClick: onRefresh } : undefined;
  return (
    <EmptyState
      icon="trends"
      title="No trending data available"
      description="There's no trending data for the selected time period. Try selecting a different time range."
      action={action}
    />
  );
};

export const NoSearchResults = ({ query, onClear }: { query: string; onClear?: () => void }) => {
  const action = onClear ? { label: "Clear search", onClick: onClear } : undefined;
  return (
    <EmptyState
      icon="search"
      title="No results found"
      description={`We couldn't find any results for "${query}". Try different keywords or check your spelling.`}
      action={action}
    />
  );
};

export const NoAnalyticsData = ({ onRefresh }: { onRefresh?: () => void }) => {
  const action = onRefresh ? { label: "Refresh", onClick: onRefresh } : undefined;
  return (
    <EmptyState
      icon="analytics"
      title="No analytics data"
      description="Analytics data is not available for the selected period. Please try a different time range."
      action={action}
    />
  );
};