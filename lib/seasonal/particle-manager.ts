// lib/seasonal/particle-manager.ts
/**
 * パーティクル管理システム
 * パーティクルの生成・更新・削除を管理
 */

import { Particle, SeasonConfig } from './types';
import { PHYSICS_CONFIG } from './config';

/**
 * パーティクル生成
 */
export function createParticles(
  config: SeasonConfig,
  canvasWidth: number,
  canvasHeight: number
): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < config.particleCount; i++) {
    particles.push(createParticle(config, canvasWidth, canvasHeight, i));
  }

  return particles;
}

/**
 * 単一パーティクル生成
 */
function createParticle(
  config: SeasonConfig,
  canvasWidth: number,
  canvasHeight: number,
  index: number
): Particle {
  const color = config.colors[Math.floor(Math.random() * config.colors.length)];

  return {
    id: `particle-${Date.now()}-${index}`,
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight - canvasHeight, // 画面上から開始
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() * 1.5 + 0.5) * config.speedMultiplier,
    radius: Math.random() * 4 + 2,
    color,
    alpha: Math.random() * 0.5 + 0.5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: config.rotationEnabled ? (Math.random() - 0.5) * 0.02 : 0,
    birthTime: Date.now(),
    glowPhase: Math.random() * Math.PI * 2, // 蛍用
  };
}

/**
 * パーティクル更新
 */
export function updateParticles(
  particles: Particle[],
  config: SeasonConfig,
  canvasWidth: number,
  canvasHeight: number,
  mouseX: number,
  mouseY: number,
  deltaTime: number
): Particle[] {
  return particles.map((particle) =>
    updateParticle(particle, config, canvasWidth, canvasHeight, mouseX, mouseY, deltaTime)
  );
}

/**
 * 単一パーティクル更新
 */
function updateParticle(
  particle: Particle,
  config: SeasonConfig,
  canvasWidth: number,
  canvasHeight: number,
  mouseX: number,
  mouseY: number,
  deltaTime: number
): Particle {
  const updated = { ...particle };

  // 重力と速度
  updated.y += updated.vy * deltaTime;
  updated.x += updated.vx * deltaTime;

  // 横揺れ（サイン波）
  updated.x += Math.sin(Date.now() * 0.001 + parseInt(updated.id.split('-')[2])) * 0.3;

  // 回転
  if (config.rotationEnabled) {
    updated.rotation += updated.rotationSpeed * deltaTime;
  }

  // マウスインタラクション
  if (config.mouseInteraction) {
    const dx = mouseX - updated.x;
    const dy = mouseY - updated.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < PHYSICS_CONFIG.mouseRepelRadius && dist > 0) {
      const force = PHYSICS_CONFIG.mouseRepelForce * (1 - dist / PHYSICS_CONFIG.mouseRepelRadius);
      updated.x -= (dx / dist) * force;
      updated.y -= (dy / dist) * force;
    }
  }

  // 画面外判定とリセット
  if (updated.y > canvasHeight + PHYSICS_CONFIG.boundaryPadding) {
    updated.y = -PHYSICS_CONFIG.boundaryPadding;
    updated.x = Math.random() * canvasWidth;
  }

  // 左右の境界
  if (updated.x < -PHYSICS_CONFIG.boundaryPadding) {
    updated.x = canvasWidth + PHYSICS_CONFIG.boundaryPadding;
  }
  if (updated.x > canvasWidth + PHYSICS_CONFIG.boundaryPadding) {
    updated.x = -PHYSICS_CONFIG.boundaryPadding;
  }

  return updated;
}

/**
 * パーティクルクリーンアップ
 * メモリリーク防止
 */
export function cleanupParticles(particles: Particle[]): void {
  particles.length = 0;
}

/**
 * パーティクル数を動的調整（パフォーマンス最適化）
 */
export function adjustParticleCount(
  currentCount: number,
  targetCount: number,
  config: SeasonConfig,
  canvasWidth: number,
  canvasHeight: number
): Particle[] {
  const particles: Particle[] = [];

  for (let i = 0; i < targetCount; i++) {
    particles.push(createParticle(config, canvasWidth, canvasHeight, i));
  }

  return particles;
}
