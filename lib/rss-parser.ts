// lib/rss-parser.ts - エラーハンドリング強化版
import Parser from 'rss-parser';
import axios from 'axios';
import { Article, ZennRSSItem, QiitaArticle } from './types';

const parser = new Parser<any, ZennRSSItem>();

/**
 * Zenn記事をRSSから取得（エラーハンドリング強化）
 */
export async function fetchZennArticles(username: string): Promise<Article[]> {
  try {
    console.log(`[Zenn] Fetching RSS for user: ${username}`);
    const startTime = Date.now();
    
    const feed = await parser.parseURL(`https://zenn.dev/${username}/feed`);
    
    const duration = Date.now() - startTime;
    console.log(`[Zenn] RSS parsed in ${duration}ms, found ${feed.items.length} items`);
    
    if (!feed.items || feed.items.length === 0) {
      console.warn('[Zenn] No items found in RSS feed');
      return [];
    }
    
    const articles = feed.items.slice(0, 10).map((item, index) => {
      const content = item['content:encoded'] || item.contentSnippet || '';
      const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim();
      
      return {
        id: item.guid || item.link || `zenn-${Date.now()}-${index}`,
        title: item.title || 'No Title',
        url: item.link || '#',
        excerpt: cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : ''),
        publishedAt: item.pubDate || new Date().toISOString(),
        platform: 'Zenn' as const,
      };
    });
    
    console.log(`[Zenn] Successfully processed ${articles.length} articles`);
    return articles;
    
  } catch (error) {
    console.error('[Zenn] Error fetching articles:');
    console.error('  Error type:', error instanceof Error ? error.name : typeof error);
    console.error('  Error message:', error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.error('  Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      });
    }
    
    return [];
  }
}

/**
 * Qiita記事をAPIから取得（エラーハンドリング強化）
 */
export async function fetchQiitaArticles(username: string): Promise<Article[]> {
  try {
    console.log(`[Qiita] Fetching articles for user: ${username}`);
    const startTime = Date.now();
    
    const response = await axios.get<QiitaArticle[]>(
      `https://qiita.com/api/v2/users/${username}/items`,
      {
        params: { per_page: 10 },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Next.js Portfolio App',
        },
        timeout: 15000, // 15秒に延長
        validateStatus: (status) => status === 200,
      }
    );
    
    const duration = Date.now() - startTime;
    console.log(`[Qiita] API responded in ${duration}ms, found ${response.data.length} items`);
    
    if (!response.data || response.data.length === 0) {
      console.warn('[Qiita] No items found in API response');
      return [];
    }
    
    const articles = response.data.map((item) => {
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
    
    console.log(`[Qiita] Successfully processed ${articles.length} articles`);
    return articles;
    
  } catch (error) {
    console.error('[Qiita] Error fetching articles:');
    console.error('  Error type:', error instanceof Error ? error.name : typeof error);
    console.error('  Error message:', error instanceof Error ? error.message : String(error));
    
    if (axios.isAxiosError(error)) {
      console.error('  Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        timeout: error.code === 'ECONNABORTED',
      });
    }
    
    return [];
  }
}

/**
 * Zenn + Qiita記事を統合取得（並列処理 + フォールバック）
 */
export async function fetchAllArticles(
  zennUsername: string,
  qiitaUsername: string
): Promise<Article[]> {
  try {
    console.log('=== fetchAllArticles Start ===');
    console.log(`Zenn: ${zennUsername}, Qiita: ${qiitaUsername}`);
    
    // 並列取得（片方失敗しても継続）
    const results = await Promise.allSettled([
      fetchZennArticles(zennUsername),
      fetchQiitaArticles(qiitaUsername),
    ]);
    
    const zennArticles = results[0].status === 'fulfilled' ? results[0].value : [];
    const qiitaArticles = results[1].status === 'fulfilled' ? results[1].value : [];
    
    if (results[0].status === 'rejected') {
      console.error('[Zenn] Promise rejected:', results[0].reason);
    }
    if (results[1].status === 'rejected') {
      console.error('[Qiita] Promise rejected:', results[1].reason);
    }
    
    const allArticles = [...zennArticles, ...qiitaArticles];
    
    console.log(`=== fetchAllArticles Complete ===`);
    console.log(`Total: ${allArticles.length} (Zenn: ${zennArticles.length}, Qiita: ${qiitaArticles.length})`);
    
    // 日付順にソート（新しい順）
    return allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    console.error('=== fetchAllArticles Fatal Error ===');
    console.error('Error:', error);
    
    // 致命的エラーでも空配列を返す
    return [];
  }
}
