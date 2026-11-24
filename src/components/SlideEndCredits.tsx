import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pause, Play, RotateCcw, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/presentationData';

interface SlideEndCreditsProps {
  onRestartPresentation: () => void;
  audioMuted: boolean;
  onToggleMute: () => void;
  onReplayAudio: () => void;
}

type CreditsPhase = 'intro' | 'rolling' | 'gap' | 'finale';

const THANK_YOU_IMAGE_SRC = '/assets/aistudio/minecraft-text__1__dba433fb.png';

const CURRICULAR_TOPICS = [
  {
    num: '01.',
    title: 'Contact Metamorphism & Thermal Aureoles',
    sub: 'Magma ascent · thermal contact spike · mineral instability & solid-state growth',
  },
  {
    num: '02.',
    title: 'Protoliths & Recrystallization',
    sub: 'Shale, mudstone, sandstone, basalt, limestone & dolostone parent rocks',
  },
  {
    num: '03.',
    title: 'Hornfels — Fine-Grained Silicate Mosaic',
    sub: 'Dense non-foliated granoblastic interlock · quartz, feldspar, biotite, andalusite & cordierite',
  },
  {
    num: '04.',
    title: 'Marble — Carbonate & Dilute HCl Test',
    sub: 'Recrystallized calcite & dolomite · Mohs ~3 · CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
  },
  {
    num: '05.',
    title: 'Quartzite — Mohs 7 Durability',
    sub: 'Tightly sutured SiO₂ grains · scratches glass · undulose extinction under strain',
  },
  {
    num: '06.',
    title: '30 µm Petrographic Thin Sections',
    sub: 'Precision rock slices transmitting polarized light through crystal lattices',
  },
  {
    num: '07.',
    title: 'PPL & XPL Optical Identification',
    sub: 'Natural color, pleochroism & relief vs. birefringence colors, twinning & extinction',
  },
  {
    num: '08.',
    title: 'Metamorphic Textures & Foliation',
    sub: 'Granoblastic, lepidoblastic, nematoblastic & porphyroblastic fabrics compared',
  },
];

const FEATURED_WORLDS = [
  {
    title: 'Hornfels — The Contact Aureole World',
    sub: 'Non-foliated silicate mosaic with interactive magmatic thermal halo',
  },
  {
    title: 'Marble — The Carbonate & Effervescence World',
    sub: 'Sugary interlocking calcite specimen with live dilute HCl CO₂ effervescence',
  },
  {
    title: 'Quartzite — The Vitreous Mohs 7 World',
    sub: 'Ultra-hard fused quartz rock with interactive Mohs 5.5 glass-plate scratch test',
  },
  {
    title: 'Petrographic Stage — The 30 µm Thin-Section World',
    sub: 'Live 360° rotating polarized microscope stage toggling PPL & XPL optical modes',
  },
];

const CrystalEmblem: React.FC = () => (
  <div className="relative w-20 h-20 mx-auto flex items-center justify-center void-glow-emblem">
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.65 }}
      animate={{ opacity: [0.35, 0.7, 0.4], scale: [1, 1.18, 1.04] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute inset-0 rounded-full"
      style={{
        background:
          'radial-gradient(circle, rgba(248,250,252,0.34) 0%, rgba(203,213,225,0.12) 48%, transparent 72%)',
        filter: 'blur(12px)',
      }}
    />
    <svg viewBox="0 0 80 80" className="relative w-full h-full text-slate-100" fill="none">
      <circle
        cx="40"
        cy="40"
        r="36"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="6 5"
        opacity="0.6"
      />
      <polygon
        points="40,14 58,28 58,52 40,66 22,52 22,28"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <polygon
        points="40,22 50,32 50,48 40,58 30,48 30,32"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.72"
      />
      <line x1="40" y1="14" x2="40" y2="66" stroke="currentColor" strokeWidth="1" opacity="0.55" />
    </svg>
  </div>
);

const MinecraftThankYouImg: React.FC<{ className?: string }> = ({
  className = 'w-[min(640px,88vw)]',
}) => (
  <img
    src={THANK_YOU_IMAGE_SRC}
    alt="Thank You"
    referrerPolicy="no-referrer"
    className={`h-auto mx-auto select-none object-contain ${className}`}
    style={{
      filter:
        'drop-shadow(0 12px 28px rgba(0,0,0,0.85)) drop-shadow(0 0 36px rgba(226,232,240,0.22))',
    }}
  />
);

export const SlideEndCredits: React.FC<SlideEndCreditsProps> = ({
  onRestartPresentation,
  audioMuted,
  onToggleMute,
  onReplayAudio,
}) => {
  const [phase, setPhase] = useState<CreditsPhase>('intro');
  const [paused, setPaused] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  const rollContainerRef = useRef<HTMLDivElement>(null);
  const rollContentRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef<number>(0);

  // Phase 1: Holy intro beat -> smoothly exit into rolling credits
  useEffect(() => {
    setPhase('intro');
    setPaused(false);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setPhase('finale');
      return;
    }

    const timer = window.setTimeout(() => {
      offsetRef.current = window.innerHeight * 0.62;
      setPhase('rolling');
    }, 2800);

    return () => window.clearTimeout(timer);
  }, [replayCount]);

  // Phase 2: Smooth RAF cinema scroll (waits cleanly while AnimatePresence exits intro)
  useEffect(() => {
    if (phase !== 'rolling' || paused) return;

    let rafId = 0;
    let last = performance.now();

    const step = (now: number) => {
      const contentEl = rollContentRef.current;
      if (!contentEl) {
        last = now;
        rafId = requestAnimationFrame(step);
        return;
      }

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      offsetRef.current -= dt * 78;
      contentEl.style.transform = `translate3d(0, ${offsetRef.current}px, 0)`;

      const contentHeight = contentEl.offsetHeight;
      if (contentHeight > 0 && offsetRef.current < -contentHeight - 80) {
        setPhase('gap');
        return;
      }

      rafId = requestAnimationFrame(step);
    };

    if (rollContentRef.current) {
      rollContentRef.current.style.transform = `translate3d(0, ${offsetRef.current}px, 0)`;
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [phase, paused]);

  // Phase 3: Brief dark void beat before resting finale card
  useEffect(() => {
    if (phase !== 'gap') return;
    const t = window.setTimeout(() => setPhase('finale'), 750);
    return () => window.clearTimeout(t);
  }, [phase]);

  const handleReplay = () => {
    setReplayCount((c) => c + 1);
    onReplayAudio();
  };

  return (
    <section className="relative min-h-screen w-full bg-transparent text-white overflow-hidden select-none">
      <AnimatePresence mode="wait">
        {/* Phase 1: Holy Ethereal Entrance + Smooth Exit Animation */}
        {phase === 'intro' && (
          <motion.div
            key="credits-intro"
            initial={{ opacity: 0, scale: 0.91, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.07, y: -36, filter: 'blur(18px)' }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.75, scale: 1.12 }}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute w-[min(780px,92vw)] h-[380px] rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(248,250,252,0.18) 0%, rgba(186,204,228,0.08) 45%, transparent 72%)',
                filter: 'blur(44px)',
              }}
            />

            <CrystalEmblem />

            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.25, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-8 w-full flex flex-col items-center"
            >
              <MinecraftThankYouImg className="w-[min(680px,88vw)]" />
              <p className="mt-6 text-xl sm:text-3xl font-medium text-slate-200 grey-aura-text">
                LO6 (Geology) — Metamorphic Rocks
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Phase 2: Smooth Cinema Rolling Credits */}
        {phase === 'rolling' && (
          <motion.div
            key="credits-rolling"
            ref={rollContainerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-screen overflow-hidden"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
            }}
          >
          <div
            ref={rollContentRef}
            className="max-w-4xl mx-auto px-6 text-center will-change-transform"
            style={{ transform: `translate3d(0, ${offsetRef.current}px, 0)` }}
          >
            {/* Opening Title in Roll */}
            <div className="pt-8 pb-14">
              <p className="text-2xl sm:text-3xl font-mono tracking-[0.26em] text-slate-200 grey-aura-text">
                LO6 (GEOLOGY)
              </p>
              <p className="mt-2.5 text-xl sm:text-2xl text-slate-300">
                Metamorphic Rocks · Interactive 3D &amp; Petrographic Atlas
              </p>
            </div>

            {/* Presented By */}
            <div className="py-12 border-t border-white/10">
              <p className="text-base font-mono tracking-[0.3em] text-slate-400 mb-8">
                PRESENTED BY
              </p>
              <div className="space-y-4">
                {TEAM_MEMBERS.map((m) => (
                  <p
                    key={m.number}
                    className="text-3xl sm:text-5xl font-bold text-white grey-aura-text tracking-tight"
                  >
                    <span className="font-mono text-slate-400 mr-2.5 text-2xl sm:text-4xl">
                      {m.number}-
                    </span>
                    {m.name}
                  </p>
                ))}
              </div>
            </div>

            {/* Curriculum Topics Covered */}
            <div className="py-14 border-t border-white/10">
              <p className="text-base font-mono tracking-[0.3em] text-slate-400 mb-10">
                CURRICULUM TOPICS COVERED
              </p>
              <div className="space-y-9">
                {CURRICULAR_TOPICS.map((t) => (
                  <div key={t.num} className="space-y-2">
                    <h3 className="text-2xl sm:text-4xl font-bold text-white grey-aura-text">
                      <span className="font-mono text-slate-400 mr-2.5">{t.num}</span>
                      {t.title}
                    </h3>
                    <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
                      {t.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Specimen Worlds Featured */}
            <div className="py-14 border-t border-white/10">
              <p className="text-base font-mono tracking-[0.3em] text-slate-400 mb-10">
                3D SPECIMEN WORLDS FEATURED
              </p>
              <div className="space-y-9">
                {FEATURED_WORLDS.map((w) => (
                  <div key={w.title} className="space-y-2">
                    <h3 className="text-2xl sm:text-4xl font-bold text-white grey-aura-text">
                      {w.title}
                    </h3>
                    <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
                      {w.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roll Finale Sign-off with User's Minecraft THANK YOU Graphic */}
            <div className="py-20 border-t border-white/10 flex flex-col items-center">
              <MinecraftThankYouImg className="w-[min(560px,84vw)]" />
              <p className="mt-6 text-xl sm:text-2xl font-mono text-slate-300 grey-aura-text">
                For Watching · LO6 (Geology) — Metamorphic Rocks
              </p>
            </div>
            </div>
          </motion.div>
        )}

        {/* Phase 4: Resting Finale Card (Clean Centered Team Roster) */}
        {phase === 'finale' && (
          <motion.div
            key="credits-finale"
            initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <CrystalEmblem />
            <div className="mt-7 w-full flex flex-col items-center">
              <MinecraftThankYouImg className="w-[min(640px,86vw)]" />
              <p className="mt-4 text-xl sm:text-3xl font-medium text-slate-300 grey-aura-text">
                LO6 (Geology) — Metamorphic Rocks
              </p>
            </div>

            <div className="mt-10 space-y-2.5 text-center">
              {TEAM_MEMBERS.map((m) => (
                <p
                  key={m.number}
                  className="text-2xl sm:text-3xl font-semibold text-slate-100 grey-aura-text"
                >
                  <span className="font-mono text-slate-400 mr-2.5">{m.number}-</span>
                  {m.name}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom-Right Discrete Credits Controls */}
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={audioMuted ? 'Unmute soundtrack' : 'Mute soundtrack'}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-sm font-medium text-slate-200 transition-colors cursor-pointer"
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{audioMuted ? 'Sound Off' : 'Sound On'}</span>
        </button>

        {phase === 'rolling' && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-sm font-medium text-slate-200 transition-colors cursor-pointer"
          >
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{paused ? 'Resume' : 'Pause'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-sm font-medium text-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Replay Credits</span>
        </button>

        <button
          type="button"
          onClick={onRestartPresentation}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-sm font-medium text-slate-200 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Slides</span>
        </button>
      </div>
    </section>
  );
};
