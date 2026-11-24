import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MiniRock3D } from './MiniRock3D';

interface SlideConceptFoliatedGradeProps {
  part: 0 | 1;
  onTogglePart: () => void;
}

const SLATE_PHOTO =
  'https://upload.wikimedia.org/wikipedia/commons/a/af/SlateUSGOV.jpg';

const PHYLLITE_PHOTO =
  'https://upload.wikimedia.org/wikipedia/commons/f/fe/PhylliteUSGOV.jpg';

const SCHIST_PHOTO =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Garnet-mica_schist_%28Gassetts%2C_Vermont%2C_USA%29_2.jpg/960px-Garnet-mica_schist_%28Gassetts%2C_Vermont%2C_USA%29_2.jpg';

const GNEISS_PHOTO =
  'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/Augen_Gneiss_%2854805720463%29.jpg/960px-Augen_Gneiss_%2854805720463%29.jpg';

export const SlideConceptFoliatedGrade: React.FC<SlideConceptFoliatedGradeProps> = ({
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
            CONCEPT 03 · PART {part + 1} OF 2
          </p>
          <h2 className="mt-1.5 text-3xl sm:text-5xl font-bold text-white grey-aura-title leading-tight">
            Foliated Metamorphic Rocks
          </h2>
        </div>

        <button
          type="button"
          onClick={onTogglePart}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-white text-slate-950 text-sm font-semibold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <kbd className="font-mono px-2 py-0.5 rounded bg-slate-950 text-white text-xs">E</kbd>
          <span>{part === 0 ? 'Part 2 (Schist & Gneiss)' : 'Part 1 (Slate & Phyllite)'}</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left: Verified Online Specimen Photos */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="concept3-gallery-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <figure>
                  <div className="overflow-hidden border-y border-white/20 bg-black/50">
                    <img
                      src={SLATE_PHOTO}
                      alt="Gray foliated slate specimen showing slaty cleavage"
                      referrerPolicy="no-referrer"
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-400">
                    Wikimedia Commons · Slate (Low-Grade Slaty Cleavage)
                  </figcaption>
                </figure>

                <figure>
                  <div className="overflow-hidden border-y border-white/20 bg-black/50">
                    <img
                      src={PHYLLITE_PHOTO}
                      alt="Phyllite metamorphic rock showing satiny sheen and wavy surface"
                      referrerPolicy="no-referrer"
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-400">
                    Wikimedia Commons · Phyllite (Satiny Sheen &amp; Wavy Surface)
                  </figcaption>
                </figure>
              </motion.div>
            ) : (
              <motion.div
                key="concept3-gallery-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <figure>
                  <div className="overflow-hidden border-y border-white/20 bg-black/50">
                    <img
                      src={SCHIST_PHOTO}
                      alt="Garnet-mica schist specimen showing coarse platy mica and garnet crystals"
                      referrerPolicy="no-referrer"
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-400">
                    Wikimedia Commons · Garnet-Mica Schist (Schistosity)
                  </figcaption>
                </figure>

                <figure>
                  <div className="overflow-hidden border-y border-white/20 bg-black/50">
                    <img
                      src={GNEISS_PHOTO}
                      alt="Augen gneiss showing alternating light and dark bands with eye-shaped feldspar"
                      referrerPolicy="no-referrer"
                      className="w-full h-48 sm:h-52 object-cover"
                    />
                  </div>
                  <figcaption className="mt-1.5 text-xs font-mono tracking-[0.14em] text-slate-400">
                    Wikimedia Commons · Augen Gneiss (Gneissic Banding)
                  </figcaption>
                </figure>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: User's Verbatim Text + 3D Specimen Figures */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {part === 0 ? (
              <motion.div
                key="concept3-part-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Slate */}
                <div className="border-t border-white/15 pt-4 flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white grey-aura-text">
                      Slate
                    </h3>
                    <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                      Forms from the low-grade metamorphism of shale. Its mineral grains are too
                      fine to be seen with the naked eye, giving it a dull appearance and slaty
                      cleavage that allows it to split easily into thin, flat sheets.
                    </p>
                    <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">Examples:</span> Gray or black
                      slate used in roofing tiles and traditional school chalkboards.
                    </p>
                  </div>
                  <MiniRock3D rockType="slate" size={88} label="Slate 3D specimen" />
                </div>

                {/* Phyllite */}
                <div className="border-t border-white/15 pt-4 flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white grey-aura-text">
                      Phyllite
                    </h3>
                    <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                      Forms under slightly higher temperature and pressure than slate. Tiny mica
                      crystals grow slightly larger, producing a satiny sheen and a slightly wavy
                      surface.
                    </p>
                    <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">Examples:</span> Chlorite- and
                      mica-rich phyllite showing a silvery-gray or pale green tint in regional
                      metamorphic belts.
                    </p>
                  </div>
                  <MiniRock3D rockType="phyllite" size={88} label="Phyllite 3D specimen" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="concept3-part-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Schist */}
                <div className="border-t border-white/15 pt-4 flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white grey-aura-text">
                      Schist
                    </h3>
                    <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                      Forms under medium-to-high metamorphic grade. Platy minerals such as
                      muscovite, biotite, and chlorite grow large enough to be visible to the naked
                      eye, creating a sparkling, scaly texture called schistosity, often alongside
                      minerals like garnet.
                    </p>
                    <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">Examples:</span> Mica schist and
                      garnet schist.
                    </p>
                  </div>
                  <MiniRock3D rockType="schist" size={88} label="Schist 3D specimen" />
                </div>

                {/* Gneiss */}
                <div className="border-t border-white/15 pt-4 flex items-center justify-between gap-5">
                  <div className="min-w-0">
                    <h3 className="text-2xl sm:text-3xl font-semibold text-white grey-aura-text">
                      Gneiss
                    </h3>
                    <p className="mt-2.5 text-lg sm:text-xl text-slate-200 leading-relaxed">
                      Forms at the highest metamorphic grade just before melting. Minerals segregate
                      into alternating light and dark bands called gneissic banding, typically with
                      light quartz and feldspar alternating with dark biotite and amphibole.
                    </p>
                    <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
                      <span className="font-semibold text-white">Examples:</span> Granitic gneiss
                      and augen gneiss, which contains eye-shaped feldspar porphyroclasts.
                    </p>
                  </div>
                  <MiniRock3D rockType="gneiss" size={88} label="Gneiss 3D specimen" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
