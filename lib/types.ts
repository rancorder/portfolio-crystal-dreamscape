// lib/seasonal/types.ts
/**
 * 季節エフェクトシステム - 型定義
 * エンタープライズグレード実装
 */

export type SeasonType = 'spring' | 'rainy' | 'summer' | 'autumn' | 'winter';

export type ParticleShape = 'sakura' | 'raindrop' | 'firefly' | 'maple' | 'snowflake';

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  birthTime: number;
  lifetime?: number;
  glowPhase?: number; // 蛍用
}

export interface SeasonConfig {
  name: string;
  emoji: string;
  particleCount: number;
  colors: string[];
  shape: ParticleShape;
  speedMultiplier: number;
  rotationEnabled: boolean;
  glowEffect: boolean;
  mouseInteraction: boolean;
  description: string;
}

export interface SeasonDefinition {
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  config: SeasonConfig;
}

export interface CanvasContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
}

export interface DrawOptions {
  particle: Particle;
  context: CanvasContext;
  time: number;
  mouseX: number;
  mouseY: number;
}
