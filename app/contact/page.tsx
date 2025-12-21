// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 簡易送信（実際はFormspreeやメールサービスと連携）
    const mailtoLink = `mailto:your-email@example.com?subject=【問い合わせ】${formData.service || '一般'}&body=名前: ${formData.name}%0D%0Aメール: ${formData.email}%0D%0A会社名: ${formData.company}%0D%0Aサービス: ${formData.service}%0D%0A%0D%0Aメッセージ:%0D%0A${formData.message}`;
    
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'rgba(157, 78, 221, 0.1)',
          border: '1px solid rgba(157, 78, 221, 0.3)',
          borderRadius: '2rem',
          padding: '3rem',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>
            送信完了
          </h1>
          <p style={{
            color: 'rgba(199, 125, 255, 0.9)',
            marginBottom: '2rem',
            lineHeight: 1.7
          }}>
            お問い合わせありがとうございます。<br />
            48時間以内に返信いたします。
          </p>
          <Link
            href="/"
            style={{
              background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            トップページへ戻る
          </Link>
        </div>
      </div>
    );
  }

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
                    color: item.href === '/contact' ? 'white' : '#c77dff',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: item.href === '/contact' ? 'bold' : '500',
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
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* ヒーロー */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ffffff 0%, #c77dff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem'
            }}>
              お問い合わせ
            </h1>
            
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'rgba(199, 125, 255, 0.9)',
              lineHeight: 1.7
            }}>
              御社の課題をお聞かせください。<br />
              <strong style={{ color: '#c77dff' }}>48時間以内に返信</strong>いたします。
            </p>
          </div>

          {/* フォーム */}
          <div style={{
            background: 'rgba(157, 78, 221, 0.08)',
            border: '1px solid rgba(157, 78, 221, 0.2)',
            borderRadius: '1.5rem',
            padding: '3rem'
          }}>
            <form onSubmit={handleSubmit}>
              {/* 名前 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#c77dff',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  お名前 <span style={{ color: '#ff6b9d' }}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="山田 太郎"
                />
              </div>

              {/* メール */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#c77dff',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  メールアドレス <span style={{ color: '#ff6b9d' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="your-email@example.com"
                />
              </div>

              {/* 会社名 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#c77dff',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  会社名
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="株式会社サンプル"
                />
              </div>

              {/* サービス選択 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#c77dff',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  ご興味のあるサービス
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                >
                  <option value="">選択してください</option>
                  <option value="スクレイピングシステム構築">スクレイピングシステム構築</option>
                  <option value="BtoB PM支援">BtoB PM支援</option>
                  <option value="QA自動化構築">QA自動化構築</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              {/* メッセージ */}
              <div style={{ marginBottom: '2rem' }}>
                <label style={{
                  display: 'block',
                  color: '#c77dff',
                  marginBottom: '0.5rem',
                  fontWeight: '500'
                }}>
                  メッセージ <span style={{ color: '#ff6b9d' }}>*</span>
                </label>
                <textarea
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(157, 78, 221, 0.3)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    color: 'white',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                  placeholder="ご相談内容をご記入ください"
                />
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #9d4edd 0%, #c77dff 100%)',
                  color: 'white',
                  padding: '1.25rem',
                  borderRadius: '0.75rem',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  border: 'none',
                  cursor: 'pointer',
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
                送信する →
              </button>
            </form>

            {/* 注意事項 */}
            <p style={{
              marginTop: '1.5rem',
              fontSize: '0.85rem',
              color: 'rgba(199, 125, 255, 0.6)',
              textAlign: 'center'
            }}>
              お送りいただいた情報は、お問い合わせ対応のみに使用いたします。
            </p>
          </div>
        </div>
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
