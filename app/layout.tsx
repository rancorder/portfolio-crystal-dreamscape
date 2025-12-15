// app/layout.tsx - SEO完全最適化版
import type { Metadata } from 'next'
import Script from 'next/script'

const siteUrl = 'https://portfolio-crystal-dreamscape.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  
  // 基本メタデータ
  title: {
    default: 'Crystal Dreamscape - Next.js Portfolio',
    template: '%s | Crystal Dreamscape',
  },
  description: 'プロデューサーひで×三姉妹によるNext.js実績多数のポートフォリオ。Zenn/Qiita自動更新システム、季節エフェクト、TypeScript完全型安全実装。フロントエンド開発の技術力を証明。',
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Portfolio',
    'Frontend Developer',
    'Web Developer',
    'フロントエンド開発',
    'ポートフォリオ',
    'Zenn',
    'Qiita',
    'Canvas API',
    '季節エフェクト',
  ],
  authors: [{ name: 'プロデューサーひで', url: siteUrl }],
  creator: 'AI Art Studio - Crystal Team',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: siteUrl,
    siteName: 'Crystal Dreamscape Portfolio',
    title: 'Crystal Dreamscape - Next.js Portfolio',
    description: 'プロデューサーひで×三姉妹によるNext.js実績多数のポートフォリオ。技術力を証明する季節エフェクトとZenn/Qiita自動更新システム。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Crystal Dreamscape Portfolio - Next.js実績',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    site: '@rancorder',
    creator: '@rancorder',
    title: 'Crystal Dreamscape - Next.js Portfolio',
    description: 'プロデューサーひで×三姉妹によるNext.js実績多数のポートフォリオ',
    images: ['/og-image.png'],
  },
  
  // robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // 検証タグ（後で追加）
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  
  // アイコン
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  // その他
  manifest: '/manifest.json',
  alternates: {
    canonical: siteUrl,
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
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Josefin+Sans:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* 構造化データ - Person */}
        <Script
          id="structured-data-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'プロデューサーひで',
              jobTitle: 'Frontend Developer',
              description: 'Next.js, React, TypeScriptを使用したフロントエンド開発者',
              url: siteUrl,
              image: `${siteUrl}/og-image.png`,
              sameAs: [
                'https://github.com/rancorder',
                'https://zenn.dev/supermassu',
                'https://qiita.com/rancorder',
                'https://note.com/rancorder',
              ],
              knowsAbout: [
                'Next.js',
                'React',
                'TypeScript',
                'Frontend Development',
                'Canvas API',
                'Web Animation',
              ],
            }),
          }}
        />
        
        {/* 構造化データ - WebSite */}
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Crystal Dreamscape Portfolio',
              description: 'Next.js実績多数のフロントエンドポートフォリオ',
              url: siteUrl,
              author: {
                '@type': 'Person',
                name: 'プロデューサーひで',
              },
              inLanguage: 'ja-JP',
            }),
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
