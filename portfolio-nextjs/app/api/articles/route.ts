// app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/rss-parser';
import { ArticlesResponse } from '@/lib/types';

// ISR: 1時間ごとに自動再検証
export const revalidate = 3600;

// Edge Runtime for better performance
export const runtime = 'nodejs';

/**
 * GET /api/articles
 * Zenn/Qiita記事取得API
 */
export async function GET() {
  try {
    console.log('[API] Fetching articles...');
    
    const articles = await fetchAllArticles('supermassu', 'rancorder');
    
    const response: ArticlesResponse = {
      success: true,
      articles,
      count: articles.length,
      timestamp: new Date().toISOString(),
    };
    
    console.log(`[API] Successfully fetched ${articles.length} articles`);
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('[API] Error:', error);
    
    const errorResponse: ArticlesResponse = {
      success: false,
      articles: [],
      count: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Failed to fetch articles',
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }
}

/**
 * OPTIONS /api/articles
 * CORS Preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
