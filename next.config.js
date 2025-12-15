// next.config.js - Netlify最適化版
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['zenn.dev', 'qiita.com', 'raw.githubusercontent.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Performance
  compress: true,
  poweredByHeader: false,
  
  // TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
