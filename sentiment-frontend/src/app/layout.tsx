"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SkipLink } from "@/components/accessibility/SkipLink";
import { Header } from "@/components/layout/header";
import { Sidebar, sidebarNavItems } from "@/components/layout/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";

import "./globals.css";

import { inter } from "./fonts";



type RootLayoutProps = {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#3b82f6" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Sentiment Analysis" />
            <link rel="apple-touch-icon" href="/icon-192x192.png" />
          </head>
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              inter.variable
            )}
          >
        <Providers>
          <SkipLink href="#main-content">Skip to main content</SkipLink>
          <SkipLink href="#navigation">Skip to navigation</SkipLink>
          <div className="flex min-h-screen flex-col">
            <Header setIsSidebarOpen={setIsSidebarOpen} />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
              <nav id="navigation" role="navigation" aria-label="Main navigation">
                <Sidebar
                  items={sidebarNavItems}
                  isOpen={isSidebarOpen}
                  setIsOpen={setIsSidebarOpen}
                />
              </nav>
              <main id="main-content" className="flex w-full flex-col overflow-hidden py-6" role="main" aria-label="Main content">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        </Providers>
        <Toaster />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
