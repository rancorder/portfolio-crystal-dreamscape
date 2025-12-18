import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-crystal-dreamscape.vercel.app'),
  
  title: 'AI Art Studio - プロが教えるAI画像生成の極意 | 広島発',
  description: 'AI画像生成のプロ集団が運営。Midjourney、Stable Diffusion、DALL-Eの実践テクニック、プロンプト作成の秘訣、企業導入事例を完全公開。',
  
  keywords: ['AI画像生成', 'Midjourney', 'Stable Diffusion', 'プロンプト', 'Crystal Dreamscape'],
  
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://portfolio-crystal-dreamscape.vercel.app/',
    siteName: 'AI Art Studio',
    title: 'AI Art Studio - AI画像生成の総合メディア',
    description: 'プロが教えるAI画像生成テクニック完全ガイド',
  },
  
  robots: {
    index: true,
    follow: true,
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
