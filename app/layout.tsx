// app/layout.tsx - 修正版
import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@/components/Analytics'

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-crystal-dreamscape.vercel.app'),
  
  title: 'AI Art Studio - プロが教えるAI画像生成の極意 | 広島発',
  description: 'AI画像生成のプロ集団が運営。Midjourney、Stable Diffusion、DALL-Eの実践テクニック、プロンプト作成の秘訣、企業導入事例を完全公開。',
  
  keywords: ['AI画像生成', 'Midjourney', 'Stable Diffusion', 'プロンプト', 'Crystal Dreamscape'],
  
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://portfolio-crystal-dreamscape.vercel.app/',
    siteName: 'AI Art Studio',
    title: 'AI Art Studio - AI画像生成の総合メディア',
    description: 'プロが教えるAI画像生成テクニック完全ガイド',
  },
  
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-74PCYJ4PPZ"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-74PCYJ4PPZ', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
```

5. Commit message:
```
   fix: globals.css import削除
```

6. **Commit changes** をクリック

---

## 🚀 **再デプロイ確認**

1. Vercelが自動で再ビルド開始（1-2分）

2. デプロイ状況確認:
```
   https://vercel.com/
   → Deployments
   → 🟢 Ready になるのを待つ
```

---

## 📋 **もし globals.css が実際に必要な場合**

プロジェクトに元々スタイルがあった場合:

### **方法2: globals.css を探して確認**

既存のCSSファイルがあるか確認:
```
https://github.com/rancorder/portfolio-crystal-dreamscape/tree/main/app
```

- `globals.css` があるか？
- `styles.css` などの別名か？

**あれば教えてくれ。そのファイル名に合わせて修正する。**

---

## ✅ **PM殿、今すぐやること**
```
□ layout.tsx を開く
□ import './globals.css' の行を削除
□ 上記の修正版コードに置き換え
□ Commit
□ Vercel再ビルド待機
