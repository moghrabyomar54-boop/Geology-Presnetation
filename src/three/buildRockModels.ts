import * as THREE from 'three';
import type { RockId } from '../data/presentationData';
import { createProceduralRockTextures, type ProceduralTextureSet } from './proceduralRockTextures';

export interface MineralHotspot {
  id: string;
  label: string;
  formula?: string;
  detail: string;
  mesh: THREE.Object3D;
  worldAnchorLocal: THREE.Vector3;
}

export interface BuiltRockRig {
  group: THREE.Group;
  coreMesh: THREE.Mesh;
  coreMaterial: THREE.MeshPhysicalMaterial;
  proceduralTextures: ProceduralTextureSet;
  photoTexture: THREE.Texture | null;
  hotspots: MineralHotspot[];
  explodableParts: { obj: THREE.Object3D; basePos: THREE.Vector3; explodeVec: THREE.Vector3 }[];
  // Rock-specific interactive props
  bubblesInstanced?: THREE.InstancedMesh;
  bubbleStates?: { pos: THREE.Vector3; speed: number; life: number; maxLife: number; scale: number }[];
  glassPlateGroup?: THREE.Group;
  thermalHaloMesh?: THREE.Mesh;
  dispose: () => void;
}

// 3D deterministic noise-like displacement for realistic angular/fractured geological rock silhouettes
function pseudoNoise3D(x: number, y: number, z: number, seed: number): number {
  const n1 = Math.sin(x * 2.1 + seed) * Math.cos(y * 2.3 - seed * 0.7) * Math.sin(z * 1.9 + seed * 1.3);
  const n2 = Math.sin(x * 4.7 - y * 3.1 + seed * 1.9) * Math.cos(z * 5.2 + x * 2.4) * 0.45;
  const n3 = Math.cos(y * 8.3 + z * 7.1 - x * 6.5 + seed) * 0.16;
  return n1 + n2 + n3;
}

function createSculptedRockGeometry(rockId: RockId): THREE.BufferGeometry {
  let geo: THREE.BufferGeometry;

  if (rockId === 'hornfels') {
    // Blocky angular contact-metamorphic slab matching the real banded specimen
    geo = new THREE.BoxGeometry(2.15, 1.95, 1.45, 36, 36, 24);
  } else if (rockId === 'marble') {
    // Coarse fractured crystalline marble block
    geo = new THREE.IcosahedronGeometry(1.32, 4);
  } else {
    // Quartzite: angular conchoidal-fractured metamorphic boulder
    geo = new THREE.IcosahedronGeometry(1.28, 4);
  }

  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    if (rockId === 'hornfels') {
      // Taper top slightly like a natural trapezoidal hand specimen + angular fractures
      const taper = 1 - Math.max(0, v.y) * 0.14;
      v.x *= taper;
      const d = pseudoNoise3D(v.x * 1.2, v.y * 1.2, v.z * 1.2, 3.1);
      // Stepped crisp edges & subtle horizontal bedding relief
      const bandRelief = Math.sin(v.y * 9.5) * 0.025;
      v.x += d * 0.12 + bandRelief;
      v.y += pseudoNoise3D(v.y, v.z, v.x, 7.4) * 0.08;
      v.z += pseudoNoise3D(v.z, v.x, v.y, 11.2) * 0.11;
    } else if (rockId === 'marble') {
      // Broad irregular cleavage faces + rough broken lower edges
      v.multiply(new THREE.Vector3(1.12, 0.96, 0.9));
      const d = pseudoNoise3D(v.x * 1.3, v.y * 1.3, v.z * 1.3, 19.7);
      const ridge = Math.abs(Math.sin(v.x * 2.4 + v.y * 1.8)) * 0.09;
      const factor = 1 + d * 0.14 - ridge;
      v.multiplyScalar(factor);
      if (v.y < -0.78) v.y = -0.78 + (v.y + 0.78) * 0.25; // Flat-ish resting base
    } else {
      // Quartzite: sharp conchoidal scoops & crisp angular facets
      v.multiply(new THREE.Vector3(1.22, 0.86, 0.95));
      const d = pseudoNoise3D(v.x * 1.4, v.y * 1.4, v.z * 1.4, 31.3);
      const conchoidal = Math.sin(v.x * 3.8 + v.z * 3.1) * 0.06;
      v.multiplyScalar(1 + d * 0.13 + conchoidal);
      if (v.y < -0.72) v.y = -0.72 + (v.y + 0.72) * 0.2;
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  pos.needsUpdate = true;
  geo.computeVertexNormals();
  geo.center();
  return geo;
}

export function buildDetailedRockModel(
  rockId: RockId,
  imagePath: string,
  maxAnisotropy: number,
  isSoftwareGl: boolean,
  onPhotoLoaded?: () => void
): BuiltRockRig {
  const group = new THREE.Group();
  const disposables: { dispose: () => void }[] = [];
  const hotspots: MineralHotspot[] = [];
  const explodableParts: { obj: THREE.Object3D; basePos: THREE.Vector3; explodeVec: THREE.Vector3 }[] = [];

  const proceduralTextures = createProceduralRockTextures(rockId, maxAnisotropy);
  const coreGeo = createSculptedRockGeometry(rockId);
  disposables.push(coreGeo);

  // Core rock material calibrated to each rock's physical luster with deeper void contrast
  const coreTint =
    rockId === 'hornfels' ? '#b0b7c0' : rockId === 'marble' ? '#c2c9d1' : '#aeb7c0';

  const coreMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(coreTint),
    map: proceduralTextures.map,
    bumpMap: proceduralTextures.bumpMap,
    bumpScale: rockId === 'hornfels' ? 0.055 : rockId === 'marble' ? 0.068 : 0.05,
    roughnessMap: proceduralTextures.roughnessMap,
    roughness: rockId === 'quartzite' ? 0.32 : rockId === 'marble' ? 0.56 : 0.78,
    metalness: 0.04,
    clearcoat: rockId === 'quartzite' ? 0.55 : rockId === 'marble' ? 0.22 : 0.05,
    clearcoatRoughness: rockId === 'quartzite' ? 0.22 : 0.48,
    sheen: rockId === 'marble' ? 0.22 : 0.0,
    sheenColor: new THREE.Color('#cbd5e1'),
  });
  disposables.push(coreMaterial);

  const coreMesh = new THREE.Mesh(coreGeo, coreMaterial);
  coreMesh.castShadow = !isSoftwareGl;
  coreMesh.receiveShadow = true;
  coreMesh.name = `${rockId}-core`;
  group.add(coreMesh);

  // Load real photo texture asynchronously for Photo Projection toggle
  let photoTexture: THREE.Texture | null = null;
  const loader = new THREE.TextureLoader();
  loader.load(
    imagePath,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAnisotropy;
      tex.wrapS = THREE.MirroredRepeatWrapping;
      tex.wrapT = THREE.MirroredRepeatWrapping;
      photoTexture = tex;
      onPhotoLoaded?.();
    },
    undefined,
    () => {
      // Fail gracefully if texture unavailable
    }
  );

  // Helper to register clickable + explodable sub-components
  const registerPart = (
    obj: THREE.Object3D,
    explodeVec: THREE.Vector3,
    hotspot?: Omit<MineralHotspot, 'mesh' | 'worldAnchorLocal'>
  ) => {
    const basePos = obj.position.clone();
    explodableParts.push({ obj, basePos, explodeVec });
    if (!isSoftwareGl) {
      obj.traverse((c) => {
        if ((c as THREE.Mesh).isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
        }
      });
    }
    if (hotspot) {
      obj.layers.enable(1);
      obj.traverse((c) => c.layers.enable(1));
      obj.userData.hotspotId = hotspot.id;
      hotspots.push({
        ...hotspot,
        mesh: obj,
        worldAnchorLocal: basePos.clone(),
      });
    }
  };

  let bubblesInstanced: THREE.InstancedMesh | undefined;
  let bubbleStates: { pos: THREE.Vector3; speed: number; life: number; maxLife: number; scale: number }[] | undefined;
  let glassPlateGroup: THREE.Group | undefined;
  let thermalHaloMesh: THREE.Mesh | undefined;

  // ==========================================================
  // SUBTLE FLUSH MINERAL FEATURES & INTERACTIVE PROPS (No weird protruding sticks)
  // ==========================================================
  if (rockId === 'hornfels') {
    // 1. Biotite Mica Flakes (thin flat dark hexagonal plates flush on surface)
    const biotiteGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.01, 6);
    const biotiteMat = new THREE.MeshStandardMaterial({
      color: '#2b201b',
      roughness: 0.2,
      metalness: 0.35,
    });
    disposables.push(biotiteGeo, biotiteMat);

    const biotiteGroup = new THREE.Group();
    const biotiteOffsets = [
      [0.42, -0.14, 0.74],
      [0.54, -0.04, 0.72],
      [0.36, -0.24, 0.74],
      [0.48, -0.22, 0.75],
      [-0.62, -0.28, 0.68],
    ];
    biotiteOffsets.forEach(([x, y, z], idx) => {
      const m = new THREE.Mesh(biotiteGeo, biotiteMat);
      m.position.set(x, y, z);
      m.rotation.set(Math.PI / 2 + idx * 0.08, idx * 0.3, 0.12);
      biotiteGroup.add(m);
    });
    group.add(biotiteGroup);
    registerPart(biotiteGroup, new THREE.Vector3(0.45, -0.1, 0.55), {
      id: 'biotite',
      label: 'Biotite Mica Flakes',
      formula: 'K(Mg,Fe)₃AlSi₃O₁₀(OH)₂',
      detail: 'Dark platy sheet silicate producing dark color and strong brown pleochroism under PPL.',
    });

    // 2. Cordierite Spotted Porphyroblasts (low-profile ovoid spots flush with matrix)
    const cordGeo = new THREE.SphereGeometry(0.062, 16, 12);
    cordGeo.scale(1.15, 0.8, 0.45);
    const cordMat = new THREE.MeshStandardMaterial({
      color: '#475569',
      roughness: 0.48,
      metalness: 0.05,
    });
    disposables.push(cordGeo, cordMat);

    const cordGroup = new THREE.Group();
    [
      [-0.25, 0.55, 0.68],
      [0.28, 0.62, 0.64],
      [-0.58, -0.35, -0.62],
      [0.12, 0.88, 0.14],
    ].forEach(([x, y, z]) => {
      const m = new THREE.Mesh(cordGeo, cordMat);
      m.position.set(x, y, z);
      cordGroup.add(m);
    });
    group.add(cordGroup);
    registerPart(cordGroup, new THREE.Vector3(0.1, 0.55, 0.35), {
      id: 'cordierite',
      label: 'Cordierite Spots',
      formula: '(Mg,Fe)₂Al₄Si₅O₁₈',
      detail: 'Ovoid porphyroblasts typical of spotted contact hornfels formed in pelitic protoliths.',
    });

    // 3. Garnet Micro-Porphyroblasts (small flush crimson dodecahedra)
    const garnetGeo = new THREE.DodecahedronGeometry(0.056, 0);
    const garnetMat = new THREE.MeshPhysicalMaterial({
      color: '#881337',
      roughness: 0.24,
      clearcoat: 0.72,
      metalness: 0.08,
    });
    disposables.push(garnetGeo, garnetMat);

    const garnetGroup = new THREE.Group();
    [
      [0.74, 0.22, 0.42],
      [0.68, 0.36, 0.54],
      [-0.74, 0.44, -0.22],
    ].forEach(([x, y, z]) => {
      const m = new THREE.Mesh(garnetGeo, garnetMat);
      m.position.set(x, y, z);
      garnetGroup.add(m);
    });
    group.add(garnetGroup);
    registerPart(garnetGroup, new THREE.Vector3(0.55, 0.3, 0.35), {
      id: 'garnet',
      label: 'Garnet Crystals',
      formula: 'X₃Y₂(SiO₄)₃',
      detail: 'Dense isometric dodecahedral crystals occasionally formed in high-grade hornfels.',
    });

    // 4. Optional Thermal Contact Aureole Base Ring (activated when toggled)
    const haloGeo = new THREE.TorusGeometry(1.75, 0.045, 16, 64);
    haloGeo.rotateX(Math.PI / 2);
    const haloMat = new THREE.MeshBasicMaterial({
      color: '#f97316',
      transparent: true,
      opacity: 0.0,
    });
    thermalHaloMesh = new THREE.Mesh(haloGeo, haloMat);
    thermalHaloMesh.position.y = -1.05;
    group.add(thermalHaloMesh);
    disposables.push(haloGeo, haloMat);
  } else if (rockId === 'marble') {
    // 1. Subtle Embedded Calcite Cleavage Facets (flush with rock contour)
    const calciteMat = new THREE.MeshPhysicalMaterial({
      color: '#dce3ea',
      roughness: 0.26,
      clearcoat: 0.48,
      metalness: 0.02,
      sheen: 0.28,
    });
    const rhombGeo = new THREE.BoxGeometry(0.18, 0.16, 0.14);
    const rPos = rhombGeo.attributes.position;
    for (let i = 0; i < rPos.count; i++) {
      const y = rPos.getY(i);
      const x = rPos.getX(i);
      rPos.setX(i, x + y * 0.26);
      rPos.setZ(i, rPos.getZ(i) + y * 0.18);
    }
    rhombGeo.computeVertexNormals();
    disposables.push(rhombGeo, calciteMat);

    const calciteGroup = new THREE.Group();
    [
      { p: [0.36, 0.54, 0.68], r: [0.3, 0.4, 0.2], s: 0.9 },
      { p: [0.5, 0.42, 0.62], r: [-0.2, 0.9, 0.3], s: 0.72 },
      { p: [-0.46, 0.32, 0.74], r: [0.5, -0.4, 0.1], s: 0.8 },
    ].forEach((c) => {
      const m = new THREE.Mesh(rhombGeo, calciteMat);
      m.position.set(c.p[0], c.p[1], c.p[2]);
      m.rotation.set(c.r[0], c.r[1], c.r[2]);
      m.scale.setScalar(c.s);
      m.castShadow = !isSoftwareGl;
      calciteGroup.add(m);
    });
    group.add(calciteGroup);
    registerPart(calciteGroup, new THREE.Vector3(0.35, 0.45, 0.5), {
      id: 'calcite',
      label: 'Calcite Cleavage Grains',
      formula: 'CaCO₃',
      detail: 'White/colorless crystals with Mohs hardness ~3, three cleavage directions, and brisk HCl fizzing.',
    });

    // 2. Subtle Dolomite Crystalline Patch (flush)
    const doloGeo = new THREE.IcosahedronGeometry(0.12, 1);
    doloGeo.scale(1.1, 0.85, 0.6);
    const doloMat = new THREE.MeshPhysicalMaterial({
      color: '#e5d4ce',
      roughness: 0.34,
      clearcoat: 0.3,
    });
    disposables.push(doloGeo, doloMat);
    const doloGroup = new THREE.Group();
    [
      [-0.64, -0.18, 0.7],
      [-0.54, -0.28, 0.74],
    ].forEach(([x, y, z], i) => {
      const m = new THREE.Mesh(doloGeo, doloMat);
      m.position.set(x, y, z);
      m.rotation.set(i * 0.4, i * 0.7, 0.3);
      doloGroup.add(m);
    });
    group.add(doloGroup);
    registerPart(doloGroup, new THREE.Vector3(-0.55, -0.2, 0.55), {
      id: 'dolomite',
      label: 'Dolomite Grains',
      formula: 'CaMg(CO₃)₂',
      detail: 'Mohs hardness ~3.5–4; reacts more weakly with cold dilute HCl than pure calcite.',
    });

    // 3. Instanced CO2 Effervescence Bubbles (for interactive HCl Acid Test!)
    const bubbleCount = 65;
    const bubbleGeo = new THREE.SphereGeometry(0.028, 10, 10);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: 0.78,
    });
    bubblesInstanced = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
    bubblesInstanced.visible = false;
    bubblesInstanced.frustumCulled = false;
    bubbleStates = Array.from({ length: bubbleCount }, (_, i) => ({
      pos: new THREE.Vector3(
        ((i % 7) - 3) * 0.16,
        0.75 + (i % 5) * 0.12,
        ((Math.floor(i / 7) % 5) - 2) * 0.14
      ),
      speed: 0.45 + (i % 6) * 0.12,
      life: (i / bubbleCount) * 1.4,
      maxLife: 1.4,
      scale: 0.5 + (i % 4) * 0.25,
    }));
    group.add(bubblesInstanced);
    disposables.push(bubbleGeo, bubbleMat);
  } else {
    // QUARTZITE: Flush Vitreous Quartz Crystal Facets + Iron-Oxide Stained Patch + Glass Scratch Plate
    const qMat = new THREE.MeshPhysicalMaterial({
      color: '#f1f5f9',
      roughness: 0.12,
      metalness: 0.02,
      clearcoat: 0.85,
      clearcoatRoughness: 0.08,
      ior: 1.54,
      transparent: true,
      opacity: 0.9,
    });
    const grainGeo = new THREE.DodecahedronGeometry(0.11, 0);
    grainGeo.scale(1.1, 0.75, 0.9);
    disposables.push(grainGeo, qMat);

    const quartzCluster = new THREE.Group();
    [
      { p: [0.35, 0.62, 0.48], r: [0.35, 0.2, -0.4], s: 1.0 },
      { p: [0.48, 0.55, 0.36], r: [0.6, 0.5, -0.6], s: 0.82 },
      { p: [-0.52, 0.42, 0.56], r: [0.4, 0.2, 0.65], s: 0.9 },
    ].forEach((c) => {
      const m = new THREE.Mesh(grainGeo, qMat);
      m.position.set(c.p[0], c.p[1], c.p[2]);
      m.rotation.set(c.r[0], c.r[1], c.r[2]);
      m.scale.setScalar(c.s);
      quartzCluster.add(m);
    });
    group.add(quartzCluster);
    registerPart(quartzCluster, new THREE.Vector3(0.32, 0.52, 0.42), {
      id: 'quartz-crystals',
      label: 'Interlocking Quartz',
      formula: 'SiO₂',
      detail: 'Mohs hardness 7, no cleavage, glassy luster, sutured interlocking crystal boundaries.',
    });

    // Iron-oxide stained flush patch
    const ironGeo = new THREE.IcosahedronGeometry(0.16, 1);
    ironGeo.scale(1.15, 0.85, 0.55);
    const ironMat = new THREE.MeshStandardMaterial({
      color: '#a16247',
      roughness: 0.58,
      metalness: 0.06,
    });
    const ironMesh = new THREE.Mesh(ironGeo, ironMat);
    ironMesh.position.set(-0.72, -0.14, 0.62);
    group.add(ironMesh);
    disposables.push(ironGeo, ironMat);
    registerPart(ironMesh, new THREE.Vector3(-0.62, -0.12, 0.48), {
      id: 'iron-oxide',
      label: 'Iron Oxide Staining',
      formula: 'Fe₂O₃',
      detail: 'Trace mineral impurities imparting red, pink, or yellow hues to quartzite.',
    });

    // Mohs 5.5 Ordinary Glass Scratch Test Plate (hidden until test is toggled!)
    glassPlateGroup = new THREE.Group();
    const plateGeo = new THREE.BoxGeometry(1.3, 0.06, 0.85);
    const plateMat = new THREE.MeshPhysicalMaterial({
      color: '#a5f3fc',
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: 0.52,
      clearcoat: 1.0,
    });
    const plateMesh = new THREE.Mesh(plateGeo, plateMat);
    const scratchCurve = new THREE.LineCurve3(
      new THREE.Vector3(-0.42, 0.036, -0.15),
      new THREE.Vector3(0.45, 0.036, 0.18)
    );
    const scratchGeo = new THREE.TubeGeometry(scratchCurve, 8, 0.01, 6, false);
    const scratchMat = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    const scratchMesh = new THREE.Mesh(scratchGeo, scratchMat);
    glassPlateGroup.add(plateMesh, scratchMesh);
    glassPlateGroup.position.set(0, 1.18, 0.25);
    glassPlateGroup.rotation.set(0.18, -0.22, -0.12);
    glassPlateGroup.visible = false;
    group.add(glassPlateGroup);
    disposables.push(plateGeo, plateMat, scratchGeo, scratchMat);
  }

  return {
    group,
    coreMesh,
    coreMaterial,
    proceduralTextures,
    photoTexture,
    hotspots,
    explodableParts,
    bubblesInstanced,
    bubbleStates,
    glassPlateGroup,
    thermalHaloMesh,
    dispose: () => {
      proceduralTextures.dispose();
      photoTexture?.dispose();
      disposables.forEach((d) => d.dispose());
    },
  };
}
