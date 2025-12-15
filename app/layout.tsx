// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crystal Dreamscape - Next.js Portfolio',
  description: 'プロデューサー　rancorder | Next.js実績多数 | Zenn/Qiita/note 自動更新システム',
  keywords: ['Next.js', 'React', 'TypeScript', 'Portfolio', 'Frontend'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Josefin+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
