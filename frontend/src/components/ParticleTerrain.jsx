import React, { useEffect, useRef } from 'react';

/**
 * Anduril-inspired 3D Topographic Particle Terrain Canvas
 * Undulating wave grid with perspective projection, smooth motion, and stealth cyber aesthetic.
 */
export default function ParticleTerrain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) * 0.05;
      targetMouseY = (e.clientY - height / 2) * 0.05;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Terrain grid configuration
    const cols = 55;
    const rows = 35;
    const spacingX = 42;
    const spacingZ = 38;

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const fov = 380;
      const cameraY = -140 + mouseY * 0.5;
      const cameraZ = -100;
      const horizonY = height * 0.58;

      // Project grid points
      const points = [];

      for (let r = 0; r < rows; r++) {
        points[r] = [];
        const z = r * spacingZ + cameraZ;

        for (let c = 0; c < cols; c++) {
          const x = (c - cols / 2) * spacingX + mouseX;

          // Undulating dual sine wave + noise simulation
          const wave1 = Math.sin(x * 0.007 + time * 1.2) * 45;
          const wave2 = Math.cos(z * 0.009 + time * 0.9) * 35;
          const wave3 = Math.sin((x + z) * 0.005 + time * 0.7) * 25;
          const y = wave1 + wave2 + wave3 - cameraY;

          // 3D perspective projection
          const scale = fov / (fov + z);
          const screenX = width / 2 + x * scale;
          const screenY = horizonY + y * scale;

          // Distance fading alpha
          const distRatio = r / rows;
          const alpha = Math.max(0.04, Math.min(0.65, (1 - distRatio) * 0.75));

          points[r][c] = { x: screenX, y: screenY, alpha, scale };
        }
      }

      // Draw horizontal undulating lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        let started = false;
        const lineAlpha = (points[r][0]?.alpha || 0.2) * 0.45;
        ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
        ctx.lineWidth = 1;

        for (let c = 0; c < cols; c++) {
          const pt = points[r][c];
          if (!started) {
            ctx.moveTo(pt.x, pt.y);
            started = true;
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }
        ctx.stroke();
      }

      // Draw particle dots at intersections
      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const pt = points[r][c];
          const dotRadius = Math.max(0.6, pt.scale * 1.8);

          // Dot glow
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, dotRadius, 0, Math.PI * 2);
          // Highlight ridges with cyber cyan and soft white
          const isHighlight = (r + c) % 6 === 0;
          ctx.fillStyle = isHighlight
            ? `rgba(255, 255, 255, ${Math.min(0.9, pt.alpha * 1.4)})`
            : `rgba(56, 189, 248, ${pt.alpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-45 transition-opacity duration-1000"
      style={{ background: 'transparent' }}
    />
  );
}
