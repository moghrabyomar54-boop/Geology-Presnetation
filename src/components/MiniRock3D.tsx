import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type MiniRockType = 'marble' | 'quartzite' | 'slate' | 'phyllite' | 'schist' | 'gneiss';

interface MiniRock3DProps {
  rockType: MiniRockType;
  label?: string;
  size?: number;
}

function detectSoftwareGl(): boolean {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function pseudoNoise(x: number, y: number, z: number, seed: number): number {
  return (
    Math.sin(x * 2.3 + seed) * Math.cos(y * 2.5 - seed * 0.7) * Math.sin(z * 2.1 + seed) +
    Math.cos(x * 4.9 - y * 3.4 + seed) * 0.35
  );
}

function createGneissBandTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#252c36';
    ctx.fillRect(0, 0, 256, 256);

    for (let y = 0; y < 256; y += 18) {
      // Dark biotite/amphibole band
      ctx.fillStyle = y % 36 === 0 ? '#1d242e' : '#333d4b';
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 256; x += 16) {
        const wave = Math.sin(x * 0.045 + y * 0.1) * 5;
        ctx.lineTo(x, y + wave);
      }
      ctx.lineTo(256, y + 10);
      ctx.lineTo(0, y + 10);
      ctx.closePath();
      ctx.fill();

      // Light quartz/feldspar band
      ctx.fillStyle = y % 36 === 0 ? '#dbe2ec' : '#b8c3d1';
      ctx.beginPath();
      ctx.moveTo(0, y + 9);
      for (let x = 0; x <= 256; x += 16) {
        const wave = Math.sin(x * 0.045 + y * 0.1 + 0.6) * 5;
        ctx.lineTo(x, y + 9 + wave);
      }
      ctx.lineTo(256, y + 18);
      ctx.lineTo(0, y + 18);
      ctx.closePath();
      ctx.fill();
    }

    // Augen eye-shaped feldspar porphyroclasts
    const eyes = [
      { x: 64, y: 74, rx: 18, ry: 8 },
      { x: 188, y: 128, rx: 20, ry: 9 },
      { x: 112, y: 196, rx: 17, ry: 7.5 },
    ];
    eyes.forEach((eye) => {
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.ellipse(eye.x, eye.y, eye.rx, eye.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export const MiniRock3D: React.FC<MiniRock3DProps> = ({
  rockType,
  label,
  size = 72,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'default',
      });
    } catch {
      setFallback(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
    camera.position.set(1.9, 1.15, 2.35);
    camera.lookAt(0, 0, 0);

    const hemi = new THREE.HemisphereLight('#b8cce0', '#0a0d12', 0.55);
    const key = new THREE.DirectionalLight('#fff5e6', 2.45);
    key.position.set(3.2, 4.0, 2.6);
    const rim = new THREE.DirectionalLight('#64748b', 1.0);
    rim.position.set(-3.0, 1.5, -2.5);
    scene.add(hemi, key, rim);

    const group = new THREE.Group();
    const disposables: { dispose: () => void }[] = [];

    if (rockType === 'marble') {
      const geo = new THREE.IcosahedronGeometry(0.86, 3);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.multiply(new THREE.Vector3(1.12, 0.92, 0.88));
        v.multiplyScalar(1 + pseudoNoise(v.x, v.y, v.z, 19.7) * 0.14);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      const mat = new THREE.MeshPhysicalMaterial({
        color: '#dde4ec',
        roughness: 0.42,
        metalness: 0.03,
        clearcoat: 0.35,
        sheen: 0.25,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      disposables.push(geo, mat);
    } else if (rockType === 'quartzite') {
      const geo = new THREE.IcosahedronGeometry(0.84, 3);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.multiply(new THREE.Vector3(1.18, 0.84, 0.94));
        v.multiplyScalar(1 + pseudoNoise(v.x * 1.2, v.y * 1.2, v.z * 1.2, 31.3) * 0.15);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      const mat = new THREE.MeshPhysicalMaterial({
        color: '#b8c8d8',
        roughness: 0.22,
        metalness: 0.05,
        clearcoat: 0.72,
        clearcoatRoughness: 0.14,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      disposables.push(geo, mat);
    } else if (rockType === 'phyllite') {
      // Wavy satiny silvery-green foliated slab
      const geo = new THREE.BoxGeometry(1.48, 0.62, 1.1, 18, 6, 14);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const ripple = Math.sin(v.x * 5.2 + v.z * 1.5) * 0.075;
        const edgeNoise = pseudoNoise(v.x, v.y, v.z, 11.4) * 0.04;
        v.y += ripple + edgeNoise;
        v.x += edgeNoise * 0.5;
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      const mat = new THREE.MeshPhysicalMaterial({
        color: '#6e7f76',
        roughness: 0.3,
        metalness: 0.28,
        sheen: 0.9,
        sheenRoughness: 0.25,
        sheenColor: new THREE.Color('#cbd5e1'),
        clearcoat: 0.28,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      disposables.push(geo, mat);
    } else if (rockType === 'schist') {
      // Flaky sparkling micaceous body with flush embedded garnet porphyroblasts
      const bodyGeo = new THREE.IcosahedronGeometry(0.86, 3);
      const pos = bodyGeo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.multiply(new THREE.Vector3(1.18, 0.68, 0.96));
        const flakeRidge = Math.sin(v.y * 18.0 + v.x * 2.5) * 0.04;
        v.multiplyScalar(1 + pseudoNoise(v.x * 1.4, v.y * 1.8, v.z * 1.4, 42.1) * 0.1 + flakeRidge);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      bodyGeo.computeVertexNormals();

      const bodyMat = new THREE.MeshPhysicalMaterial({
        color: '#525b66',
        roughness: 0.34,
        metalness: 0.36,
        sheen: 0.75,
        sheenColor: new THREE.Color('#e2e8f0'),
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(bodyMesh);
      disposables.push(bodyGeo, bodyMat);

      const garnetGeo = new THREE.DodecahedronGeometry(0.14, 0);
      const garnetMat = new THREE.MeshPhysicalMaterial({
        color: '#881337',
        roughness: 0.2,
        metalness: 0.08,
        clearcoat: 0.8,
      });
      disposables.push(garnetGeo, garnetMat);

      const garnetSpots = [
        [0.42, 0.36, 0.44],
        [-0.36, 0.42, 0.22],
        [0.12, -0.34, 0.56],
        [-0.48, -0.18, -0.44],
        [0.48, 0.12, -0.42],
      ];
      garnetSpots.forEach(([gx, gy, gz]) => {
        const gMesh = new THREE.Mesh(garnetGeo, garnetMat);
        gMesh.position.set(gx, gy, gz);
        gMesh.rotation.set(gx * 2, gy * 3, gz);
        group.add(gMesh);
      });
    } else if (rockType === 'gneiss') {
      // High-grade banded gneiss with alternating light/dark layers and augen lenses
      const tex = createGneissBandTexture();
      const geo = new THREE.IcosahedronGeometry(0.86, 3);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.multiply(new THREE.Vector3(1.16, 0.88, 0.92));
        v.multiplyScalar(1 + pseudoNoise(v.x, v.y, v.z, 7.9) * 0.11);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();

      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.48,
        metalness: 0.08,
      });
      const mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);
      disposables.push(tex, geo, mat);
    } else {
      const slateMat = new THREE.MeshStandardMaterial({
        color: '#3f4959',
        roughness: 0.58,
        metalness: 0.16,
      });
      const edgeMat = new THREE.MeshStandardMaterial({
        color: '#526074',
        roughness: 0.48,
        metalness: 0.2,
      });
      disposables.push(slateMat, edgeMat);

      const layers = [
        { w: 1.45, h: 0.18, d: 1.15, x: 0.0, y: -0.34, z: 0.0, ry: 0.05 },
        { w: 1.38, h: 0.17, d: 1.08, x: -0.05, y: -0.14, z: 0.03, ry: -0.04 },
        { w: 1.3, h: 0.16, d: 1.02, x: 0.04, y: 0.05, z: -0.02, ry: 0.08 },
        { w: 1.15, h: 0.15, d: 0.92, x: -0.02, y: 0.23, z: 0.02, ry: -0.06 },
        { w: 0.92, h: 0.13, d: 0.78, x: 0.06, y: 0.39, z: -0.03, ry: 0.12 },
      ];
      layers.forEach((l, idx) => {
        const g = new THREE.BoxGeometry(l.w, l.h, l.d);
        const m = new THREE.Mesh(g, idx % 2 === 0 ? slateMat : edgeMat);
        m.position.set(l.x, l.y, l.z);
        m.rotation.y = l.ry;
        group.add(m);
        disposables.push(g);
      });
    }

    group.rotation.x = 0.18;
    scene.add(group);

    let rafId = 0;
    let disposed = false;
    let last = performance.now();

    const renderOnce = () => {
      renderer.render(scene, camera);
    };

    const tick = (now: number) => {
      if (disposed) return;
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (!reducedMotion) {
        group.rotation.y += dt * 0.75;
      }

      renderOnce();
      if (isSoftwareGl) {
        rafId = window.setTimeout(() => tick(performance.now()), 90);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    };

    if (reducedMotion) {
      renderOnce();
    } else if (isSoftwareGl) {
      renderOnce();
      rafId = window.setTimeout(() => tick(performance.now()), 90);
    } else {
      rafId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(rafId);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, [rockType, size]);

  const fallbackFill =
    rockType === 'marble'
      ? '#e2e8f0'
      : rockType === 'quartzite'
        ? '#94a3b8'
        : rockType === 'phyllite'
          ? '#6e7f76'
          : rockType === 'schist'
            ? '#64748b'
            : rockType === 'gneiss'
              ? '#cbd5e1'
              : '#475569';

  return (
    <div
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-label={label || `${rockType} 3D model`}
      title={label || `${rockType} 3D specimen`}
    >
      {!fallback ? (
        <div ref={containerRef} style={{ width: size, height: size }} />
      ) : (
        <svg viewBox="0 0 80 80" className="w-14 h-14">
          <polygon
            points="40,10 66,24 62,56 38,68 16,54 18,24"
            fill={fallbackFill}
            stroke="#cbd5e1"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </div>
  );
};
