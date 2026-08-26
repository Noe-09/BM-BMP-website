import {
  BoxGeometry,
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  Group,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector2,
  Vector3,
  type Material,
} from "three";
import {
  canopyFragmentShader,
  canopyVertexShader,
  centerSeamFragmentShader,
  centerSeamVertexShader,
  chamberWallFragmentShader,
  chamberWallVertexShader,
} from "./chamberShader";

export type ChamberEnvironmentParams = {
  progress: number;
  selectionBias: number;
  pointer: Vector2;
  reducedMotion: boolean;
  eventDarkness: number;
};

export class ChamberEnvironment {
  readonly group: Group;
  private readonly geometries: BufferGeometry[] = [];
  private readonly materials: Material[] = [];

  // Architectural Chamber Meshes
  private floorPlinthMesh!: Mesh;
  private ceilingVaultMesh!: Mesh;
  private deepPortalMesh!: Mesh;
  private leftCurvedWallMesh!: Mesh;
  private rightBaffles: Mesh[] = [];
  private leftCanopies: Mesh[] = [];
  private centerSeamMesh!: Mesh;

  // Materials for uniform updates
  private wallMaterials: ShaderMaterial[] = [];
  private canopyMaterials: ShaderMaterial[] = [];
  private centerSeamMaterial!: ShaderMaterial;

  private selectionBiasCurrent = 0;

  constructor() {
    this.group = new Group();
    this.group.name = "ChamberEnvironment";
    this.init();
  }

  private ownGeometry<T extends BufferGeometry>(geometry: T): T {
    this.geometries.push(geometry);
    return geometry;
  }

  private ownMaterial<T extends Material>(material: T): T {
    this.materials.push(material);
    return material;
  }

  private createWallMaterial(): ShaderMaterial {
    const mat = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: chamberWallVertexShader,
        fragmentShader: chamberWallFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSelectionBias: { value: 0 },
        },
        side: DoubleSide,
      }),
    );
    this.wallMaterials.push(mat);
    return mat;
  }

  private init() {
    // 1. DEEP PORTAL RECESSED HORIZON WALL (Full frustum coverage at depth Z = -35.5)
    const portalGeo = this.ownGeometry(new PlaneGeometry(88, 56, 32, 32));
    const portalMat = this.createWallMaterial();
    this.deepPortalMesh = new Mesh(portalGeo, portalMat);
    this.deepPortalMesh.position.set(0, 0, -35.5);
    this.group.add(this.deepPortalMesh);

    // 2. GROUND FOUNDATION PLINTH (Anchors the whole chamber spatially)
    const floorGeo = this.ownGeometry(new BoxGeometry(40, 2.0, 22, 16, 4, 16));
    const floorMat = this.createWallMaterial();
    this.floorPlinthMesh = new Mesh(floorGeo, floorMat);
    this.floorPlinthMesh.position.set(0, -6.2, -28.0);
    this.group.add(this.floorPlinthMesh);

    // 3. VAULTED CEILING SLAB (Overhead architectural perspective)
    const ceilingGeo = this.ownGeometry(new PlaneGeometry(36, 20, 24, 24));
    const ceilingMat = this.createWallMaterial();
    this.ceilingVaultMesh = new Mesh(ceilingGeo, ceilingMat);
    this.ceilingVaultMesh.position.set(0, 6.8, -28.0);
    this.ceilingVaultMesh.rotation.set(0.65, 0, 0);
    this.group.add(this.ceilingVaultMesh);

    // 4. BM VISUALS WING: SWEEPING ORGANIC CURVED ALCOVE WALL
    const leftWallGeo = this.ownGeometry(
      new CylinderGeometry(18, 18, 20, 32, 4, true, Math.PI * 0.72, Math.PI * 0.52),
    );
    const leftWallMat = this.createWallMaterial();
    this.leftCurvedWallMesh = new Mesh(leftWallGeo, leftWallMat);
    this.leftCurvedWallMesh.position.set(-7.5, 0.5, -28.5);
    this.leftCurvedWallMesh.rotation.set(0.10, 0.12, -0.08);
    this.group.add(this.leftCurvedWallMesh);

    // 5. BM VISUALS WING: TRANSLUCENT REFRACTIVE CANOPY PLIES
    this.initLeftCanopies();

    // 6. BMP TECHNICAL WING: STEPPED ARCHITECTURAL COLONNADE BAFFLES
    this.initRightBaffles();

    // 7. CENTER BM LIVING ORIGIN SEAM
    this.initCenterSeam();
  }

  private initLeftCanopies() {
    const canopyData = [
      {
        size: [8.5, 14.0],
        pos: [-5.8, 1.8, -26.5],
        rot: [0.22, 0.35, -0.28],
        tint: new Vector3(0.94, 0.88, 0.96),
      },
      {
        size: [9.5, 16.0],
        pos: [-7.2, -0.8, -30.0],
        rot: [-0.15, 0.42, 0.16],
        tint: new Vector3(0.96, 0.89, 0.85),
      },
    ];

    canopyData.forEach((item) => {
      const geo = this.ownGeometry(
        new PlaneGeometry(item.size[0], item.size[1], 24, 24),
      );
      const mat = this.ownMaterial(
        new ShaderMaterial({
          vertexShader: canopyVertexShader,
          fragmentShader: canopyFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uHover: { value: 0 },
            uTint: { value: item.tint },
          },
          transparent: true,
          depthWrite: false,
          side: DoubleSide,
        }),
      );
      this.canopyMaterials.push(mat);

      const mesh = new Mesh(geo, mat);
      mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);
      mesh.rotation.set(item.rot[0], item.rot[1], item.rot[2]);
      this.leftCanopies.push(mesh);
      this.group.add(mesh);
    });
  }

  private initRightBaffles() {
    const baffleData = [
      {
        size: [1.1, 12.0, 3.8],
        pos: [6.8, 0.2, -24.5],
        rot: [0.08, -0.32, 0.04],
      },
      {
        size: [1.1, 13.0, 4.2],
        pos: [8.8, 0.4, -29.0],
        rot: [0.06, -0.38, 0.03],
      },
      {
        size: [1.1, 14.0, 4.6],
        pos: [10.8, 0.6, -33.5],
        rot: [0.04, -0.45, 0.02],
      },
    ];

    baffleData.forEach((item) => {
      const geo = this.ownGeometry(
        new BoxGeometry(item.size[0], item.size[1], item.size[2], 8, 16, 8),
      );
      const mat = this.createWallMaterial();
      const mesh = new Mesh(geo, mat);
      mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);
      mesh.rotation.set(item.rot[0], item.rot[1], item.rot[2]);
      this.rightBaffles.push(mesh);
      this.group.add(mesh);
    });
  }

  private initCenterSeam() {
    const seamGeo = this.ownGeometry(new PlaneGeometry(1.6, 16.0, 16, 48));
    this.centerSeamMaterial = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: centerSeamVertexShader,
        fragmentShader: centerSeamFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSelectionBias: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        side: DoubleSide,
      }),
    );
    this.centerSeamMesh = new Mesh(seamGeo, this.centerSeamMaterial);
    this.centerSeamMesh.position.set(0, 0.2, -26.5);
    this.group.add(this.centerSeamMesh);
  }

  tick(deltaSeconds: number, params: ChamberEnvironmentParams, totalTime: number) {
    const dampSpeed = params.reducedMotion ? 12 : 5.0;
    this.selectionBiasCurrent +=
      (params.selectionBias - this.selectionBiasCurrent) *
      Math.min(1, deltaSeconds * dampSpeed);

    // Update all architectural wall materials
    this.wallMaterials.forEach((mat) => {
      const u = mat.uniforms;
      u.uTime.value = totalTime;
      u.uProgress.value = params.progress;
      u.uSelectionBias.value = this.selectionBiasCurrent;
    });

    // Update left canopy materials (active when selectionBias < 0)
    const leftHover = Math.max(0, -this.selectionBiasCurrent);
    this.canopyMaterials.forEach((mat) => {
      mat.uniforms.uTime.value = totalTime;
      mat.uniforms.uProgress.value = params.progress;
      mat.uniforms.uHover.value = leftHover;
    });

    // Update center origin seam
    const su = this.centerSeamMaterial.uniforms;
    su.uTime.value = totalTime;
    su.uProgress.value = params.progress;
    su.uSelectionBias.value = this.selectionBiasCurrent;

    // Emergence scaling and subtle parallax response
    if (params.reducedMotion) {
      this.group.scale.setScalar(params.progress > 0.85 ? 1.0 : 0.0001);
      return;
    }

    const emergence = Math.min(1.0, Math.max(0.0, (params.progress - 0.70) / 0.25));
    const smoothEmergence = emergence * emergence * (3 - 2 * emergence);
    this.group.scale.setScalar(Math.max(0.0001, smoothEmergence));

    // Subtle pointer parallax across the physical chamber
    this.group.position.x = params.pointer.x * 0.35;
    this.group.position.y = params.pointer.y * 0.22;
  }

  dispose() {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
    this.group.clear();
  }
}
