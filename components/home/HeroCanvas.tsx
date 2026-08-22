"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { clamp01, damp, getSceneProgress, MOTION } from "@/lib/motion/physics";

type HeroCanvasProps = {
  allowAmbientMotion: boolean;
  allowPointerDepth: boolean;
  onReady: () => void;
  onUnavailable: () => void;
};

type RibbonOptions = {
  phase: number;
  width: number;
  direction: number;
};

function createFoldedRibbon({ phase, width, direction }: RibbonOptions) {
  const segments = 112;
  const crossSegments = 8;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let segment = 0; segment <= segments; segment += 1) {
    const t = segment / segments;
    const angle = t * Math.PI * 2 + phase;
    const x = (t - 0.5) * 8.2;
    const y = Math.sin(angle) * 1.08 + Math.sin(angle * 2.5) * 0.18;
    const z = Math.cos(angle) * 0.82 + Math.sin(angle * 1.5) * 0.24;
    const roll = angle * 0.72 * direction + Math.sin(angle * 2) * 0.34;
    const taper = 0.72 + Math.sin(Math.PI * t) * 0.28;

    for (let cross = 0; cross <= crossSegments; cross += 1) {
      const across = cross / crossSegments - 0.5;
      const offset = across * width * taper;
      const ridge = Math.sin(cross / crossSegments * Math.PI) * 0.12;
      positions.push(
        x + ridge * Math.sin(angle),
        y + Math.cos(roll) * offset,
        z + Math.sin(roll) * offset + ridge,
      );
      uvs.push(t, cross / crossSegments);
    }
  }

  for (let segment = 0; segment < segments; segment += 1) {
    for (let cross = 0; cross < crossSegments; cross += 1) {
      const row = crossSegments + 1;
      const a = segment * row + cross;
      const b = a + row;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function createSeamCurve(phase: number) {
  const points = Array.from({ length: 96 }, (_, index) => {
    const t = index / 95;
    const angle = t * Math.PI * 2 + phase;
    return new THREE.Vector3(
      (t - 0.5) * 8.2,
      Math.sin(angle) * 1.08 + Math.sin(angle * 2.5) * 0.18,
      Math.cos(angle) * 0.82 + Math.sin(angle * 1.5) * 0.24 + 0.12,
    );
  });
  return new THREE.BufferGeometry().setFromPoints(points);
}

export function HeroCanvas({
  allowAmbientMotion,
  allowPointerDepth,
  onReady,
  onUnavailable,
}: HeroCanvasProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(onReady);
  const unavailableRef = useRef(onUnavailable);

  useEffect(() => {
    readyRef.current = onReady;
    unavailableRef.current = onUnavailable;
  }, [onReady, onUnavailable]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 13.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      unavailableRef.current();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.className = "flagship-hero__canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.rotation.set(-0.08, -0.12, -0.08);
    scene.add(group);

    const paleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd9d1c3,
      metalness: 0.48,
      roughness: 0.26,
      clearcoat: 0.8,
      clearcoatRoughness: 0.22,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.96,
    });
    const graphiteMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x242321,
      metalness: 0.72,
      roughness: 0.2,
      clearcoat: 0.66,
      clearcoatRoughness: 0.18,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const orangeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf35a36,
      metalness: 0.3,
      roughness: 0.34,
      clearcoat: 0.74,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.92,
    });

    const ribbons = [
      new THREE.Mesh(
        createFoldedRibbon({ phase: 0.1, width: 1.48, direction: 1 }),
        paleMaterial,
      ),
      new THREE.Mesh(
        createFoldedRibbon({ phase: Math.PI * 0.72, width: 1.1, direction: -1 }),
        graphiteMaterial,
      ),
      new THREE.Mesh(
        createFoldedRibbon({ phase: Math.PI * 1.33, width: 0.44, direction: 1 }),
        orangeMaterial,
      ),
    ];
    ribbons[1].position.set(0.35, -0.18, -0.32);
    ribbons[2].position.set(-0.12, 0.14, 0.58);
    ribbons.forEach((ribbon) => group.add(ribbon));

    const seamMaterial = new THREE.LineBasicMaterial({
      color: 0xf35a36,
      transparent: true,
      opacity: 0.82,
    });
    const seam = new THREE.Line(createSeamCurve(Math.PI * 1.33), seamMaterial);
    seam.position.copy(ribbons[2].position);
    group.add(seam);

    scene.add(new THREE.HemisphereLight(0xfff7e8, 0x2a2521, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.4);
    keyLight.position.set(-3.5, 5, 7);
    scene.add(keyLight);
    const warmLight = new THREE.PointLight(0xf35a36, 22, 18, 2);
    warmLight.position.set(4, -2, 5);
    scene.add(warmLight);

    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();
    let frame = 0;
    let visible = true;
    let previousTime = performance.now();
    const hero = host.closest<HTMLElement>("[data-hero-root]");

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      group.scale.setScalar(width < 700 ? 0.72 : width < 1100 ? 0.88 : 1);
      group.position.x = width < 700 ? 0.5 : 0.95;
    };

    const move = (event: PointerEvent) => {
      if (!allowPointerDepth) return;
      pointerTarget.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };

    const render = (time: number) => {
      if (!visible) return;
      const delta = Math.min(0.05, (time - previousTime) / 1000 || 1 / 60);
      previousTime = time;
      const rect = hero?.getBoundingClientRect();
      const progress = rect
        ? getSceneProgress({
            top: rect.top,
            height: rect.height,
            viewportHeight: window.innerHeight,
          })
        : 0;
      const exit = clamp01((progress - 0.48) / 0.52);

      pointerCurrent.x = damp(
        pointerCurrent.x,
        allowPointerDepth ? pointerTarget.x : 0,
        MOTION.damping.pointer,
        delta,
      );
      pointerCurrent.y = damp(
        pointerCurrent.y,
        allowPointerDepth ? pointerTarget.y : 0,
        MOTION.damping.pointer,
        delta,
      );

      const ambient = allowAmbientMotion ? Math.sin(time * 0.00034) : 0;
      group.rotation.x = -0.08 + pointerCurrent.y * 0.038 + exit * 0.2;
      group.rotation.y = -0.12 + pointerCurrent.x * 0.046 + exit * 0.42;
      group.rotation.z = -0.08 + ambient * 0.018 - exit * 0.12;
      group.position.y = -exit * 1.55 + ambient * 0.08;
      group.position.z = -exit * 1.25;

      ribbons[0].position.x = -exit * 0.72;
      ribbons[1].position.x = 0.35 + exit * 0.88;
      ribbons[2].position.y = 0.14 + exit * 0.74;
      paleMaterial.opacity = 0.96 * (1 - exit * 0.72);
      graphiteMaterial.opacity = 0.9 * (1 - exit * 0.78);
      orangeMaterial.opacity = 0.92 * (1 - exit * 0.48);
      seamMaterial.opacity = 0.82 * (1 - exit * 0.28);

      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) {
        previousTime = performance.now();
        frame = requestAnimationFrame(render);
      } else if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    visibilityObserver.observe(host);
    window.addEventListener("pointermove", move, { passive: true });

    resize();
    frame = requestAnimationFrame(render);
    readyRef.current();

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      renderer.domElement.style.visibility = "hidden";
      unavailableRef.current();
    };
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);

    return () => {
      window.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      ribbons.forEach((ribbon) => ribbon.geometry.dispose());
      seam.geometry.dispose();
      paleMaterial.dispose();
      graphiteMaterial.dispose();
      orangeMaterial.dispose();
      seamMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [allowAmbientMotion, allowPointerDepth]);

  return <div ref={hostRef} className="flagship-hero__canvas-host" />;
}
