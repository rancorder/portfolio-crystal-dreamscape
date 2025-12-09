// lib/types.ts
export interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn' | 'Qiita';
  tags?: string[];
}

export interface ZennRSSItem {
  title: string;
  link: string;
  pubDate: string;
  'content:encoded'?: string;
  contentSnippet?: string;
  guid?: string;
}

export interface QiitaArticle {
  id: string;
  title: string;
  url: string;
  body: string;
  created_at: string;
  tags: Array<{ name: string }>;
  likes_count?: number;
}

export interface ArticlesResponse {
  success: boolean;
  articles: Article[];
  count: number;
  timestamp: string;
  error?: string;
}
