// lib/seasonal/config.ts
/**
 * 季節設定
 * 各季節のパーティクル設定を定義
 */

import { SeasonDefinition, SeasonConfig } from './types';

// 季節ごとのパーティクル設定
export const SEASON_CONFIGS: Record<string, SeasonConfig> = {
  spring: {
    name: '春',
    emoji: '🌸',
    particleCount: 150,
    colors: [
      'rgba(255, 183, 213, ', // 桜ピンク
      'rgba(255, 255, 255, ', // 白
      'rgba(255, 192, 203, ', // 淡いピンク
      'rgba(255, 218, 224, ', // 薄ピンク
    ],
    shape: 'sakura',
    speedMultiplier: 1.0,
    rotationEnabled: true,
    glowEffect: false,
    mouseInteraction: true,
    description: '桜吹雪が舞う春の風景',
  },

  rainy: {
    name: '梅雨',
    emoji: '☔',
    particleCount: 200,
    colors: [
      'rgba(173, 216, 230, ', // ライトブルー
      'rgba(135, 206, 235, ', // スカイブルー
      'rgba(176, 224, 230, ', // パウダーブルー
      'rgba(176, 196, 222, ', // ライトスティールブルー
    ],
    shape: 'raindrop',
    speedMultiplier: 4.0,
    rotationEnabled: false,
    glowEffect: false,
    mouseInteraction: false,
    description: '雨粒が降り注ぐ梅雨の情景',
  },

  summer: {
    name: '夏',
    emoji: '✨',
    particleCount: 80,
    colors: [
      'rgba(255, 255, 102, ', // 蛍の光（黄色）
      'rgba(255, 255, 153, ', // 淡い黄色
      'rgba(255, 255, 224, ', // レモン色
      'rgba(240, 255, 240, ', // ハニーデュー
    ],
    shape: 'firefly',
    speedMultiplier: 0.3,
    rotationEnabled: false,
    glowEffect: true,
    mouseInteraction: true,
    description: '蛍が舞う夏の夜',
  },

  autumn: {
    name: '秋',
    emoji: '🍁',
    particleCount: 120,
    colors: [
      'rgba(255, 140, 0, ',   // ダークオレンジ
      'rgba(178, 34, 34, ',   // ファイアブリック（赤）
      'rgba(255, 215, 0, ',   // ゴールド
      'rgba(210, 105, 30, ',  // チョコレート
      'rgba(139, 69, 19, ',   // サドルブラウン
    ],
    shape: 'maple',
    speedMultiplier: 1.3,
    rotationEnabled: true,
    glowEffect: false,
    mouseInteraction: true,
    description: '紅葉が舞い散る秋の風景',
  },

  winter: {
    name: '冬',
    emoji: '⛄',
    particleCount: 100,
    colors: [
      'rgba(255, 255, 255, ', // 純白
      'rgba(240, 248, 255, ', // アリスブルー
      'rgba(230, 230, 250, ', // ラベンダー
      'rgba(248, 248, 255, ', // ゴーストホワイト
    ],
    shape: 'snowflake',
    speedMultiplier: 0.8,
    rotationEnabled: true,
    glowEffect: true,
    mouseInteraction: true,
    description: '雪の結晶が降る冬の景色',
  },
};

// 季節の期間定義（日本の気候に合わせた正確な定義）
export const SEASON_DEFINITIONS: Record<string, SeasonDefinition> = {
  spring: {
    startMonth: 3,
    startDay: 1,
    endMonth: 5,
    endDay: 31,
    config: SEASON_CONFIGS.spring,
  },
  rainy: {
    startMonth: 6,
    startDay: 1,
    endMonth: 6,
    endDay: 30,
    config: SEASON_CONFIGS.rainy,
  },
  summer: {
    startMonth: 7,
    startDay: 1,
    endMonth: 8,
    endDay: 31,
    config: SEASON_CONFIGS.summer,
  },
  autumn: {
    startMonth: 9,
    startDay: 1,
    endMonth: 11,
    endDay: 30,
    config: SEASON_CONFIGS.autumn,
  },
  winter: {
    startMonth: 12,
    startDay: 1,
    endMonth: 2,
    endDay: 28, // 閏年は考慮しない（簡略化）
    config: SEASON_CONFIGS.winter,
  },
};

// パーティクル物理設定
export const PHYSICS_CONFIG = {
  gravity: 0.02,
  windForce: 0.1,
  mouseRepelRadius: 100,
  mouseRepelForce: 2,
  boundaryPadding: 50,
  terminalVelocity: 10,
};

// パフォーマンス設定
export const PERFORMANCE_CONFIG = {
  targetFPS: 60,
  enablePerformanceMode: true,
  reducedMotionSupport: true,
  maxParticles: 300,
};
