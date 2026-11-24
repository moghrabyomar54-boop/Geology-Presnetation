/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SlideIntro } from './components/SlideIntroContext';
import { SlideConceptFormation } from './components/SlideConcepts';
import { SlideConceptStressDeformation } from './components/SlideConceptTwo';
import { SlideConceptFoliatedGrade } from './components/SlideConceptThree';
import {
  SlideHornfels,
  SlideMarble,
  SlideQuartzite,
  SlideMicroscopyTextures,
} from './components/SlideMetamorphicSynthesis';
import {
  SlideEgyptDeformation,
  SlideEgyptMap,
  SlideEgyptHistory,
} from './components/SlideEgyptGeology';
import { SlideMineralGame } from './components/SlideMineralGame';
import { SlideEndCredits } from './components/SlideEndCredits';
import { VoidMineralBackdrop } from './components/VoidMineralBackdrop';

interface SlideMeta {
  id: string;
  label: string;
  dockId: string;
  hasParts?: boolean;
}

const SLIDES: SlideMeta[] = [
  { id: 'intro', label: 'Intro', dockId: 'intro' },
  { id: 'formation', label: 'Concept 1', dockId: 'concept-1', hasParts: true },
  { id: 'stress-deformation', label: 'Concept 2', dockId: 'concept-2', hasParts: true },
  { id: 'foliated-rocks', label: 'Concept 3', dockId: 'concept-3', hasParts: true },
  { id: 'hornfels', label: 'Concept 4 · Hornfels', dockId: 'concept-4', hasParts: true },
  { id: 'marble', label: 'Concept 4 · Marble', dockId: 'concept-4', hasParts: true },
  { id: 'quartzite', label: 'Concept 4 · Quartzite', dockId: 'concept-4', hasParts: true },
  { id: 'microscopy-textures', label: 'Concept 4 · Microscopy', dockId: 'concept-4', hasParts: true },
  { id: 'egypt-deformation', label: 'Concept 5 · Deformation', dockId: 'concept-5', hasParts: true },
  { id: 'egypt-map', label: 'Concept 5 · Egypt Map', dockId: 'concept-5', hasParts: true },
  { id: 'egypt-history', label: 'Concept 5 · Egypt History', dockId: 'concept-5', hasParts: true },
  { id: 'game', label: 'Mining Game', dockId: 'game' },
  { id: 'credits', label: 'Credits', dockId: 'credits' },
];

const DOCK_ITEMS = [
  { dockId: 'intro', label: 'Intro', slideIndex: 0 },
  { dockId: 'concept-1', label: 'Concept 1', slideIndex: 1 },
  { dockId: 'concept-2', label: 'Concept 2', slideIndex: 2 },
  { dockId: 'concept-3', label: 'Concept 3', slideIndex: 3 },
  { dockId: 'concept-4', label: 'Concept 4', slideIndex: 4 },
  { dockId: 'concept-5', label: 'Concept 5', slideIndex: 8 },
  { dockId: 'game', label: 'Mining Game', slideIndex: 11 },
  { dockId: 'credits', label: 'Credits', slideIndex: 12 },
];

const CREDITS_AUDIO_SRC =
  '/assets/aistudio/09_-_C418_-_Aria_Math__Minecraft_Volume_Beta__08a79cae.mp3';
const CREDITS_START_SECONDS = 180; // Minute 3:00

export default function App() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [contentPart, setContentPart] = useState<0 | 1>(0);
  const [holyPulseKey, setHolyPulseKey] = useState(0);
  const [showHolyBloom, setShowHolyBloom] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRafRef = useRef<number>(0);

  const currentSlide = SLIDES[slideIndex];
  const isCredits = currentSlide.id === 'credits';

  // Smooth volume fade helper
  const fadeAudioVolume = useCallback((targetVolume: number, durationMs: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;
    cancelAnimationFrame(fadeRafRef.current);

    const startVol = audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      // Smooth sine ease-in-out
      const eased = -(Math.cos(Math.PI * t) - 1) / 2;
      audio.volume = Math.max(0, Math.min(1, startVol + (targetVolume - startVol) * eased));
      if (t < 1) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        onDone?.();
      }
    };

    fadeRafRef.current = requestAnimationFrame(step);
  }, []);

  // Pre-create audio element (paused) so user gesture on slide change starts immediately
  useEffect(() => {
    const audio = new Audio(CREDITS_AUDIO_SRC);
    audio.preload = 'auto';
    audio.loop = false;
    audio.volume = 0;
    audioRef.current = audio;

    return () => {
      cancelAnimationFrame(fadeRafRef.current);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const startCreditsAudioFromMinuteThree = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const beginPlay = () => {
      try {
        if (Number.isFinite(audio.duration) && audio.duration > CREDITS_START_SECONDS) {
          audio.currentTime = CREDITS_START_SECONDS;
        } else {
          audio.currentTime = CREDITS_START_SECONDS;
        }
      } catch {
        // Ignore seek errors before metadata; handled below
      }
      audio.volume = 0;
      audio.muted = audioMuted;
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            fadeAudioVolume(0.78, 2200);
          })
          .catch(() => {
            // Autoplay fallback if triggered non-interactively
          });
      } else {
        fadeAudioVolume(0.78, 2200);
      }
    };

    if (audio.readyState >= 1) {
      beginPlay();
    } else {
      const onLoaded = () => {
        audio.removeEventListener('loadedmetadata', onLoaded);
        beginPlay();
      };
      audio.addEventListener('loadedmetadata', onLoaded);
      audio.load();
    }
  }, [audioMuted, fadeAudioVolume]);

  const stopCreditsAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    fadeAudioVolume(0, 600, () => {
      audio.pause();
    });
  }, [fadeAudioVolume]);

  const goToSlide = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(SLIDES.length - 1, idx));
      const goingToCredits = SLIDES[clamped].id === 'credits';
      const wasCredits = SLIDES[slideIndex].id === 'credits';

      setContentPart(0);

      if (goingToCredits && !wasCredits) {
        // Trigger Holy Transition Bloom & Soundtrack at 3:00
        setHolyPulseKey((k) => k + 1);
        setShowHolyBloom(true);
        startCreditsAudioFromMinuteThree();
      } else if (!goingToCredits && wasCredits) {
        setShowHolyBloom(false);
        stopCreditsAudio();
      }

      setSlideIndex(clamped);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [slideIndex, startCreditsAudioFromMinuteThree, stopCreditsAudio]
  );

  const toggleContentPart = useCallback(() => {
    setContentPart((p) => (p === 0 ? 1 : 0));
  }, []);

  // Auto-hide holy bloom overlay after transition settles
  useEffect(() => {
    if (!showHolyBloom) return;
    const t = window.setTimeout(() => setShowHolyBloom(false), 2800);
    return () => window.clearTimeout(t);
  }, [showHolyBloom, holyPulseKey]);

  const handleToggleMute = () => {
    setAudioMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  };

  // Global keyboard shortcuts: Left/Right arrows for slides, 'E' to toggle Part 1 / Part 2
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
        return;
      }

      if ((e.key === 'e' || e.key === 'E') && currentSlide.hasParts) {
        e.preventDefault();
        toggleContentPart();
        return;
      }

      if (currentSlide.id === 'game') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToSlide(slideIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToSlide(slideIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideIndex, currentSlide.id, currentSlide.hasParts, goToSlide, toggleContentPart]);

  return (
    <div
      className={`relative min-h-screen flex flex-col transition-colors duration-1000 ${
        isCredits ? 'bg-black' : 'bg-[#020305]'
      } text-[#F1F5F9]`}
    >
      {/* Persistent Deep-Void Mineral Symbols & Dust Backdrop */}
      <VoidMineralBackdrop variant={isCredits ? 'credits' : 'default'} />

      {/* Holy Celestial Transition Bloom when entering the last slide */}
      <AnimatePresence>
        {showHolyBloom && (
          <motion.div
            key={`holy-${holyPulseKey}`}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.85, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.7,
              times: [0, 0.28, 0.55, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center overflow-hidden"
          >
            <motion.div
              initial={{ scale: 0.45, opacity: 0 }}
              animate={{ scale: [0.45, 1.35, 1.85], opacity: [0, 0.9, 0] }}
              transition={{ duration: 2.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-[115vmax] h-[115vmax] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(255,253,245,0.42) 0%, rgba(226,232,240,0.20) 26%, rgba(148,163,184,0.06) 52%, rgba(0,0,0,0) 74%)',
                filter: 'blur(36px)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discrete Top-Left Floating Wordmark (No Top Bar) */}
      {!isCredits && (
        <div className="fixed top-4 left-5 z-20 flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={() => goToSlide(0)}
            className="text-sm sm:text-base font-mono tracking-wide text-slate-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
          >
            LO6 · Metamorphic Atlas
          </button>
        </div>
      )}

      {/* Main Animated Slide Stage Floating in the Void */}
      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={
              isCredits
                ? { opacity: 0, scale: 0.96, filter: 'blur(14px)' }
                : { opacity: 0, y: 10 }
            }
            animate={
              isCredits
                ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
                : { opacity: 1, y: 0 }
            }
            exit={
              isCredits
                ? { opacity: 0, scale: 0.97, filter: 'blur(10px)' }
                : { opacity: 0, y: -10, filter: 'blur(6px)' }
            }
            transition={{
              duration: isCredits ? 1.1 : 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {currentSlide.id === 'intro' && (
              <SlideIntro
                onNext={() => goToSlide(1)}
                onJumpToSlide={(idx) => goToSlide(idx)}
              />
            )}
            {currentSlide.id === 'formation' && (
              <SlideConceptFormation part={contentPart} onTogglePart={toggleContentPart} />
            )}
            {currentSlide.id === 'stress-deformation' && (
              <SlideConceptStressDeformation
                part={contentPart}
                onTogglePart={toggleContentPart}
              />
            )}
            {currentSlide.id === 'foliated-rocks' && (
              <SlideConceptFoliatedGrade
                part={contentPart}
                onTogglePart={toggleContentPart}
              />
            )}
            {currentSlide.id === 'hornfels' && (
              <SlideHornfels
                part={contentPart}
                onTogglePart={toggleContentPart}
                onJumpToSlide={goToSlide}
              />
            )}
            {currentSlide.id === 'marble' && (
              <SlideMarble
                part={contentPart}
                onTogglePart={toggleContentPart}
                onJumpToSlide={goToSlide}
              />
            )}
            {currentSlide.id === 'quartzite' && (
              <SlideQuartzite
                part={contentPart}
                onTogglePart={toggleContentPart}
                onJumpToSlide={goToSlide}
              />
            )}
            {currentSlide.id === 'microscopy-textures' && (
              <SlideMicroscopyTextures
                part={contentPart}
                onTogglePart={toggleContentPart}
                onJumpToSlide={goToSlide}
              />
            )}
            {currentSlide.id === 'egypt-deformation' && (
              <SlideEgyptDeformation
                part={contentPart}
                onTogglePart={toggleContentPart}
                onJumpToSlide={goToSlide}
              />
            )}
            {currentSlide.id === 'egypt-map' && (
              <SlideEgyptMap
                part={contentPart}
                onTogglePart={toggleContentPart}
                onJumpToSlide={goToSlide}
              />
            )}
            {currentSlide.id === 'egypt-history' && (
              <SlideEgyptHistory
                part={contentPart}
                onTogglePart={toggleContentPart}
                onJumpToSlide={goToSlide}
              />
            )}
            {currentSlide.id === 'game' && (
              <SlideMineralGame onNextToCredits={() => goToSlide(SLIDES.length - 1)} />
            )}
            {currentSlide.id === 'credits' && (
              <SlideEndCredits
                onRestartPresentation={() => goToSlide(0)}
                audioMuted={audioMuted}
                onToggleMute={handleToggleMute}
                onReplayAudio={startCreditsAudioFromMinuteThree}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Minimal Floating Bottom Slide Switcher Dock (Hidden on Credits) */}
      {!isCredits && (
        <nav
          aria-label="Presentation slide switcher"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-black/75 border border-white/12 max-w-[94vw] overflow-x-auto shadow-[0_8px_32px_rgba(0,0,0,0.65)]"
        >
          <button
            type="button"
            onClick={() => goToSlide(slideIndex - 1)}
            disabled={slideIndex === 0}
            aria-label="Previous slide"
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {DOCK_ITEMS.map((item) => {
            const active = currentSlide.dockId === item.dockId;
            return (
              <button
                key={item.dockId}
                type="button"
                onClick={() => goToSlide(item.slideIndex)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-100 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => goToSlide(slideIndex + 1)}
            disabled={slideIndex === SLIDES.length - 1}
            aria-label="Next slide"
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </nav>
      )}

    </div>
  );
}
