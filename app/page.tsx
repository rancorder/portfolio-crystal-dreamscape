// app/page.tsx
import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  title: 'Home | ひろしまいける Portfolio',
  description: '製造業PM17年 × フルスタック実装 | エンタープライズ折衝からコード実装まで一気通貫',
  openGraph: {
    title: 'ひろしまいける Portfolio',
    description: '製造業PM17年 × フルスタック実装',
  },
}

export default function HomePage() {
  return (
    <>
      {/* 季節エフェクト背景 */}
      <SeasonalCanvas />

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
              {projects.slice(0, 3).map((project, index) => (
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
                    {project.highlights.slice(0, 3).map((highlight, i) => (
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
                  }}>
                    {project.technologies.slice(0, 4).map((tech, i) => (
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
                </article>
              ))}
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
