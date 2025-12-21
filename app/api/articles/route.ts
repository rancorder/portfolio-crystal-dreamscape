// app/api/articles/route.ts
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 3600; // 1時間ごとにISR
export const dynamic = 'force-dynamic'; // キャッシュ無効化

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn' | 'Qiita' | 'note';
  thumbnail?: string;
}

export async function GET() {
  try {
    const parser = new Parser();
    const allArticles: Article[] = [];

    // Zenn記事取得
    try {
      const zennFeed = await parser.parseURL('https://zenn.dev/supermassu/feed');
      const zennArticles = zennFeed.items.slice(0, 20).map((item, index) => ({
        id: `zenn-${index}`,
        title: item.title || '',
        url: item.link || '',
        excerpt: item.contentSnippet?.slice(0, 150) || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        platform: 'Zenn' as const,
        thumbnail: item.enclosure?.url
      }));
      allArticles.push(...zennArticles);
    } catch (error) {
      console.error('Zenn RSS fetch error:', error);
    }

    // Qiita記事取得
    try {
      const qiitaFeed = await parser.parseURL('https://qiita.com/rancorder/feed');
      const qiitaArticles = qiitaFeed.items.slice(0, 20).map((item, index) => ({
        id: `qiita-${index}`,
        title: item.title || '',
        url: item.link || '',
        excerpt: item.contentSnippet?.slice(0, 150) || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        platform: 'Qiita' as const,
        thumbnail: item.enclosure?.url
      }));
      allArticles.push(...qiitaArticles);
    } catch (error) {
      console.error('Qiita RSS fetch error:', error);
    }

    // note記事取得
    try {
      const noteFeed = await parser.parseURL('https://note.com/rancorder/rss');
      const noteArticles = noteFeed.items.slice(0, 20).map((item, index) => ({
        id: `note-${index}`,
        title: item.title || '',
        url: item.link || '',
        excerpt: item.contentSnippet?.slice(0, 150) || '',
        publishedAt: item.pubDate || new Date().toISOString(),
        platform: 'note' as const,
        thumbnail: item.enclosure?.url
      }));
      allArticles.push(...noteArticles);
    } catch (error) {
      console.error('note RSS fetch error:', error);
    }

    // 日付でソート（新しい順）
    allArticles.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      articles: allArticles,
      count: allArticles.length,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
      }
    });

  } catch (error) {
    console.error('Articles API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        articles: [], 
        error: 'Failed to fetch articles',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
