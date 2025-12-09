// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: 'Zenn' | 'Qiita';
  tags?: string[];
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  // スクリプト読み込み完了後にThree.js初期化
  useEffect(() => {
    if (!scriptsLoaded) return;

    // Three.jsの初期化
    const THREE = (window as any).THREE;
    if (!THREE) return;

    const canvas = document.getElementById('canvas-3d') as HTMLCanvasElement;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas,
      alpha: true,
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    camera.position.z = 50;

    // パーティクル作成
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 100;
      
      const colorChoice = Math.random();
      if(colorChoice < 0.33) {
        colorArray[i] = 1; colorArray[i+1] = 0.72; colorArray[i+2] = 0.84; // Pink
      } else if(colorChoice < 0.66) {
        colorArray[i] = 0.79; colorArray[i+1] = 0.63; colorArray[i+2] = 0.86; // Purple
      } else {
        colorArray[i] = 0.65; colorArray[i+1] = 0.85; colorArray[i+2] = 1; // Blue
      }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // マウス追従
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // アニメーションループ
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      particlesMesh.rotation.y += mouseX * 0.0005;
      particlesMesh.rotation.x += mouseY * 0.0005;
      
      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      for(let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.02;
        if(positions[i] < -50) positions[i] = 50;
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    animate();

    // リサイズ対応
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // クリーンアップ
    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [scriptsLoaded]);

  // 記事取得
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArticles(data.articles);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Three.js CDN */}
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        strategy="beforeInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />

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
          --accent-gold: #FFD700;
          --text-dark: #2D1B4E;
          --text-light: #FFFFFF;
          --glass-bg: rgba(255, 255, 255, 0.1);
          --glass-border: rgba(255, 255, 255, 0.2);
        }

        body {
          font-family: 'Josefin Sans', sans-serif;
          background: linear-gradient(135deg, #1a0933 0%, #2d1b4e 50%, #4a2c6d 100%);
          color: var(--text-light);
          overflow-x: hidden;
          line-height: 1.6;
          min-height: 100vh;
        }

        #canvas-3d {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }

        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 2;
        }

        header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          background: rgba(42, 27, 78, 0.3);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple), var(--primary-blue));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-decoration: none;
          letter-spacing: 2px;
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
        }

        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8rem 2rem 4rem;
          text-align: center;
          z-index: 2;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #FFB7D5 0%, #C9A0DC 30%, #A5D8FF 60%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s ease-in-out infinite;
          background-size: 200% auto;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 300;
          margin-bottom: 3rem;
          opacity: 0.9;
          letter-spacing: 1px;
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
          background: linear-gradient(135deg, var(--primary-pink), var(--accent-gold));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
          margin-top: 0.5rem;
          letter-spacing: 1px;
        }

        .blog-section {
          padding: 8rem 2rem;
          position: relative;
          z-index: 2;
        }

        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          text-align: center;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .section-subtitle {
          text-align: center;
          opacity: 0.8;
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
          transition: all 0.4s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .article-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary-pink), var(--primary-purple), var(--primary-blue));
        }

        .article-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 48px rgba(255, 183, 213, 0.3);
        }

        .article-platform {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .article-title {
          font-size: 1.3rem;
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
          opacity: 0.6;
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
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 4rem;
          position: relative;
          z-index: 2;
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
        }
      `}</style>

      {/* 3D Canvas */}
      <canvas id="canvas-3d"></canvas>

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
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6 }}>
                    記事が見つかりませんでした
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p style={{ opacity: 0.6 }}>
          © 2025 AI Art Studio - Crystal Dreamscape. All rights reserved.
        </p>
      </footer>
    </>
  );
}