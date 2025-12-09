// lib/rss-parser.ts
import Parser from 'rss-parser';
import axios from 'axios';
import { Article, ZennRSSItem, QiitaArticle } from './types';

const parser = new Parser<any, ZennRSSItem>();

/**
 * Zenn記事をRSSから取得
 */
export async function fetchZennArticles(username: string): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(`https://zenn.dev/${username}/feed`);
    
    return feed.items.slice(0, 10).map((item) => {
      const content = item['content:encoded'] || item.contentSnippet || '';
      const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
      
      return {
        id: item.guid || item.link || `zenn-${Date.now()}`,
        title: item.title || 'No Title',
        url: item.link || '#',
        excerpt: cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : ''),
        publishedAt: item.pubDate || new Date().toISOString(),
        platform: 'Zenn' as const,
      };
    });
  } catch (error) {
    console.error('Error fetching Zenn articles:', error);
    return [];
  }
}

/**
 * Qiita記事をAPIから取得
 */
export async function fetchQiitaArticles(username: string): Promise<Article[]> {
  try {
    const response = await axios.get<QiitaArticle[]>(
      `https://qiita.com/api/v2/users/${username}/items`,
      {
        params: { per_page: 10 },
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );
    
    return response.data.map((item) => {
      const cleanBody = item.body
        .replace(/#/g, '')
        .replace(/\n/g, ' ')
        .replace(/```[\s\S]*?```/g, '')
        .trim();
      
      return {
        id: item.id,
        title: item.title,
        url: item.url,
        excerpt: cleanBody.substring(0, 150) + (cleanBody.length > 150 ? '...' : ''),
        publishedAt: item.created_at,
        platform: 'Qiita' as const,
        tags: item.tags.map(tag => tag.name),
      };
    });
  } catch (error) {
    console.error('Error fetching Qiita articles:', error);
    return [];
  }
}

/**
 * Zenn + Qiita記事を統合取得
 */
export async function fetchAllArticles(
  zennUsername: string,
  qiitaUsername: string
): Promise<Article[]> {
  try {
    const [zennArticles, qiitaArticles] = await Promise.all([
      fetchZennArticles(zennUsername),
      fetchQiitaArticles(qiitaUsername),
    ]);
    
    const allArticles = [...zennArticles, ...qiitaArticles];
    
    // 日付順にソート（新しい順）
    return allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
}
