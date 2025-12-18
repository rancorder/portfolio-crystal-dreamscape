// app/layout.tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Art Studio - プロが教えるAI画像生成の極意 | 広島発',
  description: 'AI画像生成のプロ集団が運営。Midjourney、Stable Diffusion、DALL-Eの実践テクニック、プロンプト作成の秘訣、企業導入事例を完全公開。月間3万人が学ぶAI画像生成の総合メディア。',
  keywords: 'AI画像生成,Midjourney,Stable Diffusion,プロンプト,AI Art,画像生成AI,広島,AIコンサル,レイナ,ひで',
  authors: [{ name: 'AI Art Studio Team' }],
  
  openGraph: {
    title: 'AI Art Studio - AI画像生成の総合メディア',
    description: 'プロが教えるAI画像生成テクニック完全ガイド',
    url: 'https://portfolio-crystal-dreamscape.vercel.app/',
    siteName: 'AI Art Studio',
    images: [{
      url: 'https://portfolio-crystal-dreamscape.vercel.app/og-image.png',
      width: 1200,
      height: 630,
      alt: 'AI Art Studio - AI画像生成の総合メディア',
    }],
    locale: 'ja_JP',
    type: 'website',
  },
  
  twitter: {
    card: 'summary_large_image',
    title: 'AI Art Studio - AI画像生成の極意',
    description: 'プロが教える実践テクニック完全ガイド',
    images: ['https://portfolio-crystal-dreamscape.vercel.app/twitter-image.png'],
    creator: '@aiartstudio',
  },
  
  alternates: {
    canonical: 'https://portfolio-crystal-dreamscape.vercel.app/',
  },
  
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
  
  verification: {
    google: 'your-google-verification-code', // Google Search Console検証コード
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
        {/* Google Analytics 4 - 最適化実装 */}
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
        {children}
      </body>
    </html>
  )
}
