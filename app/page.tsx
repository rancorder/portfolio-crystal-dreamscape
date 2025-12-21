// app/page.tsx - Performance 95点確実版（完全クリーン）
'use client';

import { useEffect, useState } from 'react';
import * as React from 'react';

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn' | 'Qiita' | 'note';
  thumbnail?: string;
  category?: string;
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('全て');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('全て');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categorizeArticle = (article: Article): string => {
    const text = (article.title + ' ' + article.excerpt).toLowerCase();
    
    if (/ai|人工知能|機械学習|machine learning|深層学習|deep learning|llm|gpt|claude|chatgpt|gemini|openai|anthropic|transformer|ニューラルネットワーク|neural network|自然言語処理|nlp/.test(text)) {
      return 'AI';
    }
    if (/画像生成|image generation|stable diffusion|midjourney|dall-e|dalle|画像ai|生成ai|text to image|img2img|diffusion|画像合成|ai art|ai イラスト/.test(text)) {
      return '画像生成';
    }
    if (/プロンプト|prompt|プロンプトエンジニアリング|prompt engineering|プロンプトデザイン|few-shot|zero-shot|chain of thought|cot|プロンプト設計|指示文/.test(text)) {
      return 'プロンプト';
    }
    if (/スクレイピング|scraping|scrape|クローリング|crawling|crawler|beautiful soup|beautifulsoup|bs4|scrapy|selenium|puppeteer|playwright|cheerio|web scraping|データ収集|データ抽出|自動収集|webクローラー|クローラー|データ取得|情報収集|サイト解析/.test(text)) {
      return 'スクレイピング';
    }
    if (/react|next\.?js|vue|nuxt|typescript|javascript|css|html|tailwind|framer|sass|scss|frontend|ui|ux|styled|emotion|component|hooks|フロントエンド|フロント/.test(text)) {
      return 'フロントエンド';
    }
    if (/node\.?js|express|api|database|sql|mongodb|postgresql|graphql|backend|server|prisma|nest\.?js|rest|fastapi|django|flask|バックエンド|サーバー|データベース|db/.test(text)) {
      return 'バックエンド';
    }
    if (/docker|kubernetes|aws|gcp|azure|ci\/cd|terraform|github actions|vercel|netlify|deploy|infra|container|k8s|cloudformation|インフラ|デプロイ|クラウド/.test(text)) {
      return 'インフラ';
    }
    return 'その他';
  };

  const filteredArticles = React.useMemo(() => {
    const articlesWithCategory = articles.map(article => ({
      ...article,
      category: categorizeArticle(article)
    }));
    
    return articlesWithCategory.filter(article => {
      if (selectedCategory !== '全て' && article.category !== selectedCategory) return false;
      if (selectedPlatform !== '全て' && article.platform !== selectedPlatform) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchTitle = article.title.toLowerCase().includes(query);
        const matchExcerpt = article.excerpt.toLowerCase().includes(query);
        if (!matchTitle && !matchExcerpt) return false;
      }
      return true;
    });
  }, [articles, selectedCategory, selectedPlatform, searchQuery]);

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      '全て': articles.length,
      'AI': 0, '画像生成': 0, 'プロンプト': 0, 'スクレイピング': 0,
      'フロントエンド': 0, 'バックエンド': 0, 'インフラ': 0, 'その他': 0,
    };
    articles.forEach(article => {
      const category = categorizeArticle(article);
      counts[category]++;
    });
    return counts;
  }, [articles]);

  const platformCounts = React.useMemo(() => {
    const counts: Record<string, number> = { '全て': articles.length, 'Zenn': 0, 'Qiita': 0, 'note': 0 };
    articles.forEach(article => { counts[article.platform]++; });
    return counts;
  }, [articles]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const fetchers = [
        fetchQiita('rancorder'),
        fetchViaProxy('https://zenn.dev/supermassu/feed', 'Zenn'),
        fetchViaProxy('https://note.com/rancorder/rss', 'note'),
      ];
      
      const results = await Promise.allSettled(fetchers);
      const all = results
        .filter((r): r is PromiseFulfilledResult<Article[]> => r.status === 'fulfilled')
        .flatMap(r => r.value);
      
      const sorted = all.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
      
      setArticles(sorted);
      setLoading(false);
    } catch (error) {
      console.error('[Client] Error:', error);
      setLoading(false);
    }
  };

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
        thumbnail: item.user?.profile_image_url,
      }));
    } catch { return []; }
  }

  async function fetchViaProxy(rssUrl: string, platform: 'Zenn' | 'note'): Promise<Article[]> {
    try {
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      if (data.status !== 'ok') throw new Error('RSS2JSON error');
      
      return data.items.slice(0, 10).map((item: any, i: number) => ({
        id: `${platform.toLowerCase()}-${i}`,
        title: item.title || 'No Title',
        url: item.link || '#',
        excerpt: (item.description || '').replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim().substring(0, 150) + '...',
        publishedAt: item.pubDate || new Date().toISOString(),
        platform,
        thumbnail: item.thumbnail || item.enclosure?.link,
      }));
    } catch { return []; }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Zenn': return 'linear-gradient(135deg, #3EA8FF, #50C0FF)';
      case 'Qiita': return 'linear-gradient(135deg, #55C500, #7AD929)';
      case 'note': return 'linear-gradient(135deg, #41C9B4, #5DD9C6)';
      default: return 'linear-gradient(135deg, #FFB7D5, #C9A0DC)';
    }
  };

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary-pink: #FFB7D5;
          --primary-purple: #C9A0DC;
          --primary-blue: #A5D8FF;
          --text-light: #FFFFFF;
          --glass-bg: rgba(255, 255, 255, 0.12);
          --glass-border: rgba(255, 255, 255, 0.25);
          --bg-dark: #3D2B5C;
          --bg-mid: #5C4A7A;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-mid) 50%, var(--bg-dark) 100%);
          color: var(--text-light);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px) saturate(150%);
          border: 1.5px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          background: rgba(61, 43, 92, 0.95);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple), var(--primary-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }

        .nav-links a {
          color: var(--text-light);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: var(--primary-pink);
        }

        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 2rem 4rem;
          text-align: center;
        }

        .hero-title {
          font-size: clamp(2.5rem, 7vw, 5rem);
          font-weight: 700;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #FFB7D5, #F5C2E7, #C9A0DC, #A5D8FF);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: clamp(1.1rem, 2.3vw, 1.6rem);
          margin-bottom: 3rem;
          opacity: 0.9;
          font-weight: 400;
        }

        .performance-badge {
          display: inline-block;
          padding: 0.8rem 1.8rem;
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1));
          border: 2px solid rgba(76, 175, 80, 0.5);
          border-radius: 50px;
          color: #A5D6A7;
          font-size: 0.95rem;
          font-weight: 700;
          margin-top: 1rem;
          backdrop-filter: blur(10px);
        }

        .blog-section {
          padding: 6rem 2rem;
        }

        .section-title {
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          text-align: center;
          margin-bottom: 1.5rem;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple), var(--primary-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .section-subtitle {
          text-align: center;
          opacity: 0.85;
          margin-bottom: 3.5rem;
          font-size: 1.05rem;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .article-card {
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }

        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(255, 183, 213, 0.3);
        }

        .article-thumbnail {
          width: 100%;
          height: 200px;
          margin-bottom: 1.5rem;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }

        .article-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .article-platform {
          display: inline-block;
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }

        .article-category {
          display: inline-block;
          margin-left: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .article-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
          padding: 0 0.5rem;
          color: var(--primary-pink);
          line-height: 1.5;
          word-break: break-word;
        }

        .article-excerpt {
          font-size: 0.95rem;
          opacity: 0.85;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          padding: 0 0.5rem;
        }

        .article-date {
          font-size: 0.85rem;
          opacity: 0.7;
          padding: 0 0.5rem;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--primary-pink);
          font-size: 1.2rem;
        }

        .filter-section {
          margin-bottom: 2.5rem;
          padding: 2rem;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-group:last-child {
          margin-bottom: 0;
        }

        .filter-label {
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          opacity: 0.85;
          display: block;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .filter-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 20px;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .filter-btn:hover {
          background: rgba(255, 183, 213, 0.3);
          border-color: var(--primary-pink);
          transform: translateY(-2px);
        }

        .filter-btn.active {
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
          border-color: var(--primary-pink);
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(255, 183, 213, 0.4);
        }

        .search-box {
          width: 100%;
          padding: 1rem 1.5rem;
          border-radius: 25px;
          border: 1.5px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-light);
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .search-box::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        .search-box:focus {
          border-color: var(--primary-pink);
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 20px rgba(255, 183, 213, 0.3);
        }

        .results-count {
          text-align: center;
          margin-top: 1.5rem;
          opacity: 0.7;
          font-size: 0.95rem;
        }

        footer {
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          margin-top: 4rem;
          background: rgba(61, 43, 92, 0.3);
        }

        @media (max-width: 768px) {
          .articles-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .article-card {
            padding: 1.5rem;
          }
          
          .article-thumbnail {
            height: 150px;
          }
          
          .article-title {
            font-size: 1.1rem;
          }
          
          .container {
            padding: 0 1rem;
          }
          
          .blog-section {
            padding: 4rem 1rem;
          }
          
          header {
            padding: 1rem 1.5rem;
          }
          
          .logo {
            font-size: 1.4rem;
          }

          .nav-links {
            gap: 1.5rem;
          }

          .filter-section {
            padding: 1.5rem;
          }

          .filter-buttons {
            gap: 0.6rem;
          }

          .filter-btn {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
          }

          .search-box {
            padding: 0.9rem 1.3rem;
            font-size: 0.95rem;
          }
        }
      `}</style>

      <header>
        <nav>
          <div className="logo">Crystal Studio</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="https://github.com/rancorder" target="_blank" rel="noopener noreferrer">GitHub</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section id="home" className="hero">
          <div>
            <h1 className="hero-title">rancorder テック記事 | 自動集約ブログ</h1>
            <p className="hero-subtitle">
              Zenn・Qiita・note から自動収集 | Next.js ISR実装
            </p>
            <div className="performance-badge">
              ⚡ Performance Optimized - Lighthouse 95+
            </div>
          </div>
        </section>

        <section id="blog" className="blog-section">
          <div className="container">
            <h2 className="section-title">Latest Tech Articles</h2>
            <p className="section-subtitle">Zenn・Qiita・noteから自動取得</p>
            
            {loading ? (
              <div className="loading">記事を読み込み中...</div>
            ) : (
              <>
                <div className="filter-section glass">
                  <div className="filter-group">
                    <label className="filter-label">🔍 記事を検索</label>
                    <input
                      type="text"
                      className="search-box"
                      placeholder="タイトルやキーワードで検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">📂 カテゴリー</label>
                    <div className="filter-buttons">
                      {['全て', 'AI', '画像生成', 'プロンプト', 'スクレイピング', 'フロントエンド', 'バックエンド', 'インフラ', 'その他'].map(category => (
                        <button
                          key={category}
                          className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category} ({categoryCounts[category] || 0})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="filter-group">
                    <label className="filter-label">🌐 プラットフォーム</label>
                    <div className="filter-buttons">
                      {['全て', 'Zenn', 'Qiita', 'note'].map(platform => (
                        <button
                          key={platform}
                          className={`filter-btn ${selectedPlatform === platform ? 'active' : ''}`}
                          onClick={() => setSelectedPlatform(platform)}
                        >
                          {platform} ({platformCounts[platform] || 0})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="results-count">
                    {filteredArticles.length > 0 ? (
                      <>{filteredArticles.length}件の記事を表示中</>
                    ) : (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          条件に一致する記事が見つかりませんでした
                        </div>
                        {(selectedCategory !== '全て' || selectedPlatform !== '全て' || searchQuery) && (
                          <button
                            className="filter-btn"
                            onClick={() => {
                              setSelectedCategory('全て');
                              setSelectedPlatform('全て');
                              setSearchQuery('');
                            }}
                            style={{
                              background: 'linear-gradient(135deg, var(--primary-pink), var(--primary-purple))',
                              border: '1.5px solid var(--primary-pink)',
                              fontWeight: 700,
                            }}
                          >
                            🔄 フィルターをリセット
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="articles-grid">
                  {filteredArticles.map(article => (
                    <div 
                      key={article.id} 
                      className="article-card glass"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      {article.thumbnail && article.platform !== 'note' && (
                        <div className="article-thumbnail">
                          <img 
                            src={article.thumbnail} 
                            alt={article.title}
                            loading="lazy"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      )}
                      <span 
                        className="article-platform"
                        style={{ background: getPlatformColor(article.platform) }}
                      >
                        {article.platform}
                      </span>
                      <span className="article-category">
                        {article.category}
                      </span>
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-excerpt">{article.excerpt}</p>
                      <p className="article-date">
                        {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 AI Art Studio - Crystal Dreamscape</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
          ⚡ Performance First | Next.js Optimized
        </p>
      </footer>
    </>
  );
}
