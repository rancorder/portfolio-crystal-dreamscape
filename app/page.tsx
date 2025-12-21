// app/page.tsx - Lighthouse 100点満点版
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas パーティクル背景
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }

    const particles: Particle[] = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    let animationId: number;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(157, 78, 221, 0.6)';
        ctx.fill();
      });

      // 接続線
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(199, 125, 255, ${0.3 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />

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
          padding: '1rem 0',
        }}>
          <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 2rem',
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
            }}>
              H・M Engineering
            </h1>

            <ul style={{
              display: 'flex',
              gap: '2rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}>
              {[
                { href: '#home', label: 'Home' },
                { href: '#projects', label: 'Projects' },
                { href: '/services', label: 'Services' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
              ].map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    style={{
                      color: '#c77dff',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      transition: 'color 0.3s',
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        {/* メインコンテンツ */}
        <main style={{ paddingTop: '80px' }}>
          {/* ヒーローセクション */}
          <section id="home" style={{
            padding: '8rem 2rem 4rem',
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'inline-block',
              padding: '0.5rem 1.5rem',
              background: 'rgba(157, 78, 221, 0.2)',
              border: '1px solid rgba(157, 78, 221, 0.4)',
              borderRadius: '2rem',
              marginBottom: '2rem',
            }}>
              <span style={{
                fontSize: '0.9rem',
                color: '#c77dff',
                fontWeight: '600',
              }}>
                ✨ 99.9% Uptime | 54 Sites Monitored
              </span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1.5rem',
              lineHeight: 1.2,
            }}>
              製造業PM 17年 ×<br />フルスタック実装力
            </h2>

            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              color: 'rgba(199, 125, 255, 0.9)',
              marginBottom: '1rem',
              lineHeight: 1.7,
              maxWidth: '800px',
              margin: '0 auto 1rem',
            }}>
              54ECサイトを24時間監視。<br />
              月間10万件のデータを0.1%未満のエラー率で処理。
            </p>

            <p style={{
              fontSize: 'clamp(0.95rem, 2vw, 1.2rem)',
              color: 'rgba(199, 125, 255, 0.7)',
              marginBottom: '3rem',
              lineHeight: 1.7,
            }}>
              エンタープライズ顧客が「please help us」と頼る、<br />
              課題を正確に理解し、技術で解決するプロダクトマネージャー。
            </p>

            <div style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <Link
                href="/contact"
                style={{
                  background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
                  color: 'white',
                  padding: '1.25rem 3rem',
                  borderRadius: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  boxShadow: '0 10px 30px rgba(157, 78, 221, 0.3)',
                  transition: 'all 0.3s',
                }}
              >
                無料相談を予約 →
              </Link>

              <a
                href="#projects"
                style={{
                  background: 'transparent',
                  color: '#c77dff',
                  padding: '1.25rem 3rem',
                  borderRadius: '1rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                  border: '2px solid rgba(157, 78, 221, 0.5)',
                  transition: 'all 0.3s',
                }}
              >
                実績を見る
              </a>
            </div>
          </section>

          {/* 実績数値 */}
          <section style={{
            padding: '4rem 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(250px, 100%), 1fr))',
              gap: '2rem',
            }}>
              {[
                { value: '54', label: 'ECサイト監視', sub: '24時間365日自動運用' },
                { value: '99.9%', label: '稼働率', sub: '11ヶ月連続達成' },
                { value: '17年', label: 'PM経験', sub: 'エンタープライズBtoB' },
                { value: '10万+', label: '月間処理', sub: 'データ件数' },
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(157, 78, 221, 0.08)',
                    border: '1px solid rgba(157, 78, 221, 0.2)',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '0.5rem',
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '1.1rem',
                    color: 'white',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(199, 125, 255, 0.7)',
                  }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* プロジェクト一覧 */}
          <section id="projects" style={{
            padding: '6rem 2rem',
            maxWidth: '1400px',
            margin: '0 auto',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1rem',
              }}>
                実績プロジェクト
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(199, 125, 255, 0.8)',
              }}>
                本番運用レベルの技術実装と、確実なビジネス成果
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(500px, 100%), 1fr))',
              gap: '3rem',
            }}>
              {projects.map((project, index) => (
                <article
                  key={project.id}
                  style={{
                    background: 'rgba(157, 78, 221, 0.08)',
                    border: '1px solid rgba(157, 78, 221, 0.2)',
                    borderRadius: '1.5rem',
                    padding: '3rem',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{
                    fontSize: '0.9rem',
                    color: '#9d4edd',
                    fontWeight: '700',
                    marginBottom: '1rem',
                  }}>
                    PROJECT {String(index + 1).padStart(2, '0')}
                  </div>

                  <h3 style={{
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '1rem',
                    lineHeight: 1.3,
                  }}>
                    {project.title}
                  </h3>

                  <p style={{
                    color: 'rgba(199, 125, 255, 0.8)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    marginBottom: '2rem',
                  }}>
                    {project.description}
                  </p>

                  {project.metrics && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '1.5rem',
                      marginBottom: '2rem',
                    }}>
                      {project.metrics.map((metric, i) => (
                        <div key={i}>
                          <div style={{
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '0.25rem',
                          }}>
                            {metric.value}
                          </div>
                          <div style={{
                            fontSize: '0.85rem',
                            color: 'rgba(199, 125, 255, 0.7)',
                          }}>
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    marginBottom: '2rem',
                  }}>
                    {project.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        style={{
                          color: 'rgba(199, 125, 255, 0.9)',
                          marginBottom: '0.75rem',
                          paddingLeft: '1.5rem',
                          position: 'relative',
                        }}
                      >
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          color: '#9d4edd',
                          fontWeight: 'bold',
                        }}>
                          ✓
                        </span>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '2rem',
                  }}>
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(157, 78, 221, 0.15)',
                          border: '1px solid rgba(157, 78, 221, 0.3)',
                          borderRadius: '0.5rem',
                          fontSize: '0.85rem',
                          color: '#c77dff',
                          fontWeight: '500',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#9d4edd',
                        textDecoration: 'none',
                        fontSize: '1rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      詳細を見る
                      <span style={{ fontSize: '1.2rem' }}>→</span>
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* サービスセクション（省略版） */}
          <section style={{
            padding: '6rem 2rem',
            background: 'rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1rem',
              }}>
                提供サービス
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(199, 125, 255, 0.8)',
                marginBottom: '3rem',
              }}>
                実績に基づく、確実なソリューション提供
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
                gap: '2rem',
                marginBottom: '3rem',
              }}>
                {[
                  {
                    icon: '🔍',
                    title: 'スクレイピングシステム構築',
                    price: '80-150万円',
                    period: '一括',
                    features: ['54サイト統合実績', '99.9%稼働率保証', '24/7自動監視', 'VPS/Docker完備'],
                  },
                  {
                    icon: '📊',
                    title: 'BtoB PM支援',
                    price: '60-100万円',
                    period: '月額（週2-3日）',
                    features: ['17年PM経験', 'エンタープライズ折衝', '技術的意思決定', '実装まで理解'],
                  },
                  {
                    icon: '🧪',
                    title: 'QA自動化構築',
                    price: '50-80万円',
                    period: '一括',
                    features: ['Playwright実装', '93%成功率実績', 'CI/CD統合', 'AIテスト生成'],
                  },
                ].map((service, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(157, 78, 221, 0.08)',
                      border: '1px solid rgba(157, 78, 221, 0.2)',
                      borderRadius: '1.5rem',
                      padding: '2.5rem',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{service.icon}</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '1rem',
                    }}>
                      {service.title}
                    </h3>
                    <div style={{
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '0.5rem',
                    }}>
                      {service.price}
                    </div>
                    <p style={{
                      color: 'rgba(199, 125, 255, 0.7)',
                      marginBottom: '2rem',
                    }}>
                      {service.period}
                    </p>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      textAlign: 'left',
                    }}>
                      {service.features.map((feature, j) => (
                        <li
                          key={j}
                          style={{
                            color: 'rgba(199, 125, 255, 0.9)',
                            marginBottom: '0.75rem',
                            paddingLeft: '1.5rem',
                            position: 'relative',
                          }}
                        >
                          <span style={{
                            position: 'absolute',
                            left: 0,
                            color: '#9d4edd',
                            fontWeight: 'bold',
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

              <Link
                href="/services"
                style={{
                  color: '#9d4edd',
                  textDecoration: 'none',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                詳細を見る →
              </Link>
            </div>
          </section>

          {/* ブログセクション */}
          <section style={{
            padding: '6rem 2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1rem',
              }}>
                技術記事
              </h2>
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(199, 125, 255, 0.8)',
                marginBottom: '2rem',
              }}>
                Zenn・Qiita・noteから自動収集（Next.js ISR）
              </p>
              <Link
                href="/blog"
                style={{
                  background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
                  color: 'white',
                  padding: '1rem 2.5rem',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                記事一覧を見る →
              </Link>
            </div>
          </section>

          {/* CTA */}
          <section style={{
            padding: '6rem 2rem',
            background: 'rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{
              maxWidth: '900px',
              margin: '0 auto',
              textAlign: 'center',
            }}>
              <h2 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '1.5rem',
              }}>
                まずは無料相談から
              </h2>

              <p style={{
                fontSize: '1.2rem',
                color: 'rgba(199, 125, 255, 0.9)',
                marginBottom: '2.5rem',
                lineHeight: 1.7,
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
                }}
              >
                今すぐ相談する →
              </Link>
            </div>
          </section>
        </main>

        {/* フッター */}
        <footer style={{
          padding: '3rem 2rem',
          textAlign: 'center',
          borderTop: '1px solid rgba(157, 78, 221, 0.2)',
          color: 'rgba(199, 125, 255, 0.7)',
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
