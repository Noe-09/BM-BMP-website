import {
  BufferGeometry,
  Color,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  Vector3,
  type Material,
} from "three";

import {
  livingMatterFragmentShader,
  livingMatterVertexShader,
  refractionFilmFragmentShader,
  refractionFilmVertexShader,
} from "./livingMatterShader";

export type LivingMatterParams = {
  progress: number;
  tension: number;
  aperture: number;
  pointer: Vector2;
  eventDarkness: number;
  reducedMotion: boolean;
  identityLeak: number;
};

export class LivingMatterSystem {
  readonly group: Group;
  private readonly materials: Material[] = [];
  private readonly geometries: BufferGeometry[] = [];

  private mainMaterial!: ShaderMaterial;
  private filmMaterial!: ShaderMaterial;
  private filamentMaterial!: LineBasicMaterial;
  private filamentGeometry!: BufferGeometry;

  private pointerTarget = new Vector2(0, 0);
  private pointerCurrent = new Vector2(0, 0);
  private tensionCurrent = 0;
  private apertureCurrent = 0;
  private darknessCurrent = 0;

  constructor() {
    this.group = new Group();
    this.initMaterials();
    this.initMeshes();
    this.initFilaments();
  }

  private ownMaterial<T extends Material>(material: T): T {
    this.materials.push(material);
    return material;
  }

  private ownGeometry<T extends BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private initMaterials() {
    const baseColor = new Color(0xf5f3ee);
    const pearlColor = new Color(0xe2ded4);
    const graphiteColor = new Color(0x181a19);
    const refractColor = new Color(0x9ca7aa);

    this.mainMaterial = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: livingMatterVertexShader,
        fragmentShader: livingMatterFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uTension: { value: 0 },
          uAperture: { value: 0 },
          uEventDarkness: { value: 0 },
          uReducedMotion: { value: 0 },
          uIdentityLeak: { value: 0 },
          uPointer: { value: new Vector2(0, 0) },
          uColorBase: { value: new Vector3(baseColor.r, baseColor.g, baseColor.b) },
          uColorPearl: { value: new Vector3(pearlColor.r, pearlColor.g, pearlColor.b) },
          uColorGraphite: { value: new Vector3(graphiteColor.r, graphiteColor.g, graphiteColor.b) },
          uColorRefract: { value: new Vector3(refractColor.r, refractColor.g, refractColor.b) },
        },
        transparent: true,
        side: DoubleSide,
        depthWrite: true,
      }),
    );

    this.filmMaterial = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: refractionFilmVertexShader,
        fragmentShader: refractionFilmFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uAperture: { value: 0 },
          uEventDarkness: { value: 0 },
          uColorBase: { value: new Vector3(baseColor.r, baseColor.g, baseColor.b) },
          uColorPearl: { value: new Vector3(pearlColor.r, pearlColor.g, pearlColor.b) },
          uColorGraphite: { value: new Vector3(graphiteColor.r, graphiteColor.g, graphiteColor.b) },
        },
        transparent: true,
        side: DoubleSide,
        depthWrite: false,
      }),
    );

    this.filamentMaterial = this.ownMaterial(
      new LineBasicMaterial({
        color: 0x9ca7aa,
        transparent: true,
        opacity: 0.25,
      }),
    );
  }

  private initMeshes() {
    // 1. Primary Topological Manifold Assembly
    // Nested procedural cylinder lattices that create continuous 3D fold geometry along the camera traversal axis
    const primaryGeometry = this.ownGeometry(
      new CylinderGeometry(3.6, 4.4, 28, 64, 96, true),
    );
    const primaryMesh = new Mesh(primaryGeometry, this.mainMaterial);
    primaryMesh.rotation.x = Math.PI / 2;
    primaryMesh.position.set(0, 0, -5);
    this.group.add(primaryMesh);

    // 2. Inner Shear-Fold Manifold
    const innerGeometry = this.ownGeometry(
      new CylinderGeometry(2.1, 2.8, 22, 48, 64, true),
    );
    const innerMesh = new Mesh(innerGeometry, this.mainMaterial);
    innerMesh.rotation.x = Math.PI / 2;
    innerMesh.rotation.y = Math.PI / 4;
    innerMesh.position.set(0, 0, -4);
    this.group.add(innerMesh);

    // 3. Cross-Cutting Hyperbolic Sheets (Translucent mineral diaphragms)
    for (let i = 0; i < 5; i++) {
      const planeGeo = this.ownGeometry(new PlaneGeometry(7.5, 7.5, 32, 32));
      const planeMesh = new Mesh(planeGeo, this.mainMaterial);
      planeMesh.position.set(
        Math.sin(i * 1.4) * 0.4,
        Math.cos(i * 1.1) * 0.3,
        -18 + i * 5.5,
      );
      planeMesh.rotation.z = i * 0.65;
      this.group.add(planeMesh);
    }

    // 4. Refraction Transmission Plies
    const filmGeo = this.ownGeometry(
      new CylinderGeometry(3.0, 3.8, 24, 32, 48, true),
    );
    const filmMesh = new Mesh(filmGeo, this.filmMaterial);
    filmMesh.rotation.x = Math.PI / 2;
    filmMesh.position.set(0, 0, -5);
    this.group.add(filmMesh);
  }

  private initFilaments() {
    // Tension filaments bridging stress nodes
    const count = 48;
    const positions = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      const angle = (i / count) * Math.PI * 2;
      const r1 = 2.4 + Math.sin(i * 2.1) * 0.6;
      const r2 = 3.6 + Math.cos(i * 1.7) * 0.8;
      const z1 = -16 + (i / count) * 22;
      const z2 = z1 + (Math.random() - 0.5) * 4;

      positions[idx] = Math.cos(angle) * r1;
      positions[idx + 1] = Math.sin(angle) * r1;
      positions[idx + 2] = z1;

      positions[idx + 3] = Math.cos(angle + 0.8) * r2;
      positions[idx + 4] = Math.sin(angle + 0.8) * r2;
      positions[idx + 5] = z2;
    }

    this.filamentGeometry = this.ownGeometry(new BufferGeometry());
    this.filamentGeometry.setAttribute(
      "position",
      new Float32BufferAttribute(positions, 3),
    );

    const filaments = new LineSegments(
      this.filamentGeometry,
      this.filamentMaterial,
    );
    this.group.add(filaments);
  }

  setPointer(x: number, y: number) {
    this.pointerTarget.set(x, y);
  }

  tick(deltaSeconds: number, params: LivingMatterParams, totalTime: number) {
    // High-inertia memory damping for pointer tension (viscous response)
    const pointerDampSpeed = params.reducedMotion ? 12 : 2.8;
    this.pointerCurrent.x +=
      (this.pointerTarget.x - this.pointerCurrent.x) *
      Math.min(1, deltaSeconds * pointerDampSpeed);
    this.pointerCurrent.y +=
      (this.pointerTarget.y - this.pointerCurrent.y) *
      Math.min(1, deltaSeconds * pointerDampSpeed);

    // Smooth internal tension
    this.tensionCurrent +=
      (params.tension - this.tensionCurrent) *
      Math.min(1, deltaSeconds * 4.5);

    this.apertureCurrent +=
      (params.aperture - this.apertureCurrent) *
      Math.min(1, deltaSeconds * 5.0);

    this.darknessCurrent +=
      (params.eventDarkness - this.darknessCurrent) *
      Math.min(1, deltaSeconds * 6.0);

    // Update main shader uniforms
    const u = this.mainMaterial.uniforms;
    u.uTime.value = totalTime;
    u.uProgress.value = params.progress;
    u.uTension.value = this.tensionCurrent;
    u.uAperture.value = this.apertureCurrent;
    u.uEventDarkness.value = this.darknessCurrent;
    u.uReducedMotion.value = params.reducedMotion ? 1 : 0;
    u.uIdentityLeak.value = params.identityLeak;
    u.uPointer.value.copy(this.pointerCurrent);

    // Update film shader uniforms
    const fu = this.filmMaterial.uniforms;
    fu.uTime.value = totalTime;
    fu.uProgress.value = params.progress;
    fu.uAperture.value = this.apertureCurrent;
    fu.uEventDarkness.value = this.darknessCurrent;

    // Fade filaments based on progress
    const filamentAlpha =
      Math.sin(params.progress * Math.PI) *
      0.35 *
      (1 - this.darknessCurrent * 0.5);
    this.filamentMaterial.opacity = Math.max(0, filamentAlpha);

    // Subtle breathing rotation of the entire field
    if (!params.reducedMotion) {
      this.group.rotation.z =
        Math.sin(totalTime * 0.15) * 0.05 + this.pointerCurrent.x * 0.04;
    }
  }

  dispose() {
    for (const geometry of this.geometries) geometry.dispose();
    for (const material of this.materials) material.dispose();
  }
}
