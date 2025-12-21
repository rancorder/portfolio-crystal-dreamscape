// /app/page.tsx - 最高のサイト完全版
// 新規実装 - Canvas背景付き

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';

interface Article {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  publishedAt: string;
  platform: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 記事取得
  useEffect(() => {
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Canvas背景アニメーション
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas サイズ設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // パーティクル設定
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    const particleCount = window.innerWidth < 768 ? 50 : 100;

    // パーティクル生成
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    // アニメーションループ
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // パーティクル更新・描画
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // 壁で反射
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // パーティクル描画
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(157, 78, 221, 0.6)';
        ctx.fill();

        // 接続線描画
        particles.forEach((p2, j) => {
          if (i < j) {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(157, 78, 221, ${0.2 * (1 - dist / 150)})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      {/* Canvas背景 */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* ========== ヘッダー ========== */}
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
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              H・M Engineering
            </div>

            <ul style={{
              display: 'flex',
              gap: '2rem',
              listStyle: 'none',
              margin: 0,
              padding: 0
            }}>
              {[
                { href: '#home', label: 'Home' },
                { href: '#projects', label: 'Projects' },
                { href: '/services', label: 'Services' },
                { href: '#blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' }
              ].map(item => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    style={{
                      color: '#c77dff',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      transition: 'color 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#c77dff'}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <main style={{ paddingTop: '80px' }}>
          {/* ========== 1. ヒーロー ========== */}
          <section id="home" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4rem 2rem',
            position: 'relative'
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* バッジ */}
              <div style={{
                display: 'inline-block',
                background: 'rgba(157, 78, 221, 0.2)',
                border: '1px solid rgba(157, 78, 221, 0.4)',
                borderRadius: '2rem',
                padding: '0.5rem 1.5rem',
                marginBottom: '2rem'
              }}>
                <span style={{ color: '#c77dff', fontSize: '0.9rem', fontWeight: '600' }}>
                  ✨ 99.9% Uptime | 54 Sites Monitored
                </span>
              </div>

              {/* メインキャッチ */}
              <h1 style={{
                fontSize: 'clamp(2.5rem, 8vw, 5rem)',
                fontWeight: 'bold',
                lineHeight: 1.2,
                marginBottom: '2rem',
                background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                製造業PM 17年 ×<br />
                フルスタック実装力
              </h1>

              {/* サブキャッチ */}
              <p style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: '#c77dff',
                marginBottom: '1rem',
                fontWeight: '500'
              }}>
                54ECサイトを24時間監視。<br />
                月間10万件のデータを0.1%未満のエラー率で処理。
              </p>

              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                color: 'rgba(199, 125, 255, 0.8)',
                marginBottom: '3rem',
                maxWidth: '800px',
                margin: '0 auto 3rem',
                lineHeight: 1.6
              }}>
                エンタープライズ顧客が「please help us」と頼る、<br />
                課題を正確に理解し、技術で解決するプロダクトマネージャー。
              </p>

              {/* CTAボタン */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                justifyContent: 'center',
                marginBottom: '5rem',
                flexWrap: 'wrap'
              }}>
                <Link
                  href="/contact"
                  style={{
                    background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
                    color: 'white',
                    padding: '1.25rem 3rem',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                    boxShadow: '0 10px 30px rgba(157, 78, 221, 0.3)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(157, 78, 221, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(157, 78, 221, 0.3)';
                  }}
                >
                  無料相談を予約 →
                </Link>

                <a
                  href="#projects"
                  style={{
                    border: '2px solid rgba(157, 78, 221, 0.6)',
                    color: '#c77dff',
                    padding: '1.25rem 3rem',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(157, 78, 221, 0.1)';
                    e.currentTarget.style.borderColor = '#c77dff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.6)';
                  }}
                >
                  実績を見る
                </a>
              </div>

              {/* 実績数値グリッド */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                maxWidth: '1000px',
                margin: '0 auto'
              }}>
                {[
                  { value: '54', label: 'ECサイト監視', sub: '24時間365日自動運用' },
                  { value: '99.9%', label: '稼働率', sub: '11ヶ月連続達成' },
                  { value: '17年', label: 'PM経験', sub: 'エンタープライズBtoB' },
                  { value: '10万+', label: '月間処理', sub: 'データ件数' }
                ].map((stat, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(157, 78, 221, 0.1)',
                      border: '1px solid rgba(157, 78, 221, 0.3)',
                      borderRadius: '1rem',
                      padding: '2rem',
                      textAlign: 'center',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(157, 78, 221, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(157, 78, 221, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{
                      fontSize: '3.5rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '0.5rem'
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      color: '#c77dff',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontSize: '0.9rem',
                      color: 'rgba(199, 125, 255, 0.7)'
                    }}>
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== 2. プロジェクト ========== */}
          <section id="projects" style={{
            padding: '8rem 2rem',
            background: 'rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  実績プロジェクト
                </h2>
                <p style={{
                  fontSize: '1.2rem',
                  color: 'rgba(199, 125, 255, 0.8)'
                }}>
                  本番運用レベルの技術実装と、確実なビジネス成果
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(450px, 100%), 1fr))',
                gap: '2.5rem'
              }}>
                {projects.map((project, index) => (
                  <div
                    key={project.id}
                    style={{
                      background: 'rgba(157, 78, 221, 0.08)',
                      border: '1px solid rgba(157, 78, 221, 0.2)',
                      borderRadius: '1.5rem',
                      padding: '2.5rem',
                      transition: 'all 0.4s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(157, 78, 221, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 20px 50px rgba(157, 78, 221, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(157, 78, 221, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* プロジェクト番号 */}
                    <div style={{
                      display: 'inline-block',
                      background: 'rgba(157, 78, 221, 0.2)',
                      color: '#c77dff',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      marginBottom: '1.5rem'
                    }}>
                      PROJECT {String(index + 1).padStart(2, '0')}
                    </div>

                    <h3 style={{
                      fontSize: '1.6rem',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '1rem',
                      lineHeight: 1.3
                    }}>
                      {project.title}
                    </h3>

                    <p style={{
                      color: 'rgba(199, 125, 255, 0.9)',
                      marginBottom: '2rem',
                      lineHeight: 1.7
                    }}>
                      {project.description}
                    </p>

                    {/* メトリクス */}
                    {project.metrics && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginBottom: '1.5rem'
                      }}>
                        {project.metrics.map((metric, i) => (
                          <div
                            key={i}
                            style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              borderRadius: '0.75rem',
                              padding: '1rem',
                              textAlign: 'center'
                            }}
                          >
                            <div style={{
                              fontSize: '1.8rem',
                              fontWeight: 'bold',
                              color: 'white',
                              marginBottom: '0.25rem'
                            }}>
                              {metric.value}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: 'rgba(199, 125, 255, 0.8)'
                            }}>
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ハイライト */}
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      marginBottom: '1.5rem'
                    }}>
                      {project.highlights.slice(0, 3).map((highlight, i) => (
                        <li
                          key={i}
                          style={{
                            color: 'rgba(199, 125, 255, 0.9)',
                            marginBottom: '0.75rem',
                            paddingLeft: '1.5rem',
                            position: 'relative',
                            fontSize: '0.95rem'
                          }}
                        >
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: '#9d4edd',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </span>
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    {/* 技術スタック */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginBottom: '1.5rem'
                    }}>
                      {project.technologies.slice(0, 6).map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.75rem',
                            background: 'rgba(157, 78, 221, 0.25)',
                            color: '#c77dff',
                            padding: '0.4rem 0.9rem',
                            borderRadius: '0.5rem',
                            fontWeight: '500'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* リンク */}
                    {project.url && (
                      <a
                        href={project.url}
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
                      >
                        詳細を見る
                        <span style={{ fontSize: '1.2rem' }}>→</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========== 3. サービス概要 ========== */}
          <section style={{
            padding: '8rem 2rem'
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  提供サービス
                </h2>
                <p style={{
                  fontSize: '1.2rem',
                  color: 'rgba(199, 125, 255, 0.8)'
                }}>
                  実績に基づく、確実なソリューション提供
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(350px, 100%), 1fr))',
                gap: '2.5rem',
                marginBottom: '4rem'
              }}>
                {[
                  {
                    icon: '🔍',
                    title: 'スクレイピングシステム構築',
                    price: '80-150万円',
                    period: '一括',
                    features: [
                      '54サイト統合実績',
                      '99.9%稼働率保証',
                      '24/7自動監視',
                      'VPS/Docker完備'
                    ]
                  },
                  {
                    icon: '📊',
                    title: 'BtoB PM支援',
                    price: '60-100万円',
                    period: '月額（週2-3日）',
                    features: [
                      '17年PM経験',
                      'エンタープライズ折衝',
                      '技術的意思決定',
                      '実装まで理解'
                    ]
                  },
                  {
                    icon: '🧪',
                    title: 'QA自動化構築',
                    price: '50-80万円',
                    period: '一括',
                    features: [
                      'Playwright実装',
                      '93%成功率実績',
                      'CI/CD統合',
                      'AIテスト生成'
                    ]
                  }
                ].map((service, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(157, 78, 221, 0.08)',
                      border: '1px solid rgba(157, 78, 221, 0.2)',
                      borderRadius: '1.5rem',
                      padding: '2.5rem',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(157, 78, 221, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.4)';
                      e.currentTarget.style.transform = 'translateY(-6px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(157, 78, 221, 0.08)';
                      e.currentTarget.style.borderColor = 'rgba(157, 78, 221, 0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      {service.icon}
                    </div>

                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '1.5rem'
                    }}>
                      {service.title}
                    </h3>

                    <div style={{
                      marginBottom: '2rem'
                    }}>
                      <div style={{
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        marginBottom: '0.5rem'
                      }}>
                        {service.price}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        color: 'rgba(199, 125, 255, 0.7)'
                      }}>
                        {service.period}
                      </div>
                    </div>

                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      {service.features.map((feature, j) => (
                        <li
                          key={j}
                          style={{
                            color: 'rgba(199, 125, 255, 0.9)',
                            marginBottom: '0.75rem',
                            paddingLeft: '1.5rem',
                            position: 'relative'
                          }}
                        >
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: '#9d4edd',
                            fontWeight: 'bold'
                          }}>
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <Link
                  href="/services"
                  style={{
                    background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
                    color: 'white',
                    padding: '1.25rem 3rem',
                    borderRadius: '0.75rem',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    display: 'inline-block',
                    boxShadow: '0 10px 30px rgba(157, 78, 221, 0.3)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 15px 40px rgba(157, 78, 221, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(157, 78, 221, 0.3)';
                  }}
                >
                  詳細を見る →
                </Link>
              </div>
            </div>
          </section>

          {/* ========== 4. 技術記事 ========== */}
          <section id="blog" style={{
            padding: '8rem 2rem',
            background: 'rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '1rem'
                }}>
                  技術記事
                </h2>
                <p style={{
                  fontSize: '1.2rem',
                  color: 'rgba(199, 125, 255, 0.8)'
                }}>
                  Zenn・Qiita・noteから自動収集（Next.js ISR）
                </p>
              </div>

              {loading ? (
                <div style={{
                  textAlign: 'center',
                  color: '#c77dff',
                  fontSize: '1.2rem',
                  padding: '4rem 0'
                }}>
                  記事を読み込み中...
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                  }}>
                    {articles.slice(0, 6).map((article) => (
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
                        <h3 style={{
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          color: 'white',
                          marginBottom: '1rem',
                          lineHeight: 1.4
                        }}>
                          {article.title}
                        </h3>

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
                        >
                          記事を読む
                          <span style={{ fontSize: '1.1rem' }}>→</span>
                        </a>
                      </article>
                    ))}
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <Link
                      href="/blog"
                      style={{
                        color: '#c77dff',
                        fontSize: '1.1rem',
                        textDecoration: 'none',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      すべての記事を見る（{articles.length}件）
                      <span style={{ fontSize: '1.3rem' }}>→</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ========== 5. 問い合わせCTA ========== */}
          <section style={{
            padding: '8rem 2rem',
            textAlign: 'center'
          }}>
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(199, 125, 255, 0.15) 100%)',
              border: '1px solid rgba(157, 78, 221, 0.3)',
              borderRadius: '2rem',
              padding: 'clamp(3rem, 8vw, 5rem)'
            }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1.5rem'
              }}>
                まずは無料相談から
              </h2>

              <p style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                color: 'rgba(199, 125, 255, 0.9)',
                marginBottom: '3rem',
                lineHeight: 1.7
              }}>
                54サイト運用実績、PM経験17年の知見で<br />
                御社の課題を解決します。<br />
                <strong style={{ color: '#c77dff' }}>48時間以内に返信</strong>いたします。
              </p>

              <Link
                href="/contact"
                style={{
                  background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
                  color: 'white',
                  padding: '1.5rem 4rem',
                  borderRadius: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.3rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 15px 40px rgba(157, 78, 221, 0.4)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(157, 78, 221, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(157, 78, 221, 0.4)';
                }}
              >
                今すぐ相談する →
              </Link>
            </div>
          </section>
        </main>

        {/* ========== フッター ========== */}
        <footer style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(157, 78, 221, 0.2)',
          color: 'rgba(199, 125, 255, 0.7)'
        }}>
          <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            © 2025 H・M Engineering
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            製造業PM × フルスタック実装力
          </p>
        </footer>
      </div>
    </>
  );
}
