// next.config.js - Netlify最適化版
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Netlify用の設定
  // output: 'standalone' は使わない（Netlify Functionsと競合）
  
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
};

module.exports = nextConfig;
