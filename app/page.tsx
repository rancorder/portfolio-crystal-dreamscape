// app/page.tsx - Crystal Dreamscape 完全修正版
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 50;

    // 🌸 桜パーティクル作成（大きく・華やか・透明感）
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 250; // 200 → 250に増量
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const sizeArray = new Float32Array(particlesCount);
    const velocityArray = new Float32Array(particlesCount);

    for(let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      
      // 位置（広範囲に配置）
      posArray[i3] = (Math.random() - 0.5) * 120;
      posArray[i3 + 1] = Math.random() * 100 + 20; // 上から降る
      posArray[i3 + 2] = (Math.random() - 0.5) * 100;
      
      // 🎨 パステルカラー（ピンク・紫・青・白）
      const colorChoice = Math.random();
      if(colorChoice < 0.35) {
        // ソフトピンク
        colorArray[i3] = 1;
        colorArray[i3 + 1] = 0.75;
        colorArray[i3 + 2] = 0.85;
      } else if(colorChoice < 0.65) {
        // ラベンダー
        colorArray[i3] = 0.85;
        colorArray[i3 + 1] = 0.70;
        colorArray[i3 + 2] = 0.95;
      } else if(colorChoice < 0.85) {
        // スカイブルー
        colorArray[i3] = 0.70;
        colorArray[i3 + 1] = 0.85;
        colorArray[i3 + 2] = 1;
      } else {
        // ホワイト（輝き）
        colorArray[i3] = 1;
        colorArray[i3 + 1] = 1;
        colorArray[i3 + 2] = 1;
      }
      
      // サイズ（大きく・ランダム）
      sizeArray[i] = Math.random() * 3 + 1.5; // 0.5 → 1.5-4.5
      
      // 落下速度（桜らしくゆっくり）
      velocityArray[i] = Math.random() * 0.5 + 0.2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 2.5, // 0.5 → 2.5（大幅に拡大）
      vertexColors: true,
      transparent: true,
      opacity: 0.85, // 0.8 → 0.85（明るく）
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      map: createSakuraTexture(), // 🌸 桜テクスチャ
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // 🌸 桜テクスチャ作成
    function createSakuraTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      
      // 桜の花びら形状（5枚花びら）
      ctx.fillStyle = 'white';
      ctx.beginPath();
      for(let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const x = 32 + Math.cos(angle) * 20;
        const y = 32 + Math.sin(angle) * 20;
        if(i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      
      // グラデーション（中心が明るい）
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
      
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    }

    // 🌟 環境光（全体を明るく）
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // マウス追従（より滑らか）
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    document.addEventListener('mousemove', handleMouseMove);

    // アニメーションループ（桜吹雪）
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // マウス追従（スムーズ）
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      
      // パーティクル全体の回転（ゆっくり）
      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x = mouseY * 0.3;
      particlesMesh.rotation.y += mouseX * 0.0005;
      
      // 🌸 桜吹雪（落下 + 横揺れ）
      const positions = particlesMesh.geometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.001;
      
      for(let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        
        // Y軸落下（個別速度）
        positions[i3 + 1] -= velocityArray[i] * 0.15;
        
        // X軸横揺れ（風の表現）
        positions[i3] += Math.sin(time + i) * 0.02;
        
        // Z軸奥行き揺れ
        positions[i3 + 2] += Math.cos(time + i * 0.5) * 0.015;
        
        // 画面下に落ちたら上にリセット
        if(positions[i3 + 1] < -50) {
          positions[i3 + 1] = 50 + Math.random() * 20;
          positions[i3] = (Math.random() - 0.5) * 120;
        }
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
          --accent-pearl: #FFF5F7;
          --text-dark: #2D1B4E;
          --text-light: #FFFFFF;
          --glass-bg: rgba(255, 255, 255, 0.15);
          --glass-border: rgba(255, 255, 255, 0.3);
        }

        body {
          font-family: 'Josefin Sans', sans-serif;
          /* 🎨 明るいグラデーション背景（宝石感） */
          background: linear-gradient(135deg, 
            #E8D5F2 0%,    /* ラベンダー */
            #F5E6F0 25%,   /* ライトピンク */
            #E6F3FF 50%,   /* スカイブルー */
            #F8E8F5 75%,   /* パールピンク */
            #E8D5F2 100%   /* ラベンダー */
          );
          color: var(--text-dark);
          overflow-x: hidden;
          line-height: 1.6;
          min-height: 100vh;
          position: relative;
        }

        /* 🌟 キラキラオーバーレイ（宝石の輝き） */
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 183, 213, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(165, 216, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(201, 160, 220, 0.2) 0%, transparent 60%);
          pointer-events: none;
          z-index: 1;
          animation: shimmerOverlay 8s ease-in-out infinite;
        }

        @keyframes shimmerOverlay {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.9; }
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

        /* 🔮 ガラスモーフィズム強化 */
        .glass {
          background: var(--glass-bg);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border: 2px solid var(--glass-border);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(255, 183, 213, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.5);
          position: relative;
          overflow: hidden;
        }

        /* 🌟 ガラスカードの輝きエフェクト */
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
            rgba(255, 255, 255, 0.3) 50%,
            transparent 70%
          );
          animation: glassShine 3s ease-in-out infinite;
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
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(15px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 4px 16px rgba(201, 160, 220, 0.2);
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
          filter: drop-shadow(0 2px 4px rgba(201, 160, 220, 0.3));
        }

        .nav-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
        }

        .nav-links a {
          color: var(--text-dark);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-links a:hover {
          color: var(--primary-purple);
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
          /* 🎨 パステルグラデーション（ゴールド削除） */
          background: linear-gradient(135deg, 
            #FFB7D5 0%,    /* ソフトピンク */
            #F5C2E7 20%,   /* ライトピンク */
            #C9A0DC 40%,   /* ラベンダー */
            #B8B4E8 60%,   /* パープル */
            #A5D8FF 80%,   /* スカイブルー */
            #D4E4FF 100%   /* ライトブルー */
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s ease-in-out infinite;
          background-size: 200% auto;
          filter: drop-shadow(0 4px 8px rgba(201, 160, 220, 0.4));
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 400;
          margin-bottom: 3rem;
          color: var(--text-dark);
          opacity: 0.85;
          letter-spacing: 1px;
          text-shadow: 0 2px 4px rgba(255, 255, 255, 0.5);
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
          filter: drop-shadow(0 2px 4px rgba(201, 160, 220, 0.3));
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.75;
          margin-top: 0.5rem;
          letter-spacing: 1px;
          color: var(--text-dark);
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
          filter: drop-shadow(0 2px 4px rgba(201, 160, 220, 0.3));
        }

        .section-subtitle {
          text-align: center;
          opacity: 0.75;
          margin-bottom: 4rem;
          font-size: 1.1rem;
          color: var(--text-dark);
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
          height: 5px;
          background: linear-gradient(90deg, 
            var(--primary-pink), 
            var(--primary-purple), 
            var(--primary-blue)
          );
          border-radius: 24px 24px 0 0;
        }

        .article-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 
            0 20px 60px rgba(255, 183, 213, 0.4),
            0 8px 16px rgba(201, 160, 220, 0.3);
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
          box-shadow: 0 4px 12px rgba(201, 160, 220, 0.3);
        }

        .article-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--primary-purple);
          line-height: 1.4;
          text-shadow: 0 1px 2px rgba(201, 160, 220, 0.2);
        }

        .article-excerpt {
          font-size: 0.95rem;
          opacity: 0.8;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          color: var(--text-dark);
        }

        .article-date {
          font-size: 0.85rem;
          opacity: 0.6;
          color: var(--text-dark);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: var(--primary-purple);
          font-size: 1.2rem;
        }

        footer {
          padding: 3rem 2rem;
          text-align: center;
          border-top: 2px solid rgba(255, 255, 255, 0.3);
          margin-top: 4rem;
          position: relative;
          z-index: 3;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          color: var(--text-dark);
        }

        footer p {
          opacity: 0.7;
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
