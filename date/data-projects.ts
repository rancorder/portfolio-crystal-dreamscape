// data/projects.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  url?: string;
  metrics?: Array<{ value: string; label: string }>;
  highlights: string[];
  technologies: string[];
}

export const projects: Project[] = [
  {
    id: '1',
    title: '54ECサイト統合スクレイピングシステム',
    description: '54のECサイトを24時間365日監視し、新規出品を自動検知。月間10万件以上のデータを0.1%未満のエラー率で処理する本番運用システム。',
    metrics: [
      { value: '54', label: 'サイト数' },
      { value: '99.9%', label: '稼働率' },
      { value: '11ヶ月', label: '連続運用' },
      { value: '10万+', label: '月間処理' }
    ],
    highlights: [
      '24/7自動監視、VPS上でDocker運用',
      '差分検知アルゴリズムによる新規出品即座通知',
      'SQLite WALモード採用、同時書き込み対応'
    ],
    technologies: ['Python', 'Playwright', 'SQLite', 'Docker', 'VPS', 'Chatwork API'],
    url: 'https://github.com/rancorder'
  },
  {
    id: '2',
    title: 'QA自動化フレームワーク構築',
    description: 'Playwrightベースの包括的テストフレームワーク。E2E、API、Visual Regressionテストを統合し、93%の成功率を実現。',
    metrics: [
      { value: '67/72', label: 'テスト成功' },
      { value: '93%', label: '成功率' },
      { value: '3種', label: 'テストタイプ' },
      { value: 'AI', label: 'テスト生成' }
    ],
    highlights: [
      'E2E/API/Visual Regression統合テスト',
      'AIによる自動テスト生成機能実装',
      'CI/CD統合、詳細レポート自動生成'
    ],
    technologies: ['Playwright', 'TypeScript', 'pytest', 'Docker', 'GitHub Actions'],
    url: 'https://github.com/rancorder'
  },
  {
    id: '3',
    title: '株価予測システム',
    description: 'XGBoostを用いた機械学習による株価予測システム。R²スコア0.89を達成し、VPS上で24時間稼働。',
    metrics: [
      { value: '0.89', label: 'R² スコア' },
      { value: '24/7', label: '稼働' },
      { value: 'XGBoost', label: 'モデル' },
      { value: 'VPS', label: 'インフラ' }
    ],
    highlights: [
      'XGBoost機械学習モデル、R²スコア0.89達成',
      '特徴量エンジニアリング最適化実装',
      'VPS上で24時間稼働、自動予測システム'
    ],
    technologies: ['Python', 'XGBoost', 'pandas', 'scikit-learn', 'VPS'],
    url: 'https://github.com/rancorder'
  },
  {
    id: '4',
    title: 'SRE実証システム',
    description: 'k6負荷試験、Prometheus/Grafana監視を統合したSREベストプラクティス実装システム。',
    metrics: [
      { value: '13,060', label: 'リクエスト' },
      { value: '0%', label: 'エラー率' },
      { value: '1.69ms', label: '平均応答' },
      { value: '24/7', label: '監視' }
    ],
    highlights: [
      'k6負荷試験、13,060リクエスト正常処理',
      'Prometheus/Grafana統合監視システム',
      '平均応答時間1.69ms、エラー率0%達成'
    ],
    technologies: ['k6', 'Prometheus', 'Grafana', 'Docker', 'VPS'],
    url: 'https://github.com/rancorder'
  },
  {
    id: '5',
    title: '音声感情分析システム',
    description: 'Whisper、BERT、OpenSMILEを統合した高精度音声感情分析システム。精度85%を達成。',
    metrics: [
      { value: '85%', label: '精度' },
      { value: '3モデル', label: '統合' },
      { value: 'リアルタイム', label: '処理' },
      { value: 'API', label: '提供' }
    ],
    highlights: [
      'Whisper音声認識、BERT感情分析、OpenSMILE音響特徴統合',
      '3モデル統合アーキテクチャ、精度85%達成',
      'リアルタイム処理、REST API提供'
    ],
    technologies: ['Whisper', 'BERT', 'OpenSMILE', 'Python', 'FastAPI'],
    url: 'https://github.com/rancorder'
  },
  {
    id: '6',
    title: 'Crystal Dreamscape Portfolio',
    description: 'Next.js 14 ISRによる技術記事自動集約サイト。Zenn/Qiita/noteから1時間ごと自動更新。',
    metrics: [
      { value: '1時間', label: 'ISR更新' },
      { value: '3サイト', label: '統合' },
      { value: 'Canvas', label: 'パーティクル' },
      { value: '自動', label: '更新' }
    ],
    highlights: [
      'Next.js 14 App Router、ISR 1時間自動更新',
      'Zenn/Qiita/note RSS API統合',
      'Canvas API パーティクル背景実装'
    ],
    technologies: ['Next.js 14', 'TypeScript', 'Canvas API', 'ISR', 'RSS Parser'],
    url: 'https://github.com/rancorder/portfolio-nextjs'
  }
];
