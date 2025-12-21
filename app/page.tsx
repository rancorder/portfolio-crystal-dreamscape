// app/layout.tsx - Google Analytics削除版
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-crystal-dreamscape.vercel.app'),
  
  title: 'rancorder テック記事 | Next.js自動集約ブログ',
  description: 'Zenn・Qiita・noteの技術記事を自動収集。AI、フロントエンド、バックエンド、インフラまで幅広くカバー。Next.js ISR実装のパフォーマンス最適化ポートフォリオ。',
  
  keywords: ['Next.js', 'React', 'TypeScript', 'フロントエンド', 'AI', 'テック記事'],
  
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://portfolio-crystal-dreamscape.vercel.app/',
    siteName: 'rancorder テック記事',
    title: 'rancorder テック記事 | Next.js自動集約ブログ',
    description: 'Zenn・Qiita・noteの技術記事を自動収集するパフォーマンス最適化ポートフォリオ',
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
