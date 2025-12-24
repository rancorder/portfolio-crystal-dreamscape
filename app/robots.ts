// app/robots.ts - SEO完全対応版
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/static/', '/_next/image/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [],
      },
    ],
    sitemap: 'https://portfolio-crystal-dreamscape.vercel.app/sitemap.xml',
    host: 'https://portfolio-crystal-dreamscape.vercel.app',
  }
}
