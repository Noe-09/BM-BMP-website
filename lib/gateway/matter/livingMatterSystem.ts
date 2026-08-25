import {
  BufferGeometry,
  Color,
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
  selectionBias: number;
  instability: number;
  singularityX: number;
};

export class LivingMatterSystem {
  readonly group: Group;
  private readonly materials: Material[] = [];
  private readonly geometries: BufferGeometry[] = [];

  private mainMaterial!: ShaderMaterial;
  private filmMaterial!: ShaderMaterial;
  private filamentMaterial!: LineBasicMaterial;
  private filamentGeometry!: BufferGeometry;

  private foregroundBlade1!: Mesh;
  private foregroundBlade2!: Mesh;
  private visualsStructureGroup = new Group();
  private technicalStructureGroup = new Group();
  private tensionSeamMesh!: Mesh;

  private pointerTarget = new Vector2(0, 0);
  private pointerCurrent = new Vector2(0, 0);
  private tensionCurrent = 0;
  private apertureCurrent = 0;
  private darknessCurrent = 0;
  private biasCurrent = 0;
  private instabilityCurrent = 0;
  private singularityXCurrent = 0;

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
    const graphiteColor = new Color(0x141615);
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
          uSelectionBias: { value: 0 },
          uInstability: { value: 0 },
          uSingularityX: { value: 0 },
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
        color: 0x8f999c,
        transparent: true,
        opacity: 0.3,
      }),
    );
  }

  private initMeshes() {
    // 1. FOREGROUND MACRO BLADES (Occupies 20–35% of frame when close to camera)
    const blade1Geo = this.ownGeometry(new PlaneGeometry(6.5, 14, 48, 64));
    this.foregroundBlade1 = new Mesh(blade1Geo, this.mainMaterial);
    this.foregroundBlade1.position.set(-1.8, 1.2, 5.0);
    this.foregroundBlade1.rotation.set(0.2, 0.45, -0.48);
    this.group.add(this.foregroundBlade1);

    const blade2Geo = this.ownGeometry(new PlaneGeometry(7.2, 16, 48, 64));
    this.foregroundBlade2 = new Mesh(blade2Geo, this.mainMaterial);
    this.foregroundBlade2.position.set(1.9, -1.4, -0.5);
    this.foregroundBlade2.rotation.set(-0.25, -0.38, 0.52);
    this.group.add(this.foregroundBlade2);

    // 2. ASYMMETRIC TOPOLOGICAL MANIFOLD SHEETS
    const sheetCount = 6;
    for (let i = 0; i < sheetCount; i++) {
      const w = 9.0 + (i % 3) * 2.5;
      const h = 12.0 + (i % 2) * 3.0;
      const geo = this.ownGeometry(new PlaneGeometry(w, h, 40, 48));
      const mesh = new Mesh(geo, this.mainMaterial);

      const zPos = 8 - i * 5.2;
      const xOffset = Math.sin(i * 1.6) * 1.5 + (i % 2 === 0 ? -0.8 : 0.9);
      const yOffset = Math.cos(i * 1.3) * 1.1 + (i % 2 === 0 ? 0.6 : -0.7);

      mesh.position.set(xOffset, yOffset, zPos);
      mesh.rotation.set(
        0.35 * Math.sin(i * 1.1),
        0.4 * Math.cos(i * 0.9),
        0.65 * (i % 2 === 0 ? -1 : 1) * (0.8 + i * 0.15),
      );
      this.group.add(mesh);
    }

    // 3. CENTRAL HERO MANIFOLD (Fills the viewport center with sculptural living matter topology)
    const heroManifoldGeo = this.ownGeometry(new PlaneGeometry(14, 20, 56, 56));
    const heroManifold = new Mesh(heroManifoldGeo, this.mainMaterial);
    heroManifold.position.set(0.2, 0.1, -17.2);
    heroManifold.rotation.set(0.08, 0.22, -0.32);
    this.group.add(heroManifold);

    // 4. TENSION SEAM MESH (The dynamic physical meridian connecting the two attractor behaviors)
    const seamGeo = this.ownGeometry(new PlaneGeometry(4.5, 24, 36, 64));
    this.tensionSeamMesh = new Mesh(seamGeo, this.mainMaterial);
    this.tensionSeamMesh.position.set(0, 0, -17.5);
    this.tensionSeamMesh.rotation.set(0.05, 0.18, -0.15);
    this.group.add(this.tensionSeamMesh);

    // 5. REFRACTION TRANSMISSION PLIES
    for (let j = 0; j < 3; j++) {
      const filmGeo = this.ownGeometry(new PlaneGeometry(11, 15, 32, 32));
      const filmMesh = new Mesh(filmGeo, this.filmMaterial);
      filmMesh.position.set(
        Math.cos(j * 2.1) * 0.9,
        Math.sin(j * 1.7) * 0.8,
        4 - j * 8.0,
      );
      filmMesh.rotation.set(0.15, j * 0.5, j * 0.7 - 0.5);
      this.group.add(filmMesh);
    }

    // 6. TWO-BEHAVIOR FIELD EMBODIMENT
    // Visuals Structure (Upper-Left Attractor): Broad, undulating, relaxed mineral wave
    const visualsGeo = this.ownGeometry(new PlaneGeometry(12, 16, 48, 48));
    const visualsMesh = new Mesh(visualsGeo, this.mainMaterial);
    visualsMesh.position.set(-3.8, 1.8, -17.8);
    visualsMesh.rotation.set(0.14, 0.35, -0.22);
    this.visualsStructureGroup.add(visualsMesh);
    this.group.add(this.visualsStructureGroup);

    // Technical Structure (Lower-Right Attractor): Precise, aligned, faceted crystalline lattice
    const techGeo = this.ownGeometry(new PlaneGeometry(12, 16, 48, 48));
    const techMesh = new Mesh(techGeo, this.mainMaterial);
    techMesh.position.set(3.8, -1.8, -17.8);
    techMesh.rotation.set(-0.14, -0.35, 0.22);
    this.technicalStructureGroup.add(techMesh);
    this.group.add(this.technicalStructureGroup);
  }

  private initFilaments() {
    const count = 54;
    const positions = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const idx = i * 6;
      const t = i / count;
      const z1 = 8 - t * 24;
      const z2 = z1 - 2.5 + (Math.sin(i * 3.7) * 1.5);

      const x1 = Math.sin(i * 2.3) * 3.2 - 0.6;
      const y1 = Math.cos(i * 1.9) * 2.8 + 0.4;

      const x2 = -x1 * 0.7 + Math.cos(i * 3.1) * 1.8;
      const y2 = -y1 * 0.6 + Math.sin(i * 2.7) * 1.6;

      positions[idx] = x1;
      positions[idx + 1] = y1;
      positions[idx + 2] = z1;

      positions[idx + 3] = x2;
      positions[idx + 4] = y2;
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
    const pointerDampSpeed = params.reducedMotion ? 12 : 2.5;
    this.pointerCurrent.x +=
      (this.pointerTarget.x - this.pointerCurrent.x) *
      Math.min(1, deltaSeconds * pointerDampSpeed);
    this.pointerCurrent.y +=
      (this.pointerTarget.y - this.pointerCurrent.y) *
      Math.min(1, deltaSeconds * pointerDampSpeed);

    this.tensionCurrent +=
      (params.tension - this.tensionCurrent) *
      Math.min(1, deltaSeconds * 4.2);

    this.apertureCurrent +=
      (params.aperture - this.apertureCurrent) *
      Math.min(1, deltaSeconds * 4.8);

    this.darknessCurrent +=
      (params.eventDarkness - this.darknessCurrent) *
      Math.min(1, deltaSeconds * 5.5);

    this.biasCurrent +=
      (params.selectionBias - this.biasCurrent) *
      Math.min(1, deltaSeconds * 6.0);

    this.instabilityCurrent +=
      (params.instability - this.instabilityCurrent) *
      Math.min(1, deltaSeconds * 8.0);

    this.singularityXCurrent +=
      (params.singularityX - this.singularityXCurrent) *
      Math.min(1, deltaSeconds * 6.5);

    // Update main shader uniforms
    const u = this.mainMaterial.uniforms;
    u.uTime.value = totalTime;
    u.uProgress.value = params.progress;
    u.uTension.value = this.tensionCurrent;
    u.uAperture.value = this.apertureCurrent;
    u.uEventDarkness.value = this.darknessCurrent;
    u.uReducedMotion.value = params.reducedMotion ? 1 : 0;
    u.uIdentityLeak.value = params.identityLeak;
    u.uSelectionBias.value = this.biasCurrent;
    u.uInstability.value = this.instabilityCurrent;
    u.uSingularityX.value = this.singularityXCurrent;
    u.uPointer.value.copy(this.pointerCurrent);

    // Update film shader uniforms
    const fu = this.filmMaterial.uniforms;
    fu.uTime.value = totalTime;
    fu.uProgress.value = params.progress;
    fu.uAperture.value = this.apertureCurrent;
    fu.uEventDarkness.value = this.darknessCurrent;

    // Tension Seam dynamically tracks the BM Singularity position
    this.tensionSeamMesh.position.x = this.singularityXCurrent;
    this.tensionSeamMesh.rotation.y = this.biasCurrent * 0.25;

    // Macro-blade spatial dynamics
    if (!params.reducedMotion) {
      const p = params.progress;
      this.foregroundBlade1.rotation.z = -0.48 + Math.sin(totalTime * 0.2) * 0.04 - p * 0.3;
      this.foregroundBlade2.rotation.z = 0.52 - Math.cos(totalTime * 0.25) * 0.04 + p * 0.25;

      // Two-world attractor response:
      if (params.progress > 0.8) {
        // Visuals (Upper-Left): Unfolds and expands negative space on active
        const visualActive = Math.max(0, -this.biasCurrent);
        this.visualsStructureGroup.position.x = -3.8 - visualActive * 1.4;
        this.visualsStructureGroup.scale.setScalar(1.0 + visualActive * 0.18);
        this.visualsStructureGroup.rotation.y = 0.35 + Math.sin(totalTime * 0.25) * 0.05 - visualActive * 0.15;

        // Technical (Lower-Right): Aligns and tensions crystalline structure on active
        const techActive = Math.max(0, this.biasCurrent);
        this.technicalStructureGroup.position.x = 3.8 + techActive * 1.4;
        this.technicalStructureGroup.scale.setScalar(1.0 - techActive * 0.08);
        this.technicalStructureGroup.rotation.y = -0.35 + techActive * 0.2;
      }
    }

    const filamentAlpha =
      Math.sin(params.progress * Math.PI) *
      0.38 *
      (1 - this.darknessCurrent * 0.4);
    this.filamentMaterial.opacity = Math.max(0, filamentAlpha);
  }

  dispose() {
    for (const geometry of this.geometries) geometry.dispose();
    for (const material of this.materials) material.dispose();
  }
}
