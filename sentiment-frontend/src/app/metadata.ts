import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Social Media Sentiment Analysis Platform",
  description: "Enterprise-grade platform for analyzing sentiment across social media platforms with real-time insights and advanced analytics.",
  keywords: ["sentiment analysis", "social media", "analytics", "AI", "machine learning"],
  authors: [{ name: "Social Media Sentiment Analysis Team" }],
  creator: "Social Media Sentiment Analysis Platform",
  publisher: "Social Media Sentiment Analysis Platform",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Social Media Sentiment Analysis Platform",
    description: "Enterprise-grade platform for analyzing sentiment across social media platforms",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Media Sentiment Analysis Platform",
    description: "Enterprise-grade platform for analyzing sentiment across social media platforms",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};