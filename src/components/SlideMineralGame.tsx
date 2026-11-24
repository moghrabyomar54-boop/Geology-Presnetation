import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Pickaxe, Play, Volume2, VolumeX } from 'lucide-react';

interface SlideMineralGameProps {
  onNextToCredits: () => void;
}

interface QuestionBlock {
  id: string;
  blockName: string;
  mineralLabel: string;
  worldX: number;
  primaryColor: string;
  accentColor: string;
  outlineColor: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTION_BLOCKS: QuestionBlock[] = [
  {
    id: 'diamond-ore-1',
    blockName: 'Diamond Ore',
    mineralLabel: 'Diamond Ore',
    worldX: 165,
    primaryColor: '#2ee6f2',
    accentColor: '#a5f3fc',
    outlineColor: '#0e7490',
    question: 'How does Hornfels form, and why does it lack foliation?',
    options: [
      'It forms mainly through contact metamorphism when existing rocks are heated by magma without strong directed pressure producing parallel layers.',
      'It forms deep in subduction zones under extreme tectonic shear stress that aligns platy mica sheets.',
      'It precipitates directly from warm shallow seawater as layered calcium carbonate mud.',
      'It cools slowly from molten magma underground as coarse interlocking granite crystals.',
    ],
    correctIndex: 0,
    explanation:
      'Magmatic heat bakes surrounding country rock in a thermal aureole without strong directed pressure, yielding a dense non-foliated granoblastic mosaic.',
  },
  {
    id: 'gold-ore',
    blockName: 'Gold Ore',
    mineralLabel: 'Gold Ore',
    worldX: 335,
    primaryColor: '#facc15',
    accentColor: '#fef08a',
    outlineColor: '#a16207',
    question: 'What happens when dilute hydrochloric acid is applied to calcite-rich Marble?',
    options: [
      'The acid freezes on contact and turns the calcite grains dark purple.',
      'Effervescence occurs (bubbles of CO₂ gas form) via CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂.',
      'No reaction occurs because carbonate minerals are completely insoluble in acid.',
      'Silica gel precipitates instantly and increases the rock hardness to Mohs 7.',
    ],
    correctIndex: 1,
    explanation:
      'Calcite (CaCO₃) reacts briskly with dilute HCl, releasing carbon dioxide bubbles (effervescence).',
  },
  {
    id: 'emerald-ore',
    blockName: 'Emerald Ore',
    mineralLabel: 'Emerald Ore',
    worldX: 505,
    primaryColor: '#22c55e',
    accentColor: '#86efac',
    outlineColor: '#15803d',
    question: 'What is the parent rock of Quartzite, and what gives it a Mohs hardness of 7?',
    options: [
      'Shale is the parent rock, and its fine biotite clay layers give it a Mohs hardness of 7.',
      'Limestone is the parent rock, and its interlocked calcite rhombohedra give it a hardness of 7.',
      'Quartz-rich sandstone is the parent rock, and its predominant quartz (SiO₂) composition gives it a hardness of 7.',
      'Basalt is the parent rock, and its iron-rich pyroxene crystals give it a hardness of 7.',
    ],
    correctIndex: 2,
    explanation:
      'Recrystallization fuses quartz-rich sandstone grains into an ultra-hard (Mohs 7) interlocking SiO₂ mosaic that scratches ordinary glass.',
  },
  {
    id: 'redstone-ore',
    blockName: 'Redstone Ore',
    mineralLabel: 'Redstone Ore',
    worldX: 675,
    primaryColor: '#ef4444',
    accentColor: '#fca5a5',
    outlineColor: '#991b1b',
    question: 'Why is a thin section prepared to a standard thickness of approximately 30 µm?',
    options: [
      'To make the rock heavy enough to sink in dilute hydrochloric acid.',
      'So light can pass through the minerals and their optical properties can be studied under a microscope.',
      'To melt the crystal boundaries before polishing the specimen.',
      'Because rocks thicker than 30 µm lose their Mohs hardness scale value.',
    ],
    correctIndex: 1,
    explanation:
      'At ~30 µm thickness, rock slices become transparent to polarized light, revealing diagnostic optical properties.',
  },
  {
    id: 'lapis-ore',
    blockName: 'Lapis Lazuli Ore',
    mineralLabel: 'Lapis Ore',
    worldX: 845,
    primaryColor: '#2563eb',
    accentColor: '#93c5fd',
    outlineColor: '#1e3a8a',
    question:
      'What is the difference between Plane Polarized Light (PPL) and Crossed Polarized Light (XPL)?',
    options: [
      'PPL uses ultraviolet lasers to melt calcite, whereas XPL uses X-rays to measure density.',
      'PPL only works on igneous rocks, while XPL only works on sedimentary rocks.',
      'PPL uses one polarizer to show natural color, pleochroism, relief, and cleavage, while XPL uses two polarizers at 90° to show interference colors, twinning, and extinction.',
      'PPL shows interference colors and twinning, while XPL removes all polarizers for naked-eye viewing.',
    ],
    correctIndex: 2,
    explanation:
      'Single-polarizer PPL reveals color, pleochroism, relief, and cleavage; crossed-polarizer (90°) XPL reveals interference colors, twinning, and extinction.',
  },
  {
    id: 'diamond-ore-6',
    blockName: 'Diamond Ore',
    mineralLabel: 'Diamond Ore',
    worldX: 1015,
    primaryColor: '#2ee6f2',
    accentColor: '#cffafe',
    outlineColor: '#0e7490',
    question: 'Which metamorphic texture is shared by Hornfels, Marble, and Quartzite?',
    options: [
      'Lepidoblastic texture (parallel alignment of platy mica sheets).',
      'Granoblastic texture (interlocking mineral grains of roughly equal dimensions).',
      'Nematoblastic texture (needle-like amphibole prisms aligned along one axis).',
      'Glassy vesicular texture (trapped volcanic gas bubbles).',
    ],
    correctIndex: 1,
    explanation:
      'Hornfels, Marble, and Quartzite are all non-foliated rocks dominated by equidimensional interlocking crystals—a granoblastic texture.',
  },
  {
    id: 'iron-ore',
    blockName: 'Iron Ore',
    mineralLabel: 'Iron Ore',
    worldX: 1185,
    primaryColor: '#e2c0a4',
    accentColor: '#ffedd5',
    outlineColor: '#9a3412',
    question:
      '7Q: Which metamorphic process mainly forms Hornfels when magma moves upward and heats surrounding rocks?',
    options: [
      'Contact metamorphism.',
      'Deep oceanic trench subduction under cold high pressure.',
      'Mechanical weathering and river gravel deposition.',
      'Evaporation of mineral-rich desert lakes.',
    ],
    correctIndex: 0,
    explanation:
      'Contact metamorphism happens when rising magma bakes adjacent rock layers, transforming them into dense Hornfels.',
  },
  {
    id: 'copper-ore',
    blockName: 'Copper Ore',
    mineralLabel: 'Copper Ore',
    worldX: 1355,
    primaryColor: '#ea580c',
    accentColor: '#6ee7b7',
    outlineColor: '#7c2d12',
    question:
      '8Q: Name two parent rocks (protoliths) that can form Marble when exposed to heat and pressure.',
    options: [
      'Shale and mudstone.',
      'Limestone and dolostone.',
      'Quartz-rich sandstone and basalt.',
      'Obsidian and pumice.',
    ],
    correctIndex: 1,
    explanation:
      'Marble forms when carbonate protoliths—limestone or dolostone—recrystallize into interlocking calcite or dolomite grains.',
  },
  {
    id: 'amethyst-ore',
    blockName: 'Amethyst Ore',
    mineralLabel: 'Amethyst Ore',
    worldX: 1525,
    primaryColor: '#a855f7',
    accentColor: '#e9d5ff',
    outlineColor: '#6b21a8',
    question:
      '9Q: Why can Quartzite scratch ordinary glass, and what is its hardness on the Mohs scale?',
    options: [
      'It is made mainly of calcite (CaCO₃) and has a hardness of 3 on the Mohs scale.',
      'It is made mainly of quartz (SiO₂) and has a hardness of 7 on the Mohs scale.',
      'It is composed of platy biotite mica and has a hardness of 2.5 on the Mohs scale.',
      'It contains volcanic ash and has a hardness of 4 on the Mohs scale.',
    ],
    correctIndex: 1,
    explanation:
      'Quartzite is composed primarily of quartz (SiO₂) with a Mohs hardness of 7, harder than ordinary window glass (~5.5).',
  },
  {
    id: 'coal-ore',
    blockName: 'Coal Ore',
    mineralLabel: 'Coal Ore',
    worldX: 1695,
    primaryColor: '#27272a',
    accentColor: '#71717a',
    outlineColor: '#09090b',
    question:
      '10Q: What happens during the acid test when dilute hydrochloric acid is put on calcite-rich Marble?',
    options: [
      'The marble immediately hardens to Mohs 7 without any gas bubbles.',
      'Bubbles appear (effervescence) from carbon dioxide gas (CO₂) via CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂.',
      'No reaction occurs because calcite does not react with dilute acids.',
      'The surface freezes into white needle-like quartz fibers.',
    ],
    correctIndex: 1,
    explanation:
      'Dilute HCl reacts vigorously with calcite (CaCO₃), releasing CO₂ gas bubbles (effervescence).',
  },
  {
    id: 'prismarine-ore',
    blockName: 'Prismarine Ore',
    mineralLabel: 'Prismarine Ore',
    worldX: 1865,
    primaryColor: '#14b8a6',
    accentColor: '#99f6e4',
    outlineColor: '#0f766e',
    question:
      '11Q: How are the two polarizers positioned in Crossed Polarized Light (XPL), and what is one thing you can observe with it?',
    options: [
      'They are aligned parallel at 0° to measure Mohs scratch resistance.',
      'They are positioned at 90° to each other, letting you observe interference colors, twinning, or extinction.',
      'Only one polarizer is used to dissolve carbonate grains in thin sections.',
      'They are removed completely so rocks are viewed in ordinary room light.',
    ],
    correctIndex: 1,
    explanation:
      'In XPL, two polarizers are crossed at 90°, revealing interference colors, lamellar twinning, and extinction behavior.',
  },
  {
    id: 'diamond-block',
    blockName: 'Block of Diamond',
    mineralLabel: 'Diamond',
    worldX: 2035,
    primaryColor: '#2ee6f2',
    accentColor: '#cffafe',
    outlineColor: '#0e7490',
    question:
      '12Q: Which metamorphic texture has interlocking mineral grains of roughly equal size, and what is one rock that has it?',
    options: [
      'Lepidoblastic texture, found exclusively in unbaked shale.',
      'Granoblastic texture, found in Marble, Quartzite, or Hornfels.',
      'Vesicular texture, found in frothy volcanic pumice.',
      'Nematoblastic texture, found only in limestone.',
    ],
    correctIndex: 1,
    explanation:
      'Granoblastic texture consists of roughly equal-sized interlocking grains and defines non-foliated Marble, Quartzite, and Hornfels.',
  },
];

type GamePhase =
  | 'TITLE'
  | 'WALKING'
  | 'QUIZ'
  | 'BREAKING'
  | 'CREEPER_AMBUSH'
  | 'EXPLODED'
  | 'YOU_DIED'
  | 'FINAL_BATTLE'
  | 'VICTORY';

interface PixelParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

type SheepPhase = 'WAITING' | 'WITH_STEVE' | 'RUNNING' | 'CONTINUING';

interface BeeEntity {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  phaseOffset: number;
  range: number;
}

type HostileKind = 'creeper' | 'zombie' | 'enderman';

interface HostileMob {
  id: string;
  kind: HostileKind;
  x: number;
  hp: number;
  maxHp: number;
  walkTimer: number;
  hitFlash: number;
  attackCooldown: number;
  dropsDiamond: boolean;
  teleportTimer: number;
  dead: boolean;
}

interface XpOrb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  collected: boolean;
}

interface DiamondDrop {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  collected: boolean;
}

const createInitialBees = (): BeeEntity[] => [
  { baseX: 230, baseY: 96, x: 230, y: 96, vx: 22, phaseOffset: 0.4, range: 75 },
  { baseX: 590, baseY: 88, x: 590, y: 88, vx: -20, phaseOffset: 1.7, range: 85 },
  { baseX: 980, baseY: 98, x: 980, y: 98, vx: 25, phaseOffset: 2.9, range: 90 },
  { baseX: 1410, baseY: 92, x: 1410, y: 92, vx: -23, phaseOffset: 4.1, range: 85 },
  { baseX: 1840, baseY: 94, x: 1840, y: 94, vx: 21, phaseOffset: 5.3, range: 95 },
];

// Retro Atari Web Audio chiptune synthesizer (zero external assets)
function playAtariTone(
  type:
    | 'step'
    | 'encounter'
    | 'hit'
    | 'break'
    | 'wrong'
    | 'creeper_hiss'
    | 'explosion'
    | 'sword'
    | 'xp'
    | 'victory',
  muted: boolean
) {
  if (muted) return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const beep = (
      freq: number,
      dur: number,
      delay = 0,
      wave: OscillatorType = 'square',
      vol = 0.08
    ) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now + delay);
      gain.gain.setValueAtTime(vol, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + dur);
    };

    const playNoise = (
      dur: number,
      filterType: BiquadFilterType,
      freqStart: number,
      freqEnd: number,
      vol: number
    ) => {
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(sampleRate * dur);
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(freqStart, now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start(now);
      src.stop(now + dur);
    };

    if (type === 'step') {
      beep(140, 0.04, 0, 'square', 0.03);
    } else if (type === 'encounter') {
      beep(440, 0.08, 0, 'square', 0.07);
      beep(660, 0.12, 0.08, 'square', 0.07);
    } else if (type === 'hit') {
      beep(220, 0.07, 0, 'triangle', 0.1);
    } else if (type === 'break') {
      beep(523.25, 0.08, 0, 'square', 0.08);
      beep(659.25, 0.08, 0.07, 'square', 0.08);
      beep(783.99, 0.14, 0.14, 'square', 0.09);
    } else if (type === 'wrong') {
      beep(190, 0.12, 0, 'sawtooth', 0.08);
      beep(140, 0.18, 0.11, 'sawtooth', 0.08);
    } else if (type === 'sword') {
      playNoise(0.08, 'highpass', 1800, 600, 0.09);
      beep(340, 0.06, 0, 'triangle', 0.09);
      beep(520, 0.05, 0.03, 'square', 0.05);
    } else if (type === 'xp') {
      beep(987.77, 0.07, 0, 'sine', 0.09);
      beep(1318.51, 0.12, 0.06, 'sine', 0.09);
    } else if (type === 'victory') {
      beep(523.25, 0.1, 0, 'square', 0.08);
      beep(659.25, 0.1, 0.1, 'square', 0.08);
      beep(783.99, 0.1, 0.2, 'square', 0.08);
      beep(1046.5, 0.25, 0.3, 'square', 0.1);
    } else if (type === 'creeper_hiss') {
      playNoise(1.08, 'bandpass', 2200, 4800, 0.16);
      beep(920, 0.08, 0.0, 'sawtooth', 0.025);
      beep(1180, 0.1, 0.45, 'sawtooth', 0.03);
    } else if (type === 'explosion') {
      playNoise(0.68, 'lowpass', 950, 90, 0.34);
      const sub = ctx.createOscillator();
      const subGain = ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(130, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + 0.55);
      subGain.gain.setValueAtTime(0.24, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      sub.connect(subGain);
      subGain.connect(ctx.destination);
      sub.start(now);
      sub.stop(now + 0.55);
    }

    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, 1400);
  } catch {
    // AudioContext blocked or unsupported
  }
}

export const SlideMineralGame: React.FC<SlideMineralGameProps> = ({ onNextToCredits }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<GamePhase>('TITLE');
  const [brokenCount, setBrokenCount] = useState(0);
  const [activeBlockIdx, setActiveBlockIdx] = useState(0);
  const [wrongChoices, setWrongChoices] = useState<number[]>([]);
  const [shakeQuiz, setShakeQuiz] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [autoWalk, setAutoWalk] = useState(false);
  const [sfxMuted, setSfxMuted] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [mobsSlain, setMobsSlain] = useState(0);
  const [xpPoints, setXpPoints] = useState(0);
  const [gotZombieDiamond, setGotZombieDiamond] = useState(false);

  // Mutable real-time game state for smooth 60fps Atari pixel rendering
  const gameRef = useRef({
    steveX: 48,
    steveDir: 1 as -1 | 1,
    walkDir: 0 as -1 | 0 | 1,
    walkTimer: 0,
    swingTimer: 0,
    breakAnimTimer: 0,
    breakingBlockIndex: -1,
    broken: QUESTION_BLOCKS.map(() => false),
    particles: [] as PixelParticle[],
    cameraX: 0,
    stepSfxCooldown: 0,
    // Sheep companion in middle of questions -> runs -> continues its path
    sheepPhase: 'WAITING' as SheepPhase,
    sheepX: 585,
    sheepDir: 1 as -1 | 1,
    sheepWalkTimer: 0,
    sheepRunTimer: 0,
    // Ambient flying Overworld bees
    bees: createInitialBees(),
    // Wrong-answer Creeper ambush state
    creeperActive: false,
    creeperX: 2140,
    creeperWalkTimer: 0,
    creeperFusing: false,
    creeperFuseTimer: 0,
    creeperExploded: false,
    steveDead: false,
    explosionFlash: 0,
    craterX: -1,
    // Nightfall & Final Battle (3 Creepers, 2 Zombies, 2 Endermen)
    nightFactor: 0,
    swordSlashTimer: 0,
    swordCooldown: 0,
    hostiles: [] as HostileMob[],
    xpOrbs: [] as XpOrb[],
    diamondDrop: { active: false, x: 0, y: 0, vy: 0, collected: false } as DiamondDrop,
    victoryTriggered: false,
  });

  const timeoutsRef = useRef<number[]>([]);
  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => clearAllTimeouts, [clearAllTimeouts]);

  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const autoWalkRef = useRef(autoWalk);
  autoWalkRef.current = autoWalk;
  const mutedRef = useRef(sfxMuted);
  mutedRef.current = sfxMuted;

  const initWorldState = useCallback(() => {
    clearAllTimeouts();
    gameRef.current = {
      steveX: 48,
      steveDir: 1,
      walkDir: 0,
      walkTimer: 0,
      swingTimer: 0,
      breakAnimTimer: 0,
      breakingBlockIndex: -1,
      broken: QUESTION_BLOCKS.map(() => false),
      particles: [],
      cameraX: 0,
      stepSfxCooldown: 0,
      sheepPhase: 'WAITING',
      sheepX: 585,
      sheepDir: 1,
      sheepWalkTimer: 0,
      sheepRunTimer: 0,
      bees: createInitialBees(),
      creeperActive: false,
      creeperX: 2140,
      creeperWalkTimer: 0,
      creeperFusing: false,
      creeperFuseTimer: 0,
      creeperExploded: false,
      steveDead: false,
      explosionFlash: 0,
      craterX: -1,
      nightFactor: 0,
      swordSlashTimer: 0,
      swordCooldown: 0,
      hostiles: [],
      xpOrbs: [],
      diamondDrop: { active: false, x: 0, y: 0, vy: 0, collected: false },
      victoryTriggered: false,
    };
    setBrokenCount(0);
    setActiveBlockIdx(0);
    setWrongChoices([]);
    setFeedbackMsg(null);
    setAutoWalk(false);
    setProgressPct(0);
    setMobsSlain(0);
    setXpPoints(0);
    setGotZombieDiamond(false);
  }, [clearAllTimeouts]);

  const resetGame = useCallback(() => {
    initWorldState();
    setPhase('WALKING');
  }, [initWorldState]);

  const goToTitleScreen = useCallback(() => {
    initWorldState();
    setPhase('TITLE');
  }, [initWorldState]);

  const spawnBreakParticles = (worldX: number, block: QuestionBlock) => {
    const colors = [
      block.primaryColor,
      block.accentColor,
      '#848484',
      '#5c5c5c',
      '#ffffff',
      block.outlineColor,
    ];
    for (let i = 0; i < 28; i++) {
      gameRef.current.particles.push({
        x: worldX + 12 + (Math.random() - 0.5) * 14,
        y: 120 + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 98,
        vy: -38 - Math.random() * 88,
        color: colors[i % colors.length],
        size: 2 + Math.floor(Math.random() * 3),
        life: 0.75 + Math.random() * 0.45,
      });
    }
  };

  const handleAnswer = useCallback(
    (optionIdx: number) => {
      if (phaseRef.current !== 'QUIZ') return;
      const block = QUESTION_BLOCKS[activeBlockIdx];
      if (!block) return;

      if (optionIdx === block.correctIndex) {
        // Correct! Trigger pickaxe swing + break animation
        playAtariTone('hit', mutedRef.current);
        scheduleTimeout(() => playAtariTone('break', mutedRef.current), 180);

        gameRef.current.breakingBlockIndex = activeBlockIdx;
        gameRef.current.breakAnimTimer = 0.9;
        gameRef.current.swingTimer = 0.9;
        setFeedbackMsg(block.explanation);
        setPhase('BREAKING');

        scheduleTimeout(() => {
          spawnBreakParticles(block.worldX, block);
        }, 240);

        scheduleTimeout(() => {
          gameRef.current.broken[activeBlockIdx] = true;
          const nextBrokenCount = activeBlockIdx + 1;
          setBrokenCount(nextBrokenCount);
          setWrongChoices([]);
          setFeedbackMsg(null);

          if (nextBrokenCount >= QUESTION_BLOCKS.length) {
            // Night falls! 3 Creepers, 2 Zombies, and 2 Endermen rush Steve!
            setAutoWalk(false);
            const g = gameRef.current;
            const sx = g.steveX;
            g.hostiles = [
              { id: 'c1', kind: 'creeper', x: sx + 118, hp: 2, maxHp: 2, walkTimer: 0, hitFlash: 0, attackCooldown: 0, dropsDiamond: false, teleportTimer: 0, dead: false },
              { id: 'z1', kind: 'zombie', x: sx - 115, hp: 2, maxHp: 2, walkTimer: 0.4, hitFlash: 0, attackCooldown: 0, dropsDiamond: false, teleportTimer: 0, dead: false },
              { id: 'e1', kind: 'enderman', x: sx + 152, hp: 2, maxHp: 2, walkTimer: 0.8, hitFlash: 0, attackCooldown: 0, dropsDiamond: false, teleportTimer: 1.1, dead: false },
              { id: 'c2', kind: 'creeper', x: sx - 156, hp: 2, maxHp: 2, walkTimer: 1.1, hitFlash: 0, attackCooldown: 0, dropsDiamond: false, teleportTimer: 0, dead: false },
              { id: 'c3', kind: 'creeper', x: sx + 188, hp: 2, maxHp: 2, walkTimer: 0.3, hitFlash: 0, attackCooldown: 0, dropsDiamond: false, teleportTimer: 0, dead: false },
              { id: 'e2', kind: 'enderman', x: sx - 196, hp: 2, maxHp: 2, walkTimer: 0.6, hitFlash: 0, attackCooldown: 0, dropsDiamond: false, teleportTimer: 1.4, dead: false },
              { id: 'z2', kind: 'zombie', x: sx + 220, hp: 2, maxHp: 2, walkTimer: 0.2, hitFlash: 0, attackCooldown: 0, dropsDiamond: true, teleportTimer: 0, dead: false },
            ];
            g.xpOrbs = [];
            g.diamondDrop = { active: false, x: 0, y: 0, vy: 0, collected: false };
            g.victoryTriggered = false;
            setMobsSlain(0);
            setXpPoints(0);
            setGotZombieDiamond(false);
            setPhase('FINAL_BATTLE');
          } else {
            setActiveBlockIdx(nextBrokenCount);
            setPhase('WALKING');
          }
        }, 900);
      } else {
        // Wrong answer in the middle of the game! Creeper stalks up and blows Steve up!
        playAtariTone('wrong', mutedRef.current);
        setWrongChoices((prev) => (prev.includes(optionIdx) ? prev : [...prev, optionIdx]));
        setShakeQuiz(true);
        setAutoWalk(false);
        // Prevent double-clicking answers during the 320ms shake before Creeper spawns
        phaseRef.current = 'CREEPER_AMBUSH';
        scheduleTimeout(() => {
          setShakeQuiz(false);
          const g = gameRef.current;
          g.creeperActive = true;
          g.creeperX = Math.max(g.steveX + 98, g.cameraX + 275);
          g.creeperWalkTimer = 0;
          g.creeperFusing = false;
          g.creeperFuseTimer = 0;
          g.creeperExploded = false;
          setPhase('CREEPER_AMBUSH');
        }, 320);
      }
    },
    [activeBlockIdx, scheduleTimeout]
  );

  // Keyboard controls for walking (A/D or Left/Right) and answering (1-4)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (phaseRef.current === 'TITLE' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        resetGame();
        return;
      }

      if (phaseRef.current === 'QUIZ') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          e.preventDefault();
          handleAnswer(Number(e.key) - 1);
        }
        return;
      }

      if (phaseRef.current === 'WALKING') {
        if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          e.preventDefault();
          gameRef.current.walkDir = 1;
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          gameRef.current.walkDir = -1;
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (
        e.key === 'ArrowRight' ||
        e.key === 'd' ||
        e.key === 'D' ||
        e.key === 'ArrowLeft' ||
        e.key === 'a' ||
        e.key === 'A'
      ) {
        gameRef.current.walkDir = 0;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [handleAnswer, resetGame]);

  // 2D Atari Pixel Art Canvas Game Loop (320 x 180 internal pixel grid)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const W = canvas.width; // 320
    const H = canvas.height; // 180
    const GROUND_Y = 136;

    let rafId = 0;
    let lastTime = performance.now();

    const drawPixelSteve = (
      sx: number,
      sy: number,
      walkPhase: number,
      swinging: boolean,
      dir: -1 | 1,
      hasSword: boolean
    ) => {
      const legSwing = Math.round(Math.sin(walkPhase * 10) * 2.5);
      const armSwing = swinging ? -6 + Math.round(Math.sin(walkPhase * 28) * 5) : -legSwing;

      ctx.save();
      ctx.translate(sx, 0);
      ctx.scale(dir, 1);

      // Shadow on pixel ground
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(-6, sy + 28, 13, 3);

      // Back Leg (dark indigo pants)
      ctx.fillStyle = '#1e2b7a';
      ctx.fillRect(-2 - Math.floor(legSwing / 2), sy + 18, 4, 10);

      // Front Leg (blue pants + grey boot)
      ctx.fillStyle = '#2d40b8';
      ctx.fillRect(-1 + Math.floor(legSwing / 2), sy + 18, 4, 8);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-1 + Math.floor(legSwing / 2), sy + 26, 4, 2);

      // Torso (Steve cyan shirt)
      ctx.fillStyle = '#0694a2';
      ctx.fillRect(-3, sy + 8, 7, 10);
      ctx.fillStyle = '#0e7490';
      ctx.fillRect(2, sy + 8, 2, 10);

      // Head (blocky 9x9 Steve head)
      ctx.fillStyle = '#c98e6b';
      ctx.fillRect(-4, sy - 1, 9, 9);
      // Brown pixel hair
      ctx.fillStyle = '#4a2c18';
      ctx.fillRect(-4, sy - 1, 9, 3);
      ctx.fillRect(-4, sy + 2, 2, 2);
      // White + blue eye facing right
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2, sy + 3, 2, 2);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(3, sy + 3, 1, 2);
      // Mouth/beard detail
      ctx.fillStyle = '#7c4a2d';
      ctx.fillRect(1, sy + 6, 3, 1);

      // Arm + Tool
      const armY = sy + 9 + Math.max(-3, Math.min(3, Math.floor(armSwing / 2)));
      ctx.fillStyle = '#0891b2';
      ctx.fillRect(-1, armY, 4, 4);
      ctx.fillStyle = '#c98e6b';
      ctx.fillRect(2, armY + 2, 3, 4);

      if (hasSword) {
        // Gleaming Minecraft Diamond Sword!
        const wx = 5;
        const wy = swinging ? armY - 4 : armY + 1;
        // Hilt & guard
        ctx.fillStyle = '#78350f';
        ctx.fillRect(wx - 1, wy + 2, 2, 2);
        ctx.fillStyle = '#0e7490';
        ctx.fillRect(wx, wy, 4, 2);
        // Diagonal cyan blade
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(wx + 2, wy - 2, 3, 3);
        ctx.fillRect(wx + 4, wy - 4, 3, 3);
        ctx.fillRect(wx + 6, wy - 6, 3, 3);
        ctx.fillRect(wx + 8, wy - 8, 3, 3);
        // Bright specular edge
        ctx.fillStyle = '#cffafe';
        ctx.fillRect(wx + 3, wy - 2, 1, 1);
        ctx.fillRect(wx + 5, wy - 4, 1, 1);
        ctx.fillRect(wx + 7, wy - 6, 1, 1);
        ctx.fillRect(wx + 9, wy - 8, 2, 2);

        // Sweeping cyan slash arc while striking
        if (swinging) {
          ctx.fillStyle = 'rgba(165, 243, 252, 0.85)';
          ctx.fillRect(wx + 10, wy - 10, 3, 6);
          ctx.fillRect(wx + 12, wy - 4, 2, 7);
          ctx.fillRect(wx + 10, wy + 3, 3, 4);
        }
      } else {
        // Pixel Iron Pickaxe held in front
        const px = 5;
        const py = swinging ? armY - 4 : armY + 1;
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px, py + 2, 2, 2);
        ctx.fillRect(px + 2, py, 2, 2);
        ctx.fillRect(px + 4, py - 2, 2, 2);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(px + 3, py - 5, 5, 2);
        ctx.fillRect(px + 7, py - 3, 2, 4);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(px + 2, py - 4, 1, 2);
      }

      ctx.restore();
    };

    const drawMineralBlock = (
      bx: number,
      by: number,
      block: QuestionBlock,
      crackStage: number,
      tickCount: number
    ) => {
      const size = 24;

      if (block.id === 'diamond-block') {
        // Gleaming Minecraft Block of Diamond
        ctx.fillStyle = '#0e7490';
        ctx.fillRect(bx - 1, by - 1, size + 2, size + 2);
        ctx.fillStyle = '#22d3ee';
        ctx.fillRect(bx, by, size, size);
        // Bright cyan top & left bevel
        ctx.fillStyle = '#a5f3fc';
        ctx.fillRect(bx, by, size, 3);
        ctx.fillRect(bx, by, 3, size);
        // Deeper shadow bottom & right bevel
        ctx.fillStyle = '#0891b2';
        ctx.fillRect(bx, by + size - 3, size, 3);
        ctx.fillRect(bx + size - 3, by, 3, size);
        // Inner specular diamond square
        ctx.fillStyle = '#67e8f9';
        ctx.fillRect(bx + 4, by + 4, 16, 16);
        ctx.fillStyle = '#ecfeff';
        ctx.fillRect(bx + 6, by + 6, 5, 5);
        ctx.fillRect(bx + 14, by + 13, 3, 3);
      } else {
        // Authentic Minecraft Stone Base with mottled 3x3 stone pixels
        ctx.fillStyle = '#3f3f46';
        ctx.fillRect(bx - 1, by - 1, size + 2, size + 2);
        const stonePalette = ['#7d7d7d', '#6e6e6e', '#8b8b8b', '#757575', '#636363'];
        for (let py = 0; py < size; py += 3) {
          for (let px = 0; px < size; px += 3) {
            const hash = Math.abs((px * 13 + py * 29 + bx * 0 + block.worldX) % stonePalette.length);
            ctx.fillStyle = stonePalette[hash];
            ctx.fillRect(bx + px, by + py, 3, 3);
          }
        }
        // Subtle stone top/bottom bevel
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fillRect(bx, by, size, 2);
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(bx, by + size - 2, size, 2);

        // Embedded Minecraft Ore Nuggets (shadow + core + bright highlight)
        const oreSpots = [
          [4, 4, 4, 3],
          [14, 3, 5, 4],
          [9, 10, 5, 4],
          [3, 14, 4, 4],
          [16, 12, 4, 4],
          [11, 18, 5, 3],
        ];
        for (const [ox, oy, ow, oh] of oreSpots) {
          ctx.fillStyle = block.outlineColor;
          ctx.fillRect(bx + ox, by + oy + 1, ow, oh);
          ctx.fillStyle = block.primaryColor;
          ctx.fillRect(bx + ox, by + oy, ow, oh);
          ctx.fillStyle = block.accentColor;
          ctx.fillRect(bx + ox, by + oy, Math.max(1, ow - 2), Math.max(1, oh - 2));
        }
      }

      // Floating Atari marker above unbroken ore block
      const bob = Math.round(Math.sin(tickCount * 4 + bx) * 2);
      ctx.fillStyle = block.outlineColor;
      ctx.fillRect(bx + 9, by - 13 + bob, 6, 6);
      ctx.fillStyle = block.primaryColor;
      ctx.fillRect(bx + 10, by - 12 + bob, 4, 4);
      ctx.fillStyle = block.accentColor;
      ctx.fillRect(bx + 11, by - 15 + bob, 2, 2);

      // Progressive Minecraft block crack overlay when breaking
      if (crackStage > 0) {
        ctx.fillStyle = '#090a0d';
        ctx.fillRect(bx + 10, by + 8, 3, 3);
        ctx.fillRect(bx + 8, by + 11, 2, 5);
        ctx.fillRect(bx + 13, by + 10, 4, 2);
        if (crackStage > 1) {
          ctx.fillRect(bx + 4, by + 5, 5, 2);
          ctx.fillRect(bx + 14, by + 15, 6, 3);
          ctx.fillRect(bx + 6, by + 17, 4, 4);
        }
      }
    };

    const drawPixelCreeper = (
      cx: number,
      cy: number,
      walkPhase: number,
      fusing: boolean,
      fuseTimer: number
    ) => {
      const flashWhite = fusing && Math.floor((1.15 - fuseTimer) * 18) % 2 === 0;
      const swell = fusing ? Math.min(2, Math.floor((1.15 - fuseTimer) * 2.2)) : 0;
      const stride = fusing ? 0 : Math.round(Math.sin(walkPhase * 11) * 2);

      const darkGreen = flashWhite ? '#e2e8f0' : '#256029';
      const midGreen = flashWhite ? '#ffffff' : '#43a047';
      const brightGreen = flashWhite ? '#f8fafc' : '#66bb6a';
      const footDark = flashWhite ? '#cbd5e1' : '#1b471e';

      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.48)';
      ctx.fillRect(cx - 6 - swell, cy + 28, 13 + swell * 2, 3);

      // 4 iconic Creeper feet
      ctx.fillStyle = footDark;
      ctx.fillRect(cx - 4 - stride, cy + 22, 4, 6);
      ctx.fillRect(cx + 1 + stride, cy + 22, 4, 6);
      ctx.fillStyle = midGreen;
      ctx.fillRect(cx - 4 - stride, cy + 21, 4, 3);
      ctx.fillRect(cx + 1 + stride, cy + 21, 4, 3);

      // Creeper tall blocky torso
      ctx.fillStyle = darkGreen;
      ctx.fillRect(cx - 3 - swell, cy + 9 - swell, 7 + swell * 2, 13 + swell);
      ctx.fillStyle = midGreen;
      ctx.fillRect(cx - 2 - swell, cy + 10 - swell, 5 + swell * 2, 11 + swell);
      ctx.fillStyle = brightGreen;
      ctx.fillRect(cx - 2, cy + 12, 2, 3);
      ctx.fillRect(cx + 1, cy + 16, 2, 3);

      // Blocky 10x10 Creeper head
      const hx = cx - 5 - swell;
      const hy = cy - 1 - swell;
      const hw = 10 + swell * 2;
      const hh = 10 + swell * 2;

      ctx.fillStyle = '#0f2811';
      ctx.fillRect(hx - 1, hy - 1, hw + 2, hh + 2);
      ctx.fillStyle = midGreen;
      ctx.fillRect(hx, hy, hw, hh);
      ctx.fillStyle = brightGreen;
      ctx.fillRect(hx + 1, hy + 1, 3, 2);
      ctx.fillRect(hx + 6, hy + 1, 2, 2);
      ctx.fillStyle = darkGreen;
      ctx.fillRect(hx + 7, hy + 4, 2, 4);

      // Classic Creeper face (2 square eyes, nose bridge, inverted-U mouth)
      ctx.fillStyle = flashWhite ? '#334155' : '#090a0d';
      // Eyes
      ctx.fillRect(hx + 1 + swell, hy + 2 + swell, 2, 2);
      ctx.fillRect(hx + 6 + swell, hy + 2 + swell, 2, 2);
      // Nose bridge
      ctx.fillRect(hx + 4 + swell, hy + 4 + swell, 2, 2);
      // Mouth upper bar
      ctx.fillRect(hx + 3 + swell, hy + 5 + swell, 4, 2);
      // Mouth lower fangs
      ctx.fillRect(hx + 3 + swell, hy + 7 + swell, 1, 2);
      ctx.fillRect(hx + 6 + swell, hy + 7 + swell, 1, 2);
    };

    const drawPixelSheep = (
      sx: number,
      sy: number,
      walkPhase: number,
      dir: -1 | 1,
      isRunning: boolean
    ) => {
      const legStride = isRunning
        ? Math.round(Math.sin(walkPhase * 22) * 3)
        : Math.round(Math.sin(walkPhase * 10) * 1.8);
      const hopY = isRunning ? -Math.abs(Math.round(Math.sin(walkPhase * 16) * 3)) : 0;
      const y = sy + hopY;

      // Ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.fillRect(sx - 8, sy + 14, 17, 2);

      // 4 legs (tan skin + dark hooves)
      ctx.fillStyle = '#c8a68e';
      ctx.fillRect(sx - 6 - legStride, y + 9, 3, 5);
      ctx.fillRect(sx - 2 + legStride, y + 9, 3, 5);
      ctx.fillRect(sx + 2 - legStride, y + 9, 3, 5);
      ctx.fillRect(sx + 5 + legStride, y + 9, 3, 5);
      ctx.fillStyle = '#57534e';
      ctx.fillRect(sx - 6 - legStride, y + 12, 3, 2);
      ctx.fillRect(sx + 5 + legStride, y + 12, 3, 2);

      // Fluffy white wool body
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(sx - 8, y + 1, 16, 9);
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(sx - 7, y, 14, 8);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(sx - 5, y + 2, 3, 2);
      ctx.fillRect(sx + 1, y + 4, 4, 2);

      // Sheep head positioned left or right by facing dir
      const hx = dir === 1 ? sx + 4 : sx - 10;
      const hy = y - 1;
      // Wool tuft on top
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(hx, hy - 1, 6, 2);
      // Peach face
      ctx.fillStyle = '#e7c6b6';
      ctx.fillRect(hx, hy + 1, 6, 6);
      // Eyes (classic white + black Minecraft outer pixels)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hx + (dir === 1 ? 2 : 0), hy + 2, 2, 1);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(hx + (dir === 1 ? 3 : 0), hy + 2, 1, 1);
      // Cute pink snout
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(hx + (dir === 1 ? 3 : 1), hy + 4, 2, 2);

      // Tiny "!" alert over sheep when startled & running
      if (isRunning) {
        ctx.fillStyle = '#fde047';
        ctx.fillRect(sx, y - 9, 2, 4);
        ctx.fillRect(sx, y - 4, 2, 1);
      }
    };

    const drawPixelBee = (bx: number, by: number, vx: number, timeSec: number) => {
      const wingUp = Math.floor(timeSec * 16) % 2 === 0;
      const bob = Math.round(Math.sin(timeSec * 6 + bx * 0.1) * 1.5);
      const y = by + bob;
      const facingRight = vx >= 0;

      // Soft wing shadow / flutter
      ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
      if (wingUp) {
        ctx.fillRect(bx - 2, y - 4, 3, 3);
        ctx.fillRect(bx + 1, y - 3, 3, 2);
      } else {
        ctx.fillRect(bx - 2, y - 1, 3, 2);
        ctx.fillRect(bx + 1, y - 1, 3, 2);
      }

      // Blocky Bee Body (yellow + brown stripes)
      ctx.fillStyle = '#451a03';
      ctx.fillRect(bx - 4, y, 8, 5);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(bx - 3, y, 2, 5);
      ctx.fillRect(bx + 1, y, 2, 5);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(bx - 3, y, 2, 2);

      // Cute glowing cyan Minecraft bee eye on facing front
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(facingRight ? bx + 2 : bx - 4, y + 1, 2, 2);
    };

    const drawPixelZombie = (zx: number, zy: number, walkPhase: number, dir: -1 | 1, hitFlash: number) => {
      const legSwing = Math.round(Math.sin(walkPhase * 9) * 2);
      const hurt = hitFlash > 0;
      ctx.save();
      ctx.translate(zx, 0);
      ctx.scale(dir, 1);

      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(-6, zy + 28, 13, 3);

      // Legs
      ctx.fillStyle = hurt ? '#fca5a5' : '#26348b';
      ctx.fillRect(-2 - legSwing, zy + 18, 4, 10);
      ctx.fillStyle = hurt ? '#fecaca' : '#3142a8';
      ctx.fillRect(-1 + legSwing, zy + 18, 4, 10);

      // Tattered cyan torso
      ctx.fillStyle = hurt ? '#ef4444' : '#0891b2';
      ctx.fillRect(-3, zy + 8, 7, 10);
      ctx.fillStyle = hurt ? '#f87171' : '#155e75';
      ctx.fillRect(1, zy + 10, 2, 6);

      // Zombie green head
      ctx.fillStyle = hurt ? '#fca5a5' : '#4d7c3f';
      ctx.fillRect(-4, zy - 1, 9, 9);
      ctx.fillStyle = hurt ? '#ef4444' : '#36582c';
      ctx.fillRect(-4, zy - 1, 9, 2);
      // Dark hollow zombie eyes
      ctx.fillStyle = '#090a0d';
      ctx.fillRect(2, zy + 3, 2, 2);

      // Outstretched zombie arms
      ctx.fillStyle = hurt ? '#fca5a5' : '#588c48';
      ctx.fillRect(2, zy + 9, 7, 3);
      ctx.fillStyle = hurt ? '#ef4444' : '#3f6b32';
      ctx.fillRect(2, zy + 12, 6, 2);

      ctx.restore();
    };

    const drawPixelEnderman = (ex: number, ey: number, walkPhase: number, dir: -1 | 1, hitFlash: number) => {
      const legSwing = Math.round(Math.sin(walkPhase * 12) * 2.5);
      const hurt = hitFlash > 0;
      ctx.save();
      ctx.translate(ex, 0);
      ctx.scale(dir, 1);

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-6, ey + 38, 13, 3);

      // Long slender legs
      ctx.fillStyle = hurt ? '#f87171' : '#09090d';
      ctx.fillRect(-3 - legSwing, ey + 21, 2, 17);
      ctx.fillRect(1 + legSwing, ey + 21, 2, 17);

      // Slender torso
      ctx.fillStyle = hurt ? '#ef4444' : '#111116';
      ctx.fillRect(-3, ey + 9, 6, 12);

      // Long arms
      ctx.fillStyle = hurt ? '#fca5a5' : '#18181f';
      ctx.fillRect(2, ey + 9, 2, 16);
      ctx.fillRect(-4, ey + 10, 2, 14);

      // Head + iconic glowing magenta-purple eyes
      ctx.fillStyle = hurt ? '#ef4444' : '#09090d';
      ctx.fillRect(-4, ey, 8, 9);
      ctx.fillStyle = '#e879f9';
      ctx.fillRect(0, ey + 3, 4, 2);
      ctx.fillStyle = '#fae8ff';
      ctx.fillRect(2, ey + 3, 2, 2);

      ctx.restore();
    };

    const drawXpOrb = (ox: number, oy: number, timeSec: number) => {
      const pulse = Math.floor(timeSec * 10 + ox) % 2 === 0;
      ctx.fillStyle = '#15803d';
      ctx.fillRect(ox - 2, oy - 2, 5, 5);
      ctx.fillStyle = pulse ? '#a3e635' : '#4ade80';
      ctx.fillRect(ox - 1, oy - 1, 3, 3);
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ox, oy, 1, 1);
    };

    const drawDiamondItem = (dx: number, dy: number, timeSec: number) => {
      const bob = Math.round(Math.sin(timeSec * 5) * 2);
      const y = dy + bob;
      // Glow halo
      ctx.fillStyle = 'rgba(103, 232, 249, 0.32)';
      ctx.fillRect(dx - 6, y - 6, 12, 12);
      // Diamond outline + cyan gem facets
      ctx.fillStyle = '#0e7490';
      ctx.fillRect(dx - 4, y - 3, 8, 6);
      ctx.fillRect(dx - 2, y - 5, 4, 10);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(dx - 3, y - 2, 6, 4);
      ctx.fillRect(dx - 1, y - 4, 2, 8);
      ctx.fillStyle = '#cffafe';
      ctx.fillRect(dx - 2, y - 2, 2, 3);
    };

    const triggerCreeperExplosion = () => {
      const g = gameRef.current;
      g.creeperExploded = true;
      g.steveDead = true;
      g.explosionFlash = 1.0;
      g.craterX = g.steveX + 4;
      playAtariTone('explosion', mutedRef.current);

      const explosionPalette = [
        '#ffffff',
        '#fef08a',
        '#f97316',
        '#ef4444',
        '#64748b',
        '#334155',
        '#43a047',
        '#0694a2',
      ];
      for (let i = 0; i < 64; i++) {
        const angle = (Math.PI * 2 * i) / 64 + (Math.random() - 0.5) * 0.4;
        const speed = 35 + Math.random() * 135;
        g.particles.push({
          x: g.steveX + 6 + (Math.random() - 0.5) * 14,
          y: GROUND_Y - 14 + (Math.random() - 0.5) * 16,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 48,
          color: explosionPalette[i % explosionPalette.length],
          size: i % 3 === 0 ? 4 : 3,
          life: 0.7 + Math.random() * 0.7,
        });
      }

      phaseRef.current = 'EXPLODED';
      setPhase('EXPLODED');
      scheduleTimeout(() => {
        phaseRef.current = 'YOU_DIED';
        setPhase('YOU_DIED');
      }, 780);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const g = gameRef.current;

      // Update Steve walking & live progress percentage
      if (phaseRef.current === 'WALKING') {
        const dir = g.walkDir !== 0 ? g.walkDir : autoWalkRef.current ? 1 : 0;
        if (dir !== 0) {
          g.steveDir = dir as -1 | 1;
          g.steveX += dir * 68 * dt;
          g.walkTimer += dt;
          g.stepSfxCooldown -= dt;
          if (g.stepSfxCooldown <= 0) {
            playAtariTone('step', mutedRef.current);
            g.stepSfxCooldown = 0.28;
          }

          // Clamp left world bound
          if (g.steveX < 24) g.steveX = 24;

          // Check collision right in front of the next unbroken mineral block
          const nextIdx = g.broken.findIndex((b) => !b);
          if (nextIdx !== -1) {
            const targetStopX = QUESTION_BLOCKS[nextIdx].worldX - 18;
            if (g.steveX >= targetStopX) {
              g.steveX = targetStopX;
              g.walkDir = 0;
              setActiveBlockIdx(nextIdx);
              setWrongChoices([]);
              setFeedbackMsg(null);
              playAtariTone('encounter', mutedRef.current);
              setPhase('QUIZ');
            }
          }
        }
      }

      const endWorldX = QUESTION_BLOCKS[QUESTION_BLOCKS.length - 1].worldX - 18;
      const pct = Math.max(0, Math.min(100, Math.round(((g.steveX - 48) / (endWorldX - 48)) * 100)));
      setProgressPct((prev) => (prev === pct ? prev : pct));

      if (phaseRef.current === 'BREAKING') {
        g.swingTimer += dt;
        g.breakAnimTimer = Math.max(0, g.breakAnimTimer - dt);
      }

      // Smoothly transition into nightfall during FINAL_BATTLE & VICTORY
      if (phaseRef.current === 'FINAL_BATTLE' || phaseRef.current === 'VICTORY') {
        g.nightFactor = Math.min(1, g.nightFactor + dt * 0.85);
      } else {
        g.nightFactor = Math.max(0, g.nightFactor - dt * 1.5);
      }

      // Final Night Battle: Steve fights 3 Creepers, 2 Zombies, and 2 Endermen with Diamond Sword!
      if (phaseRef.current === 'FINAL_BATTLE') {
        g.swordSlashTimer = Math.max(0, g.swordSlashTimer - dt);
        g.swordCooldown = Math.max(0, g.swordCooldown - dt);

        // Move each living mob toward Steve (Endermen also do short purple teleport dashes)
        let aliveCount = 0;
        let closestAlive: HostileMob | null = null;
        let closestDist = Infinity;

        g.hostiles.forEach((mob) => {
          if (mob.dead) return;
          aliveCount += 1;
          mob.hitFlash = Math.max(0, mob.hitFlash - dt);
          mob.attackCooldown = Math.max(0, mob.attackCooldown - dt);

          const dx = g.steveX - mob.x;
          const dist = Math.abs(dx);
          if (dist < closestDist) {
            closestDist = dist;
            closestAlive = mob;
          }

          if (dist > 18) {
            const speed = mob.kind === 'enderman' ? 56 : mob.kind === 'creeper' ? 46 : 42;
            mob.x += Math.sign(dx) * speed * dt;
            mob.walkTimer += dt;

            if (mob.kind === 'enderman') {
              mob.teleportTimer -= dt;
              if (mob.teleportTimer <= 0 && dist > 62) {
                mob.teleportTimer = 1.6;
                for (let p = 0; p < 8; p++) {
                  g.particles.push({
                    x: mob.x,
                    y: GROUND_Y - 18 + (Math.random() - 0.5) * 16,
                    vx: (Math.random() - 0.5) * 60,
                    vy: -20 - Math.random() * 40,
                    color: '#d946ef',
                    size: 2,
                    life: 0.45,
                  });
                }
                mob.x += Math.sign(dx) * 32;
              }
            }
          }
        });

        // Steve actively turns toward & strikes nearby mobs with his Diamond Sword
        if (closestAlive) {
          const targetMob = closestAlive as HostileMob;
          const dx = targetMob.x - g.steveX;
          if (Math.abs(dx) > 1) {
            g.steveDir = dx >= 0 ? 1 : -1;
          }
          // Step slightly toward nearest mob if none are in sword reach yet
          if (Math.abs(dx) > 26 && aliveCount > 0) {
            g.steveX += g.steveDir * 24 * dt;
            g.walkTimer += dt;
          } else if (g.swordCooldown <= 0) {
            // Sword Strike!
            g.swordSlashTimer = 0.28;
            g.swordCooldown = 0.36;
            g.swingTimer += 0.5;
            playAtariTone('sword', mutedRef.current);

            targetMob.hp -= 1;
            targetMob.hitFlash = 0.22;
            targetMob.x += g.steveDir * 14; // Knockback

            if (targetMob.hp <= 0) {
              targetMob.dead = true;
              setMobsSlain((c) => c + 1);
              playAtariTone('hit', mutedRef.current);

              const popColor =
                targetMob.kind === 'enderman'
                  ? '#d946ef'
                  : targetMob.kind === 'creeper'
                  ? '#4ade80'
                  : '#84cc16';
              for (let k = 0; k < 14; k++) {
                g.particles.push({
                  x: targetMob.x,
                  y: GROUND_Y - 16,
                  vx: (Math.random() - 0.5) * 90,
                  vy: -25 - Math.random() * 65,
                  color: k % 2 === 0 ? popColor : '#e2e8f0',
                  size: 3,
                  life: 0.55,
                });
              }

              // Spawn 3 XP orbs per defeated enemy
              for (let o = 0; o < 3; o++) {
                g.xpOrbs.push({
                  x: targetMob.x + (Math.random() - 0.5) * 10,
                  y: GROUND_Y - 10,
                  vx: (Math.random() - 0.5) * 45,
                  vy: -55 - Math.random() * 30,
                  life: 0,
                  collected: false,
                });
              }

              // Last surviving Zombie spawns the special Diamond!
              const remainingZombies = g.hostiles.filter(
                (m) => !m.dead && m.kind === 'zombie'
              ).length;
              if (!g.diamondDrop.active && targetMob.kind === 'zombie' && remainingZombies === 0) {
                g.diamondDrop = {
                  active: true,
                  x: targetMob.x,
                  y: GROUND_Y - 12,
                  vy: -68,
                  collected: false,
                };
              }
            }
          }
        }

        // Update XP Orbs (bounce then fly magnetically into Steve)
        const orbSpeed = aliveCount === 0 ? 220 : 165;
        g.xpOrbs.forEach((orb) => {
          if (orb.collected) return;
          orb.life += dt;
          if (orb.life < 0.3) {
            orb.x += orb.vx * dt;
            orb.y += orb.vy * dt;
            orb.vy += 220 * dt;
            if (orb.y > GROUND_Y - 4) {
              orb.y = GROUND_Y - 4;
              orb.vy = 0;
            }
          } else {
            const tx = g.steveX;
            const ty = GROUND_Y - 14;
            const dx = tx - orb.x;
            const dy = ty - orb.y;
            const d = Math.hypot(dx, dy);
            if (d < 9) {
              orb.collected = true;
              setXpPoints((x) => x + 15);
              playAtariTone('xp', mutedRef.current);
            } else {
              orb.x += (dx / d) * orbSpeed * dt;
              orb.y += (dy / d) * orbSpeed * dt;
            }
          }
        });

        const allXpCollected = g.xpOrbs.every((o) => o.collected);

        // Update Zombie's spawned Diamond drop -> Steve collects XP & picks up Diamond to WIN!
        if (g.diamondDrop.active && !g.diamondDrop.collected) {
          g.diamondDrop.y += g.diamondDrop.vy * dt;
          g.diamondDrop.vy += 220 * dt;
          if (g.diamondDrop.y > GROUND_Y - 6) {
            g.diamondDrop.y = GROUND_Y - 6;
            g.diamondDrop.vy = 0;
          }

          if (aliveCount === 0 && allXpCollected) {
            // All 7 enemies defeated & all XP absorbed! Steve walks to claim the Zombie's Diamond
            const dx = g.diamondDrop.x - g.steveX;
            if (Math.abs(dx) > 6) {
              g.steveDir = dx >= 0 ? 1 : -1;
              g.steveX += g.steveDir * 76 * dt;
              g.walkTimer += dt;
            } else {
              g.diamondDrop.collected = true;
              setGotZombieDiamond(true);
              playAtariTone('victory', mutedRef.current);
              if (!g.victoryTriggered) {
                g.victoryTriggered = true;
                scheduleTimeout(() => {
                  phaseRef.current = 'VICTORY';
                  setPhase('VICTORY');
                }, 420);
              }
            }
          }
        }
      }

      // Update Middle-of-Questions Sheep companion -> runs -> continues its path
      if (g.sheepPhase === 'WAITING') {
        // Grazing slightly until Steve arrives near the middle questions (Q4 zone)
        if (g.steveX >= 520) {
          g.sheepPhase = 'WITH_STEVE';
        }
      } else if (g.sheepPhase === 'WITH_STEVE') {
        const desiredX = g.steveX - 24;
        const dx = desiredX - g.sheepX;
        if (Math.abs(dx) > 2) {
          const step = Math.sign(dx) * Math.min(Math.abs(dx), 76 * dt);
          g.sheepX += step;
          g.sheepDir = step >= 0 ? 1 : -1;
          g.sheepWalkTimer += dt;
        }
        // Once Steve reaches midpoint around Q6–Q7, the sheep sprints ahead!
        if (g.steveX >= 1015) {
          g.sheepPhase = 'RUNNING';
          g.sheepDir = 1;
          g.sheepRunTimer = 0;
        }
      } else if (g.sheepPhase === 'RUNNING') {
        g.sheepX += 168 * dt;
        g.sheepWalkTimer += dt;
        g.sheepRunTimer += dt;
        g.sheepDir = 1;
        if (g.sheepRunTimer >= 1.55) {
          g.sheepPhase = 'CONTINUING';
        }
      } else if (g.sheepPhase === 'CONTINUING') {
        // Calmly continues its path rightward across the plains
        g.sheepX += 34 * dt;
        g.sheepWalkTimer += dt * 0.65;
        g.sheepDir = 1;
        if (g.sheepX > 2240) {
          g.sheepX = 2240;
        }
      }

      // Update flying Overworld bees
      const timeSec = now / 1000;
      g.bees.forEach((bee) => {
        bee.x += bee.vx * dt;
        if (bee.x > bee.baseX + bee.range) {
          bee.x = bee.baseX + bee.range;
          bee.vx = -Math.abs(bee.vx);
        } else if (bee.x < bee.baseX - bee.range) {
          bee.x = bee.baseX - bee.range;
          bee.vx = Math.abs(bee.vx);
        }
        bee.y = bee.baseY + Math.sin(timeSec * 2.4 + bee.phaseOffset) * 9;
      });

      // Update Creeper stalking & fuse detonation after final mineral block
      if (phaseRef.current === 'CREEPER_AMBUSH' && g.creeperActive && !g.creeperExploded) {
        if (!g.creeperFusing) {
          g.creeperX -= 62 * dt;
          g.creeperWalkTimer += dt;
          g.stepSfxCooldown -= dt;
          if (g.stepSfxCooldown <= 0) {
            playAtariTone('step', mutedRef.current);
            g.stepSfxCooldown = 0.24;
          }
          if (g.creeperX <= g.steveX + 15) {
            g.creeperX = g.steveX + 15;
            g.creeperFusing = true;
            g.creeperFuseTimer = 1.15;
            playAtariTone('creeper_hiss', mutedRef.current);
          }
        } else {
          g.creeperFuseTimer -= dt;
          if (g.creeperFuseTimer <= 0) {
            triggerCreeperExplosion();
          }
        }
      }

      if (g.explosionFlash > 0) {
        g.explosionFlash = Math.max(0, g.explosionFlash - dt * 2.2);
      }

      // Update pixel shard particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 240 * dt;
        p.life -= dt;
        if (p.life <= 0) g.particles.splice(i, 1);
      }

      // Smooth side-scrolling pixel camera across all 12 blocks & centered on Final Night Battle
      const targetCam =
        phaseRef.current === 'FINAL_BATTLE' || phaseRef.current === 'VICTORY'
          ? Math.max(0, Math.min(1940, g.steveX - 155))
          : phaseRef.current === 'CREEPER_AMBUSH' ||
            phaseRef.current === 'EXPLODED' ||
            phaseRef.current === 'YOU_DIED'
          ? Math.max(0, Math.min(1860, g.steveX - 80))
          : Math.max(0, Math.min(1840, g.steveX - 95));
      g.cameraX += (targetCam - g.cameraX) * Math.min(1, dt * 7);

      const shakeX =
        g.explosionFlash > 0 ? Math.round((Math.random() - 0.5) * 8 * g.explosionFlash) : 0;
      const shakeY =
        g.explosionFlash > 0 ? Math.round((Math.random() - 0.5) * 6 * g.explosionFlash) : 0;

      ctx.save();
      ctx.translate(shakeX, shakeY);

      // ===== RENDER 2D MINECRAFT OVERWORLD PIXEL SCENE =====
      // 1. Dynamic Overworld Sky (Daytime Blue/White -> Starry Night during Final Battle)
      const nf = g.nightFactor;
      const lerpChan = (day: number, night: number) => Math.round(day + (night - day) * nf);
      const skyTop = `rgb(${lerpChan(91, 6)}, ${lerpChan(164, 10)}, ${lerpChan(252, 30)})`;
      const skyMid = `rgb(${lerpChan(142, 16)}, ${lerpChan(200, 24)}, ${lerpChan(255, 58)})`;
      const skyBot = `rgb(${lerpChan(238, 28)}, ${lerpChan(247, 42)}, ${lerpChan(255, 86)})`;

      const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
      skyGrad.addColorStop(0, skyTop);
      skyGrad.addColorStop(0.58, skyMid);
      skyGrad.addColorStop(1, skyBot);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(-10, -10, W + 20, GROUND_Y + 20);

      // Twinkling Stars at Night
      if (nf > 0.2) {
        const starAlpha = Math.min(1, (nf - 0.2) * 1.25);
        for (let s = 0; s < 34; s++) {
          const stx = ((s * 73 + 19) % (W - 12)) + 6;
          const sty = ((s * 41 + 11) % (GROUND_Y - 46)) + 6;
          const twinkle = 0.55 + Math.sin(timeSec * 3 + s) * 0.45;
          ctx.fillStyle = `rgba(241, 245, 249, ${(starAlpha * twinkle).toFixed(2)})`;
          ctx.fillRect(stx, sty, s % 4 === 0 ? 2 : 1, s % 4 === 0 ? 2 : 1);
        }
      }

      // 2. Classic Blocky Pixel Sun (sets on nightfall) & Rising Pixel Moon
      const sunX = 252 - Math.floor(g.cameraX * 0.04);
      const sunY = Math.round(16 + nf * 135);
      if (sunY < GROUND_Y) {
        ctx.fillStyle = `rgba(255, 253, 224, ${(0.45 * (1 - nf)).toFixed(2)})`;
        ctx.fillRect(sunX - 4, sunY - 4, 28, 28);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(sunX, sunY, 20, 20);
        ctx.fillStyle = '#fef9c3';
        ctx.fillRect(sunX + 3, sunY + 3, 14, 14);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(sunX + 6, sunY + 6, 8, 8);
      }

      if (nf > 0.15) {
        const moonX = 248 - Math.floor(g.cameraX * 0.03);
        const moonY = Math.round(145 - nf * 126);
        ctx.fillStyle = `rgba(226, 232, 240, ${(0.25 * nf).toFixed(2)})`;
        ctx.fillRect(moonX - 3, moonY - 3, 24, 24);
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(moonX, moonY, 18, 18);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(moonX + 3, moonY + 4, 4, 4);
        ctx.fillRect(moonX + 11, moonY + 10, 4, 4);
        ctx.fillRect(moonX + 10, moonY + 3, 3, 2);
      }

      // 3. Fluffy White Blocky Minecraft Clouds (tinted slightly cool at night)
      const cloudDefs = [
        { x: 30, y: 24, w: 46, h: 10 },
        { x: 135, y: 38, w: 54, h: 11 },
        { x: 235, y: 28, w: 40, h: 9 },
        { x: 345, y: 20, w: 58, h: 11 },
      ];
      for (const cl of cloudDefs) {
        const cx = (((cl.x - Math.floor(g.cameraX * 0.14 + (now / 90))) % (W + 120)) + (W + 120)) % (W + 120) - 60;
        ctx.fillStyle = nf > 0.5 ? '#475569' : '#ffffff';
        ctx.fillRect(cx, cl.y, cl.w, cl.h);
        ctx.fillRect(cx + 8, cl.y - 4, cl.w - 16, 4);
        ctx.fillStyle = nf > 0.5 ? '#334155' : '#dbeafe';
        ctx.fillRect(cx + 2, cl.y + cl.h - 2, cl.w - 4, 2);
      }

      // 4. Soft Daytime / Moonlight Hills on the Horizon
      ctx.fillStyle = nf > 0.5 ? '#1e293b' : '#9ac8eb';
      for (let m = -1; m < 8; m++) {
        const mx = m * 95 - (Math.floor(g.cameraX * 0.25) % 95);
        ctx.fillRect(mx, GROUND_Y - 26, 62, 26);
        ctx.fillRect(mx + 14, GROUND_Y - 38, 34, 12);
      }
      ctx.fillStyle = nf > 0.5 ? '#1f4928' : '#6bb463';
      for (let h = -1; h < 9; h++) {
        const hx = h * 80 - (Math.floor(g.cameraX * 0.42) % 80);
        ctx.fillRect(hx, GROUND_Y - 12, 54, 12);
        ctx.fillRect(hx + 10, GROUND_Y - 18, 30, 6);
      }

      // Tiny Pixel Grass Tufts & Wildflowers along the surface
      for (let f = 52; f < 2260; f += 64) {
        const fx = Math.round(f - g.cameraX);
        if (fx < -10 || fx > W + 10) continue;
        ctx.fillStyle = '#3d8b19';
        ctx.fillRect(fx, GROUND_Y - 4, 2, 4);
        ctx.fillRect(fx + 3, GROUND_Y - 3, 2, 3);
        if (f % 128 === 52) {
          ctx.fillStyle = f % 256 === 52 ? '#ef4444' : '#facc15';
          ctx.fillRect(fx + 1, GROUND_Y - 6, 3, 3);
        }
      }

      // 5. Authentic Minecraft Grass & Mottled Pixel Dirt Ground (matching reference)
      const CELL = 2;
      const grassPalette = ['#4da622', '#5ec02c', '#71d039', '#3d8b18', '#7edb44'];
      const dirtPalette = ['#795134', '#865b3c', '#694429', '#946845', '#5a3821', '#7f5536'];

      const startWorldCol = Math.floor((g.cameraX - 4) / CELL);
      const endWorldCol = Math.ceil((g.cameraX + W + 4) / CELL);
      const groundRows = Math.ceil((H - GROUND_Y) / CELL);

      for (let wCol = startWorldCol; wCol <= endWorldCol; wCol++) {
        const sx = Math.round(wCol * CELL - g.cameraX);
        // Jagged grass overhang depth (2 to 4 cells = 4px to 8px)
        const grassDepth = 2 + Math.abs((wCol * 7 + (wCol >> 1) * 3) % 3);

        for (let row = 0; row < groundRows; row++) {
          const sy = GROUND_Y + row * CELL;
          const seed = Math.abs((wCol * 31 + row * 17) ^ (wCol * 13 - row * 23));

          if (row < grassDepth) {
            ctx.fillStyle = grassPalette[seed % grassPalette.length];
          } else {
            ctx.fillStyle = dirtPalette[seed % dirtPalette.length];
          }
          ctx.fillRect(sx, sy, CELL, CELL);
        }
      }

      // Carve blasted crater into grass & dirt after Creeper explodes
      if (g.craterX >= 0) {
        const cx = Math.round(g.craterX - g.cameraX);
        ctx.fillStyle = skyBot;
        ctx.fillRect(cx - 18, GROUND_Y, 36, 10);
        ctx.fillRect(cx - 12, GROUND_Y + 10, 24, 8);
        ctx.fillRect(cx - 6, GROUND_Y + 18, 12, 6);
        // Charred dark soil rim around crater
        ctx.fillStyle = '#3b2414';
        ctx.fillRect(cx - 21, GROUND_Y, 3, 6);
        ctx.fillRect(cx + 18, GROUND_Y, 3, 6);
        ctx.fillRect(cx - 14, GROUND_Y + 10, 2, 6);
        ctx.fillRect(cx + 12, GROUND_Y + 10, 2, 6);
      }

      // 6. Diamond & Ore Blocks
      QUESTION_BLOCKS.forEach((b, idx) => {
        const bx = Math.round(b.worldX - g.cameraX);
        if (bx < -32 || bx > W + 32) return;

        if (!g.broken[idx]) {
          let crackStage = 0;
          if (phaseRef.current === 'BREAKING' && g.breakingBlockIndex === idx) {
            crackStage = g.breakAnimTimer < 0.45 ? 2 : 1;
          }
          drawMineralBlock(bx, GROUND_Y - 24, b, crackStage, now / 1000);
        } else {
          // Small diamond/ore rubble & stone chips on grass after breaking
          ctx.fillStyle = b.primaryColor;
          ctx.fillRect(bx + 4, GROUND_Y - 3, 4, 3);
          ctx.fillRect(bx + 15, GROUND_Y - 2, 3, 2);
          ctx.fillStyle = '#7d7d7d';
          ctx.fillRect(bx + 10, GROUND_Y - 2, 3, 2);
        }
      });

      // 7. Ambient Flying Bees
      g.bees.forEach((bee) => {
        const bsx = Math.round(bee.x - g.cameraX);
        if (bsx < -16 || bsx > W + 16) return;
        drawPixelBee(bsx, Math.round(bee.y), bee.vx, timeSec);
      });

      // 8. Pixel Sheep (moves with Steve in middle questions, then runs, then continues its path)
      const sheepScreenX = Math.round(g.sheepX - g.cameraX);
      if (sheepScreenX >= -24 && sheepScreenX <= W + 24 && !g.steveDead) {
        drawPixelSheep(
          sheepScreenX,
          GROUND_Y - 15,
          g.sheepWalkTimer,
          g.sheepDir,
          g.sheepPhase === 'RUNNING'
        );
      }

      // 9. Pixel Steve Sprite (holds Diamond Sword during Final Battle & Victory!)
      const steveScreenX = Math.round(g.steveX - g.cameraX);
      const steveScreenY = GROUND_Y - 29;
      if (!g.steveDead) {
        const hasSword =
          phaseRef.current === 'FINAL_BATTLE' || phaseRef.current === 'VICTORY';
        const isSwinging =
          phaseRef.current === 'BREAKING' || g.swordSlashTimer > 0;
        drawPixelSteve(
          steveScreenX,
          steveScreenY,
          isSwinging ? g.swingTimer : g.walkTimer,
          isSwinging,
          g.steveDir,
          hasSword
        );

        // Alert "!" above Steve when wrong-answer Creeper closes in
        if (
          phaseRef.current === 'CREEPER_AMBUSH' &&
          g.creeperActive &&
          g.creeperX - g.steveX < 75
        ) {
          const blink = Math.floor(now / 110) % 2 === 0;
          ctx.fillStyle = blink ? '#ef4444' : '#fde047';
          ctx.fillRect(steveScreenX - 1, steveScreenY - 14, 3, 7);
          ctx.fillRect(steveScreenX - 1, steveScreenY - 5, 3, 2);
        }
      }

      // 10. Wrong-Answer Creeper Sprite
      if (g.creeperActive && !g.creeperExploded) {
        const creeperScreenX = Math.round(g.creeperX - g.cameraX);
        const creeperScreenY = GROUND_Y - 29;
        drawPixelCreeper(
          creeperScreenX,
          creeperScreenY,
          g.creeperWalkTimer,
          g.creeperFusing,
          g.creeperFuseTimer
        );
      }

      // 11. Final Night Battle Mobs (3 Creepers, 2 Zombies, 2 Endermen)
      g.hostiles.forEach((mob) => {
        if (mob.dead) return;
        const mx = Math.round(mob.x - g.cameraX);
        if (mx < -24 || mx > W + 24) return;
        const faceDir: -1 | 1 = g.steveX >= mob.x ? 1 : -1;
        if (mob.kind === 'creeper') {
          drawPixelCreeper(mx, GROUND_Y - 29, mob.walkTimer, mob.hitFlash > 0, 1.0);
        } else if (mob.kind === 'zombie') {
          drawPixelZombie(mx, GROUND_Y - 29, mob.walkTimer, faceDir, mob.hitFlash);
        } else {
          drawPixelEnderman(mx, GROUND_Y - 39, mob.walkTimer, faceDir, mob.hitFlash);
        }
      });

      // 12. Glowing XP Orbs & Zombie's Spawned Diamond Item Drop
      g.xpOrbs.forEach((orb) => {
        if (orb.collected) return;
        drawXpOrb(Math.round(orb.x - g.cameraX), Math.round(orb.y), timeSec);
      });

      if (g.diamondDrop.active && !g.diamondDrop.collected) {
        drawDiamondItem(
          Math.round(g.diamondDrop.x - g.cameraX),
          Math.round(g.diamondDrop.y),
          timeSec
        );
      }

      // 13. Pixel Shard & Explosion Particles
      g.particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x - g.cameraX), Math.round(p.y), p.size, p.size);
      });

      // 10. Detonation flash overlay
      if (g.explosionFlash > 0) {
        ctx.fillStyle = `rgba(255, 245, 220, ${Math.min(0.82, g.explosionFlash * 0.75)})`;
        ctx.fillRect(-10, -10, W + 20, H + 20);
      }

      ctx.restore();

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [scheduleTimeout]);

  const currentQuestion = QUESTION_BLOCKS[activeBlockIdx];

  return (
    <section className="max-w-[1440px] mx-auto px-5 sm:px-10 pt-14 pb-28">
      {/* Header Floating in the Void */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-5 mb-6"
      >
        <div>
          <p className="text-sm sm:text-base font-mono tracking-wide text-slate-400 grey-aura-text">
            2D Pixel Expedition · Answer Geology Questions to Mine Diamond &amp; Ores
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-1.5 grey-aura-title">
            Steve&apos;s Diamond &amp; Ore Challenge
          </h2>
        </div>

        {/* Collected Ores Hotbar Counter + SFX Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 px-2.5 py-2 rounded-lg bg-black/60 border border-white/15">
            {QUESTION_BLOCKS.map((b, i) => (
              <div
                key={b.id}
                title={b.mineralLabel}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-sm border flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                  i < brokenCount
                    ? 'border-emerald-400 text-slate-950 scale-105'
                    : i === activeBlockIdx && phase !== 'TITLE'
                    ? 'border-amber-400 text-amber-200 opacity-90'
                    : 'border-white/15 text-slate-500 opacity-45'
                }`}
                style={{
                  backgroundColor: i < brokenCount ? b.primaryColor : 'rgba(255,255,255,0.04)',
                }}
              >
                {i < brokenCount ? '✓' : i + 1}
              </div>
            ))}
            <span className="ml-2 text-sm font-mono text-slate-200 tabular-nums">
              {brokenCount} / {QUESTION_BLOCKS.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setSfxMuted((m) => !m)}
            aria-label={sfxMuted ? 'Unmute game sound effects' : 'Mute game sound effects'}
            className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 cursor-pointer"
          >
            {sfxMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Main 2D Pixel Canvas Stage */}
      <div className="relative w-full max-w-[780px] mx-auto">
        {/* Distance / Progress Indicator to the End of the Mining Game */}
        <div className="mb-3 px-3.5 py-2.5 rounded-xl bg-black/55 border border-white/15">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-slate-300 mb-2">
            <span>
              EXPEDITION PROGRESS ·{' '}
              <span className="text-white font-semibold">
                {brokenCount >= QUESTION_BLOCKS.length
                  ? 'FINAL STAGE REACHED!'
                  : `${QUESTION_BLOCKS.length - brokenCount} ${
                      QUESTION_BLOCKS.length - brokenCount === 1 ? 'block' : 'blocks'
                    } left to the end`}
              </span>
            </span>
            <span className="text-cyan-300 font-bold tabular-nums">
              {brokenCount >= QUESTION_BLOCKS.length ? 100 : progressPct}%
            </span>
          </div>

          <div className="relative h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300 transition-all duration-150"
              style={{ width: `${brokenCount >= QUESTION_BLOCKS.length ? 100 : Math.max(3, progressPct)}%` }}
            />
          </div>

          <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>START</span>
            {QUESTION_BLOCKS.map((b, i) => (
              <span
                key={b.id}
                title={b.blockName}
                className={`w-2 h-2 rounded-full transition-transform ${
                  i < brokenCount
                    ? 'scale-110'
                    : i === activeBlockIdx && phase !== 'TITLE'
                    ? 'ring-2 ring-amber-300 scale-125'
                    : 'opacity-40'
                }`}
                style={{ backgroundColor: i < brokenCount ? b.primaryColor : '#94a3b8' }}
              />
            ))}
            <span className="text-cyan-300 font-semibold">END</span>
          </div>
        </div>

        <div className="relative rounded-xl overflow-hidden border-2 border-white/20 bg-[#6cb4ff] shadow-[0_0_50px_rgba(0,0,0,0.9)]">
          <canvas
            ref={canvasRef}
            width={320}
            height={180}
            className="w-full h-auto block aspect-[16/9]"
            style={{ imageRendering: 'pixelated' }}
          />

          {/* Top-left In-Game Pixel HUD (hidden on You Died! screen for authentic look) */}
          {phase !== 'YOU_DIED' && (
            <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between text-xs sm:text-sm font-mono">
              <span
                className={`px-2.5 py-1 rounded border ${
                  phase === 'CREEPER_AMBUSH'
                    ? 'bg-red-950/90 border-red-400/70 text-red-100 animate-pulse'
                    : phase === 'FINAL_BATTLE'
                    ? 'bg-indigo-950/90 border-cyan-400/70 text-cyan-100'
                    : phase === 'VICTORY'
                    ? 'bg-emerald-950/90 border-emerald-400/70 text-emerald-100'
                    : 'bg-black/70 border-white/20 text-white'
                }`}
              >
                {phase === 'CREEPER_AMBUSH'
                  ? '⚠ WRONG ANSWER · A CREEPER IS COMING!'
                  : phase === 'FINAL_BATTLE'
                  ? `⚔ NIGHTFALL · MOBS SLAIN ${mobsSlain}/7 · XP ${xpPoints}`
                  : phase === 'VICTORY'
                  ? `✦ NIGHT SURVIVED · XP ${xpPoints} · DIAMOND CLAIMED!`
                  : `STAGE ${Math.min(brokenCount + 1, QUESTION_BLOCKS.length)} · ${QUESTION_BLOCKS[Math.min(activeBlockIdx, QUESTION_BLOCKS.length - 1)].blockName.toUpperCase()}`}
              </span>
              <span className="hidden sm:inline px-2.5 py-1 rounded bg-black/70 border border-white/20 text-slate-200">
                {phase === 'FINAL_BATTLE' || phase === 'VICTORY'
                  ? '3 Creepers · 2 Zombies · 2 Endermen'
                  : 'Use A / D or Arrow Keys · Wrong Answer = Creeper!'}
              </span>
            </div>
          )}

          {/* TITLE OVERLAY */}
          {phase === 'TITLE' && (
            <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center p-6 text-center">
              <Pickaxe className="w-12 h-12 text-cyan-300 mb-3" />
              <h3 className="text-3xl sm:text-5xl font-bold text-white grey-aura-title">
                Mine the 12 Diamond &amp; Ore Blocks
              </h3>
              <p className="mt-3 text-base sm:text-xl text-slate-100 max-w-xl leading-relaxed">
                Walk Steve across the Overworld and answer every question right to mine all 12 ores!
                Watch out—a wrong answer summons a Creeper, and at nightfall Steve draws his sword
                to defeat 7 mobs and win the Zombie&apos;s Diamond.
              </p>
              <button
                type="button"
                onClick={resetGame}
                className="mt-6 inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-100 hover:bg-white text-slate-950 font-bold text-base sm:text-lg transition-colors cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.28)]"
              >
                <Play className="w-5 h-5" />
                <span>Start Mining Expedition</span>
              </button>
            </div>
          )}

          {/* BREAKING FEEDBACK BANNER */}
          {phase === 'BREAKING' && feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 rounded-xl bg-emerald-950/90 border border-emerald-400/50 px-5 py-3.5 text-center"
            >
              <p className="text-sm sm:text-base font-mono font-bold text-emerald-300">
                ✓ BLOCK MINED!
              </p>
              <p className="text-sm sm:text-lg text-white mt-1">{feedbackMsg}</p>
            </motion.div>
          )}

          {/* VICTORY OVERLAY */}
          {phase === 'VICTORY' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-[#050b18]/80 flex flex-col items-center justify-center px-5 py-4 text-center select-none"
              style={{ fontFamily: '"Silkscreen", "IBM Plex Mono", monospace' }}
            >
              <h3 className="text-3xl sm:text-5xl font-bold text-cyan-300 tracking-wide drop-shadow-[3px_3px_0_#0f172a]">
                YOU WON!
              </h3>
              <p className="mt-2 text-xs sm:text-base text-white">
                3 Creepers · 2 Zombies · 2 Endermen Defeated!
              </p>
              <p className="mt-1.5 text-xs sm:text-base text-lime-300">
                XP Collected: <span className="font-bold text-yellow-300">{xpPoints}</span> ·{' '}
                {gotZombieDiamond ? "Zombie's Diamond Claimed!" : 'Diamond Claimed!'}
              </p>

              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full max-w-[440px]">
                <button
                  type="button"
                  onClick={resetGame}
                  className="w-full py-2.5 bg-[#475569] hover:bg-[#64748b] border-2 border-black text-white text-sm tracking-wide cursor-pointer shadow-[inset_2px_2px_0_#94a3b8,inset_-2px_-2px_0_#1e293b] transition-colors"
                >
                  Play Again
                </button>
                <button
                  type="button"
                  onClick={onNextToCredits}
                  className="w-full py-2.5 bg-[#0e7490] hover:bg-[#0891b2] border-2 border-black text-[#ecfeff] text-sm tracking-wide cursor-pointer shadow-[inset_2px_2px_0_#67e8f9,inset_-2px_-2px_0_#164e63] transition-colors inline-flex items-center justify-center gap-2"
                >
                  <span>Proceed to Credits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MINECRAFT "YOU DIED!" SCREEN OVERLAY */}
          {phase === 'YOU_DIED' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 bg-[#9b5959]/75 flex flex-col items-center justify-center px-5 py-4 text-center select-none"
              style={{ fontFamily: '"Silkscreen", "IBM Plex Mono", monospace' }}
            >
              <h3 className="text-3xl sm:text-5xl font-bold text-white tracking-wide drop-shadow-[3px_3px_0_#3b3b3b]">
                You Died!
              </h3>
              <p className="mt-2 text-sm sm:text-lg text-white drop-shadow-[2px_2px_0_#3b3b3b]">
                Steve was blown up by a Creeper
              </p>
              <p className="mt-1.5 text-sm sm:text-lg text-white drop-shadow-[2px_2px_0_#3b3b3b]">
                Score:{' '}
                <span className="text-[#ffff55] font-bold">{brokenCount}</span>
              </p>

              <div className="mt-5 sm:mt-7 flex flex-col items-center gap-2.5 w-full max-w-[340px]">
                <button
                  type="button"
                  onClick={resetGame}
                  className="w-full py-2 sm:py-2.5 bg-[#727272] hover:bg-[#848484] active:bg-[#5e5e5e] border-2 border-black text-white text-sm sm:text-base tracking-wide cursor-pointer shadow-[inset_2px_2px_0_#a8a8a8,inset_-2px_-2px_0_#464646] transition-colors"
                  style={{ textShadow: '2px 2px 0 #2d2d2d' }}
                >
                  Respawn
                </button>
                <button
                  type="button"
                  onClick={goToTitleScreen}
                  className="w-full py-2 sm:py-2.5 bg-[#727272] hover:bg-[#848484] active:bg-[#5e5e5e] border-2 border-black text-white text-sm sm:text-base tracking-wide cursor-pointer shadow-[inset_2px_2px_0_#a8a8a8,inset_-2px_-2px_0_#464646] transition-colors"
                  style={{ textShadow: '2px 2px 0 #2d2d2d' }}
                >
                  Title Screen
                </button>
                <button
                  type="button"
                  onClick={onNextToCredits}
                  className="mt-1 w-full py-2 sm:py-2.5 bg-[#5a7558] hover:bg-[#6a8868] active:bg-[#496147] border-2 border-black text-[#ffffaa] text-sm sm:text-base tracking-wide cursor-pointer shadow-[inset_2px_2px_0_#94b392,inset_-2px_-2px_0_#374a35] transition-colors inline-flex items-center justify-center gap-2"
                  style={{ textShadow: '2px 2px 0 #253324' }}
                >
                  <span>Proceed to Credits</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Arcade Walk Controls Bar (Active during WALKING) */}
        {phase === 'WALKING' && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onMouseDown={() => {
                  gameRef.current.walkDir = -1;
                }}
                onMouseUp={() => {
                  gameRef.current.walkDir = 0;
                }}
                onMouseLeave={() => {
                  if (gameRef.current.walkDir === -1) gameRef.current.walkDir = 0;
                }}
                onTouchStart={() => {
                  gameRef.current.walkDir = -1;
                }}
                onTouchEnd={() => {
                  gameRef.current.walkDir = 0;
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white/5 hover:bg-white/12 active:bg-white/20 border border-white/15 text-base font-semibold text-white cursor-pointer select-none"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Walk Left</span>
              </button>

              <button
                type="button"
                onMouseDown={() => {
                  gameRef.current.walkDir = 1;
                }}
                onMouseUp={() => {
                  gameRef.current.walkDir = 0;
                }}
                onMouseLeave={() => {
                  if (gameRef.current.walkDir === 1) gameRef.current.walkDir = 0;
                }}
                onTouchStart={() => {
                  gameRef.current.walkDir = 1;
                }}
                onTouchEnd={() => {
                  gameRef.current.walkDir = 0;
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-100 hover:bg-white active:bg-slate-300 text-slate-950 text-base font-bold cursor-pointer select-none"
              >
                <span>Walk Right</span>
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => setAutoWalk((w) => !w)}
                className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg border text-base font-medium cursor-pointer transition-colors ${
                  autoWalk
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                    : 'bg-white/5 hover:bg-white/10 border-white/15 text-slate-200'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>{autoWalk ? 'Auto-Walking...' : 'Auto-Walk'}</span>
              </button>
            </div>

            <p className="text-base font-mono text-slate-300 grey-aura-text">
              Walk right to reach <span className="text-white font-semibold">{currentQuestion.blockName}</span>
            </p>
          </div>
        )}

        {/* Question Panel Appears When Steve Stops in Front of a Mineral Block */}
        <AnimatePresence>
          {phase === 'QUIZ' && currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{
                opacity: 1,
                y: 0,
                x: shakeQuiz ? [0, -8, 8, -6, 6, 0] : 0,
              }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-5 border-t border-white/15"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <p className="text-sm sm:text-base font-mono tracking-wider text-amber-300">
                  ORE ENCOUNTER {activeBlockIdx + 1} OF {QUESTION_BLOCKS.length} ·{' '}
                  {currentQuestion.blockName.toUpperCase()}
                </p>
                {wrongChoices.length > 0 && (
                  <p className="text-sm font-mono text-rose-400">
                    Pickaxe bounced! Choose the right answer to break the block.
                  </p>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white grey-aura-title leading-snug">
                {currentQuestion.question}
              </h3>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentQuestion.options.map((opt, idx) => {
                  const isWrong = wrongChoices.includes(idx);
                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isWrong}
                      onClick={() => handleAnswer(idx)}
                      className={`text-left px-5 py-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isWrong
                          ? 'bg-rose-950/30 border-rose-500/40 text-rose-300/60 line-through cursor-not-allowed'
                          : 'bg-white/[0.04] hover:bg-white/[0.1] border-white/15 hover:border-slate-200/70 text-slate-100'
                      }`}
                    >
                      <span className="font-mono text-sm sm:text-base font-bold px-2.5 py-0.5 rounded bg-white/10 text-slate-200 shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-base sm:text-lg leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
