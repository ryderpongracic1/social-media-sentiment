"use client";

import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import { type DateRange } from 'react-day-picker';

import { PlatformFilter } from '@/components/features/data-filters/platform-filter';
import { SentimentTypeFilter } from '@/components/features/data-filters/sentiment-type-filter';
import { TimeRangeFilter } from '@/components/features/data-filters/time-range-filter';
import { SearchBar } from '@/components/features/search/search-bar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/use-toast';
import { useSocialMediaPosts } from '@/lib/api/hooks';
import { type SocialMediaPost, type PaginatedResponse } from '@/types/api';


const POSTS_PER_PAGE = 10;

export default function PostsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [timeRange, setTimeRange] = useState<DateRange | undefined>(undefined);
  const [sentimentType, setSentimentType] = useState<string>('all');
  const [platform, setPlatform] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();

  const { data, isLoading, isError, error } = useSocialMediaPosts(
    currentPage,
    POSTS_PER_PAGE,
    timeRange?.from ? format(timeRange.from, 'yyyy-MM-dd') : undefined,
    timeRange?.to ? format(timeRange.to, 'yyyy-MM-dd') : undefined,
    sentimentType === 'all' ? undefined : sentimentType,
    platform === 'all' ? undefined : platform,
    searchQuery === '' ? undefined : searchQuery
  ) as { data: PaginatedResponse<SocialMediaPost> | undefined; isLoading: boolean; isError: boolean; error: Error | null };

  const posts = data?.items || [];
  const totalPosts = data?.totalCount || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Error",
        description: `Failed to fetch social media posts: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    }
    // Add a toast for successful actions (example)
    if (!isLoading && !isError && data && currentPage === 1) {
      toast({
        title: "Success",
        description: "Social media posts loaded successfully.",
      });
    }
  }, [isError, error, toast, isLoading, data, currentPage]);

  const handleLoadMore = useCallback(() => {
    if (currentPage < totalPages && !isLoading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [currentPage, totalPages, isLoading]);

  const handleTimeRangeChange = useCallback((range: DateRange | undefined) => {
    setTimeRange(range);
    setCurrentPage(1);
  }, []);

  const handleSentimentChange = useCallback((sentiment: string) => {
    setSentimentType(sentiment);
    setCurrentPage(1);
  }, []);

  const handlePlatformChange = useCallback((platform: string) => {
    setPlatform(platform);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Social Media Posts</CardTitle>
          <CardDescription>View and analyze social media posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <TimeRangeFilter onDateChange={handleTimeRangeChange} />
            <SentimentTypeFilter onSentimentChange={handleSentimentChange} />
            <PlatformFilter onPlatformChange={handlePlatformChange} />
            <SearchBar onSearch={handleSearch} className="flex-grow" />
          </div>
          {isLoading && currentPage === 1 ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size={32} />
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>{post.platform}</CardTitle>
                        <CardDescription>{post.author}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>{post.content}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Sentiment: {post.sentimentType} | Score: {post.sentimentScore?.toFixed(2)} | Date: {new Date(post.timestamp).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && currentPage > 1 && (
                <div className="flex justify-center items-center py-4">
                  <LoadingSpinner size={32} />
                </div>
              )}
              {!isLoading && posts.length > 0 && currentPage < totalPages && (
                <div className="flex justify-center mt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLoadMore}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Load More
                  </motion.button>
                </div>
              )}
              {!isLoading && posts.length === 0 && (
                <p className="text-center text-muted-foreground">No posts found matching your criteria.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}