// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crystal Dreamscape - Next.js Portfolio',
  description: 'プロデューサーひで×三姉妹 | Next.js実績多数 | Zenn/Qiita自動更新システム',
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
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Josefin+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}
