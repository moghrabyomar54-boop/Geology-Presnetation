export interface TeamMember {
  number: number;
  name: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { number: 1, name: 'Mohammed Ahmed' },
  { number: 2, name: 'Omar Sherief' },
  { number: 3, name: 'Eyad Alaa' },
  { number: 4, name: 'Adham Talal' },
  { number: 5, name: 'Malek Amr' },
  { number: 6, name: 'Abdelrahman Ahmed' },
];

export type RockId = 'hornfels' | 'marble' | 'quartzite';

export interface MineralDetail {
  name: string;
  formula?: string;
  role: string;
  notes: string;
  colorHex: string;
}

export interface FormationStep {
  step: number;
  title: string;
  detail: string;
}

export interface RockSpec {
  id: RockId;
  title: string;
  subtitle: string;
  imagePath: string;
  imageCaption: string;
  definition: string;
  metamorphismType: string;
  generalCharacteristics: string[];
  howItFormsSummary: string;
  formationSteps?: FormationStep[];
  parentRocks: { name: string; description: string }[];
  minerals: MineralDetail[];
  impurities?: string;
  physicalProperties: { label: string; value: string }[];
  specialSectionTitle: string;
  specialSectionItems: { title: string; detail: string }[];
  acidReactionEquation?: string;
  uses?: string[];
  microscopicSummary: string;
  hotspotPrompt: string;
}

export const ROCK_SPECS: Record<RockId, RockSpec> = {
  hornfels: {
    id: 'hornfels',
    title: '1. Hornfels',
    subtitle: 'Non-Foliated Contact Metamorphic Rock',
    imagePath: '/assets/aistudio/image_76cd56fd.png',
    imageCaption: 'Banded Hornfels hand specimen with alternating dark and pale silicate layers (centimeter scale).',
    definition:
      'A non-foliated metamorphic rock that forms mainly through contact metamorphism when hot magma intrudes and bakes surrounding country rocks.',
    metamorphismType: 'Contact Metamorphism (Thermal)',
    generalCharacteristics: [
      'Usually very hard, dense, and compact',
      'Fine-grained interlocking texture',
      'Non-layered (lacks foliation) though compositional banding from the protolith can remain',
      'Typically appears in dark colors (black, dark grey, brown, greenish) or spotted varieties',
    ],
    howItFormsSummary:
      'Intense thermal energy from rising magma destabilizes original protolith minerals, driving solid-state recrystallization and new chemical reactions into a dense, horn-like rock.',
    formationSteps: [
      {
        step: 1,
        title: 'Magma Ascent',
        detail: "Magma moves upward through the Earth's crust toward shallower crustal levels.",
      },
      {
        step: 2,
        title: 'Thermal Contact',
        detail: 'The rising magma intrusion comes into direct contact with surrounding country rocks.',
      },
      {
        step: 3,
        title: 'Temperature Spike',
        detail: 'Surrounding rocks experience a significant increase in temperature within the contact aureole.',
      },
      {
        step: 4,
        title: 'Mineral Instability',
        detail: 'Original low-temperature minerals in the host rock become thermodynamically unstable.',
      },
      {
        step: 5,
        title: 'Recrystallization & Reactions',
        detail: 'New high-temperature minerals nucleate and grow through solid-state recrystallization and chemical reactions.',
      },
      {
        step: 6,
        title: 'Transformation to Hornfels',
        detail: 'The original protolith transforms into tough, dense, fine-grained Hornfels.',
      },
    ],
    parentRocks: [
      { name: 'Shale & Mudstone', description: 'Pelitic protoliths rich in clay and silica yield biotite, andalusite, and cordierite hornfels.' },
      { name: 'Sandstone', description: 'Quartz-rich layers produce dense quartz-feldspar hornfelsic bands.' },
      { name: 'Basalt & Fine-Grained Rocks', description: 'Mafic volcanic protoliths form pyroxene- and plagioclase-bearing dark hornfels.' },
    ],
    minerals: [
      { name: 'Quartz', formula: 'SiO₂', role: 'Framework Silicate', notes: 'Hard, chemically resistant granular matrix mineral.', colorHex: '#e2e8f0' },
      { name: 'Feldspar', formula: '(K,Na,Ca)AlSi₃O₈', role: 'Framework Silicate', notes: 'Common silicate mineral forming pale interlocking bands.', colorHex: '#cbd5e1' },
      { name: 'Biotite', formula: 'K(Mg,Fe)₃AlSi₃O₁₀(OH)₂', role: 'Sheet Silicate', notes: 'Dark mica mineral giving dark grey/brown sheen and PPL pleochroism.', colorHex: '#3f2e26' },
      { name: 'Andalusite', formula: 'Al₂SiO₅', role: 'Aluminosilicate', notes: 'Aluminium-rich prismatic mineral (often spelled Andalusite / Andaulusite) diagnostic of low-P, high-T contact metamorphism.', colorHex: '#b47b84' },
      { name: 'Cordierite', formula: '(Mg,Fe)₂Al₄Si₅O₁₈', role: 'Cyclosilicate', notes: 'Common in spotted contact metamorphic hornfels.', colorHex: '#64748b' },
      { name: 'Pyroxene', formula: 'XY(Si,Al)₂O₆', role: 'Chain Silicate', notes: 'Common in high-temperature mafic or calc-silicate varieties.', colorHex: '#4d5d53' },
      { name: 'Garnet', formula: 'X₃Y₂(SiO₄)₃', role: 'Nesosilicate', notes: 'May occur as small rounded porphyroblasts in certain compositions.', colorHex: '#7f1d1d' },
    ],
    physicalProperties: [
      { label: 'Color', value: 'Black, dark grey, brown, greenish, or spotted' },
      { label: 'Grain Size', value: 'Very fine-grained (often requires microscope)' },
      { label: 'Hardness', value: 'Generally very hard (~6–7 Mohs, mineral dependent)' },
      { label: 'Texture', value: 'Dense, compact, randomly oriented granoblastic grains' },
    ],
    specialSectionTitle: 'Protolith Dependency & Thermal Aureole',
    specialSectionItems: [
      {
        title: 'No Single Fixed Composition',
        detail: "Resulting mineral assemblages depend directly on the protolith's bulk chemical composition and local temperature/pressure conditions.",
      },
      {
        title: 'Microscopic Granoblastic Interlock',
        detail: 'Fine-grained interlocking crystals with random orientation and zero planar foliation under polarized light.',
      },
    ],
    microscopicSummary:
      'Fine-grained minerals in a granoblastic interlocking mosaic with random orientation and no obvious foliation; common phases include quartz, feldspar, biotite, andalusite, and cordierite.',
    hotspotPrompt: 'Click any mineral crystal or press [E] for the full Hornfels dossier',
  },
  marble: {
    id: 'marble',
    title: '2. Marble',
    subtitle: 'Non-Foliated Carbonate Metamorphic Rock',
    imagePath: '/assets/aistudio/image_24f7143d.png',
    imageCaption: 'Crystalline Marble specimen showing interlocking white calcite grains and dark graphite/impurity bands.',
    definition:
      'A non-foliated metamorphic rock formed mainly from the metamorphism of limestone or dolostone, consisting primarily of calcite (CaCO₃) or dolomite (CaMg(CO₃)₂).',
    metamorphismType: 'Contact or Regional Metamorphism',
    generalCharacteristics: [
      'Sugary, crystalline interlocking carbonate texture',
      'Relatively soft (~3 Mohs for calcite marble)',
      'Reacts vigorously with dilute hydrochloric acid (HCl)',
      'Pure calcite marble is white; impurities create grey, pink, green, black, or cream streaks',
    ],
    howItFormsSummary:
      'Sedimentary limestone or dolostone is buried or heated near an igneous intrusion; elevated temperature and pressure recrystallize original carbonate grains into larger, tightly interlocking crystals without necessarily changing bulk chemical composition.',
    parentRocks: [
      { name: 'Limestone', description: 'Sedimentary carbonate rock composed mainly of calcite (CaCO₃).' },
      { name: 'Dolostone', description: 'Sedimentary carbonate rock composed mainly of dolomite (CaMg(CO₃)₂).' },
    ],
    minerals: [
      { name: 'Calcite', formula: 'CaCO₃', role: 'Primary Carbonate', notes: 'Usually white or colorless; Mohs hardness ~3; 3 directions of rhombohedral cleavage; fizzes strongly in dilute HCl.', colorHex: '#f8fafc' },
      { name: 'Dolomite', formula: 'CaMg(CO₃)₂', role: 'Mg-Carbonate', notes: 'White, grey, or pinkish; Mohs hardness ~3.5–4; reacts more weakly with cold dilute HCl than calcite.', colorHex: '#e2d9d5' },
      { name: 'Graphite & Iron Oxides', formula: 'C / Fe₂O₃', role: 'Coloring Impurities', notes: 'Create dark grey veins, swirls, pink, or golden streaks.', colorHex: '#475569' },
      { name: 'Quartz & Mica', formula: 'SiO₂ / Phyllosilicates', role: 'Accessory Impurities', notes: 'Derived from sandy or clayey impurities in the original limestone.', colorHex: '#94a3b8' },
    ],
    impurities: 'Quartz, mica, graphite, and iron oxides occur as impurities, producing varied colors and veined patterns.',
    physicalProperties: [
      { label: 'Color', value: 'White, grey, pink, green, black, or cream' },
      { label: 'Texture', value: 'Crystalline texture with tightly interlocking crystals' },
      { label: 'Grain Size', value: 'Fine-grained or coarse-grained (sugary)' },
      { label: 'Hardness', value: '~3 on Mohs scale (calcite) — much softer than quartzite' },
    ],
    specialSectionTitle: 'The Dilute HCl Acid Test',
    specialSectionItems: [
      {
        title: 'Carbonate Effervescence',
        detail: 'Applying dilute hydrochloric acid to calcite-rich marble produces immediate CO₂ gas bubbles (effervescence).',
      },
      {
        title: 'Calcite vs. Dolomite Response',
        detail: 'Pure calcite marble fizzes vigorously in cold dilute HCl, whereas dolomitic marble reacts weakly unless powdered or warmed.',
      },
    ],
    acidReactionEquation: 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑',
    uses: [
      'Sculptures & fine carving',
      'Buildings & architectural facades',
      'Floor tiles & countertops',
      'Decorative objects & historical monuments',
    ],
    microscopicSummary:
      'Predominantly recrystallized calcite crystals forming a granoblastic mosaic with prominent lamellar calcite twinning and high-order pastel interference colors under XPL.',
    hotspotPrompt: 'Try the HCl Acid Test in the dock or press [E] for full Marble details',
  },
  quartzite: {
    id: 'quartzite',
    title: '3. Quartzite',
    subtitle: 'Ultra-Hard Non-Foliated Silicate Metamorphic Rock',
    imagePath: '/assets/aistudio/image_8bb9fbc3.png',
    imageCaption: 'Translucent grey-white Quartzite specimen showing glassy vitreous luster and tightly fused quartz grains.',
    definition:
      'A hard, resistant, non-foliated metamorphic rock formed mainly from quartz-rich sandstone and consisting predominantly of quartz (SiO₂).',
    metamorphismType: 'Regional or Contact Metamorphism',
    generalCharacteristics: [
      'Extreme hardness (7 on Mohs scale — scratches ordinary glass)',
      'Glassy, vitreous luster with conchoidal fracture across grains',
      'Granular crystalline texture with tightly interlocked sutured quartz',
      'Exceptional resistance to chemical and physical weathering',
    ],
    howItFormsSummary:
      'Quartz-rich sandstone experiences elevated temperature and pressure, causing individual sand-sized quartz grains to recrystallize and fuse together into an interlocked, pore-free crystalline mosaic.',
    parentRocks: [
      { name: 'Quartz-Rich Sandstone', description: 'Clastic sedimentary rock composed primarily of sand-sized quartz (SiO₂) grains.' },
    ],
    minerals: [
      { name: 'Quartz', formula: 'SiO₂', role: 'Dominant Mineral (>90%)', notes: 'Mohs hardness 7; colorless/white when pure; no cleavage; glassy appearance; extreme weathering stability.', colorHex: '#f1f5f9' },
      { name: 'Feldspar & Mica', formula: 'Aluminosilicates', role: 'Minor Accessories', notes: 'Small amounts can modify hue and localized texture.', colorHex: '#cbd5e1' },
      { name: 'Iron Oxides', formula: 'Fe₂O₃ / FeO(OH)', role: 'Coloring Agents', notes: 'Impart red, pink, yellow, or rusty tints to natural quartzite.', colorHex: '#b45309' },
    ],
    physicalProperties: [
      { label: 'Hardness', value: '7 on Mohs scale (scratches ordinary glass)' },
      { label: 'Texture', value: 'Granular, crystalline, tightly interlocked quartz grains' },
      { label: 'Color', value: 'White, grey, red, yellow, or green' },
      { label: 'Weathering', value: 'Very high resistance due to quartz chemical stability' },
    ],
    specialSectionTitle: 'Microscopic Features (PPL & XPL)',
    specialSectionItems: [
      { title: 'Quartz Grains (PPL)', detail: 'Usually colorless with low relief under Plane Polarized Light.' },
      { title: 'Interlocking Crystals', detail: 'Tightly fitted grains with zero pore space indicating complete recrystallization.' },
      { title: 'Interference Colors (XPL)', detail: 'Displays first-order grey or white interference colors under Crossed Polarized Light.' },
      { title: 'Undulose Extinction', detail: 'Different parts of a single quartz grain go dark at slightly different stage rotation angles, revealing internal crystal strain.' },
      { title: 'Grain Boundaries', detail: 'Irregular, sutured, or polygonal boundaries recording recrystallization and grain boundary migration.' },
    ],
    uses: [
      'High-durability construction & road aggregate',
      'Building facades & architectural cladding',
      'Decorative stones & flooring',
      'Landscaping & crushed stone',
    ],
    microscopicSummary:
      'Abundant, tightly interlocked recrystallized quartz crystals showing sutured/polygonal boundaries, low relief under PPL, first-order grey/white interference colors under XPL, and diagnostic undulose extinction.',
    hotspotPrompt: 'Test Mohs 7 hardness in the dock or press [E] for full Quartzite details',
  },
};

export interface TextureType {
  id: 'granoblastic' | 'lepidoblastic' | 'nematoblastic' | 'porphyroblastic';
  name: string;
  grainShape: string;
  alignment: string;
  minerals: string;
  examples: string;
  description: string;
}

export const METAMORPHIC_TEXTURES: TextureType[] = [
  {
    id: 'granoblastic',
    name: 'Granoblastic',
    grainShape: 'Equidimensional interlocking polygons',
    alignment: 'Random / Non-foliated',
    minerals: 'Quartz, Calcite, Feldspar',
    examples: 'Hornfels, Marble, Quartzite',
    description:
      'Interlocking mineral grains of roughly equal dimensions forming a tight, mosaic-like fabric typical of non-foliated rocks.',
  },
  {
    id: 'lepidoblastic',
    name: 'Lepidoblastic',
    grainShape: 'Platy, flaky, or sheet-like crystals',
    alignment: 'Parallel / Subparallel foliation',
    minerals: 'Muscovite, Biotite, Chlorite',
    examples: 'Slate, Phyllite, Schist',
    description:
      'Sheet silicate minerals aligned parallel or subparallel to one another perpendicular to principal stress, generating strong foliation.',
  },
  {
    id: 'nematoblastic',
    name: 'Nematoblastic',
    grainShape: 'Elongated, prismatic, needle-shaped',
    alignment: 'Preferred linear orientation',
    minerals: 'Amphibole (Hornblende, Actinolite)',
    examples: 'Amphibolite, Lineated Schist',
    description:
      'Elongated needle-like or prismatic crystals aligned along a preferred linear axis (lineation) during directed deformation.',
  },
  {
    id: 'porphyroblastic',
    name: 'Porphyroblastic',
    grainShape: 'Large euhedral crystals in fine matrix',
    alignment: 'Variable matrix',
    minerals: 'Garnet, Staurolite, Andalusite',
    examples: 'Garnet Schist, Spotted Hornfels',
    description:
      'Relatively large metamorphic crystals (porphyroblasts) that grew rapidly during metamorphism, surrounded by a finer-grained groundmass.',
  },
];

export const LO6_CONCEPTS = [
  'Contact Metamorphism & Thermal Aureoles',
  'Protoliths & Solid-State Recrystallization',
  'Hornfels — Fine-Grained Non-Foliated Silicate Rock',
  'Marble — Carbonate Recrystallization & Dilute HCl Acid Test',
  'Quartzite — Mohs 7 Durability & Undulose Extinction',
  '30 µm Petrographic Thin Sections',
  'PPL (Pleochroism, Relief, Cleavage)',
  'XPL (Interference Colors, Twinning, Extinction)',
  'Granoblastic, Lepidoblastic, Nematoblastic & Porphyroblastic Textures',
  'Foliated vs. Non-Foliated Metamorphic Fabrics',
];
