import type { NextConfig } from "next";

// Check if we're building for Azure Static Web Apps
const isAzureStaticWebApps = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Static export configuration for Azure Static Web Apps
  ...(isAzureStaticWebApps && { output: 'export' }),
  
  // Disable features incompatible with static export
  trailingSlash: true,
  
  // Image optimization for static export
  images: {
    unoptimized: isAzureStaticWebApps,
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    ...(isAzureStaticWebApps && {
      loader: 'custom',
      loaderFile: './src/lib/imageLoader.ts'
    })
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://sentiment-analysis-api-1.azurewebsites.net',
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // TypeScript config
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint config - be more lenient during build to prevent failures
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@tremor/react",
      "framer-motion",
      "recharts"
    ],
  },

  // Compression
  compress: true,

  // Only add headers for non-static builds
  ...(!isAzureStaticWebApps && {
    async headers() {
      return [
        {
          source: "/(.*)",
          headers: [
            {
              key: "X-Frame-Options",
              value: "DENY",
            },
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        },
      ];
    },
  }),

  // Webpack customization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size for production
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: "vendor",
              chunks: "all",
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: "common",
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
            },
            react: {
              name: "react",
              chunks: "all",
              test: /[\\\/]node_modules[\\\/](react|react-dom)[\\\/]/,
              priority: 30,
            },
            charts: {
              name: "charts",
              chunks: "all",
              test: /[\/]node_modules[\/](recharts|d3|@tremor\/react)[\/]/,
              priority: 25,
            },
          },
        },
        // Tree shaking optimization
        usedExports: true,
        sideEffects: false,
      };
    }

    return config;
  },
};

export default nextConfig;