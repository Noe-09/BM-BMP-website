import {
  BoxGeometry,
  BufferGeometry,
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
  chamberBackdropFragmentShader,
  chamberBackdropVertexShader,
  refractivePlyFragmentShader,
  refractivePlyVertexShader,
  structuralRailFragmentShader,
  structuralRailVertexShader,
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

  private backdropMesh!: Mesh;
  private backdropMaterial!: ShaderMaterial;

  private leftPliesGroup = new Group();
  private leftPlyMaterials: ShaderMaterial[] = [];

  private rightRailsGroup = new Group();
  private rightRailMaterials: ShaderMaterial[] = [];

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

  private init() {
    // 1. DEEP PRISMATIC CHAMBER BACKDROP
    const backdropGeo = this.ownGeometry(new PlaneGeometry(68, 52, 48, 48));
    this.backdropMaterial = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: chamberBackdropVertexShader,
        fragmentShader: chamberBackdropFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uProgress: { value: 0 },
          uSelectionBias: { value: 0 },
          uPointer: { value: new Vector2(0, 0) },
        },
      }),
    );
    this.backdropMesh = new Mesh(backdropGeo, this.backdropMaterial);
    this.backdropMesh.position.set(0, 0, -36.0);
    this.group.add(this.backdropMesh);

    // 2. BM VISUALS WING: REFRACTIVE SPATIAL PLIES (Depth framing)
    this.initLeftRefractivePlies();
    this.group.add(this.leftPliesGroup);

    // 3. BMP TECHNICAL WING: STRUCTURAL PERSPECTIVE RAILS
    this.initRightStructuralRails();
    this.group.add(this.rightRailsGroup);
  }

  private initLeftRefractivePlies() {
    const pliesData = [
      {
        size: [8.5, 16.0],
        pos: [-6.2, 1.4, -30.5],
        rot: [0.12, 0.38, -0.22],
        tint: new Vector3(0.92, 0.88, 0.96),
      },
      {
        size: [9.5, 18.0],
        pos: [-7.8, -1.2, -33.5],
        rot: [-0.15, 0.45, 0.18],
        tint: new Vector3(0.88, 0.94, 0.95),
      },
    ];

    pliesData.forEach((item) => {
      const geo = this.ownGeometry(
        new PlaneGeometry(item.size[0], item.size[1], 24, 24),
      );
      const mat = this.ownMaterial(
        new ShaderMaterial({
          vertexShader: refractivePlyVertexShader,
          fragmentShader: refractivePlyFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uHover: { value: 0 },
            uTint: { value: item.tint },
          },
          transparent: true,
          depthWrite: false,
          side: DoubleSide,
        }),
      );
      this.leftPlyMaterials.push(mat);

      const mesh = new Mesh(geo, mat);
      mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);
      mesh.rotation.set(item.rot[0], item.rot[1], item.rot[2]);
      this.leftPliesGroup.add(mesh);
    });
  }

  private initRightStructuralRails() {
    const railsData = [
      {
        size: [0.06, 0.06, 16.0],
        pos: [2.8, -2.2, -28.0],
        rot: [0.18, -0.32, 0],
      },
      {
        size: [0.05, 0.05, 18.0],
        pos: [5.6, 2.0, -29.5],
        rot: [-0.15, -0.28, 0],
      },
      {
        size: [0.06, 0.06, 17.0],
        pos: [6.8, -1.8, -31.0],
        rot: [0.10, -0.24, 0],
      },
      {
        size: [0.05, 0.05, 15.0],
        pos: [4.2, 3.4, -30.0],
        rot: [-0.22, -0.26, 0],
      },
    ];

    railsData.forEach((item, index) => {
      const geo = this.ownGeometry(
        new BoxGeometry(item.size[0], item.size[1], item.size[2]),
      );
      const mat = this.ownMaterial(
        new ShaderMaterial({
          vertexShader: structuralRailVertexShader,
          fragmentShader: structuralRailFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uHover: { value: 0 },
            uRailIndex: { value: index },
          },
          transparent: true,
          depthWrite: false,
        }),
      );
      this.rightRailMaterials.push(mat);

      const mesh = new Mesh(geo, mat);
      mesh.position.set(item.pos[0], item.pos[1], item.pos[2]);
      mesh.rotation.set(item.rot[0], item.rot[1], item.rot[2]);
      this.rightRailsGroup.add(mesh);
    });
  }

  tick(deltaSeconds: number, params: ChamberEnvironmentParams, totalTime: number) {
    const dampSpeed = params.reducedMotion ? 12 : 5.0;
    this.selectionBiasCurrent +=
      (params.selectionBias - this.selectionBiasCurrent) *
      Math.min(1, deltaSeconds * dampSpeed);

    // Update backdrop uniforms
    const bu = this.backdropMaterial.uniforms;
    bu.uTime.value = totalTime;
    bu.uProgress.value = params.progress;
    bu.uSelectionBias.value = this.selectionBiasCurrent;
    bu.uPointer.value.copy(params.pointer);

    // Update left refractive plies (hover when selectionBias < 0)
    const leftHover = Math.max(0, -this.selectionBiasCurrent);
    this.leftPlyMaterials.forEach((mat) => {
      mat.uniforms.uTime.value = totalTime;
      mat.uniforms.uHover.value = leftHover;
    });

    // Update right structural rails (hover when selectionBias > 0)
    const rightHover = Math.max(0, this.selectionBiasCurrent);
    this.rightRailMaterials.forEach((mat) => {
      mat.uniforms.uTime.value = totalTime;
      mat.uniforms.uHover.value = rightHover;
    });

    // Subtle parallax motion
    if (!params.reducedMotion) {
      this.leftPliesGroup.position.x = params.pointer.x * 0.25;
      this.leftPliesGroup.position.y = params.pointer.y * 0.15;

      this.rightRailsGroup.position.x = params.pointer.x * 0.22;
      this.rightRailsGroup.position.y = params.pointer.y * 0.15;
    }
  }

  dispose() {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
    this.group.clear();
  }
}
