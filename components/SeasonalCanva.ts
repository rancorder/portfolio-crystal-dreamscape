// components/SeasonalCanvas.tsx
'use client';

import { useEffect, useRef } from 'react';

export function SeasonalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // Canvas サイズ設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    // 現在の季節判定
    const getSeason = () => {
      const month = new Date().getMonth() + 1;
      if (month >= 3 && month <= 5) return 'spring';
      if (month === 6) return 'rainy';
      if (month >= 7 && month <= 8) return 'summer';
      if (month >= 9 && month <= 11) return 'autumn';
      return 'winter';
    };

    const season = getSeason();

    // 季節ごとの設定
    const seasonConfig: Record<string, {
      count: number;
      colors: string[];
      shape: string;
      speed: number;
    }> = {
      spring: {
        count: 80,
        colors: ['rgba(255, 183, 213, 0.8)', 'rgba(255, 192, 203, 0.8)'],
        shape: 'sakura',
        speed: 1.0
      },
      rainy: {
        count: 120,
        colors: ['rgba(173, 216, 230, 0.7)', 'rgba(135, 206, 235, 0.7)'],
        shape: 'rain',
        speed: 4.0
      },
      summer: {
        count: 50,
        colors: ['rgba(255, 255, 102, 0.8)', 'rgba(255, 255, 153, 0.8)'],
        shape: 'firefly',
        speed: 0.3
      },
      autumn: {
        count: 80,
        colors: ['rgba(255, 140, 0, 0.8)', 'rgba(178, 34, 34, 0.8)', 'rgba(255, 215, 0, 0.8)'],
        shape: 'maple',
        speed: 1.3
      },
      winter: {
        count: 100,
        colors: ['rgba(255, 255, 255, 0.8)', 'rgba(240, 248, 255, 0.8)'],
        shape: 'snowflake',
        speed: 0.8
      }
    };

    const config = seasonConfig[season];

    // パーティクル生成
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      rotation: number;
      rotationSpeed: number;
      glowPhase: number;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() * 1.5 + 0.5) * config.speed,
        radius: Math.random() * 4 + 2,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        glowPhase: Math.random() * Math.PI * 2
      });
    }

    // 桜描画
    const drawSakura = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / 5);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, -p.radius * 0.3, p.radius * 0.6, p.radius, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    };

    // 雨描画
    const drawRain = (p: Particle) => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - p.radius * 2);
      ctx.lineTo(p.x - p.radius * 0.4, p.y);
      ctx.quadraticCurveTo(p.x, p.y + p.radius, p.x + p.radius * 0.4, p.y);
      ctx.closePath();
      ctx.fill();
    };

    // 蛍描画
    const drawFirefly = (p: Particle, time: number) => {
      const glow = Math.sin(time * 0.003 + p.glowPhase) * 0.5 + 0.5;
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, 'rgba(255, 255, 102, 0)');
      ctx.globalAlpha = glow;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    };

    // もみじ描画
    const drawMaple = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < 14; i++) {
        const angle = (Math.PI * 2 * i) / 14;
        const radius = i % 2 === 0 ? p.radius : p.radius * 0.5;
        const x = Math.cos(angle - Math.PI / 2) * radius;
        const y = Math.sin(angle - Math.PI / 2) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    // 雪の結晶描画
    const drawSnowflake = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < 6; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / 6);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -p.radius);
        ctx.stroke();
        
        // 枝
        ctx.beginPath();
        ctx.moveTo(0, -p.radius * 0.7);
        ctx.lineTo(-p.radius * 0.25, -p.radius * 0.85);
        ctx.moveTo(0, -p.radius * 0.7);
        ctx.lineTo(p.radius * 0.25, -p.radius * 0.85);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    };

    // アニメーションループ
    let animationId: number;
    function animate(time: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // 更新
        p.y += p.vy;
        p.x += p.vx;
        p.x += Math.sin(time * 0.001) * 0.3;
        p.rotation += p.rotationSpeed;

        // 画面外判定
        if (p.y > canvas.height + 50) {
          p.y = -50;
          p.x = Math.random() * canvas.width;
        }

        // 描画
        switch (config.shape) {
          case 'sakura':
            drawSakura(p);
            break;
          case 'rain':
            drawRain(p);
            break;
          case 'firefly':
            drawFirefly(p, time);
            break;
          case 'maple':
            drawMaple(p);
            break;
          case 'snowflake':
            drawSnowflake(p);
            break;
        }
      });

      animationId = requestAnimationFrame(animate);
    }

    animate(0);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none'
      }}
    />
  );
}
