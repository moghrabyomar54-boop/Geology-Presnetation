import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  FlaskConical,
  Flame,
  Hammer,
  Layers,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import type { RockSpec } from '../data/presentationData';
import { buildDetailedRockModel, type BuiltRockRig, type MineralHotspot } from '../three/buildRockModels';

interface ThreeRockViewportProps {
  rock: RockSpec;
}

// Pre-allocated math helpers outside render loop (zero GC)
const _v1 = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3(1, 1, 1);

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

export const ThreeRockViewport: React.FC<ThreeRockViewportProps> = ({ rock }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const [autoRotate, setAutoRotate] = useState(true);
  const [textureMode, setTextureMode] = useState<'procedural' | 'photo'>('procedural');
  const [explodeAmount, setExplodeAmount] = useState(0);
  const [specialActive, setSpecialActive] = useState(false);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<MineralHotspot | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [webglError, setWebglError] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);

  // Refs synced to animation loop so React UI state never tears down WebGL
  const stateRef = useRef({
    autoRotate: true,
    explodeTarget: 0,
    explodeCurrent: 0,
    specialActive: false,
    textureMode: 'procedural' as 'procedural' | 'photo',
    resetCameraRequested: false,
  });

  stateRef.current.autoRotate = autoRotate;
  stateRef.current.explodeTarget = explodeAmount;
  stateRef.current.specialActive = specialActive;
  stateRef.current.textureMode = textureMode;

  const rigRef = useRef<BuiltRockRig | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Reset UI toggles smoothly when switching rocks
  useEffect(() => {
    setSpecialActive(false);
    setExplodeAmount(0);
    setSelectedHotspot(null);
    setHoveredLabel(null);
    setPhotoReady(false);
    setTextureMode('procedural');
  }, [rock.id]);

  // Update core material map when textureMode toggles
  useEffect(() => {
    const rig = rigRef.current;
    if (!rig) return;
    if (textureMode === 'photo' && rig.photoTexture) {
      rig.coreMaterial.map = rig.photoTexture;
      rig.coreMaterial.needsUpdate = true;
    } else {
      rig.coreMaterial.map = rig.proceduralTextures.map;
      rig.coreMaterial.needsUpdate = true;
    }
  }, [textureMode, photoReady]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
    } catch {
      setWebglError(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 520;

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    scene.environmentIntensity = 0.28;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(2.9, 1.85, 3.65);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.0;
    controls.maxDistance = 7.5;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.target.set(0, 0.05, 0);
    controlsRef.current = controls;

    // Dramatic Sculptural 3-Point Lighting Rig for Deeper Shadows
    const hemiLight = new THREE.HemisphereLight('#7c93ad', '#0a0c10', 0.32);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#fff2de', 2.25);
    keyLight.position.set(4.8, 5.4, 3.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 20;
    const d = 2.8;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.normalBias = 0.015;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#64748b', 0.8);
    rimLight.position.set(-4.5, 2.2, -4.0);
    scene.add(rimLight);

    // Grounding radial contact shadow & dark museum pedestal disc
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 124);
    grad.addColorStop(0, 'rgba(0,0,0,0.92)');
    grad.addColorStop(0.55, 'rgba(0,0,0,0.48)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(4.4, 4.4),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.16;
    scene.add(shadowPlane);

    const plinthGeo = new THREE.CylinderGeometry(1.75, 1.85, 0.06, 48);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: '#0c0e13',
      roughness: 0.58,
      metalness: 0.3,
    });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = -1.2;
    plinth.receiveShadow = true;
    scene.add(plinth);

    // Build detailed multi-part 3D Rock Rig
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    const rig = buildDetailedRockModel(rock.id, rock.imagePath, maxAnisotropy, isSoftwareGl, () => {
      setPhotoReady(true);
    });
    rigRef.current = rig;
    scene.add(rig.group);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycasting for mineral hotspots
    const raycaster = new THREE.Raycaster();
    raycaster.layers.set(1);
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };
    let lastHoverTime = 0;

    const getHotspotHit = (clientX: number, clientY: number): MineralHotspot | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(rig.group.children, true);
      for (const hit of hits) {
        let obj: THREE.Object3D | null = hit.object;
        while (obj) {
          if (obj.userData.hotspotId) {
            return rig.hotspots.find((h) => h.id === obj!.userData.hotspotId) || null;
          }
          obj = obj.parent;
        }
      }
      return null;
    };

    const onPointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Ignore orbit drag
      const hit = getHotspotHit(e.clientX, e.clientY);
      if (hit) {
        setSelectedHotspot(hit);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverTime < 60) return;
      lastHoverTime = now;
      const hit = getHotspotHit(e.clientX, e.clientY);
      renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
      setHoveredLabel(hit ? `${hit.label}${hit.formula ? ` (${hit.formula})` : ''}` : null);
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation loop with software WebGL pacing guard
    let frameId = 0;
    let disposed = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const s = stateRef.current;

      // Smoothly rotate specimen if enabled
      if (s.autoRotate) {
        rig.group.rotation.y += delta * 0.28;
      }

      // Smoothly damp exploded mineral parts
      s.explodeCurrent = THREE.MathUtils.damp(s.explodeCurrent, s.explodeTarget, 6, delta);
      rig.explodableParts.forEach((p) => {
        _v1.copy(p.explodeVec).multiplyScalar(s.explodeCurrent);
        p.obj.position.copy(p.basePos).add(_v1);
      });

      // Camera reset smooth transition
      if (s.resetCameraRequested) {
        camera.position.lerp(new THREE.Vector3(2.9, 1.85, 3.65), 0.12);
        controls.target.lerp(new THREE.Vector3(0, 0.05, 0), 0.12);
        if (camera.position.distanceTo(new THREE.Vector3(2.9, 1.85, 3.65)) < 0.04) {
          s.resetCameraRequested = false;
        }
      }

      // Rock-specific live interactions
      if (rig.bubblesInstanced && rig.bubbleStates) {
        rig.bubblesInstanced.visible = s.specialActive;
        if (s.specialActive) {
          rig.bubbleStates.forEach((b, i) => {
            b.life += delta * b.speed;
            if (b.life > b.maxLife) b.life = 0;
            const y = 0.65 + (b.life / b.maxLife) * 1.15;
            const wobbleX = Math.sin(now * 0.005 + i) * 0.04;
            _v1.set(b.pos.x + wobbleX, y, b.pos.z);
            const sc = b.scale * (1 - (b.life / b.maxLife) * 0.4);
            _scale.setScalar(sc);
            _mat4.compose(_v1, _quat, _scale);
            rig.bubblesInstanced!.setMatrixAt(i, _mat4);
          });
          rig.bubblesInstanced.instanceMatrix.needsUpdate = true;
        }
      }

      if (rig.glassPlateGroup) {
        rig.glassPlateGroup.visible = s.specialActive;
        if (s.specialActive) {
          rig.glassPlateGroup.position.y = 1.16 + Math.sin(now * 0.003) * 0.04;
        }
      }

      if (rig.thermalHaloMesh) {
        const mat = rig.thermalHaloMesh.material as THREE.MeshBasicMaterial;
        const targetOp = s.specialActive ? 0.65 + Math.sin(now * 0.004) * 0.18 : 0;
        mat.opacity = THREE.MathUtils.damp(mat.opacity, targetOp, 6, delta);
        rig.thermalHaloMesh.visible = mat.opacity > 0.01;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) afterDraw(tick);
      else frameId = requestAnimationFrame(tick);
    }

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      controls.dispose();
      rig.dispose();
      shadowPlane.geometry.dispose();
      (shadowPlane.material as THREE.Material).dispose();
      shadowTex.dispose();
      plinthGeo.dispose();
      plinthMat.dispose();
      envTexture.dispose();
      renderer.dispose();
      rigRef.current = null;
    };
  }, [rock.id, rock.imagePath]);

  const handleResetView = () => {
    stateRef.current.resetCameraRequested = true;
    setExplodeAmount(0);
    setSelectedHotspot(null);
  };

  const specialButtonConfig =
    rock.id === 'marble'
      ? { label: specialActive ? 'Stop HCl Test' : 'Run HCl Acid Test', icon: FlaskConical }
      : rock.id === 'quartzite'
      ? { label: specialActive ? 'Hide Glass Plate' : 'Mohs 7 Scratch Test', icon: Hammer }
      : { label: specialActive ? 'Hide Heat Aureole' : 'Show Magma Heat', icon: Flame };

  const SpecialIcon = specialButtonConfig.icon;

  return (
    <div className="relative w-full h-[440px] lg:h-[510px] overflow-hidden">
      {/* Dedicated WebGL Mount Container floating directly in the void */}
      {!webglError ? (
        <div ref={mountRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
          <img
            src={rock.imagePath}
            alt={rock.imageCaption}
            referrerPolicy="no-referrer"
            className="max-h-72 rounded-lg object-contain border border-white/15 mb-4"
          />
          <p className="text-base text-slate-300">{rock.imageCaption}</p>
        </div>
      )}

      {/* Top-Left Clean Unboxed Specimen Caption + Hover Readout */}
      <div className="pointer-events-none absolute top-2 left-2 right-2 flex items-start justify-between gap-4 z-10">
        <div>
          <p className="text-sm font-mono text-slate-400 grey-aura-text">
            Interactive 3D Specimen · Drag to Orbit · Scroll to Zoom
          </p>
          {hoveredLabel && (
            <p className="mt-1.5 text-sm font-medium text-white bg-black/75 px-3 py-1 rounded border border-white/15 inline-block">
              Mineral: {hoveredLabel}
            </p>
          )}
        </div>
      </div>

      {/* Selected Mineral Hotspot Callout */}
      {selectedHotspot && (
        <div className="absolute top-14 left-2 z-10 max-w-sm rounded-xl bg-[#0b0d13]/95 border border-white/15 p-4 shadow-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-mono text-slate-400">
                {selectedHotspot.formula || 'Mineral Component'}
              </p>
              <h4 className="text-lg font-semibold text-white mt-0.5">{selectedHotspot.label}</h4>
            </div>
            <button
              type="button"
              onClick={() => setSelectedHotspot(null)}
              className="text-sm text-slate-400 hover:text-white px-2 py-0.5 cursor-pointer"
            >
              Close
            </button>
          </div>
          <p className="text-base text-slate-200 mt-2 leading-relaxed">{selectedHotspot.detail}</p>
        </div>
      )}

      {/* Active Experiment Status Banner (e.g. HCl Reaction Equation) */}
      {specialActive && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 z-10 px-5 py-2.5 rounded-lg bg-[#0b0d13]/95 border border-white/15 text-center max-w-[92%]">
          {rock.id === 'marble' && (
            <p className="text-sm sm:text-base font-mono text-slate-100">
              Effervescence Active: <span className="text-sky-300">CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑</span>
            </p>
          )}
          {rock.id === 'quartzite' && (
            <p className="text-sm sm:text-base font-mono text-slate-100">
              Mohs Hardness 7 vs. Glass Plate (5.5): <span className="text-emerald-300">Quartzite Scratches Glass</span>
            </p>
          )}
          {rock.id === 'hornfels' && (
            <p className="text-sm sm:text-base font-mono text-slate-100">
              Contact Aureole: <span className="text-amber-300">Magmatic Heat Recrystallizes Protolith</span>
            </p>
          )}
        </div>
      )}

      {/* Collapsible Bottom Control Dock (Larger Horizon Fonts) */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center w-[98%] max-w-[820px] pointer-events-none">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="pointer-events-auto mb-1.5 flex items-center gap-2 px-4 py-1.5 rounded-t-lg bg-[#0d1017]/95 border border-b-0 border-white/15 text-sm font-medium text-slate-200 hover:text-white cursor-pointer"
        >
          {dockCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{dockCollapsed ? 'Show Controls' : 'Hide Controls'}</span>
        </button>

        {!dockCollapsed && (
          <div className="pointer-events-auto w-full rounded-xl bg-[#0d1017]/95 border border-white/15 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoRotate((r) => !r)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/12 text-sm sm:text-base font-medium text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{autoRotate ? 'Pause' : 'Orbit'}</span>
              </button>

              <button
                type="button"
                onClick={handleResetView}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/5 hover:bg-white/12 text-sm sm:text-base font-medium text-slate-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Explode Mineral Layers Slider */}
            <label className="flex items-center gap-2.5 text-sm sm:text-base font-medium text-slate-200">
              <Layers className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="whitespace-nowrap">Minerals</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={explodeAmount}
                onChange={(e) => setExplodeAmount(parseFloat(e.target.value))}
                className="w-24 sm:w-28 accent-slate-200 cursor-pointer"
              />
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setTextureMode((m) => (m === 'procedural' && photoReady ? 'photo' : 'procedural'))
                }
                disabled={!photoReady}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  textureMode === 'photo'
                    ? 'bg-slate-100 text-slate-950 font-semibold'
                    : 'bg-white/5 hover:bg-white/12 text-slate-100'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{textureMode === 'photo' ? 'Photo Wrap' : '3D Minerals'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSpecialActive((s) => !s)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  specialActive
                    ? 'bg-slate-100 text-slate-950 font-semibold'
                    : 'bg-white/10 hover:bg-white/18 text-white'
                }`}
              >
                <SpecialIcon className="w-4 h-4" />
                <span>{specialButtonConfig.label}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
