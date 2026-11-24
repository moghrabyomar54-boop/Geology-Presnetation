import * as THREE from 'three';
import type { RockId } from '../data/presentationData';

// Deterministic pseudo-random generator for reproducible geological grain textures
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface ProceduralTextureSet {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  dispose: () => void;
}

export function createProceduralRockTextures(
  rockId: RockId,
  maxAnisotropy: number
): ProceduralTextureSet {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  const bumpCanvas = document.createElement('canvas');
  const roughCanvas = document.createElement('canvas');

  colorCanvas.width = bumpCanvas.width = roughCanvas.width = size;
  colorCanvas.height = bumpCanvas.height = roughCanvas.height = size;

  const cCtx = colorCanvas.getContext('2d')!;
  const bCtx = bumpCanvas.getContext('2d')!;
  const rCtx = roughCanvas.getContext('2d')!;

  if (rockId === 'hornfels') {
    const rand = mulberry32(4207);

    // Base fine-grained dark hornfels slate
    cCtx.fillStyle = '#2d3138';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#707070';
    bCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#b8b8b8';
    rCtx.fillRect(0, 0, size, size);

    // Alternating dark & pale hornfelsic compositional bands (like the attached specimen!)
    const bands = [
      { y: 0, h: 68, col: '#5b584f', rough: 195 },
      { y: 68, h: 42, col: '#8d928c', rough: 175 },
      { y: 110, h: 36, col: '#3b4046', rough: 205 },
      { y: 146, h: 72, col: '#9da39d', rough: 168 },
      { y: 218, h: 86, col: '#22262c', rough: 210 },
      { y: 304, h: 48, col: '#9ca19b', rough: 170 },
      { y: 352, h: 38, col: '#3a3f46', rough: 205 },
      { y: 390, h: 64, col: '#8f948e', rough: 172 },
      { y: 454, h: 58, col: '#272b31', rough: 208 },
    ];

    bands.forEach((b) => {
      cCtx.fillStyle = b.col;
      cCtx.fillRect(0, b.y, size, b.h);
      const rVal = Math.round(b.rough);
      rCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
      rCtx.fillRect(0, b.y, size, b.h);
    });

    // Organic waviness along band edges
    for (let i = 0; i < 420; i++) {
      const y = rand() * size;
      const x = rand() * size;
      const w = 24 + rand() * 80;
      const h = 3 + rand() * 10;
      const light = rand() > 0.55;
      cCtx.fillStyle = light ? 'rgba(180,185,178,0.16)' : 'rgba(18,20,24,0.22)';
      cCtx.fillRect(x, y, w, h);
    }

    // Fine-grained granoblastic mineral speckle (quartz, feldspar, biotite)
    for (let i = 0; i < 9500; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 0.7 + rand() * 1.9;
      const tone = rand();
      if (tone < 0.35) {
        cCtx.fillStyle = 'rgba(20, 22, 26, 0.55)'; // dark biotite
        bCtx.fillStyle = 'rgba(60, 60, 60, 0.5)';
      } else if (tone < 0.75) {
        cCtx.fillStyle = 'rgba(130, 136, 142, 0.42)';
        bCtx.fillStyle = 'rgba(165, 165, 165, 0.45)';
      } else {
        cCtx.fillStyle = 'rgba(218, 222, 226, 0.35)'; // micro-quartz/feldspar
        bCtx.fillStyle = 'rgba(215, 215, 215, 0.45)';
      }
      cCtx.beginPath();
      cCtx.arc(x, y, r, 0, Math.PI * 2);
      cCtx.fill();
      bCtx.fillRect(x, y, r * 1.4, r * 1.4);
    }

    // Spotted cordierite ovoids & subtle white cross-cutting quartz veinlet
    for (let i = 0; i < 36; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const rx = 3 + rand() * 5;
      cCtx.fillStyle = 'rgba(42, 48, 58, 0.65)';
      cCtx.beginPath();
      cCtx.ellipse(x, y, rx, rx * 0.75, rand() * Math.PI, 0, Math.PI * 2);
      cCtx.fill();
    }

    // Fine oblique fracture / quartz veinlet like in the photo
    cCtx.strokeStyle = 'rgba(225, 230, 235, 0.55)';
    cCtx.lineWidth = 1.6;
    cCtx.beginPath();
    cCtx.moveTo(size * 0.42, size * 0.28);
    cCtx.lineTo(size * 0.58, size * 0.55);
    cCtx.lineTo(size * 0.75, size * 0.88);
    cCtx.stroke();

    bCtx.strokeStyle = 'rgba(240, 240, 240, 0.7)';
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    bCtx.moveTo(size * 0.42, size * 0.28);
    bCtx.lineTo(size * 0.58, size * 0.55);
    bCtx.lineTo(size * 0.75, size * 0.88);
    bCtx.stroke();
  } else if (rockId === 'marble') {
    const rand = mulberry32(8813);

    // Translucent sugary white-grey calcite matrix
    cCtx.fillStyle = '#dde1e4';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#909090';
    bCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#8e8e8e';
    rCtx.fillRect(0, 0, size, size);

    // Diagonal smoky grey graphite / impurity streaks
    for (let v = 0; v < 7; v++) {
      const startY = v * 75 - 40;
      cCtx.strokeStyle = `rgba(74, 82, 92, ${0.22 + rand() * 0.28})`;
      cCtx.lineWidth = 14 + rand() * 26;
      cCtx.beginPath();
      cCtx.moveTo(-20, startY + 280);
      cCtx.bezierCurveTo(
        size * 0.35,
        startY + 180 + (rand() - 0.5) * 40,
        size * 0.65,
        startY + 80 + (rand() - 0.5) * 40,
        size + 20,
        startY - 40
      );
      cCtx.stroke();
    }

    // Coarse interlocking sugary calcite crystals (polygonal facets)
    for (let i = 0; i < 4200; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const rx = 2.5 + rand() * 6;
      const ry = 2 + rand() * 5;
      const angle = rand() * Math.PI;
      const bright = rand();
      if (bright > 0.6) {
        cCtx.fillStyle = 'rgba(248, 250, 252, 0.42)';
        rCtx.fillStyle = 'rgba(95, 95, 95, 0.5)';
        bCtx.fillStyle = 'rgba(225, 225, 225, 0.45)';
      } else if (bright > 0.25) {
        cCtx.fillStyle = 'rgba(202, 208, 214, 0.38)';
        rCtx.fillStyle = 'rgba(135, 135, 135, 0.5)';
        bCtx.fillStyle = 'rgba(155, 155, 155, 0.45)';
      } else {
        cCtx.fillStyle = 'rgba(110, 118, 128, 0.3)';
        rCtx.fillStyle = 'rgba(165, 165, 165, 0.5)';
        bCtx.fillStyle = 'rgba(90, 90, 90, 0.45)';
      }
      cCtx.save();
      cCtx.translate(x, y);
      cCtx.rotate(angle);
      cCtx.fillRect(-rx / 2, -ry / 2, rx, ry);
      cCtx.restore();

      bCtx.save();
      bCtx.translate(x, y);
      bCtx.rotate(angle);
      bCtx.fillRect(-rx / 2, -ry / 2, rx, ry);
      bCtx.restore();

      rCtx.fillRect(x, y, rx, ry);
    }
  } else {
    // Quartzite: vitreous, tightly interlocked glassy quartz grains
    const rand = mulberry32(9951);

    cCtx.fillStyle = '#c4c7c9';
    cCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#888888';
    bCtx.fillRect(0, 0, size, size);
    rCtx.fillStyle = '#525252'; // Low roughness -> glossy vitreous quartz luster
    rCtx.fillRect(0, 0, size, size);

    // Subtle frosted patches & iron oxide warm whisper
    for (let i = 0; i < 60; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const rad = 25 + rand() * 55;
      const g = cCtx.createRadialGradient(x, y, 2, x, y, rad);
      if (rand() > 0.78) {
        g.addColorStop(0, 'rgba(182, 168, 152, 0.24)');
      } else if (rand() > 0.4) {
        g.addColorStop(0, 'rgba(232, 236, 240, 0.3)');
      } else {
        g.addColorStop(0, 'rgba(130, 135, 140, 0.26)');
      }
      g.addColorStop(1, 'rgba(196, 199, 201, 0)');
      cCtx.fillStyle = g;
      cCtx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }

    // Tightly sutured interlocking quartz crystals + conchoidal sparkle
    for (let i = 0; i < 6500; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 1.2 + rand() * 3.4;
      const t = rand();
      if (t > 0.72) {
        cCtx.fillStyle = 'rgba(244, 247, 250, 0.48)';
        bCtx.fillStyle = 'rgba(230, 230, 230, 0.5)';
        rCtx.fillStyle = 'rgba(55, 55, 55, 0.5)';
      } else if (t > 0.3) {
        cCtx.fillStyle = 'rgba(176, 181, 186, 0.36)';
        bCtx.fillStyle = 'rgba(150, 150, 150, 0.45)';
        rCtx.fillStyle = 'rgba(85, 85, 85, 0.5)';
      } else {
        cCtx.fillStyle = 'rgba(116, 122, 128, 0.34)';
        bCtx.fillStyle = 'rgba(85, 85, 85, 0.45)';
        rCtx.fillStyle = 'rgba(115, 115, 115, 0.5)';
      }
      cCtx.beginPath();
      cCtx.arc(x, y, r, 0, Math.PI * 2);
      cCtx.fill();
      bCtx.fillRect(x, y, r * 1.2, r * 1.2);
      rCtx.fillRect(x, y, r, r);
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.anisotropy = maxAnisotropy;

  return {
    map,
    bumpMap,
    roughnessMap,
    dispose: () => {
      map.dispose();
      bumpMap.dispose();
      roughnessMap.dispose();
    },
  };
}
