// lib/seasonal/renderer.ts
/**
 * パーティクル描画エンジン
 * 各季節のエフェクトを描画
 */

import { Particle, CanvasContext, ParticleShape } from './types';

/**
 * パーティクル描画メインファンクション
 */
export function drawParticle(
  shape: ParticleShape,
  particle: Particle,
  ctx: CanvasRenderingContext2D,
  time: number
): void {
  switch (shape) {
    case 'sakura':
      drawSakura(ctx, particle);
      break;
    case 'raindrop':
      drawRaindrop(ctx, particle);
      break;
    case 'firefly':
      drawFirefly(ctx, particle, time);
      break;
    case 'maple':
      drawMaple(ctx, particle);
      break;
    case 'snowflake':
      drawSnowflake(ctx, particle);
      break;
  }
}

/**
 * 桜の花びら（春）
 */
function drawSakura(ctx: CanvasRenderingContext2D, particle: Particle): void {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = particle.alpha;

  // 5枚の花びら
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 5);

    // グラデーション
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.radius);
    gradient.addColorStop(0, particle.color + '1)');
    gradient.addColorStop(0.5, particle.color + '0.8)');
    gradient.addColorStop(1, particle.color + '0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(
      0,
      -particle.radius * 0.3,
      particle.radius * 0.6,
      particle.radius,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

/**
 * 雨粒（梅雨）
 */
function drawRaindrop(ctx: CanvasRenderingContext2D, particle: Particle): void {
  ctx.save();
  ctx.globalAlpha = particle.alpha;

  // 縦長のグラデーション
  const gradient = ctx.createLinearGradient(
    particle.x,
    particle.y - particle.radius * 2,
    particle.x,
    particle.y + particle.radius
  );
  gradient.addColorStop(0, particle.color + '0.8)');
  gradient.addColorStop(1, particle.color + '0.2)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.moveTo(particle.x, particle.y - particle.radius * 2);
  ctx.lineTo(particle.x - particle.radius * 0.4, particle.y);
  ctx.quadraticCurveTo(
    particle.x,
    particle.y + particle.radius,
    particle.x + particle.radius * 0.4,
    particle.y
  );
  ctx.closePath();
  ctx.fill();

  // 尻尾の線
  ctx.strokeStyle = particle.color + '0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(particle.x, particle.y - particle.radius * 2);
  ctx.lineTo(particle.x, particle.y - particle.radius * 3);
  ctx.stroke();

  ctx.restore();
}

/**
 * 蛍（夏）
 */
function drawFirefly(
  ctx: CanvasRenderingContext2D,
  particle: Particle,
  time: number
): void {
  ctx.save();

  // 点滅効果（サイン波）
  const glowPhase = particle.glowPhase || 0;
  const glow = Math.sin(time * 0.003 + glowPhase) * 0.5 + 0.5;
  ctx.globalAlpha = particle.alpha * glow;

  // 外側の光（大きい、薄い）
  const outerGradient = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    particle.radius * 4
  );
  outerGradient.addColorStop(0, particle.color + '0.8)');
  outerGradient.addColorStop(0.3, particle.color + '0.4)');
  outerGradient.addColorStop(1, particle.color + '0)');

  ctx.fillStyle = outerGradient;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
  ctx.fill();

  // 内側の光（小さい、濃い）
  const innerGradient = ctx.createRadialGradient(
    particle.x,
    particle.y,
    0,
    particle.x,
    particle.y,
    particle.radius
  );
  innerGradient.addColorStop(0, particle.color + '1)');
  innerGradient.addColorStop(1, particle.color + '0.6)');

  ctx.fillStyle = innerGradient;
  ctx.beginPath();
  ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * もみじ（秋）
 */
function drawMaple(ctx: CanvasRenderingContext2D, particle: Particle): void {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = particle.alpha;

  ctx.fillStyle = particle.color + '1)';
  ctx.strokeStyle = particle.color + '0.8)';
  ctx.lineWidth = 0.5;

  // もみじの7つの尖った葉
  ctx.beginPath();

  const points = 7;
  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * 2 * i) / (points * 2);
    const radius = i % 2 === 0 ? particle.radius : particle.radius * 0.5;

    const x = Math.cos(angle - Math.PI / 2) * radius;
    const y = Math.sin(angle - Math.PI / 2) * radius;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 葉脈
  ctx.strokeStyle = particle.color + '0.5)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < points; i++) {
    const angle = (Math.PI * 2 * i) / points - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
      Math.cos(angle) * particle.radius * 0.8,
      Math.sin(angle) * particle.radius * 0.8
    );
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * 雪の結晶（冬）
 */
function drawSnowflake(ctx: CanvasRenderingContext2D, particle: Particle): void {
  ctx.save();
  ctx.translate(particle.x, particle.y);
  ctx.rotate(particle.rotation);
  ctx.globalAlpha = particle.alpha;

  ctx.strokeStyle = particle.color + '1)';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';

  // 6方向の結晶
  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 6);

    // メインの軸
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -particle.radius);
    ctx.stroke();

    // 枝（上部）
    ctx.beginPath();
    ctx.moveTo(0, -particle.radius * 0.7);
    ctx.lineTo(-particle.radius * 0.25, -particle.radius * 0.85);
    ctx.moveTo(0, -particle.radius * 0.7);
    ctx.lineTo(particle.radius * 0.25, -particle.radius * 0.85);
    ctx.stroke();

    // 枝（中部）
    ctx.beginPath();
    ctx.moveTo(0, -particle.radius * 0.4);
    ctx.lineTo(-particle.radius * 0.2, -particle.radius * 0.52);
    ctx.moveTo(0, -particle.radius * 0.4);
    ctx.lineTo(particle.radius * 0.2, -particle.radius * 0.52);
    ctx.stroke();

    ctx.restore();
  }

  // 中心の六角形
  ctx.fillStyle = particle.color + '0.8)';
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6;
    const x = Math.cos(angle) * particle.radius * 0.15;
    const y = Math.sin(angle) * particle.radius * 0.15;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

/**
 * パフォーマンス最適化：パーティクルのバッチ描画
 */
export function batchDrawParticles(
  shape: ParticleShape,
  particles: Particle[],
  ctx: CanvasRenderingContext2D,
  time: number
): void {
  // 同じ形状をまとめて描画することで効率化
  particles.forEach((particle) => {
    drawParticle(shape, particle, ctx, time);
  });
}
