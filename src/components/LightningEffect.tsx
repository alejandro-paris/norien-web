import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface LightningBolt {
  segments: Point[];
  branches: Point[][];
  opacity: number;
  fadeSpeed: number;
  width: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

export const LightningEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let bolts: LightningBolt[] = [];
    let sparks: Spark[] = [];
    let lastBoltTime = 0;
    let glowPulse = 0;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const generateSegments = (
      startX: number,
      startY: number,
      endX: number,
      endY: number,
      segmentCount: number,
      jitter: number
    ): Point[] => {
      const points: Point[] = [{ x: startX, y: startY }];
      const dx = endX - startX;
      const dy = endY - startY;

      for (let i = 1; i < segmentCount; i++) {
        const t = i / segmentCount;
        const offsetX = (Math.random() - 0.5) * jitter;
        const offsetY = (Math.random() - 0.5) * jitter * 0.5;
        points.push({
          x: startX + dx * t + offsetX,
          y: startY + dy * t + offsetY,
        });
      }

      points.push({ x: endX, y: endY });
      return points;
    };

    const generateBolt = (): LightningBolt => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Energy source point (center-upper area)
      const sourceX = w * 0.5;
      const sourceY = h * 0.3;

      // Random angle for bolt direction
      const angle = (Math.random() - 0.5) * Math.PI * 1.2;
      const length = h * (0.3 + Math.random() * 0.35);

      const endX = sourceX + Math.sin(angle) * length;
      const endY = sourceY + Math.cos(angle) * length * 0.8;

      const segments = generateSegments(
        sourceX, sourceY, endX, endY,
        8 + Math.floor(Math.random() * 6),
        60 + Math.random() * 40
      );

      // Generate branches
      const branches: Point[][] = [];
      for (let i = 2; i < segments.length - 1; i++) {
        if (Math.random() > 0.6) {
          const branchAngle = angle + (Math.random() - 0.5) * 1.2;
          const branchLen = length * (0.2 + Math.random() * 0.2);
          const branchEnd = {
            x: segments[i].x + Math.sin(branchAngle) * branchLen,
            y: segments[i].y + Math.cos(branchAngle) * branchLen * 0.6,
          };
          branches.push(
            generateSegments(
              segments[i].x, segments[i].y,
              branchEnd.x, branchEnd.y,
              4 + Math.floor(Math.random() * 3),
              30 + Math.random() * 20
            )
          );
        }
      }

      // Generate sparks at the source point
      for (let i = 0; i < 3 + Math.floor(Math.random() * 4); i++) {
        sparks.push({
          x: sourceX + (Math.random() - 0.5) * 20,
          y: sourceY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: 1 + Math.random() * 2,
          opacity: 0.8 + Math.random() * 0.2,
          life: 30 + Math.floor(Math.random() * 40),
        });
      }

      return {
        segments,
        branches,
        opacity: 0.9 + Math.random() * 0.1,
        fadeSpeed: 0.012 + Math.random() * 0.018,
        width: 1.5 + Math.random() * 1.5,
      };
    };

    const drawPath = (points: Point[], opacity: number, width: number) => {
      if (points.length < 2) return;

      // Outer glow
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = `rgba(197, 160, 89, ${opacity * 0.2})`;
      ctx.lineWidth = width * 8;
      ctx.shadowColor = '#C5A059';
      ctx.shadowBlur = 40;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Mid glow
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = `rgba(218, 190, 120, ${opacity * 0.5})`;
      ctx.lineWidth = width * 3;
      ctx.shadowBlur = 20;
      ctx.stroke();

      // Core bright line
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = `rgba(255, 245, 210, ${opacity})`;
      ctx.lineWidth = width;
      ctx.shadowColor = '#FFF5D2';
      ctx.shadowBlur = 10;
      ctx.stroke();

      ctx.shadowBlur = 0;
    };

    const drawBolt = (bolt: LightningBolt) => {
      drawPath(bolt.segments, bolt.opacity, bolt.width);
      for (const branch of bolt.branches) {
        drawPath(branch, bolt.opacity * 0.6, bolt.width * 0.6);
      }
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      glowPulse += 0.02;

      // Central energy glow (pulsating)
      const pulseIntensity = 0.08 + Math.sin(glowPulse) * 0.04;
      const centerX = w * 0.5;
      const centerY = h * 0.3;

      // Large ambient glow
      const ambientGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, w * 0.55
      );
      ambientGlow.addColorStop(0, `rgba(197, 160, 89, ${pulseIntensity + 0.06})`);
      ambientGlow.addColorStop(0.3, `rgba(197, 160, 89, ${pulseIntensity * 0.5})`);
      ambientGlow.addColorStop(0.6, `rgba(197, 160, 89, ${pulseIntensity * 0.15})`);
      ambientGlow.addColorStop(1, 'rgba(197, 160, 89, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, w, h);

      // Bright core orb
      const orbGlow = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 40 + Math.sin(glowPulse * 1.5) * 10
      );
      orbGlow.addColorStop(0, `rgba(255, 240, 200, ${0.4 + Math.sin(glowPulse) * 0.15})`);
      orbGlow.addColorStop(0.4, `rgba(218, 190, 120, ${0.15 + Math.sin(glowPulse) * 0.05})`);
      orbGlow.addColorStop(1, 'rgba(197, 160, 89, 0)');
      ctx.fillStyle = orbGlow;
      ctx.fillRect(centerX - 80, centerY - 80, 160, 160);

      // Generate new bolts periodically
      const boltInterval = 600 + Math.random() * 800;
      if (time - lastBoltTime > boltInterval) {
        bolts.push(generateBolt());
        if (Math.random() > 0.4) {
          bolts.push(generateBolt());
        }
        if (Math.random() > 0.7) {
          bolts.push(generateBolt());
        }
        lastBoltTime = time;
      }

      // Draw and update bolts
      bolts = bolts.filter((bolt) => bolt.opacity > 0.01);
      for (const bolt of bolts) {
        drawBolt(bolt);
        bolt.opacity -= bolt.fadeSpeed;
      }

      // Draw and update sparks
      sparks = sparks.filter((spark) => spark.life > 0);
      for (const spark of sparks) {
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 160, ${spark.opacity * (spark.life / 60)})`;
        ctx.shadowColor = '#C5A059';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.02; // slight gravity
        spark.life--;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};
