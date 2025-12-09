// app/page.tsx - Crystal Dreamscape バランス調整版
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    // 🌸 桜パーティクル作成（コントラスト重視）
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);
    const velocityArray = new Float32Array(particlesCount);

    for(let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      posArray[i3] = (Math.random() - 0.5) * 120;
      posArray[i3 + 1] = Math.random() * 100 + 20;
      posArray[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // 🎨 明るい色のみ（背景とのコントラスト重視）
      const colorChoice = Math.random();
      if(colorChoice < 0.4) {
        // 明るいピンク
        colorArray[i3] = 1;
        colorArray[i3 + 1] = 0.6;
        colorArray[i3 + 2] = 0.8;
      } else if(colorChoice < 0.7) {
        // ホワイト（輝き）
        colorArray[i3] = 1;
        colorArray[i3 + 1] = 1;
        colorArray[i3 + 2] = 1;
      } else {
        // ライトブルー
        colorArray[i3] = 0.8;
        colorArray[i3 + 1] = 0.9;
        colorArray[i3 + 2] = 1;
      }
      
      sizeArray[i] = Math.random() * 2.5 + 1.5;
      velocityArray[i] = Math.random() * 0.5 + 0.2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.9, // 明瞭度アップ
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: createSakuraTexture(),
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    function createSakuraTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      // 桜の花びら
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 200, 230, 0.9)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      
      return new THREE.CanvasTexture(canvas);
    }

    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // アニメーションループ
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      
      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x = mouseY * 0.3;
      particlesMesh.rotation.y += mouseX * 0.0005;
      
      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.001;
      
      for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        positions[i3 + 1] -= velocityArray[i] * 0.15;
        positions[i3] += Math.sin(time + i) * 0.02;
        positions[i3 + 2] += Math.cos(time + i * 0.5) * 0.015;
        
        if(positions[i3 + 1] < -50) {
          positions[i3 + 1] = 50 + Math.random() * 20;
          positions[i3] = (Math.random() - 0.5) * 120;
        }
      }
      particlesMesh.geometry.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [scriptsLoaded]);

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
          --accent-pearl: #FFF5F7;
          --text-light: #FFFFFF;
          --text-dark: #2D1B4E;
          --glass-bg: rgba(255, 255, 255, 0.12);
          --glass-border: rgba(255, 255, 255, 0.25);
        }

        body {
          font-family: 'Josefin Sans', sans-serif;
          /* 🎨 バランス背景（薄暗い宝石空間） */
          background: linear-gradient(135deg, 
            #3D2B5C 0%,    /* ディープパープル */
            #4A3368 20%,   /* ミディアムパープル */
            #5C4A7A 40%,   /* ライトパープル */
            #4A3368 60%,   /* ミディアムパープル */
            #3D2B5C 80%,   /* ディープパープル */
            #2E1F47 100%   /* ダークパープル */
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          color: var(--text-light);
          overflow-x: hidden;
          line-height: 1.6;
          min-height: 100vh;
          position: relative;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        /* 🌟 キラキラオーバーレイ（控えめ） */
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

        #canvas-3d {
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
        <p>
          © 2025 AI Art Studio - Crystal Dreamscape. All rights reserved.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          🌸 Powered by Next.js + Three.js + TypeScript
        </p>
      </footer>
    </>
  );
}
