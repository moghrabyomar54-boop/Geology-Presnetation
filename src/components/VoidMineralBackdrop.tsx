import React, { useEffect, useRef } from 'react';

interface VoidMineralBackdropProps {
  variant?: 'default' | 'credits';
}

const MINERAL_SYMBOLS = [
  {
    id: 'quartz-hex',
    formula: 'SiO₂',
    name: 'Quartz',
    top: '8%',
    left: '6%',
    size: 130,
    rotate: -14,
    duration: '18s',
    delay: '0s',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" stroke="currentColor">
        <polygon points="60,8 96,28 96,82 60,112 24,82 24,28" strokeWidth="1.2" />
        <polygon points="60,8 78,34 78,86 60,112 42,86 42,34" strokeWidth="0.9" opacity="0.7" />
        <line x1="24" y1="28" x2="96" y2="28" strokeWidth="0.8" opacity="0.55" />
        <line x1="24" y1="82" x2="96" y2="82" strokeWidth="0.8" opacity="0.55" />
        <line x1="60" y1="8" x2="60" y2="112" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: 'calcite-rhomb',
    formula: 'CaCO₃',
    name: 'Calcite',
    top: '14%',
    left: '82%',
    size: 120,
    rotate: 16,
    duration: '22s',
    delay: '-4s',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" stroke="currentColor">
        <polygon points="36,18 98,28 82,92 20,82" strokeWidth="1.2" />
        <polygon points="48,34 86,40 74,80 36,74" strokeWidth="0.85" opacity="0.65" />
        <line x1="36" y1="18" x2="48" y2="34" strokeWidth="0.8" opacity="0.5" />
        <line x1="98" y1="28" x2="86" y2="40" strokeWidth="0.8" opacity="0.5" />
        <line x1="82" y1="92" x2="74" y2="80" strokeWidth="0.8" opacity="0.5" />
        <line x1="20" y1="82" x2="36" y2="74" strokeWidth="0.8" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: 'silicate-tetra',
    formula: 'SiO₄⁴⁻',
    name: 'Silicate',
    top: '68%',
    left: '8%',
    size: 112,
    rotate: 10,
    duration: '20s',
    delay: '-7s',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" stroke="currentColor">
        <polygon points="60,14 104,92 16,92" strokeWidth="1.2" />
        <line x1="60" y1="14" x2="60" y2="68" strokeWidth="0.9" opacity="0.7" />
        <line x1="16" y1="92" x2="60" y2="68" strokeWidth="0.9" opacity="0.7" />
        <line x1="104" y1="92" x2="60" y2="68" strokeWidth="0.9" opacity="0.7" />
        <circle cx="60" cy="68" r="5" strokeWidth="1" />
        <circle cx="60" cy="14" r="3.5" strokeWidth="1" />
        <circle cx="16" cy="92" r="3.5" strokeWidth="1" />
        <circle cx="104" cy="92" r="3.5" strokeWidth="1" />
      </svg>
    ),
  },
  {
    id: 'garnet-dodec',
    formula: 'Al₂SiO₅',
    name: 'Andalusite / Garnet',
    top: '72%',
    left: '84%',
    size: 126,
    rotate: -18,
    duration: '24s',
    delay: '-9s',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" stroke="currentColor">
        <polygon points="60,10 98,32 98,88 60,110 22,88 22,32" strokeWidth="1.15" />
        <polygon points="60,26 84,42 84,78 60,94 36,78 36,42" strokeWidth="0.85" opacity="0.6" />
        <line x1="22" y1="32" x2="98" y2="88" strokeWidth="0.75" opacity="0.45" />
        <line x1="98" y1="32" x2="22" y2="88" strokeWidth="0.75" opacity="0.45" />
        <line x1="60" y1="10" x2="60" y2="110" strokeWidth="0.75" opacity="0.45" />
      </svg>
    ),
  },
  {
    id: 'mica-sheet',
    formula: 'K(Mg,Fe)₃AlSi₃O₁₀',
    name: 'Biotite Lattice',
    top: '42%',
    left: '4%',
    size: 96,
    rotate: 24,
    duration: '26s',
    delay: '-12s',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" stroke="currentColor">
        <polygon points="60,18 96,39 96,81 60,102 24,81 24,39" strokeWidth="1.1" />
        <polygon points="60,34 82,47 82,73 60,86 38,73 38,47" strokeWidth="0.9" opacity="0.65" />
        <circle cx="60" cy="60" r="6" strokeWidth="0.9" opacity="0.65" />
      </svg>
    ),
  },
  {
    id: 'dolomite-twin',
    formula: 'CaMg(CO₃)₂',
    name: 'Dolomite',
    top: '40%',
    left: '89%',
    size: 98,
    rotate: -11,
    duration: '21s',
    delay: '-5s',
    svg: (
      <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" stroke="currentColor">
        <polygon points="60,12 104,60 60,108 16,60" strokeWidth="1.1" />
        <line x1="38" y1="36" x2="82" y2="84" strokeWidth="0.85" opacity="0.6" />
        <line x1="46" y1="28" x2="90" y2="76" strokeWidth="0.85" opacity="0.45" />
        <line x1="30" y1="44" x2="74" y2="92" strokeWidth="0.85" opacity="0.45" />
      </svg>
    ),
  },
];

const FLOATING_FORMULAS = [
  { text: 'SiO₂', top: '23%', left: '16%', delay: '0s' },
  { text: 'CaCO₃ + 2HCl', top: '26%', left: '72%', delay: '-3s' },
  { text: 'Al₂SiO₅', top: '56%', left: '14%', delay: '-6s' },
  { text: 'Mohs 7', top: '58%', left: '78%', delay: '-2s' },
  { text: '30 µm · XPL', top: '84%', left: '24%', delay: '-5s' },
  { text: 'ΔT · P', top: '83%', left: '68%', delay: '-8s' },
];

export const VoidMineralBackdrop: React.FC<VoidMineralBackdropProps> = ({ variant = 'default' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 70 }, (_, i) => ({
      x: ((i * 197) % 100) / 100,
      y: ((i * 313) % 100) / 100,
      r: 0.7 + (i % 3) * 0.65,
      vx: ((i % 5) - 2) * 0.000035,
      vy: -0.00006 - (i % 4) * 0.000035,
      alpha: 0.1 + (i % 5) * 0.055,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        ctx.fillStyle = `rgba(196, 210, 228, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x * canvas.width, p.y * canvas.height, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      draw();
    } else {
      animId = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const symbolOpacity = variant === 'credits' ? 'opacity-[0.16]' : 'opacity-[0.13]';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Subtle deep-void radial luminosity */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(980px,95vw)] h-[620px] rounded-full"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(148,163,184,0.10) 0%, rgba(71,85,105,0.04) 48%, rgba(2,3,5,0) 76%)',
          filter: 'blur(48px)',
        }}
      />

      {/* Drifting Mineral Dust Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

      {/* Crystallographic Wireframe Mineral Symbols */}
      {MINERAL_SYMBOLS.map((sym) => (
        <div
          key={sym.id}
          className={`hidden md:flex flex-col items-center absolute text-slate-300 ${symbolOpacity} animate-void-drift`}
          style={{
            top: sym.top,
            left: sym.left,
            width: sym.size,
            height: sym.size,
            transform: `rotate(${sym.rotate}deg)`,
            animationDuration: sym.duration,
            animationDelay: sym.delay,
            filter: 'drop-shadow(0 0 18px rgba(186, 204, 228, 0.25))',
          }}
        >
          {sym.svg}
          <span className="mt-1 text-[11px] font-mono tracking-widest text-slate-300/80 whitespace-nowrap">
            {sym.formula}
          </span>
        </div>
      ))}

      {/* Subtle Drifting Mineral Formulas */}
      {FLOATING_FORMULAS.map((f) => (
        <span
          key={f.text}
          className="hidden lg:block absolute font-mono text-xs tracking-[0.22em] text-slate-400/20 animate-float-slow"
          style={{
            top: f.top,
            left: f.left,
            animationDelay: f.delay,
          }}
        >
          {f.text}
        </span>
      ))}
    </div>
  );
};
