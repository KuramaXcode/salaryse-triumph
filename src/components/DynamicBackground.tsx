import { useEffect, useRef } from 'react';
import type { HouseVariant } from '../types';

interface DynamicBackgroundProps {
  theme: HouseVariant | null;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const themeColors: Record<string, { primary: string; secondary: string; glow: string }> = {
  hp: { primary: '#d4af37', secondary: '#997a00', glow: 'rgba(212,175,55,0.15)' },
  got: { primary: '#cc3333', secondary: '#8a1c1c', glow: 'rgba(204,51,51,0.12)' },
  marvel: { primary: '#e23636', secondary: '#9c1b1b', glow: 'rgba(226,54,54,0.12)' },
  sw: { primary: '#4fc3f7', secondary: '#0288d1', glow: 'rgba(79,195,247,0.1)' },
  mh: { primary: '#cc0000', secondary: '#880000', glow: 'rgba(204,0,0,0.12)' },
};

function DynamicBackground({ theme }: DynamicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const activeTheme = theme || 'hp';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = themeColors[activeTheme] || themeColors.hp;

    // Initialize particles based on theme
    const initParticles = () => {
      const particles: Particle[] = [];
      const count = activeTheme === 'sw' ? 120 : 50;

      for (let i = 0; i < count; i++) {
        particles.push(createParticle(canvas, colors, activeTheme));
      }
      particlesRef.current = particles;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw ambient glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.7
      );
      gradient.addColorStop(0, colors.glow);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, idx) => {
        p.life++;

        if (activeTheme === 'sw') {
          // Starfield: particles move toward camera (grow and move outward)
          p.x += p.speedX * 0.5;
          p.y += p.speedY * 0.5;
          p.size += 0.005;
          p.opacity = Math.min(1, p.life / 60);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(200,220,255,${p.opacity * 0.8})`;
          ctx.fill();

          // Streak effect for fast stars
          if (p.size > 1) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.speedX * 3, p.y - p.speedY * 3);
            ctx.strokeStyle = `rgba(200,220,255,${p.opacity * 0.3})`;
            ctx.lineWidth = p.size * 0.5;
            ctx.stroke();
          }
        } else if (activeTheme === 'hp') {
          // Floating embers
          p.x += Math.sin(p.life * 0.02) * 0.5 + p.speedX;
          p.y += p.speedY;
          p.opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.7;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212,175,55,${p.opacity})`;
          ctx.fill();
          ctx.shadowColor = '#d4af37';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else if (activeTheme === 'got') {
          // Ash / snow falling
          p.x += Math.sin(p.life * 0.015) * 0.8;
          p.y += p.speedY;
          p.opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.5;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180,180,180,${p.opacity})`;
          ctx.fill();
        } else if (activeTheme === 'marvel') {
          // Digital nodes with connections
          p.x += p.speedX;
          p.y += p.speedY;
          p.opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(226,54,54,${p.opacity})`;
          ctx.fill();

          // Draw connections to nearby particles
          particlesRef.current.forEach((p2, idx2) => {
            if (idx2 <= idx) return;
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(226,54,54,${(1 - dist / 120) * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        } else if (activeTheme === 'mh') {
          // Money rain / red smoke
          p.x += Math.sin(p.life * 0.03) * 1.2;
          p.y += p.speedY;
          p.opacity = Math.sin((p.life / p.maxLife) * Math.PI) * 0.4;

          // Draw € symbols for some, circles for others
          if (p.size > 2.5) {
            ctx.font = `${p.size * 4}px monospace`;
            ctx.fillStyle = `rgba(204,0,0,${p.opacity})`;
            ctx.fillText('€', p.x, p.y);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(204,0,0,${p.opacity * 0.6})`;
            ctx.fill();
          }
        }

        // Reset particle if off-screen or life expired
        if (
          p.life > p.maxLife ||
          p.x < -20 || p.x > canvas.width + 20 ||
          p.y < -20 || p.y > canvas.height + 20
        ) {
          particlesRef.current[idx] = createParticle(canvas, colors, activeTheme);
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [activeTheme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}

function createParticle(
  canvas: HTMLCanvasElement,
  _colors: { primary: string; secondary: string },
  theme: string
): Particle {
  const w = canvas.width;
  const h = canvas.height;

  if (theme === 'sw') {
    // Stars spawn from center and move outward
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 1.5;
    return {
      x: w / 2 + (Math.random() - 0.5) * 100,
      y: h / 2 + (Math.random() - 0.5) * 100,
      size: Math.random() * 0.8,
      speedX: Math.cos(angle) * speed,
      speedY: Math.sin(angle) * speed,
      opacity: 0,
      color: '#ccdcff',
      life: 0,
      maxLife: 200 + Math.random() * 300,
    };
  }

  if (theme === 'got') {
    return {
      x: Math.random() * w,
      y: -10,
      size: 1 + Math.random() * 2,
      speedX: 0,
      speedY: 0.3 + Math.random() * 0.8,
      opacity: 0,
      color: '#b4b4b4',
      life: 0,
      maxLife: (h / 0.5) + Math.random() * 200,
    };
  }

  if (theme === 'mh') {
    return {
      x: Math.random() * w,
      y: -10,
      size: 1 + Math.random() * 3,
      speedX: 0,
      speedY: 0.5 + Math.random() * 1.5,
      opacity: 0,
      color: '#cc0000',
      life: 0,
      maxLife: (h / 1) + Math.random() * 200,
    };
  }

  // Default: hp (embers rising) and marvel (nodes drifting)
  return {
    x: Math.random() * w,
    y: theme === 'hp' ? h + 10 : Math.random() * h,
    size: 1 + Math.random() * 2.5,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: theme === 'hp' ? -(0.3 + Math.random() * 0.7) : (Math.random() - 0.5) * 0.3,
    opacity: 0,
    color: _colors.primary,
    life: 0,
    maxLife: 200 + Math.random() * 400,
  };
}

export default DynamicBackground;
