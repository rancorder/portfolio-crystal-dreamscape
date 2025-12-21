// app/api/rss/zenn/route.ts
import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 3600; // 1時間ごとにISR

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn';
  thumbnail?: string;
}

export async function GET() {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL('https://zenn.dev/rancorder/feed');
    
    const articles: Article[] = feed.items.slice(0, 20).map((item, index) => ({
      id: `zenn-${index}`,
      title: item.title || '',
      url: item.link || '',
      excerpt: item.contentSnippet?.slice(0, 150) || '',
      publishedAt: item.pubDate || new Date().toISOString(),
      platform: 'Zenn' as const,
      thumbnail: item.enclosure?.url
    }));

    return NextResponse.json({
      success: true,
      articles,
      count: articles.length
    });
  } catch (error) {
    console.error('Zenn RSS fetch error:', error);
    return NextResponse.json(
      { success: false, articles: [], error: 'Failed to fetch Zenn articles' },
      { status: 500 }
    );
  }
}
