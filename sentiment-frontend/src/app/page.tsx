"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-4xl mx-auto"
      >
        {/* Hero Section */}
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white"
          >
            Social Media{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sentiment Analysis
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Analyze social media sentiment in real-time with advanced AI-powered insights
          </motion.p>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mt-12"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">Real-time Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor sentiment across multiple social media platforms in real-time
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-600">AI-Powered Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced machine learning algorithms provide accurate sentiment classification
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-green-600">Trend Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Identify emerging trends and patterns in social media conversations
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/auth/login">
              Get Started
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
            <Link href="/api/health">
              Health Check
            </Link>
          </Button>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>✅ Application is running and ready for deployment</p>
          <p className="mt-1">Version: 1.0.0 | Environment: {process.env.NODE_ENV || 'development'}</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
