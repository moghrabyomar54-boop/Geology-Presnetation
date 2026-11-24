import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ROCK_SPECS, type RockId } from '../data/presentationData';
import { ThreeRockViewport } from './ThreeRockViewport';

interface SectionSlideProps {
  part: 0 | 1;
  onTogglePart: () => void;
  onJumpToSlide: (slideIndex: number) => void;
}

const ROCK_IDS: RockId[] = ['hornfels', 'marble', 'quartzite'];

const ROCK_LABELS: Record<RockId, string> = {
  hornfels: 'Hornfels',
  marble: 'Marble',
  quartzite: 'Quartzite',
};

const CONCEPT_FOUR_TABS = [
  { slideIndex: 4, label: '1. Hornfels' },
  { slideIndex: 5, label: '2. Marble' },
  { slideIndex: 6, label: '3. Quartzite' },
  { slideIndex: 7, label: '4. Microscopy & Textures' },
];

const ConceptFourSubNav: React.FC<{
  activeSlideIndex: number;
  onJumpToSlide: (slideIndex: number) => void;
}> = ({ activeSlideIndex, onJumpToSlide }) => (
  <div className="flex flex-wrap items-center gap-2 mb-5">
    {CONCEPT_FOUR_TABS.map((tab) => {
      const active = tab.slideIndex === activeSlideIndex;
      return (
        <button
          key={tab.slideIndex}
          type="button"
          onClick={() => onJumpToSlide(tab.slideIndex)}
          className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
            active
              ? 'bg-slate-100 text-slate-950 font-semibold'
              : 'text-slate-300 hover:text-white border border-white/15 hover:border-white/35'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

export const SlideHornfels: React.FC<SectionSlideProps> = ({
  part,
  onTogglePart,
  onJumpToSlide,
}) => {
  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-14 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4 mb-4"
      >
        <div>
          <p className="text-sm sm:text-base font-mono tracking-[0.24em] text-slate-400 grey-aura-text">
            CONCEPT 04 · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Hornfels
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Characteristics & Conclusion)' : 'Part 1 (Origin & Protoliths)'}</span>
        </button>
      </motion.div>

      <ConceptFourSubNav activeSlideIndex={4} onJumpToSlide={onJumpToSlide} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Sliced 2-Part Verbatim Content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="hornfels-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Formation &amp; Contact Metamorphism
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Non-foliated metamorphic rock formed mainly by contact metamorphism when rising
                    magma heats surrounding rocks, causing unstable minerals to recrystallize and
                    react chemically.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Protoliths &amp; Mineral Assemblages
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Protoliths include shale, mudstone, sandstone, basalt, and other fine-grained
                    rocks, controlling resulting minerals (such as quartz, feldspar, biotite,
                    andalusite, cordierite, pyroxene, and garnet) based on composition and
                    temperature/pressure conditions.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hornfels-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Physical Properties &amp; Appearance
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Typically very hard, dense, compact, fine-grained, and non-layered with randomly
                    oriented grains and colors ranging from black, dark grey, brown, or greenish to
                    spotted.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Conclusion
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Contact heating from magma transforms fine-grained protoliths into hard, dense,
                    non-foliated hornfels with variable mineral assemblages.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Interactive 3D Specimen Overview */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/15 pb-3">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-slate-400">
              3D SPECIMEN OVERVIEW
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 text-slate-950">
              Hornfels
            </span>
          </div>

          <ThreeRockViewport rock={ROCK_SPECS.hornfels} />
        </div>
      </div>
    </section>
  );
};

export const SlideMarble: React.FC<SectionSlideProps> = ({
  part,
  onTogglePart,
  onJumpToSlide,
}) => {
  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-14 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4 mb-4"
      >
        <div>
          <p className="text-sm sm:text-base font-mono tracking-[0.24em] text-slate-400 grey-aura-text">
            CONCEPT 04 · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Marble
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Tests, Uses & Conclusion)' : 'Part 1 (Origin & Composition)'}</span>
        </button>
      </motion.div>

      <ConceptFourSubNav activeSlideIndex={5} onJumpToSlide={onJumpToSlide} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Sliced 2-Part Verbatim Content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="marble-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Formation &amp; Recrystallization
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Non-foliated metamorphic rock formed mainly when limestone or dolostone
                    undergoes heat and pressure (burial or near an igneous intrusion),
                    recrystallizing grains into a tightly interlocking crystalline texture without
                    necessarily changing overall chemical composition.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Composition &amp; Impurities
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Primarily composed of calcite (CaCO₃, Mohs ~3, three cleavage directions, fizzes
                    with dilute HCl) or dolomite (CaMg(CO₃)₂, Mohs ~3.5–4, weaker cold dilute HCl
                    reaction), with impurities like quartz, mica, graphite, and iron oxides adding
                    color/patterns.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="marble-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Appearance, Acid Reaction &amp; Uses
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Appears in white, grey, pink, green, black, or cream (pure calcite marble is
                    commonly white), is softer than quartzite, effervesces (CO₂ bubbles) with dilute
                    HCl (CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂), and is used in sculptures, buildings,
                    floor tiles, decorative objects, monuments, and architectural decoration.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Conclusion
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Recrystallization of limestone or dolostone creates interlocking calcite/dolomite
                    marble identified by hardness, acid effervescence, and wide
                    architectural/artistic uses.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Interactive 3D Specimen Overview */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/15 pb-3">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-slate-400">
              3D SPECIMEN OVERVIEW
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 text-slate-950">
              Marble
            </span>
          </div>

          <ThreeRockViewport rock={ROCK_SPECS.marble} />
        </div>
      </div>
    </section>
  );
};

export const SlideQuartzite: React.FC<SectionSlideProps> = ({
  part,
  onTogglePart,
  onJumpToSlide,
}) => {
  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-14 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4 mb-4"
      >
        <div>
          <p className="text-sm sm:text-base font-mono tracking-[0.24em] text-slate-400 grey-aura-text">
            CONCEPT 04 · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Quartzite
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Uses, Microscopy & Conclusion)' : 'Part 1 (Origin & Mineralogy)'}</span>
        </button>
      </motion.div>

      <ConceptFourSubNav activeSlideIndex={6} onJumpToSlide={onJumpToSlide} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Sliced 2-Part Verbatim Content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="quartzite-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Formation &amp; Strength
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Hard, resistant, non-foliated metamorphic rock formed when quartz-rich sandstone
                    experiences increased temperature and pressure and its quartz grains
                    recrystallize into tightly interlocked crystals.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Mineral Composition &amp; Properties
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Predominantly quartz (SiO₂, Mohs hardness 7, usually colorless/white when pure,
                    no cleavage, glassy look, high weathering resistance), with possible feldspar,
                    mica, or iron oxide influences giving white, grey, red, yellow, or green
                    colors.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="quartzite-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Uses &amp; Microscopic Features
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Used in construction materials, road construction, decorative stones, building
                    facades, flooring, and landscaping; under the microscope it shows colorless
                    low-relief quartz grains, interlocking crystals, first-order grey/white XPL
                    interference colors, undulose extinction from internal strain/deformation, and
                    irregular, sutured, or polygonal grain boundaries.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Conclusion
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Recrystallization of quartz-rich sandstone produces durable, Mohs-7 quartzite
                    with diagnostic interlocking quartz and optical/microscopic deformation
                    features.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Interactive 3D Specimen Overview */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/15 pb-3">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-slate-400">
              3D SPECIMEN OVERVIEW
            </span>
            <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold bg-slate-100 text-slate-950">
              Quartzite
            </span>
          </div>

          <ThreeRockViewport rock={ROCK_SPECS.quartzite} />
        </div>
      </div>
    </section>
  );
};

export const SlideMicroscopyTextures: React.FC<SectionSlideProps> = ({
  part,
  onTogglePart,
  onJumpToSlide,
}) => {
  const [activeRockId, setActiveRockId] = useState<RockId>('hornfels');
  const activeRock = ROCK_SPECS[activeRockId];

  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-14 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/15 pb-4 mb-4"
      >
        <div>
          <p className="text-sm sm:text-base font-mono tracking-[0.24em] text-slate-400 grey-aura-text">
            CONCEPT 04 · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Microscopic Identification, Textures &amp; Foliation
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Rock Optics & Conclusion)' : 'Part 1 (Thin Sections & Textures)'}</span>
        </button>
      </motion.div>

      <ConceptFourSubNav activeSlideIndex={7} onJumpToSlide={onJumpToSlide} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Sliced 2-Part Verbatim Content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="microscopy-textures-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Thin Sections (~30 µm) &amp; Optical Study
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Thin sections (~30 µm) let light pass through rocks for petrographic microscope
                    study using PPL (one polarizer: color, pleochroism like brown biotite shifts,
                    relief, cleavage) and XPL (two polarizers at 90°: interference colors, twinning,
                    extinction).
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Four Metamorphic Textures &amp; Foliation
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Four textures are granoblastic (interlocking roughly equal grains in marble,
                    quartzite, hornfels), lepidoblastic (aligned platy/sheet minerals like muscovite
                    and biotite), nematoblastic (elongated/needle minerals like some amphiboles),
                    and porphyroblastic (large porphyroblasts like garnet in finer grains),
                    distinguishing foliated rocks (slate, phyllite, schist, gneiss) from
                    non-foliated rocks (hornfels, marble, quartzite).
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="microscopy-textures-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Diagnostic Microscopic Identification
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Under the microscope, hornfels shows fine-grained granoblastic/random crystals
                    without obvious foliation; marble shows recrystallized granoblastic calcite with
                    twinning and high-order XPL interference colors; quartzite shows abundant
                    interlocking quartz with first-order grey/white XPL colors and possible undulose
                    extinction.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Conclusion
                  </h3>
                  <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Combining 30 µm thin-section PPL/XPL optics with metamorphic texture and
                    foliation analysis distinguishes rock fabrics and identifies hornfels, marble,
                    and quartzite.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Interactive 3D Specimen Overview */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/15 pb-3">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-slate-400">
              3D SPECIMEN OVERVIEW
            </span>
            <div className="flex items-center gap-2">
              {ROCK_IDS.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveRockId(id)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                    activeRockId === id
                      ? 'bg-slate-100 text-slate-950'
                      : 'text-slate-300 hover:text-white border border-white/15'
                  }`}
                >
                  {ROCK_LABELS[id]}
                </button>
              ))}
            </div>
          </div>

          <ThreeRockViewport rock={activeRock} />
        </div>
      </div>
    </section>
  );
};
