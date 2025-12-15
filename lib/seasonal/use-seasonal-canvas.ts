// lib/seasonal/use-seasonal-canvas.ts
/**
 * 季節エフェクト Reactフック
 * エンタープライズグレード実装
 */

import { useEffect, useRef, useState } from 'react';
import { detectCurrentSeason, getSeasonConfig } from './detector';
import { createParticles, updateParticles, cleanupParticles } from './particle-manager';
import { drawParticle } from './renderer';
import { Particle, SeasonConfig, SeasonType } from './types';
import { PERFORMANCE_CONFIG } from './config';

export function useSeasonalCanvas(canvasId: string = 'canvas-seasonal') {
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef<number>(0);
  const [currentSeason, setCurrentSeason] = useState<SeasonType>('spring');
  const [seasonConfig, setSeasonConfig] = useState<SeasonConfig | null>(null);

  useEffect(() => {
    // 季節判定
    const season = detectCurrentSeason();
    const config = getSeasonConfig(season);
    
    setCurrentSeason(season);
    setSeasonConfig(config);

    console.log('🌸 Seasonal System Initialized');
    console.log(`Current Season: ${config.name} ${config.emoji}`);
    console.log(`Particle Count: ${config.particleCount}`);
    console.log(`Shape: ${config.shape}`);

    // Canvas取得
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      console.error(`Canvas element #${canvasId} not found`);
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      console.error('Failed to get 2D context');
      return;
    }

    // Canvas サイズ設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // リサイズ時にパーティクルを再生成
      particlesRef.current = createParticles(config, canvas.width, canvas.height);
    };
    resizeCanvas();

    // パーティクル初期化
    particlesRef.current = createParticles(config, canvas.width, canvas.height);

    // マウスイベント
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // タッチイベント（モバイル対応）
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('resize', resizeCanvas);

    // アニメーションループ
    let frameCount = 0;
    const animate = (currentTime: number) => {
      // Delta time計算（フレームレート独立）
      const deltaTime = lastTimeRef.current
        ? Math.min((currentTime - lastTimeRef.current) / 16.67, 2) // 最大2フレーム分
        : 1;
      lastTimeRef.current = currentTime;

      // パフォーマンスモード：フレームスキップ
      frameCount++;
      if (PERFORMANCE_CONFIG.enablePerformanceMode && frameCount % 2 === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // クリア
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // パーティクル更新
      particlesRef.current = updateParticles(
        particlesRef.current,
        config,
        canvas.width,
        canvas.height,
        mouseRef.current.x,
        mouseRef.current.y,
        deltaTime
      );

      // パーティクル描画
      particlesRef.current.forEach((particle) => {
        drawParticle(config.shape, particle, ctx, currentTime);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    // アニメーション開始
    animationRef.current = requestAnimationFrame(animate);

    // クリーンアップ
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resizeCanvas);
      cleanupParticles(particlesRef.current);
      
      console.log('🌸 Seasonal System Cleaned Up');
    };
  }, []); // 空の依存配列：マウント時のみ実行

  return {
    currentSeason,
    seasonConfig,
  };
}
