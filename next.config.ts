import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  esModule: false,
  
  // Add experimental features for better API caching
  experimental: {
    // This helps with API route caching
    staleTimes: {
      dynamic: 30, // Cache dynamic routes for 30 seconds
      static: 180, // Cache static routes for 180 seconds
    },
  },
  
  // Configure headers for API routes to enable caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },
};

export default nextConfig;