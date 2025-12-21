// app/blog/page.tsx
import type { Metadata, Viewport } from 'next'
import ArticleGrid from '@/components/ArticleGrid'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'Blog | ひろしまいける Portfolio',
  description: '技術ブログ記事一覧 - Zenn, Qiita, noteの記事を集約',
  openGraph: {
    title: 'Blog | ひろしまいける Portfolio',
    description: '技術ブログ記事一覧',
  },
}

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">
          Tech Blog
        </h1>
        <ArticleGrid />
      </div>
    </main>
  )
}
