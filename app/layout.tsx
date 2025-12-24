// app/layout.tsx - SEO完全対応版
import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-crystal-dreamscape.vercel.app'),
  
  title: {
    default: 'rancorder テック記事 | AI・フロントエンド・スクレイピング',
    template: '%s | rancorder テック記事'
  },
  
  description: 'AI画像生成、プロンプトエンジニアリング、Next.js実装など、実践的な技術記事を自動集積。Zenn・Qiita・noteから最新情報をお届け。',
  
  keywords: [
    'AI', 'AI画像生成', 'Midjourney', 'Stable Diffusion', 
    'プロンプト', 'Next.js', 'React', 'フロントエンド',
    'スクレイピング', 'Python', 'TypeScript'
  ],
  
  authors: [{ name: 'rancorder' }],
  creator: 'rancorder',
  publisher: 'Crystal Studio',
  
  // ★★★ 致命的修正：robots設定 ★★★
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://portfolio-crystal-dreamscape.vercel.app/',
    siteName: 'rancorder テック記事',
    title: 'rancorder テック記事 | AI・フロントエンド技術情報',
    description: 'AI画像生成、プロンプト、Next.js実装の実践記事集',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'rancorder テック記事',
      },
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'rancorder テック記事',
    description: 'AI・フロントエンド・スクレイピング技術情報',
    images: ['/og-image.png'],
  },
  
  alternates: {
    canonical: 'https://portfolio-crystal-dreamscape.vercel.app/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-74PCYJ4PPZ"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-74PCYJ4PPZ', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
