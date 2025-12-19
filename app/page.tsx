// app/page.tsx - CORS回避版（桜吹雪）
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
  category?: string; // 自動判定カテゴリー
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('全て');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('全て');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // カテゴリー自動判定
  const categorizeArticle = (article: Article): string => {
    const text = (article.title + ' ' + article.excerpt).toLowerCase();
    
    // AI（最優先でチェック）
    if (/ai|人工知能|機械学習|machine learning|深層学習|deep learning|llm|gpt|claude|chatgpt|gemini|openai|anthropic|transformer/.test(text)) {
      return 'AI';
    }
    
    // 画像生成
    if (/画像生成|image generation|stable diffusion|midjourney|dall-e|dalle|画像ai|生成ai|text to image|img2img/.test(text)) {
      return '画像生成';
    }
    
    // プロンプト
    if (/プロンプト|prompt|プロンプトエンジニアリング|prompt engineering|プロンプトデザイン|few-shot|zero-shot|chain of thought/.test(text)) {
      return 'プロンプト';
    }
    
    // フロントエンド
    if (/react|next\.?js|vue|nuxt|typescript|javascript|css|html|tailwind|framer|sass|scss|frontend|ui|ux/.test(text)) {
      return 'フロントエンド';
    }
    
    // バックエンド
    if (/node\.?js|express|api|database|sql|mongodb|postgresql|graphql|backend|server|prisma|nest\.?js/.test(text)) {
      return 'バックエンド';
    }
    
    // インフラ
    if (/docker|kubernetes|aws|gcp|azure|ci\/cd|terraform|github actions|vercel|netlify|deploy|infra/.test(text)) {
      return 'インフラ';
    }
    
    return 'その他';
  };

  // フィルタリング＆検索ロジック
  const filteredArticles = React.useMemo(() => {
    return articles
      .map(article => ({
        ...article,
        category: categorizeArticle(article)
      }))
      .filter(article => {
        // カテゴリーフィルター
        if (selectedCategory !== '全て' && article.category !== selectedCategory) {
          return false;
        }
        
        // プラットフォームフィルター
        if (selectedPlatform !== '全て' && article.platform !== selectedPlatform) {
          return false;
        }
        
        // 検索フィルター
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          const matchTitle = article.title.toLowerCase().includes(query);
          const matchExcerpt = article.excerpt.toLowerCase().includes(query);
          if (!matchTitle && !matchExcerpt) {
            return false;
          }
        }
        
        return true;
      });
  }, [articles, selectedCategory, selectedPlatform, searchQuery]);

  // カテゴリー別記事数カウント
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      '全て': articles.length,
      'AI': 0,
      '画像生成': 0,
      'プロンプト': 0,
      'フロントエンド': 0,
      'バックエンド': 0,
      'インフラ': 0,
      'その他': 0,
    };
    
    articles.forEach(article => {
      const category = categorizeArticle(article);
      counts[category]++;
    });
    
    return counts;
  }, [articles]);

  // プラットフォーム別記事数カウント
  const platformCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      '全て': articles.length,
      'Zenn': 0,
      'Qiita': 0,
      'note': 0,
    };
    
    articles.forEach(article => {
      counts[article.platform]++;
    });
    
    return counts;
  }, [articles]);

  // 🌸 Canvas桜吹雪エフェクト
  useEffect(() => {
    const canvas = document.getElementById('canvas-sakura') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
        'rgba(255, 183, 213, ',
        'rgba(255, 255, 255, ',
        'rgba(201, 160, 220, ',
        'rgba(165, 216, 255, ',
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function drawSakura(x: number, y: number, radius: number, color: string, alpha: number, rotation: number) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;

      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / 5);
        
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

    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        p.y += p.vy;
        p.x += p.vx;
        p.x += Math.sin(Date.now() * 0.001 + index) * 0.3;
        p.rotation += p.rotationSpeed;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x -= (dx / dist) * 2;
          p.y -= (dy / dist) * 2;
        }

        if (p.y > canvas.height + 50) {
          p.y = -50;
          p.x = Math.random() * canvas.width;
        }

        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;

        drawSakura(p.x, p.y, p.radius, p.color, p.alpha, p.rotation);
      });

      animationId = requestAnimationFrame(animate);
    }
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 記事取得（CORS回避版）
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        console.log('[Client] Fetching articles...');
        
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

  // Qiita取得（直接）
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
        thumbnail: item.user?.profile_image_url || undefined, // サムネイル
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
        
        // サムネイル画像を抽出（複数パターン対応）
        let thumbnail: string | undefined;
        
        // 1. thumbnail フィールド
        if (item.thumbnail) {
          thumbnail = item.thumbnail;
        }
        // 2. enclosure.link
        else if (item.enclosure?.link) {
          thumbnail = item.enclosure.link;
        }
        // 3. content から抽出（note用）
        else if (item.content) {
          const imgMatch = item.content.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch) {
            thumbnail = imgMatch[1];
          }
        }
        // 4. description から抽出
        else if (item.description) {
          const imgMatch = item.description.match(/<img[^>]+src=["']([^"']+)["']/i);
          if (imgMatch) {
            thumbnail = imgMatch[1];
          }
        }
        
        // noteの場合、assets.st-note.comのURLを確認
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

  // プラットフォーム別カラー
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'Zenn': return 'linear-gradient(135deg, #3EA8FF, #50C0FF)';
      case 'Qiita': return 'linear-gradient(135deg, #55C500, #7AD929)';
      case 'note': return 'linear-gradient(135deg, #41C9B4, #5DD9C6)';
      default: return 'linear-gradient(135deg, var(--primary-pink), var(--primary-purple))';
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
        }

        body {
          font-family: 'Josefin Sans', sans-serif;
          background: linear-gradient(135deg, 
            #3D2B5C 0%, #4A3368 20%, #5C4A7A 40%, 
            #4A3368 60%, #3D2B5C 80%, #2E1F47 100%
          );
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          color: var(--text-light);
          min-height: 100vh;
          overflow-x: hidden;
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
            radial-gradient(circle at 80% 70%, rgba(165, 216, 255, 0.12) 0%, transparent 40%);
          pointer-events: none;
          z-index: 1;
        }

        /* 冬の装飾 */
        body::after {
          content: '⛄';
          position: fixed;
          bottom: 5%;
          right: 5%;
          font-size: 8rem;
          opacity: 0.15;
          pointer-events: none;
          z-index: 1;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        /* 追加の雪だるま（左上） */
        .winter-decoration-left {
          position: fixed;
          top: 10%;
          left: 3%;
          font-size: 6rem;
          opacity: 0.12;
          pointer-events: none;
          z-index: 1;
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        /* 冬の木（右中央） */
        .winter-decoration-tree {
          position: fixed;
          top: 50%;
          right: 2%;
          font-size: 5rem;
          opacity: 0.1;
          pointer-events: none;
          z-index: 1;
          animation: float 7s ease-in-out infinite;
          animation-delay: 2s;
        }

        /* モバイルでは小さく */
        @media (max-width: 768px) {
          body::after {
            font-size: 4rem;
            bottom: 3%;
            right: 3%;
            opacity: 0.1;
          }
          
          .winter-decoration-left {
            font-size: 3rem;
            top: 5%;
            left: 2%;
            opacity: 0.08;
          }
          
          .winter-decoration-tree {
            font-size: 2.5rem;
            opacity: 0.08;
          }
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
          width: 100%;
          box-sizing: border-box;
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
            var(--primary-pink), var(--primary-purple), var(--primary-blue)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
          transition: all 0.3s ease;
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
          z-index: 3;
        }

        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, 
            #FFB7D5, #F5C2E7, #C9A0DC, #A5D8FF, #D4E4FF
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shimmer 5s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .hero-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          margin-bottom: 3rem;
          opacity: 0.9;
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
            var(--primary-pink), var(--primary-purple), var(--primary-blue)
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-subtitle {
          text-align: center;
          opacity: 0.85;
          margin-bottom: 4rem;
          font-size: 1.1rem;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 350px), 1fr));
          gap: 2.5rem;
          margin-top: 4rem;
          width: 100%;
        }

        .article-card {
          padding: 2.5rem;
          transition: all 0.4s ease;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          width: 100%;
          box-sizing: border-box;
        }

        .article-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 60px rgba(255, 183, 213, 0.5);
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
          transition: transform 0.4s ease;
        }

        .article-card:hover .article-thumbnail img {
          transform: scale(1.05);
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

        .article-title {
          font-size: 1.4rem;
          font-weight: 700;
          margin-bottom: 1rem;
          padding: 0 0.5rem;
          color: var(--primary-pink);
          line-height: 1.5;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
          white-space: normal;
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

        /* フィルターセクション */
        .filter-section {
          margin-bottom: 3rem;
          padding: 2rem;
          background: var(--glass-bg);
          backdrop-filter: blur(20px) saturate(150%);
          border: 1.5px solid var(--glass-border);
          border-radius: 20px;
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
            margin-top: 2rem;
          }
          
          .article-card {
            padding: 1rem;
            overflow: hidden;
            width: 100%;
          }
          
          .article-thumbnail {
            height: 150px;
            margin-bottom: 1rem;
            border-radius: 12px;
          }
          
          .article-title {
            font-size: 1rem;
            margin-bottom: 0.8rem;
            line-height: 1.6;
            word-break: break-word;
            overflow-wrap: break-word;
            max-width: 100%;
          }
          
          .article-excerpt {
            font-size: 0.85rem;
            line-height: 1.6;
            margin-bottom: 1rem;
          }
          
          .article-platform {
            font-size: 0.7rem;
            padding: 0.4rem 1rem;
            margin-bottom: 0.8rem;
          }
          
          .article-date {
            font-size: 0.75rem;
          }
          
          .container {
            padding: 0 1rem;
            width: 100%;
          }
          
          .blog-section {
            padding: 4rem 1rem;
          }
          
          header {
            padding: 1rem 1.5rem;
          }
          
          .logo {
            font-size: 1.5rem;
          }
          
          .nav-links {
            gap: 1.5rem;
          }
          
          .nav-links a {
            font-size: 0.9rem;
          }

          /* フィルターのモバイル対応 */
          .filter-section {
            padding: 1.5rem;
          }

          .filter-buttons {
            gap: 0.6rem;
          }

          .filter-btn {
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
          }

          .search-box {
            padding: 0.8rem 1.2rem;
            font-size: 0.9rem;
          }

          .filter-label {
            font-size: 0.85rem;
          }
        }
      `}</style>

      {/* 冬の装飾 */}
      <div className="winter-decoration-left">⛄</div>
      <div className="winter-decoration-tree">🎄</div>

      <canvas id="canvas-sakura"></canvas>

      <header>
        <nav>
          <div className="logo">Crystal Studio</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="https://github.com/rancorder" target="_blank">GitHub</a></li>
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
                {/* フィルターセクション */}
                <div className="filter-section">
                  {/* 検索ボックス */}
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

                  {/* カテゴリーフィルター */}
                  <div className="filter-group">
                    <label className="filter-label">📂 カテゴリー</label>
                    <div className="filter-buttons">
                      {['全て', 'AI', '画像生成', 'プロンプト', 'フロントエンド', 'バックエンド', 'インフラ', 'その他'].map(category => (
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

                  {/* プラットフォームフィルター */}
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

                  {/* 検索結果数 */}
                  <div className="results-count">
                    {filteredArticles.length}件の記事を表示中
                  </div>
                </div>

                {/* 記事一覧 */}
                <div className="articles-grid">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map(article => (
                    <div 
                      key={article.id} 
                      className="article-card glass"
                      onClick={() => window.open(article.url, '_blank')}
                    >
                      {(article.thumbnail && article.platform !== 'note') && (
                        <div className="article-thumbnail">
                          <img 
                            src={article.thumbnail} 
                            alt={article.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
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
                  ))
                ) : (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.6 }}>
                    {searchQuery || selectedCategory !== '全て' || selectedPlatform !== '全て' 
                      ? '条件に一致する記事が見つかりませんでした' 
                      : '記事が見つかりませんでした'}
                  </div>
                )}
              </div>
            </>
            )}
          </div>
        </section>
      </main>

      <footer>
        <p>© 2025 AI Art Studio - Crystal Dreamscape</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          🌸 Powered by Next.js + Canvas API
        </p>
      </footer>
    </>
  );
}
