// app/blog/page.tsx - CORS回避プロキシ版
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn' | 'Qiita' | 'note';
  thumbnail?: string;
}

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Qiita API直接取得
  async function fetchQiita(username: string): Promise<Article[]> {
    try {
      const res = await fetch(`https://qiita.com/api/v2/users/${username}/items?per_page=20`);
      const items = await res.json();
      
      return items.map((item: any, i: number) => ({
        id: `qiita-${i}`,
        title: item.title,
        url: item.url,
        excerpt: (item.body || '').replace(/#/g, '').substring(0, 150) + '...',
        publishedAt: item.created_at,
        platform: 'Qiita' as const,
        thumbnail: item.user?.profile_image_url || undefined,
      }));
    } catch (error) {
      console.error('[Qiita] Error:', error);
      return [];
    }
  }

  // RSS→JSONプロキシ経由取得
  async function fetchViaProxy(rssUrl: string, platform: 'Zenn' | 'note'): Promise<Article[]> {
    try {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      
      const res = await fetch(proxyUrl);
      const data = await res.json();
      
      if (data.status !== 'ok') {
        throw new Error(`RSS2JSON error: ${data.message}`);
      }
      
      return data.items.slice(0, 10).map((item: any, i: number) => {
        const cleanDescription = (item.description || '')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim();
        
        let thumbnail: string | undefined;
        
        if (item.thumbnail) {
          thumbnail = item.thumbnail;
        } else if (item.enclosure?.link) {
          thumbnail = item.enclosure.link;
        } else if (item.content) {
          const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch) {
            thumbnail = imgMatch[1];
          }
        } else if (item.description) {
          const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch) {
            thumbnail = imgMatch[1];
          }
        }
        
        if (platform === 'note' && thumbnail && !thumbnail.startsWith('http')) {
          thumbnail = `https://assets.st-note.com${thumbnail}`;
        }
        
        return {
          id: `${platform.toLowerCase()}-${i}`,
          title: item.title || 'No Title',
          url: item.link || '#',
          excerpt: cleanDescription.substring(0, 150) + (cleanDescription.length > 150 ? '...' : ''),
          publishedAt: item.pubDate || new Date().toISOString(),
          platform,
          thumbnail,
        };
      });
    } catch (error) {
      console.error(`[${platform}] Error:`, error);
      return [];
    }
  }

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('[Client] Fetching articles...');
        
        const fetchers = [
          fetchQiita('rancorder'),
          fetchViaProxy('https://zenn.dev/rancorder/feed', 'Zenn'),
          fetchViaProxy('https://note.com/rancorder/rss', 'note'),
        ];
        
        const results = await Promise.allSettled(fetchers);
        
        const allArticles = results
          .filter((r) => r.status === 'fulfilled')
          .flatMap((r: any) => r.value);
        
        // 日付でソート
        allArticles.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        );
        
        console.log(`[Client] Total articles: ${allArticles.length}`);
        setArticles(allArticles);
        setLoading(false);
      } catch (error) {
        console.error('[Client] Failed to fetch articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)',
    }}>
      {/* ヘッダー */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(26, 11, 46, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(157, 78, 221, 0.2)',
        padding: '1rem 0'
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <Link href="/" style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            H・M Engineering
          </Link>

          <ul style={{
            display: 'flex',
            gap: '2rem',
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/#projects', label: 'Projects' },
              { href: '/services', label: 'Services' },
              { href: '/blog', label: 'Blog' },
              { href: '/contact', label: 'Contact' }
            ].map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    color: item.href === '/blog' ? 'white' : '#c77dff',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: item.href === '/blog' ? 'bold' : '500',
                    transition: 'color 0.3s'
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main style={{ paddingTop: '100px', padding: '100px 2rem 4rem' }}>
        {/* ヒーロー */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          maxWidth: '1000px',
          margin: '0 auto 4rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem'
          }}>
            技術記事
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'rgba(199, 125, 255, 0.9)',
            lineHeight: 1.7
          }}>
            Zenn・Qiita・noteから自動収集<br />
            クライアントサイドで直接取得（CORS回避）
          </p>

          {!loading && articles.length > 0 && (
            <p style={{
              marginTop: '1rem',
              fontSize: '1rem',
              color: 'rgba(199, 125, 255, 0.7)'
            }}>
              全{articles.length}件の記事
            </p>
          )}
        </div>

        {/* 記事一覧 */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div style={{
              textAlign: 'center',
              color: '#c77dff',
              fontSize: '1.2rem',
              padding: '4rem 0'
            }}>
              記事を読み込み中...
            </div>
          ) : articles.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'rgba(199, 125, 255, 0.7)',
              fontSize: '1.1rem',
              padding: '4rem 0'
            }}>
              記事が見つかりませんでした
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))',
              gap: '2rem'
            }}>
              {articles.map((article) => (
                <article
                  key={article.id}
                  style={{
                    background: 'rgba(157, 78, 221, 0.08)',
                    border: '1px solid rgba(157, 78, 221, 0.2)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(157, 78, 221, 0.12)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(157, 78, 221, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <h2 style={{
                    fontSize: '1.3rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '1rem',
                    lineHeight: 1.4
                  }}>
                    {article.title}
                  </h2>

                  <p style={{
                    color: 'rgba(199, 125, 255, 0.8)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginBottom: '1.5rem'
                  }}>
                    {article.excerpt}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <span style={{
                      fontSize: '0.8rem',
                      background:
                        article.platform === 'Zenn'
                          ? 'rgba(59, 130, 246, 0.3)'
                          : article.platform === 'Qiita'
                          ? 'rgba(16, 185, 129, 0.3)'
                          : 'rgba(168, 85, 247, 0.3)',
                      color: 'white',
                      padding: '0.35rem 0.9rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500'
                    }}>
                      {article.platform}
                    </span>

                    <span style={{
                      fontSize: '0.85rem',
                      color: 'rgba(199, 125, 255, 0.7)'
                    }}>
                      {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </div>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#9d4edd',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    記事を読む
                    <span style={{ fontSize: '1.1rem' }}>→</span>
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* フッター */}
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(157, 78, 221, 0.2)',
        color: 'rgba(199, 125, 255, 0.7)',
        marginTop: '6rem'
      }}>
        <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          © 2025 H・M Engineering
        </p>
        <p style={{ fontSize: '0.9rem' }}>
          製造業PM × フルスタック実装力
        </p>
      </footer>
    </div>
  );
}
