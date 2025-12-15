// app/page.tsx - エラー表示機能追加版
'use client';

import { useEffect, useState } from 'react';

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn' | 'Qiita';
  tags?: string[];
}

interface ApiError {
  message: string;
  timestamp: string;
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // 🌸 Canvas桜吹雪エフェクト（Three.js不要）
  useEffect(() => {
    const canvas = document.getElementById('canvas-sakura') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 桜パーティクル定義
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      rotation: number;
      rotationSpeed: number;
    }

    const particles: Particle[] = [];
    const particleCount = 150;

    // パーティクル生成
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 1.5 + 0.5,
        radius: Math.random() * 4 + 2,
        color: getRandomColor(),
        alpha: Math.random() * 0.5 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    function getRandomColor(): string {
      const colors = [
        'rgba(255, 183, 213, ', // ピンク
        'rgba(255, 255, 255, ',  // ホワイト
        'rgba(201, 160, 220, ',  // ラベンダー
        'rgba(165, 216, 255, ',  // スカイブルー
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // 桜の花びら描画
    function drawSakura(x: number, y: number, radius: number, color: string, alpha: number, rotation: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      // 5枚花びら
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / 5);
        
        // グラデーション
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        gradient.addColorStop(0, color + '1)');
        gradient.addColorStop(0.5, color + '0.8)');
        gradient.addColorStop(1, color + '0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, -radius * 0.3, radius * 0.6, radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }

    // マウス追従
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // アニメーションループ
    let animationId: number;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        // 位置更新（落下 + 横揺れ）
        p.y += p.vy;
        p.x += p.vx;
        p.x += Math.sin(Date.now() * 0.001 + index) * 0.3;
        p.rotation += p.rotationSpeed;

        // マウス反応（近くのパーティクルが避ける）
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= (dx / dist) * 2;
          p.y -= (dy / dist) * 2;
        }

        // 画面下に落ちたらリセット
        if (p.y > canvas.height + 50) {
          p.y = -50;
          p.x = Math.random() * canvas.width;
        }

        // 左右端の処理
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;

        // 描画
        drawSakura(p.x, p.y, p.radius, p.color, p.alpha, p.rotation);
      });

      animationId = requestAnimationFrame(animate);
    }
    animate();

    // リサイズ対応
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 記事取得（エラーハンドリング強化）
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('[Client] Fetching articles from /api/articles...');
        const startTime = Date.now();
        
        const res = await fetch('/api/articles', {
          cache: 'no-store', // ISRテスト時は強制リフレッシュ
        });
        
        const duration = Date.now() - startTime;
        console.log(`[Client] Response received in ${duration}ms`);
        console.log('[Client] Response status:', res.status);
        console.log('[Client] Response headers:', Object.fromEntries(res.headers.entries()));
        
        const data = await res.json();
        console.log('[Client] Response data:', data);
        
        if (data.success) {
          console.log(`[Client] Successfully loaded ${data.articles.length} articles`);
          setArticles(data.articles);
          setDebugInfo(`✅ 記事取得成功: ${data.articles.length}件 (${duration}ms)`);
        } else {
          console.error('[Client] API returned success=false:', data.error);
          setError({
            message: data.error || 'API returned error',
            timestamp: data.timestamp,
          });
          setDebugInfo(`❌ API Error: ${data.error}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('[Client] Fetch error:', err);
        setError({
          message: err instanceof Error ? err.message : 'Unknown fetch error',
          timestamp: new Date().toISOString(),
        });
        setDebugInfo(`❌ Fetch Error: ${err instanceof Error ? err.message : String(err)}`);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

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
          --accent-pearl: #FFF5F7;
          --text-light: #FFFFFF;
          --glass-bg: rgba(255, 255, 255, 0.12);
          --glass-border: rgba(255, 255, 255, 0.25);
        }

        body {
          font-family: 'Josefin Sans', sans-serif;
          background: linear-gradient(135deg, 
            #3D2B5C 0%,
            #4A3368 20%,
            #5C4A7A 40%,
            #4A3368 60%,
            #3D2B5C 80%,
            #2E1F47 100%
          );
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

        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 183, 213, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(165, 216, 255, 0.12) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(201, 160, 220, 0.1) 0%, transparent 50%);
          pointer-events: none;
          z-index: 1;
          animation: shimmerOverlay 10s ease-in-out infinite;
        }

        @keyframes shimmerOverlay {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }

        #canvas-sakura {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1.5px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          position: relative;
          overflow: hidden;
        }

        .glass::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 70%
          );
          animation: glassShine 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes glassShine {
          0%, 100% { transform: translate(-100%, -100%); }
          50% { transform: translate(100%, 100%); }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 3;
        }

        header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          background: rgba(61, 43, 92, 0.4);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, 
            var(--primary-pink), 
            var(--primary-purple), 
            var(--primary-blue)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          letter-spacing: 2px;
          filter: drop-shadow(0 2px 8px rgba(255, 183, 213, 0.5));
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
          font-size: 0.95rem;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          position: relative;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .nav-links a:hover {
          color: var(--primary-pink);
          transform: translateY(-2px);
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--primary-pink), var(--primary-purple));
          transition: width 0.3s ease;
          box-shadow: 0 0 8px var(--primary-pink);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 2rem 4rem;
          text-align: center;
          z-index: 3;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, 
            #FFB7D5 0%,
            #F5C2E7 25%,
            #C9A0DC 50%,
            #A5D8FF 75%,
            #D4E4FF 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 5s ease-in-out infinite;
          background-size: 200% auto;
          filter: drop-shadow(0 4px 12px rgba(255, 183, 213, 0.6));
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 400;
          margin-bottom: 3rem;
          color: var(--text-light);
          opacity: 0.9;
          letter-spacing: 1px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 4rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-family: 'Cormorant Garamond', serif;
          font-size: 3.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, 
            var(--primary-pink), 
            var(--primary-purple),
            var(--primary-blue)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 8px rgba(255, 183, 213, 0.6));
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 0.5rem;
          letter-spacing: 1px;
          color: var(--text-light);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
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
          background: linear-gradient(135deg, 
            var(--primary-pink), 
            var(--primary-purple),
            var(--primary-blue)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 8px rgba(255, 183, 213, 0.5));
        }

        .section-subtitle {
          text-align: center;
          opacity: 0.85;
          margin-bottom: 4rem;
          font-size: 1.1rem;
          color: var(--text-light);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .debug-info {
          text-align: center;
          padding: 1rem 2rem;
          margin: 2rem auto;
          max-width: 800px;
          background: rgba(255, 183, 213, 0.1);
          border: 1px solid rgba(255, 183, 213, 0.3);
          border-radius: 12px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          color: var(--primary-pink);
        }

        .error-box {
          text-align: center;
          padding: 2rem;
          margin: 2rem auto;
          max-width: 800px;
          background: rgba(255, 100, 100, 0.1);
          border: 2px solid rgba(255, 100, 100, 0.4);
          border-radius: 16px;
          color: #FFB7D5;
        }

        .error-box h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .error-box p {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          opacity: 0.9;
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
          position: relative;
        }

        .article-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            var(--primary-pink), 
            var(--primary-purple), 
            var(--primary-blue)
          );
          border-radius: 24px 24px 0 0;
          box-shadow: 0 0 12px var(--primary-pink);
        }

        .article-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 
            0 20px 60px rgba(255, 183, 213, 0.5),
            0 8px 16px rgba(201, 160, 220, 0.4);
        }

        .article-platform {
          display: inline-block;
          padding: 0.5rem 1.2rem;
          background: linear-gradient(135deg, 
            var(--primary-pink), 
            var(--primary-purple)
          );
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
          box-shadow: 0 4px 12px rgba(201, 160, 220, 0.4);
        }

        .article-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--primary-pink);
          line-height: 1.4;
          text-shadow: 0 2px 4px rgba(255, 183, 213, 0.3);
        }

        .article-excerpt {
          font-size: 0.95rem;
          opacity: 0.85;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          color: var(--text-light);
        }

        .article-date {
          font-size: 0.85rem;
          opacity: 0.7;
          color: var(--text-light);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--primary-pink);
          font-size: 1.2rem;
        }

        footer {
          padding: 3rem 2rem;
          text-align: center;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          margin-top: 4rem;
          position: relative;
          z-index: 3;
          background: rgba(61, 43, 92, 0.3);
          backdrop-filter: blur(10px);
          color: var(--text-light);
        }

        footer p {
          opacity: 0.75;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 768px) {
          header {
            padding: 1rem 1.5rem;
          }

          .nav-links {
            gap: 1.5rem;
            font-size: 0.85rem;
          }

          .hero {
            padding: 6rem 1.5rem 3rem;
          }

          .articles-grid {
            grid-template-columns: 1fr;
          }

          .stat-number {
            font-size: 2.5rem;
          }
        }
      `}</style>

      {/* Canvas桜吹雪 */}
      <canvas id="canvas-sakura"></canvas>

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
            <h1 className="hero-title">Crystal Dreamscape</h1>
            <p className="hero-subtitle">
              プロデューサーひで × 三姉妹 | Next.js実績多数 | フロントエンド案件獲得特化型ポートフォリオ
            </p>
            
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Next.js Projects</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100+</div>
                <div className="stat-label">Technical Articles</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        <section id="blog" className="blog-section">
          <div className="container">
            <h2 className="section-title">Latest Tech Articles</h2>
            <p className="section-subtitle">Zenn・Qiitaから自動取得（Next.js ISR実装）</p>
            
            {/* デバッグ情報表示 */}
            {debugInfo && (
              <div className="debug-info">
                {debugInfo}
              </div>
            )}
            
            {/* エラー表示 */}
            {error && (
              <div className="error-box">
                <h3>🚨 記事取得エラー</h3>
                <p><strong>Error:</strong> {error.message}</p>
                <p><strong>Time:</strong> {new Date(error.timestamp).toLocaleString('ja-JP')}</p>
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
                  ブラウザのコンソールで詳細ログを確認してください
                </p>
              </div>
            )}
            
            {loading ? (
              <div className="loading">記事を読み込み中...</div>
            ) : (
              <div className="articles-grid">
                {articles.length > 0 ? (
                  articles.map(article => (
                    <div 
                      key={article.id} 
                      className="article-card glass"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      <span className="article-platform">{article.platform}</span>
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-excerpt">{article.excerpt}</p>
                      <p className="article-date">
                        {new Date(article.publishedAt).toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                  ))
                ) : (
                  !error && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6 }}>
                      記事が見つかりませんでした
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>
          © 2025 AI Art Studio - Crystal Dreamscape. All rights reserved.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          🌸 Powered by Next.js + Canvas API + TypeScript
        </p>
      </footer>
    </>
  );
}
