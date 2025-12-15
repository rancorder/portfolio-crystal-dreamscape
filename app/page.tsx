// app/page.tsx - GitHub + note 対応版（クライアント取得）
'use client';

import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn' | 'Qiita' | 'GitHub' | 'note';
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // 🌸 Canvas桜吹雪エフェクト（既存コードと同じ - 省略）
  useEffect(() => {
    const canvas = document.getElementById('canvas-sakura') as HTMLCanvasElement;
    if (!canvas) return;
    // ... 既存の桜エフェクトコード ...
  }, []);

  // 記事取得（GitHub + note追加版）
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('[Client] Fetching from all platforms...');
        
        const fetchers = [
          fetchZenn('supermassu'),
          fetchQiita('rancorder'),
          fetchGitHub('rancorder'), // ← GitHub追加
          fetchNote('rancorder'), // ← note追加（あなたのnoteユーザー名に変更）
        ];
        
        const results = await Promise.allSettled(fetchers);
        
        const all = results
          .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === 'fulfilled')
          .flatMap(r => r.value);
        
        // 日付順ソート
        const sorted = all.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        console.log(`[Client] Loaded ${sorted.length} items`);
        setArticles(sorted);
        setLoading(false);
      } catch (error) {
        console.error('[Client] Error:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Zenn取得
  async function fetchZenn(username: string): Promise<Article[]> {
    try {
      const res = await fetch(`https://zenn.dev/${username}/feed`);
      const xml = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(xml, 'text/xml');
      const items = doc.querySelectorAll('item');
      
      return Array.from(items).slice(0, 10).map((item, i) => ({
        id: `zenn-${i}`,
        title: item.querySelector('title')?.textContent || 'No Title',
        url: item.querySelector('link')?.textContent || '#',
        excerpt: (item.querySelector('description')?.textContent || '').substring(0, 150) + '...',
        publishedAt: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
        platform: 'Zenn' as const,
      }));
    } catch (error) {
      console.error('[Zenn] Error:', error);
      return [];
    }
  }

  // Qiita取得
  async function fetchQiita(username: string): Promise<Article[]> {
    try {
      const res = await fetch(`https://qiita.com/api/v2/users/${username}/items?per_page=10`);
      const data = await res.json();
      
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        excerpt: item.body.substring(0, 150) + '...',
        publishedAt: item.created_at,
        platform: 'Qiita' as const,
      }));
    } catch (error) {
      console.error('[Qiita] Error:', error);
      return [];
    }
  }

  // GitHub Activity取得
  async function fetchGitHub(username: string): Promise<Article[]> {
    try {
      const res = await fetch(`https://api.github.com/users/${username}/events/public`);
      const events = await res.json();
      
      return events.slice(0, 10).map((event: any) => {
        let title = '';
        let excerpt = '';
        
        switch (event.type) {
          case 'PushEvent':
            const commits = event.payload.commits?.length || 0;
            title = `📝 ${commits} commits to ${event.repo.name.split('/')[1]}`;
            excerpt = event.payload.commits?.[0]?.message || 'Code update';
            break;
          case 'CreateEvent':
            title = `🎉 Created ${event.payload.ref_type}: ${event.repo.name}`;
            excerpt = 'New repository or branch';
            break;
          case 'PullRequestEvent':
            title = `🔀 ${event.payload.pull_request.title}`;
            excerpt = 'Pull request';
            break;
          case 'WatchEvent':
            title = `⭐ Starred ${event.repo.name}`;
            excerpt = 'Repository starred';
            break;
          default:
            title = `${event.type.replace('Event', '')} on ${event.repo.name}`;
            excerpt = 'GitHub activity';
        }
        
        return {
          id: event.id,
          title,
          url: `https://github.com/${event.repo.name}`,
          excerpt: excerpt.substring(0, 150),
          publishedAt: event.created_at,
          platform: 'GitHub' as const,
        };
      });
    } catch (error) {
      console.error('[GitHub] Error:', error);
      return [];
    }
  }

  // note取得
  async function fetchNote(username: string): Promise<Article[]> {
    try {
      const res = await fetch(`https://note.com/${username}/rss`);
      const xml = await res.text();
      
      // XMLをパース
      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      
      return items.slice(0, 10).map((item: string, i: number) => {
        const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || 'No Title';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '#';
        const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString();
        const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || '';
        
        const cleanDesc = description.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        
        return {
          id: `note-${i}`,
          title,
          url: link,
          excerpt: cleanDesc.substring(0, 150) + (cleanDesc.length > 150 ? '...' : ''),
          publishedAt: pubDate,
          platform: 'note' as const,
        };
      });
    } catch (error) {
      console.error('[note] Error:', error);
      return [];
    }
  }

  // プラットフォーム別のカラー
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Zenn': return 'linear-gradient(135deg, #3EA8FF, #50C0FF)';
      case 'Qiita': return 'linear-gradient(135deg, #55C500, #7AD929)';
      case 'GitHub': return 'linear-gradient(135deg, #6E40C9, #8B5CF6)';
      case 'note': return 'linear-gradient(135deg, #41C9B4, #5DD9C6)';
      default: return 'linear-gradient(135deg, var(--primary-pink), var(--primary-purple))';
    }
  };

  return (
    <>
      <style jsx global>{`
        /* 既存のスタイル（省略） */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        :root {
          --primary-pink: #FFB7D5;
          --primary-purple: #C9A0DC;
          --primary-blue: #A5D8FF;
          --text-light: #FFFFFF;
          --glass-bg: rgba(255, 255, 255, 0.12);
          --glass-border: rgba(255, 255, 255, 0.25);
        }

        body {
          font-family: 'Josefin Sans', sans-serif;
          background: linear-gradient(135deg, #3D2B5C 0%, #4A3368 20%, #5C4A7A 40%, #4A3368 60%, #3D2B5C 80%, #2E1F47 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          color: var(--text-light);
          overflow-x: hidden;
          line-height: 1.6;
          min-height: 100vh;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px) saturate(150%);
          border: 1.5px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 3;
        }

        .blog-section {
          padding: 8rem 2rem;
          position: relative;
          z-index: 3;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple), var(--primary-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 8px rgba(255, 183, 213, 0.5));
        }

        .section-subtitle {
          text-align: center;
          opacity: 0.85;
          margin-bottom: 4rem;
          font-size: 1.1rem;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2.5rem;
          margin-top: 4rem;
        }

        .article-card {
          padding: 2.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .article-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(255, 183, 213, 0.5);
        }

        .article-platform {
          display: inline-block;
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .article-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--primary-pink);
          line-height: 1.4;
        }

        .article-excerpt {
          font-size: 0.95rem;
          opacity: 0.85;
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .article-date {
          font-size: 0.85rem;
          opacity: 0.7;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--primary-pink);
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .articles-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <canvas id="canvas-sakura"></canvas>

      <main>
        <section className="blog-section">
          <div className="container">
            <h2 className="section-title">Latest Activities</h2>
            <p className="section-subtitle">
              Zenn・Qiita・GitHub・note から自動取得
            </p>
            
            {loading ? (
              <div className="loading">読み込み中...</div>
            ) : (
              <div className="articles-grid">
                {articles.map(article => (
                  <div 
                    key={article.id} 
                    className="article-card glass"
                    onClick={() => window.open(article.url, '_blank')}
                  >
                    <span 
                      className="article-platform" 
                      style={{ background: getPlatformColor(article.platform) }}
                    >
                      {article.platform}
                    </span>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <p className="article-date">
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
