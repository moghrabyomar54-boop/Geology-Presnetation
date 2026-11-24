import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ROCK_SPECS } from '../data/presentationData';
import { ThreeRockViewport } from './ThreeRockViewport';
import { MiniRock3D } from './MiniRock3D';

interface EgyptSlideProps {
  part: 0 | 1;
  onTogglePart: () => void;
  onJumpToSlide: (slideIndex: number) => void;
}

const CONCEPT_FIVE_TABS = [
  { slideIndex: 8, label: '1. Deformation' },
  { slideIndex: 9, label: '2. Egypt Map' },
  { slideIndex: 10, label: '3. Egypt History' },
];

const ConceptFiveSubNav: React.FC<{
  activeSlideIndex: number;
  onJumpToSlide: (slideIndex: number) => void;
}> = ({ activeSlideIndex, onJumpToSlide }) => (
  <div className="flex flex-wrap items-center gap-2 mb-5">
    {CONCEPT_FIVE_TABS.map((tab) => {
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

const FOLDED_GNEISS_IMAGE =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f6/Folded_Precambrian_Gneiss_near_Port_Nis_in_Scotland.jpg/960px-Folded_Precambrian_Gneiss_near_Port_Nis_in_Scotland.jpg';

const STEP_FOLD_SLATE_IMAGE =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Step-fold_in_slate_hjk00252.jpg/960px-Step-fold_in_slate_hjk00252.jpg';

const EGYPT_MAP_PRIMARY =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Geological_map_of_Egypt.png/960px-Geological_map_of_Egypt.png';

const EGYPT_MAP_ALT =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Geological_map_of_Egypt_accessible.svg/960px-Geological_map_of_Egypt_accessible.svg.png';

const MIGMATITE_IMAGE =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Migmatite.jpg/960px-Migmatite.jpg';

export const SlideEgyptDeformation: React.FC<EgyptSlideProps> = ({
  part,
  onTogglePart,
  onJumpToSlide,
}) => {
  const quartzite = ROCK_SPECS.quartzite;

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
            CONCEPT 05 · GEOLOGICAL MAPS &amp; HISTORY OF EGYPT · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Decoding Rock Deformation &amp; Metamorphic Records
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Explanation & Conclusion)' : 'Part 1 (Evidence of Deformation)'}</span>
        </button>
      </motion.div>

      <ConceptFiveSubNav activeSlideIndex={8} onJumpToSlide={onJumpToSlide} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Sliced 2-Part Verbatim Content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="egypt-def-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="border-t border-white/15 pt-4"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                  Evidence of Deformation in Rocks
                </h3>
                <div className="mt-4 space-y-4 text-lg sm:text-xl text-slate-200 leading-relaxed">
                  <p>
                    <span className="font-semibold text-white">Folds:</span> Bent or curved rock
                    layers caused by compressional stress.
                  </p>
                  <p>
                    <span className="font-semibold text-white">Faults:</span> Fractures showing
                    visible displacement along rock blocks.
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <p>
                      <span className="font-semibold text-white">Foliation &amp; Lineation:</span>{' '}
                      Parallel alignment of minerals under directed pressure.
                    </p>
                    <MiniRock3D rockType="slate" label="Foliation 3D specimen" />
                  </div>
                  <p>
                    <span className="font-semibold text-white">Joints &amp; Veins:</span> Brittle
                    fractures often filled with secondary minerals like quartz.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="egypt-def-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Explanation
                  </h3>
                  <p className="mt-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Folds, faults, foliation, lineation, joints, and veins record how rocks bend,
                    fracture, and align under stress and directed pressure.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Conclusion
                  </h3>
                  <p className="mt-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    These structural features provide direct evidence of rock deformation in
                    Egypt&apos;s geological record.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <figure>
                    <div className="overflow-hidden border-y border-white/20 bg-black/50">
                      <img
                        src={FOLDED_GNEISS_IMAGE}
                        alt="Folded Precambrian gneiss rock layers"
                        referrerPolicy="no-referrer"
                        className="w-full h-36 sm:h-40 object-cover"
                      />
                    </div>
                    <figcaption className="mt-1.5 text-xs font-mono text-slate-500">
                      Wikimedia · Folded Gneiss
                    </figcaption>
                  </figure>
                  <figure>
                    <div className="overflow-hidden border-y border-white/20 bg-black/50">
                      <img
                        src={STEP_FOLD_SLATE_IMAGE}
                        alt="Step fold in foliated slate"
                        referrerPolicy="no-referrer"
                        className="w-full h-36 sm:h-40 object-cover"
                      />
                    </div>
                    <figcaption className="mt-1.5 text-xs font-mono text-slate-500">
                      Wikimedia · Step-Fold Slate
                    </figcaption>
                  </figure>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Matched 3D Quartz Specimen (Secondary Minerals Like Quartz) */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/15 pb-3">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-slate-400">
              3D MINERAL MATCH · QUARTZ (SiO₂)
            </span>
          </div>
          <ThreeRockViewport rock={quartzite} />
        </div>
      </div>
    </section>
  );
};

export const SlideEgyptMap: React.FC<EgyptSlideProps> = ({
  part,
  onTogglePart,
  onJumpToSlide,
}) => {
  const [mapVariant, setMapVariant] = useState<'primary' | 'accessible'>('primary');

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
            CONCEPT 05 · GEOLOGICAL MAPS &amp; HISTORY OF EGYPT · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Geological Map of Egypt &amp; Major Structural Features
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>
            {part === 0 ? 'Part 2 (Features, Explanation & Conclusion)' : 'Part 1 (Basement & Cover)'}
          </span>
        </button>
      </motion.div>

      <ConceptFiveSubNav activeSlideIndex={9} onJumpToSlide={onJumpToSlide} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Sliced 2-Part Verbatim Content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="egypt-map-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Precambrian Basement Complex (Arabian-Nubian Shield)
                  </h3>
                  <div className="mt-2.5 space-y-2 text-base sm:text-lg text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">Location:</span> Dominates the
                      Eastern Desert (east of the Nile), the entire Sinai Peninsula, and the
                      southwestern corner (Gebel Uweinat area).
                    </p>
                    <p>
                      <span className="font-semibold text-white">Composition:</span> These are the
                      oldest rocks in Egypt (over 600 million years old), primarily metamorphic
                      (gneiss, schist) and igneous (granite, volcanic) rocks.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Significance:</span> This region
                      forms the stable foundation upon which younger sedimentary rocks were
                      deposited.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Phanerozoic Sedimentary Cover
                  </h3>
                  <div className="mt-2.5 space-y-2 text-base sm:text-lg text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">Location:</span> Covers the vast
                      majority of the Western Desert (west of the Nile) and forms a thin,
                      discontinuous strip along the Nile Valley and the northern coast.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Composition:</span> These rocks are
                      younger than the basement and include sandstones, limestones, and shales. They
                      were deposited in shallow seas and continental environments over hundreds of
                      millions of years.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Significance:</span> These units
                      are crucial for groundwater (aquifers) and hydrocarbon resources (oil and
                      gas).
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="egypt-map-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Major Structural Features
                  </h3>
                  <div className="mt-2 space-y-2 text-base sm:text-lg text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">Nile Valley:</span> A major
                      geographical and geological lineament, acting as a rough boundary between the
                      older Basement Complex to the east and the thick sedimentary sequence to the
                      west.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Red Sea Rift:</span> A prominent,
                      linear feature forming Egypt&apos;s eastern boundary, associated with
                      significant faulting and the opening of the Red Sea.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Fault Lines:</span> Numerous faults
                      are visible on the map, particularly within the Basement Complex (e.g., in
                      Sinai and the Eastern Desert), indicating a complex tectonic history.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/15 pt-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white grey-aura-text">
                    Explanation
                  </h3>
                  <p className="mt-1.5 text-base sm:text-lg text-slate-300 leading-relaxed">
                    Egypt&apos;s geological map separates the ancient Precambrian Basement Complex
                    from the younger Phanerozoic Sedimentary Cover, alongside major structural
                    features like the Nile Valley, Red Sea Rift, and fault lines.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-3">
                  <h3 className="text-lg sm:text-xl font-semibold text-white grey-aura-text">
                    Conclusion
                  </h3>
                  <p className="mt-1.5 text-base sm:text-lg text-slate-200 leading-relaxed">
                    These map divisions and structural features show Egypt&apos;s tectonic history
                    as well as the distribution of its basement foundation and groundwater or
                    hydrocarbon resources.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Verified Online Geological Map of Egypt + Matched 3D Protolith Rocks */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between gap-3 border-b border-white/15 pb-3">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-slate-400">
              GEOLOGICAL MAP OF EGYPT
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMapVariant('primary')}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  mapVariant === 'primary'
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-300 hover:text-white border border-white/15'
                }`}
              >
                Geological Map
              </button>
              <button
                type="button"
                onClick={() => setMapVariant('accessible')}
                className={`px-3.5 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
                  mapVariant === 'accessible'
                    ? 'bg-slate-100 text-slate-950'
                    : 'text-slate-300 hover:text-white border border-white/15'
                }`}
              >
                Color-Coded Map
              </button>
            </div>
          </div>

          <figure>
            <div className="overflow-hidden border-y border-white/20 bg-white/95">
              <img
                src={mapVariant === 'primary' ? EGYPT_MAP_PRIMARY : EGYPT_MAP_ALT}
                alt="Geological map of Egypt"
                referrerPolicy="no-referrer"
                className="w-full max-h-[340px] object-contain mx-auto"
              />
            </div>
            <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-500">
              Wikimedia Commons · Geological Map of Egypt
            </figcaption>
          </figure>

          <div className="grid grid-cols-3 gap-4 border-y border-white/10 py-2">
            <div className="flex flex-col items-center text-center">
              <MiniRock3D rockType="quartzite" label="Quartzite 3D figure" />
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Sandstone → Quartzite
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <MiniRock3D rockType="marble" label="Marble 3D figure" />
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Limestone → Marble
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <MiniRock3D rockType="slate" label="Slate 3D figure" />
              <span className="text-xs sm:text-sm font-medium text-slate-200">
                Shale → Slate
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const SlideEgyptHistory: React.FC<EgyptSlideProps> = ({
  part,
  onTogglePart,
  onJumpToSlide,
}) => {
  const hornfels = ROCK_SPECS.hornfels;

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
            CONCEPT 05 · GEOLOGICAL MAPS &amp; HISTORY OF EGYPT · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white grey-aura-title leading-tight">
            Distribution of Metamorphic Rocks &amp; What They Reveal About Egypt&apos;s History
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Explanation & Conclusion)' : 'Part 1 (Distribution & History)'}</span>
        </button>
      </motion.div>

      <ConceptFiveSubNav activeSlideIndex={10} onJumpToSlide={onJumpToSlide} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Sliced 2-Part Verbatim Content */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="egypt-hist-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Distribution of Metamorphic Rocks in Egypt
                  </h3>
                  <div className="mt-2.5 space-y-2 text-base sm:text-lg text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">
                        Eastern Desert (Red Sea Hills):
                      </span>{' '}
                      Main exposure of metavolcanics, metasediments, and gneiss domes.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Southern Sinai:</span> High-grade
                      gneisses, migmatites, and schist belts around St. Catherine and Wadi Feiran.
                    </p>
                    <p>
                      <span className="font-semibold text-white">
                        Southwestern Desert (Gebel Uweinat):
                      </span>{' '}
                      Ancient Archean–Paleoproterozoic granulites and gneisses.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Subsurface Basement:</span>{' '}
                      Underlies younger sedimentary cover across the rest of Egypt.
                    </p>
                  </div>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    What Metamorphic Rocks Reveal About Egypt&apos;s History
                  </h3>
                  <div className="mt-2.5 space-y-2 text-base sm:text-lg text-slate-200 leading-relaxed">
                    <p>
                      <span className="font-semibold text-white">
                        Pan-African Orogeny (~900–550 Ma):
                      </span>{' '}
                      Records the closure of the Mozambique Ocean and assembly of Gondwana.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Arc Accretion &amp; Subduction:</span>{' '}
                      Low-grade metavolcanics and ophiolites mark ancient oceanic crust and island
                      arcs.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Deep Crustal Collision:</span>{' '}
                      High-grade gneisses and migmatites indicate extreme heat and pressure during
                      mountain building.
                    </p>
                    <p>
                      <span className="font-semibold text-white">Exhumation &amp; Extension:</span>{' '}
                      Core complexes reveal how deep crust rose to the surface before Red Sea
                      rifting.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="egypt-hist-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Explanation
                  </h3>
                  <p className="mt-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Metamorphic rocks appear across the Eastern Desert, Southern Sinai, Gebel
                    Uweinat, and beneath sedimentary cover, preserving records of the Pan-African
                    Orogeny, arc accretion and subduction, deep crustal collision, and exhumation
                    and extension.
                  </p>
                </div>

                <div className="border-t border-white/15 pt-4">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white grey-aura-text">
                    Conclusion
                  </h3>
                  <p className="mt-2 text-lg sm:text-xl text-slate-200 leading-relaxed">
                    Examining these metamorphic rocks reveals how ocean closure, Gondwana assembly,
                    mountain building, and crustal uplift shaped Egypt&apos;s history prior to Red
                    Sea rifting.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <figure>
                    <div className="overflow-hidden border-y border-white/20 bg-black/50">
                      <img
                        src={MIGMATITE_IMAGE}
                        alt="High-grade migmatite rock"
                        referrerPolicy="no-referrer"
                        className="w-full h-36 sm:h-40 object-cover"
                      />
                    </div>
                    <figcaption className="mt-1.5 text-xs font-mono text-slate-500">
                      Wikimedia · High-Grade Migmatite
                    </figcaption>
                  </figure>
                  <figure>
                    <div className="overflow-hidden border-y border-white/20 bg-black/50">
                      <img
                        src={FOLDED_GNEISS_IMAGE}
                        alt="Folded Precambrian gneiss"
                        referrerPolicy="no-referrer"
                        className="w-full h-36 sm:h-40 object-cover"
                      />
                    </div>
                    <figcaption className="mt-1.5 text-xs font-mono text-slate-500">
                      Wikimedia · Precambrian Gneiss
                    </figcaption>
                  </figure>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Matched 3D High-Temperature Silicate Specimen */}
        <div className="lg:col-span-6">
          <div className="flex items-center justify-between gap-3 mb-3 border-b border-white/15 pb-3">
            <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-slate-400">
              3D METAMORPHIC MINERAL ASSEMBLAGE
            </span>
          </div>
          <ThreeRockViewport rock={hornfels} />
        </div>
      </div>
    </section>
  );
};
