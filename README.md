# 🌸 Crystal Dreamscape Portfolio - Next.js ISR Implementation

[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR-BADGE-ID/deploy-status)](https://app.netlify.com/sites/YOUR-SITE/deploys)

> **女性受け × 圧倒的ビジュアル × Next.js実績証明**  
> Zenn/Qiita自動更新システム搭載の次世代ポートフォリオ

---

## ✨ 特徴

### 🎨 デザイン
- **Crystal Dreamscape**: 宝石のような透明感 × 3D桜吹雪エフェクト
- **Three.js**: 200個のパーティクルによるインタラクティブ背景
- **Glassmorphism**: フロストガラス風の洗練されたUI
- **GSAP**: スクロールトリガー連動のスムーズアニメーション

### ⚡ 技術実装
- **Next.js 14**: App Router + ISR（1時間自動更新）
- **TypeScript**: 完全型安全実装
- **RSS Parser**: Zenn/Qiita記事自動取得
- **API Routes**: サーバーレスアーキテクチャ

### 📊 パフォーマンス
- **Lighthouse**: Performance 95+ 目標
- **Core Web Vitals**: すべてGreen
- **CDN Cache**: Netlify Edge Network
- **ISR**: ユーザー体験を損なわない更新

---

## 🚀 クイックスタート

### 前提条件
- Node.js 18+ 
- npm or yarn
- Git

### インストール

```bash
# リポジトリクローン
git clone https://github.com/rancorder/portfolio-crystal-dreamscape.git
cd /portfolio-crystal-dreamscape

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバー: http://localhost:3000  
API エンドポイント: http://localhost:3000/api/articles

---

## 📁 プロジェクト構造

```
portfolio-nextjs/
├── app/
│   ├── api/
│   │   └── articles/
│   │       └── route.ts         # ISR記事取得API
│   ├── page.tsx                 # メインページ
│   └── layout.tsx               # ルートレイアウト
├── lib/
│   ├── rss-parser.ts            # RSS取得ロジック
│   └── types.ts                 # TypeScript型定義
├── components/                  # React Components
├── public/
│   └── index.html              # 静的HTML版（デモ用）
├── package.json
├── next.config.js
├── tsconfig.json
└── README.md
```

---

## 🔧 API仕様

### `GET /api/articles`

Zenn・Qiitaから最新記事を取得

**Response:**
```json
{
  "success": true,
  "articles": [
    {
      "id": "article-id",
      "title": "記事タイトル",
      "url": "https://zenn.dev/...",
      "excerpt": "記事の抜粋...",
      "publishedAt": "2025-01-15T10:00:00Z",
      "platform": "Zenn",
      "tags": ["Next.js", "React"]
    }
  ],
  "count": 20,
  "timestamp": "2025-01-15T12:00:00Z"
}
```

**ISR設定:**
- `revalidate: 3600` (1時間)
- `Cache-Control: public, s-maxage=3600, stale-while-revalidate=7200`

---

## 🌐 デプロイ (Netlify)

### GitHub連携

```bash
# GitHubにプッシュ
git add .
git commit -m "feat: Next.js ISR implementation"
git push origin main
```

### Netlify設定

1. **New site from Git** → GitHub選択
2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: `18`
3. **Deploy!**

### 環境変数（不要）
- Zenn/QiitaはRSS/公開APIのため認証不要

---

## 📈 実績アピールポイント

### フロントエンド案件獲得用

✅ **Next.js ISR完全実装**  
「1時間ごとの自動更新で常に最新情報を表示」

✅ **TypeScript型安全開発**  
「大規模開発に耐える堅牢な型定義」

✅ **API統合経験**  
「Zenn/QiitaのRSS/API統合実装」

✅ **パフォーマンス最適化**  
「Lighthouse 95点以上のWebVitals最適化」

✅ **女性受けデザイン**  
「Three.js + Glassmorphismの次世代UI」

---

## 🎯 Next Steps

### 追加実装候補

1. **記事検索機能**
   - Full-text search
   - Tag filtering

2. **OGP画像生成**
   - Next.js Image Optimization
   - Dynamic OG images

3. **Analytics統合**
   - Google Analytics 4
   - Vercel Analytics

4. **PWA化**
   - Service Worker
   - Offline support

---

## 📝 技術記事執筆案

### Zenn投稿候補

1. 「Next.js ISRで実現するZenn/Qiita自動更新システム」
2. 「Three.jsで作る女性受けポートフォリオサイト」
3. 「TypeScript完全型安全なRSSパーサー実装」

### Qiita投稿候補

1. 「Next.js 14 App Router完全攻略」
2. 「ISRとSSG/SSRの使い分け実践ガイド」
3. 「Netlify最適化テクニック集」

---

## 👥 チーム

**AI Art Studio - Crystal Team**
- プロデューサーひで (Tech Lead)
- 三姉妹 (Development)

---

## 📄 License

MIT License - 自由に使用・改変可能

---

## 🔗 Links

- **Live Demo**: https://your-site.netlify.app
- **GitHub**: https://github.com/rancorder/portfolio-nextjs
- **Zenn**: https://zenn.dev/supermassu
- **Qiita**: https://qiita.com/rancorder

---

**Made with 💎 Crystal Dreamscape by AI Art Studio**
