// app/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'H・M Engineering | 製造業PM × フルスタック実装力',
  description: '54ECサイトを24時間監視、月間10万件処理。17年のPM経験とフルスタック実装力で、エンタープライズ顧客の課題を解決。',
  keywords: ['プロダクトマネージャー', 'フルスタック', 'スクレイピング', 'QA自動化', 'BtoB', 'PM支援', 'Next.js', 'TypeScript'],
  authors: [{ name: 'H・M Engineering' }],
  creator: 'H・M Engineering',
  publisher: 'H・M Engineering',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://portfolio-crystal-dreamscape.vercel.app',
    siteName: 'H・M Engineering',
    title: 'H・M Engineering | 製造業PM × フルスタック実装力',
    description: '54ECサイトを24時間監視、月間10万件処理。17年のPM経験とフルスタック実装力で課題を解決。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'H・M Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'H・M Engineering | 製造業PM × フルスタック実装力',
    description: '54ECサイトを24時間監視、月間10万件処理。',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: '#9d4edd',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#9d4edd" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#1a0b2e',
        color: '#ffffff',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}>
        {children}
      </body>
    </html>
  );
}
