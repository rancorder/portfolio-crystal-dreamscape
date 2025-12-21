// app/not-found.tsx
import type { Metadata, Viewport } from 'next'
import Link from 'next/link'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: '404 Not Found | ひろしまいける Portfolio',
  description: 'ページが見つかりません',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">ページが見つかりません</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </main>
  )
}
