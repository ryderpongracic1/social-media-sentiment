import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/providers";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { Home, LineChart, TrendingUp, Settings, Users, Database, Key, BarChart3 } from "lucide-react";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
              <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                <Sidebar
                  items={[
                    {
                      href: "/dashboard",
                      title: "Dashboard",
                      icon: Home,
                    },
                    {
                      href: "/sentiment",
                      title: "Sentiment Analysis",
                      icon: LineChart,
                    },
                    {
                      href: "/trends",
                      title: "Trend Analysis",
                      icon: TrendingUp,
                    },
                    {
                      href: "/data-sources",
                      title: "Data Sources",
                      icon: Database,
                    },
                    {
                      href: "/users",
                      title: "User Management",
                      icon: Users,
                    },
                    {
                      href: "/settings",
                      title: "System Settings",
                      icon: Settings,
                    },
                    {
                      href: "/api-keys",
                      title: "API Keys",
                      icon: Key,
                    },
                    {
                      href: "/reports",
                      title: "Analytics Reports",
                      icon: BarChart3,
                    },
                  ]}
                />
              </aside>
              <main className="flex w-full flex-col overflow-hidden py-6">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
