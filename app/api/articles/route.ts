// app/api/articles/route.ts - デバッグ強化版
import { NextResponse } from 'next/server';
import { fetchAllArticles } from '@/lib/rss-parser';
import { ArticlesResponse } from '@/lib/types';

// ISR: 1時間ごとに自動再検証（Netlify対応）
export const revalidate = 3600;

// Netlify Functions 最適化
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * GET /api/articles
 * Zenn/Qiita記事取得API（デバッグ強化版）
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    console.log('=== API Articles Debug Start ===');
    console.log('Request URL:', request.url);
    console.log('Request Headers:', Object.fromEntries(request.headers.entries()));
    
    // 記事取得開始
    console.log('[1/3] Fetching articles from Zenn/Qiita...');
    const articles = await fetchAllArticles('supermassu', 'rancorder');
    
    console.log(`[2/3] Successfully fetched ${articles.length} articles`);
    console.log('[3/3] Articles preview:', articles.slice(0, 2).map(a => ({
      title: a.title.substring(0, 50),
      platform: a.platform,
    })));
    
    const response: ArticlesResponse = {
      success: true,
      articles,
      count: articles.length,
      timestamp: new Date().toISOString(),
    };
    
    const duration = Date.now() - startTime;
    console.log(`=== API Success (${duration}ms) ===`);
    
    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Fetch-Duration': `${duration}ms`,
        'X-Article-Count': `${articles.length}`,
      },
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('=== API Error ===');
    console.error('Error Type:', error instanceof Error ? error.name : typeof error);
    console.error('Error Message:', error instanceof Error ? error.message : String(error));
    console.error('Error Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error(`Duration: ${duration}ms`);
    
    const errorResponse: ArticlesResponse = {
      success: false,
      articles: [],
      count: 0,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
    
    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Error': 'true',
        'X-Fetch-Duration': `${duration}ms`,
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
