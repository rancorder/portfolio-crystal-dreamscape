// lib/analytics.ts
/**
 * Google Analytics 4 イベント追跡ユーティリティ
 */

// GA4が読み込まれているか確認
export const GA_TRACKING_ID = 'G-74PCYJ4PPZ'

// イベント送信関数
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// ページビュー追跡（Next.js App Router用）
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// よく使うイベントのショートカット
export const analytics = {
  // ブログ記事クリック
  clickBlogPost: (title: string, url: string) => {
    event({
      action: 'click_blog_post',
      category: 'engagement',
      label: `${title} - ${url}`,
    })
  },

  // 外部リンククリック
  clickExternalLink: (url: string) => {
    event({
      action: 'click_external_link',
      category: 'outbound',
      label: url,
    })
  },

  // GitHub リンククリック
  clickGitHub: () => {
    event({
      action: 'click_github',
      category: 'social',
      label: 'GitHub Profile',
    })
  },

  // スクロール深度（25%, 50%, 75%, 100%）
  scrollDepth: (percentage: number) => {
    event({
      action: 'scroll_depth',
      category: 'engagement',
      label: `${percentage}%`,
      value: percentage,
    })
  },

  // ページ滞在時間（離脱時）
  timeOnPage: (seconds: number) => {
    event({
      action: 'time_on_page',
      category: 'engagement',
      value: seconds,
    })
  },

  // カテゴリフィルタークリック
  filterCategory: (category: string) => {
    event({
      action: 'filter_category',
      category: 'interaction',
      label: category,
    })
  },

  // 検索実行
  search: (query: string) => {
    event({
      action: 'search',
      category: 'engagement',
      label: query,
    })
  },
}

// TypeScript型定義
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
    dataLayer: any[]
  }
}
