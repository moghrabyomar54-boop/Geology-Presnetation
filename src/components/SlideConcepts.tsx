import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MiniRock3D, MiniRockType } from './MiniRock3D';

interface SlideConceptFormationProps {
  part: 0 | 1;
  onTogglePart: () => void;
}

const CONCEPT_ONE_MAIN_IMAGE =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/18/Rock_contact_metamorphism_eng_text.jpg/960px-Rock_contact_metamorphism_eng_text.jpg';

const CONCEPT_ONE_SUB_IMAGES = [
  {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c7/Metamorphic_Aureole_in_the_Henry_Mountains.JPG/960px-Metamorphic_Aureole_in_the_Henry_Mountains.JPG',
    alt: 'Metamorphic contact aureole rock outcrop',
    label: 'Contact Aureole',
  },
  {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Step-fold_in_slate_hjk00252.jpg/960px-Step-fold_in_slate_hjk00252.jpg',
    alt: 'Step-fold in metamorphic slate',
    label: 'Slate Deformation',
  },
  {
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Rockfall_block_of_Sioux_Quartzite_in_Blue_Mounds_State_Park%2C_Minnesota%2C_August_11%2C_2025_%285184%29.jpg/960px-Rockfall_block_of_Sioux_Quartzite_in_Blue_Mounds_State_Park%2C_Minnesota%2C_August_11%2C_2025_%285184%29.jpg',
    alt: 'Quartzite metamorphic rock block',
    label: 'Quartzite Outcrop',
  },
];

const CHEMICAL_EXAMPLES: {
  label: string;
  rockType: MiniRockType;
}[] = [
  { label: 'Limestone → Marble.', rockType: 'marble' },
  { label: 'Sandstone → Quartzite.', rockType: 'quartzite' },
  { label: 'Shale → Slate.', rockType: 'slate' },
];

export const SlideConceptFormation: React.FC<SlideConceptFormationProps> = ({
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
            CONCEPT 01 · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Introduction &amp; Formation of Metamorphic Rocks
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Temp, Pressure & Examples)' : 'Part 1 (Definition & Form)'}</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Rich Online Geology Photo Gallery */}
        <div className="lg:col-span-5 space-y-3">
          <figure>
            <div className="overflow-hidden border-y border-white/20 bg-black/50">
              <img
                src={CONCEPT_ONE_MAIN_IMAGE}
                alt="Contact metamorphism diagram"
                referrerPolicy="no-referrer"
                className="w-full h-56 sm:h-64 object-cover"
              />
            </div>
            <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-500">
              Wikimedia Commons · Contact Metamorphism
            </figcaption>
          </figure>

          <div className="grid grid-cols-3 gap-3">
            {CONCEPT_ONE_SUB_IMAGES.map((img) => (
              <figure key={img.label}>
                <div className="overflow-hidden border border-white/15 bg-black/50">
                  <img
                    src={img.src}
                    alt={img.alt}
                    referrerPolicy="no-referrer"
                    className="w-full h-28 sm:h-32 object-cover"
                  />
                </div>
                <figcaption className="mt-1 text-[11px] font-mono text-slate-400 truncate">
                  {img.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        {/* Right: Sliced 2-Part Verbatim Content (No Vertical Scroll Needed) */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="formation-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-8"
              >
                {/* 1. Definition */}
                <div className="border-t border-white/15 pt-5">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white grey-aura-text">
                    1. Definition of Metamorphic Rocks
                  </h3>
                  <p className="mt-3 text-xl sm:text-2xl text-slate-200 leading-relaxed">
                    Metamorphic rocks are rocks that have changed from their original form due to
                    heat, pressure, or chemically active fluids, without melting completely
                  </p>
                </div>

                {/* 2. How Metamorphic Rocks Form */}
                <div className="border-t border-white/15 pt-5">
                  <h3 className="text-2xl sm:text-3xl font-semibold text-white grey-aura-text">
                    2. How Metamorphic Rocks Form
                  </h3>
                  <p className="mt-3 text-xl sm:text-2xl text-slate-200 leading-relaxed">
                    Metamorphic rocks form when existing rocks are exposed to high temperatures and
                    pressure deep inside the Earth&apos;s crust. These conditions cause minerals to
                    change and form new textures and structures.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="formation-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* 3. Effects of Temperature and Pressure */}
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    3. Effects of Temperature and Pressure
                  </h3>
                  <div className="mt-2.5 space-y-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">Temperature:</span> High heat causes
                      minerals to recrystallize and may create new minerals.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Pressure:</span> High pressure can
                      change the shape and arrangement of mineral grains.
                    </p>
                    <p className="text-slate-300">
                      Together, heat and pressure change the texture and structure of rocks.
                    </p>
                  </div>
                </div>

                {/* 4. Effects of Chemical Composition */}
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    4. Effects of Chemical Composition
                  </h3>
                  <div className="mt-2 space-y-1.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    <p>
                      The original chemical and mineral composition of a rock determines which
                      metamorphic minerals can form.
                    </p>
                    <p className="text-slate-300">
                      Different parent rocks can produce different metamorphic rocks under similar
                      conditions.
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-mono tracking-[0.2em] text-slate-400 mb-2">
                      EXAMPLES
                    </p>
                    <div className="divide-y divide-white/10 border-y border-white/15">
                      {CHEMICAL_EXAMPLES.map((ex) => (
                        <div
                          key={ex.rockType}
                          className="flex items-center justify-between gap-4 py-1.5"
                        >
                          <p className="text-lg sm:text-xl font-semibold text-white grey-aura-text">
                            {ex.label}
                          </p>
                          <MiniRock3D rockType={ex.rockType} label={`${ex.label} 3D figure`} />
                        </div>
                      ))}
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
