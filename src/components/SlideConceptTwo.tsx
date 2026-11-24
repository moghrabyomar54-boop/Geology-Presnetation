import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MiniRock3D } from './MiniRock3D';

interface SlideConceptStressDeformationProps {
  part: 0 | 1;
  onTogglePart: () => void;
}

const STRESS_TYPES_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/8/8c/Tension%2C_compression%2C_shear.png';

const FOLD_PLASTIC_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/1/1c/Syncline_and_anticline_norw.jpg';

const FAULT_BRITTLE_IMAGE =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/77/Fault_types.svg/960px-Fault_types.svg.png';

const FOLIATED_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/2/26/Schist_vs_Slate.jpg';

const NON_FOLIATED_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/b/be/Quartzite_2_jpg.jpg';

export const SlideConceptStressDeformation: React.FC<SlideConceptStressDeformationProps> = ({
  part,
  onTogglePart,
}) => {
  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-14 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4 mb-6"
      >
        <div>
          <p className="text-sm sm:text-base font-mono tracking-[0.24em] text-slate-400 grey-aura-text">
            CONCEPT 02 · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Stress, Deformation &amp; Foliation
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>
            {part === 0
              ? 'Part 2 (The Relation & Foliated vs. Non-foliated)'
              : 'Part 1 (Stress & Deformation)'}
          </span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Online Geology Photo Gallery Matched to Active Part */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="concept2-gallery-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <figure>
                  <div className="overflow-hidden border-y border-white/20 bg-white/95">
                    <img
                      src={STRESS_TYPES_IMAGE}
                      alt="Tension, compression, and shear stress diagram"
                      referrerPolicy="no-referrer"
                      className="w-full h-56 sm:h-60 object-contain mx-auto"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-500">
                    Wikimedia Commons · Tension, Compression &amp; Shear
                  </figcaption>
                </figure>

                <div className="grid grid-cols-2 gap-3">
                  <figure>
                    <div className="overflow-hidden border border-white/15 bg-black/50">
                      <img
                        src={FOLD_PLASTIC_IMAGE}
                        alt="Plastic folding in deformed rock layers"
                        referrerPolicy="no-referrer"
                        className="w-full h-32 sm:h-36 object-cover"
                      />
                    </div>
                    <figcaption className="mt-1 text-xs font-mono text-slate-400">
                      Wikimedia · Folding (Plastic)
                    </figcaption>
                  </figure>
                  <figure>
                    <div className="overflow-hidden border border-white/15 bg-white/95">
                      <img
                        src={FAULT_BRITTLE_IMAGE}
                        alt="Brittle fault types diagram"
                        referrerPolicy="no-referrer"
                        className="w-full h-32 sm:h-36 object-contain"
                      />
                    </div>
                    <figcaption className="mt-1 text-xs font-mono text-slate-400">
                      Wikimedia · Faults (Brittle)
                    </figcaption>
                  </figure>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="concept2-gallery-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                <figure>
                  <div className="overflow-hidden border-y border-white/20 bg-black/50">
                    <img
                      src={FOLIATED_IMAGE}
                      alt="Foliated metamorphic rocks schist and slate"
                      referrerPolicy="no-referrer"
                      className="w-full h-56 sm:h-60 object-cover"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-500">
                    Wikimedia Commons · Foliated (Schist &amp; Slate)
                  </figcaption>
                </figure>

                <div className="grid grid-cols-2 gap-3">
                  <figure>
                    <div className="overflow-hidden border border-white/15 bg-black/50">
                      <img
                        src={NON_FOLIATED_IMAGE}
                        alt="Non-foliated quartzite specimen"
                        referrerPolicy="no-referrer"
                        className="w-full h-32 sm:h-36 object-cover"
                      />
                    </div>
                    <figcaption className="mt-1 text-xs font-mono text-slate-400">
                      Wikimedia · Non-foliated (Quartzite)
                    </figcaption>
                  </figure>
                  <figure>
                    <div className="overflow-hidden border border-white/15 bg-white/95">
                      <img
                        src={STRESS_TYPES_IMAGE}
                        alt="Stress types diagram"
                        referrerPolicy="no-referrer"
                        className="w-full h-32 sm:h-36 object-contain"
                      />
                    </div>
                    <figcaption className="mt-1 text-xs font-mono text-slate-400">
                      Wikimedia · Stress Forces
                    </figcaption>
                  </figure>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: User's Verbatim Text Sliced into 2 Clean Parts */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="concept2-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* What is stress? */}
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    What is stress?
                  </h3>
                  <p className="mt-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    An applied force to a rock from pressure, tension, shear on rocks because of
                    tectonic force inside the Earth.
                  </p>
                  <p className="mt-3 text-sm font-mono tracking-[0.2em] text-slate-400">TYPES</p>
                  <div className="mt-2 space-y-1.5 text-base sm:text-lg text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">Compressional:</span> Squeezes the
                      rocks that can make folding or breaking
                    </p>
                    <p>
                      <span className="font-semibold text-white">Tensional:</span> Pulls the rock in
                      different direction that causes stretching
                    </p>
                    <p>
                      <span className="font-semibold text-white">Shear:</span> Two forces in
                      different direction but not the same line and causes sliding
                    </p>
                  </div>
                </div>

                {/* Deformation */}
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Deformation:
                  </h3>
                  <p className="mt-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    It is the changes that happens to the rock due to the stress.
                  </p>
                  <p className="mt-3 text-sm font-mono tracking-[0.2em] text-slate-400">TYPES</p>
                  <div className="mt-2 space-y-1.5 text-base sm:text-lg text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">Elastic:</span> Temporary changes
                      in the rock
                    </p>
                    <p>
                      <span className="font-semibold text-white">Plastic:</span> Permanent change
                      that doesn&apos;t return to the original state
                    </p>
                    <p>
                      <span className="font-semibold text-white">Brittle:</span> The rock breaks
                      completely
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="concept2-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* The relation */}
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    The relation
                  </h3>
                  <div className="mt-2 space-y-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    <p>
                      In a very simple way, the stress is the cause and deformation is the result.
                    </p>
                    <p className="text-slate-300">
                      When stress increases the deformation increases and vice versa.
                    </p>
                  </div>
                </div>

                {/* Foliated and Non-foliated */}
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Foliated and Non-foliated
                  </h3>
                  <p className="mt-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    These texture appear when the rocks are exposed to high heat and pressure and
                    become metamorphic rocks and the minerals inside it becomes arranged.
                  </p>

                  <div className="mt-4 divide-y divide-white/10 border-y border-white/15">
                    <div className="flex items-center justify-between gap-4 py-2.5">
                      <div>
                        <p className="text-lg sm:text-xl font-semibold text-white grey-aura-text">
                          Foliated
                        </p>
                        <p className="mt-1 text-base sm:text-lg text-slate-200 leading-relaxed">
                          When the pressure happens in one direction arranged in a specific way
                        </p>
                      </div>
                      <MiniRock3D rockType="slate" label="Foliated rock 3D figure" />
                    </div>

                    <div className="flex items-center justify-between gap-4 py-2.5">
                      <div>
                        <p className="text-lg sm:text-xl font-semibold text-white grey-aura-text">
                          Non-foliated
                        </p>
                        <p className="mt-1 text-base sm:text-lg text-slate-200 leading-relaxed">
                          When the pressure is equal in all directions or when the rock doesn&apos;t
                          contains platy minerals
                        </p>
                      </div>
                      <MiniRock3D rockType="quartzite" label="Non-foliated rock 3D figure" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
