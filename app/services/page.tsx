// app/services/page.tsx
'use client';

import Link from 'next/link';

export default function ServicesPage() {
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
                    color: item.href === '/services' ? 'white' : '#c77dff',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: item.href === '/services' ? 'bold' : '500',
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
        <section style={{ 
          textAlign: 'center', 
          marginBottom: '6rem',
          maxWidth: '1000px',
          margin: '0 auto 6rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem'
          }}>
            提供サービス
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            color: 'rgba(199, 125, 255, 0.9)',
            lineHeight: 1.7,
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            17年のPM経験と本番運用レベルの技術実装力で、<br />
            御社の課題を確実に解決します。
          </p>
        </section>

        {/* サービス詳細 */}
        <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            
            {/* サービス1: スクレイピング */}
            <div style={{
              background: 'rgba(157, 78, 221, 0.08)',
              border: '1px solid rgba(157, 78, 221, 0.2)',
              borderRadius: '1.5rem',
              padding: '3rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
              gap: '3rem'
            }}>
              <div>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  スクレイピングシステム構築
                </h2>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}>
                  80-150万円
                </div>
                <p style={{ color: 'rgba(199, 125, 255, 0.7)', marginBottom: '2rem' }}>
                  一括料金
                </p>
              </div>

              <div>
                <h3 style={{ color: '#c77dff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  提供内容
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {[
                    '要件定義・システム設計',
                    'スクレイピングロジック実装',
                    'データベース設計・構築',
                    'VPS環境構築・Docker設定',
                    '24/7監視システム構築',
                    'エラー通知・リカバリー機能',
                    '3ヶ月間の運用サポート'
                  ].map((item, i) => (
                    <li key={i} style={{
                      color: 'rgba(199, 125, 255, 0.9)',
                      marginBottom: '0.75rem',
                      paddingLeft: '1.5rem',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#9d4edd', fontWeight: 'bold' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 style={{ color: '#c77dff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  実績
                </h3>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    {[
                      { value: '54サイト', label: '統合監視' },
                      { value: '99.9%', label: '稼働率' },
                      { value: '11ヶ月', label: '連続運用' },
                      { value: '10万+', label: '月間処理' }
                    ].map((stat, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(199, 125, 255, 0.7)' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* サービス2: PM支援 */}
            <div style={{
              background: 'rgba(157, 78, 221, 0.08)',
              border: '1px solid rgba(157, 78, 221, 0.2)',
              borderRadius: '1.5rem',
              padding: '3rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
              gap: '3rem'
            }}>
              <div>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  BtoB プロダクトPM支援
                </h2>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}>
                  60-100万円
                </div>
                <p style={{ color: 'rgba(199, 125, 255, 0.7)', marginBottom: '2rem' }}>
                  月額（週2-3日稼働）
                </p>
              </div>

              <div>
                <h3 style={{ color: '#c77dff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  提供内容
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {[
                    'プロダクト戦略策定',
                    '要件定義・仕様策定',
                    'エンタープライズ顧客折衝',
                    '技術的意思決定サポート',
                    '開発チームマネジメント',
                    'ステークホルダー調整',
                    'リスク管理・進捗管理'
                  ].map((item, i) => (
                    <li key={i} style={{
                      color: 'rgba(199, 125, 255, 0.9)',
                      marginBottom: '0.75rem',
                      paddingLeft: '1.5rem',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#9d4edd', fontWeight: 'bold' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 style={{ color: '#c77dff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  強み
                </h3>
                <p style={{ color: 'rgba(199, 125, 255, 0.9)', lineHeight: 1.7 }}>
                  17年のBtoB製造業PM経験 × 実装まで理解する技術力。エンタープライズ企業との折衝経験豊富で、「please help us」と頼られる課題解決力があります。
                </p>
              </div>
            </div>

            {/* サービス3: QA自動化 */}
            <div style={{
              background: 'rgba(157, 78, 221, 0.08)',
              border: '1px solid rgba(157, 78, 221, 0.2)',
              borderRadius: '1.5rem',
              padding: '3rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
              gap: '3rem'
            }}>
              <div>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🧪</div>
                <h2 style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  QA自動化・テスト構築
                </h2>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem'
                }}>
                  50-80万円
                </div>
                <p style={{ color: 'rgba(199, 125, 255, 0.7)', marginBottom: '2rem' }}>
                  一括料金
                </p>
              </div>

              <div>
                <h3 style={{ color: '#c77dff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  提供内容
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                  {[
                    'テスト戦略策定',
                    'Playwright E2Eテスト実装',
                    'API自動テスト構築',
                    'Visual Regressionテスト',
                    'CI/CD統合設定',
                    'AIテスト生成機能実装',
                    'レポート自動化'
                  ].map((item, i) => (
                    <li key={i} style={{
                      color: 'rgba(199, 125, 255, 0.9)',
                      marginBottom: '0.75rem',
                      paddingLeft: '1.5rem',
                      position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: '#9d4edd', fontWeight: 'bold' }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 style={{ color: '#c77dff', fontSize: '1.2rem', marginBottom: '1rem' }}>
                  実績
                </h3>
                <div style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '0.75rem',
                  padding: '1.5rem'
                }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem'
                  }}>
                    {[
                      { value: '67/72', label: 'テスト成功' },
                      { value: '93%', label: '成功率' },
                      { value: '3種類', label: 'テスト統合' },
                      { value: 'AI', label: '自動生成' }
                    ].map((stat, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(199, 125, 255, 0.7)' }}>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section style={{
          maxWidth: '900px',
          margin: '6rem auto 0',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(157, 78, 221, 0.15) 0%, rgba(199, 125, 255, 0.15) 100%)',
            border: '1px solid rgba(157, 78, 221, 0.3)',
            borderRadius: '2rem',
            padding: '3rem'
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
              marginBottom: '2.5rem',
              lineHeight: 1.7
            }}>
              御社の課題をお聞かせください。<br />
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
