import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/presentationData';

interface IntroSlideProps {
  onNext: () => void;
  onJumpToSlide: (slideIndex: number) => void;
}

const ORDERED_CONCEPTS = [
  { num: 'Concept 1', title: 'Introduction & Formation of Metamorphic Rocks', slideIndex: 1 },
  { num: 'Concept 2', title: 'Stress, Deformation & Foliation', slideIndex: 2 },
  { num: 'Concept 3', title: 'Foliated Metamorphic Rocks', slideIndex: 3 },
  { num: 'Concept 4', title: 'Hornfels, Marble, Quartzite & Microscopy', slideIndex: 4 },
  { num: 'Concept 5', title: 'Geological Maps & History of Egypt', slideIndex: 8 },
];

export const SlideIntro: React.FC<IntroSlideProps> = ({ onNext, onJumpToSlide }) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 pt-12 pb-20">
      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-xs sm:text-sm font-mono tracking-[0.26em] text-slate-300/85 grey-aura-text">
            GEOLOGY PRESENTATION · LEARNING OUTCOME 6
          </p>

          <h1 className="mt-2.5 text-5xl sm:text-6xl lg:text-7xl font-bold text-white tracking-tight grey-aura-title text-balance leading-[1.04]">
            LO6: Metamorphic Rocks
          </h1>
        </motion.div>

        {/* Wide 2-Column Void Grid: Team Roster Left, Ordered Concepts Right */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Presented By */}
          <div className="lg:col-span-6">
            <p className="text-xs sm:text-sm font-mono tracking-[0.26em] text-slate-400 mb-3 grey-aura-text">
              PRESENTED BY
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {TEAM_MEMBERS.map((member) => (
                <div key={member.number} className="py-2 border-b border-white/10">
                  <span className="text-sm font-mono text-slate-400 tabular-nums mr-2">
                    {member.number}-
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-white grey-aura-text">
                    {member.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ordered Concepts (No Explanations) */}
          <div className="lg:col-span-6">
            <p className="text-xs sm:text-sm font-mono tracking-[0.26em] text-slate-400 mb-3 grey-aura-text">
              CONCEPTS
            </p>
            <ol className="divide-y divide-white/10 border-y border-white/15">
              {ORDERED_CONCEPTS.map((concept) => (
                <li key={concept.num}>
                  <button
                    type="button"
                    onClick={() => onJumpToSlide(concept.slideIndex)}
                    className="w-full flex items-center justify-between gap-3 py-2.5 px-1.5 hover:bg-white/[0.04] transition-colors cursor-pointer group text-left"
                  >
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="text-sm font-mono text-slate-400 shrink-0">
                        {concept.num}
                      </span>
                      <span className="text-base sm:text-xl font-semibold text-slate-100 group-hover:text-white grey-aura-text truncate">
                        {concept.title}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-slate-100 hover:bg-white text-slate-950 font-semibold text-base sm:text-lg transition-all cursor-pointer shadow-[0_0_40px_rgba(226,232,240,0.28)]"
          >
            <span>Start Presentation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
