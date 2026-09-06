import {
  BoxGeometry,
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  type Material,
} from "three";
import {
  technicalFragmentShader,
  technicalLogicPlaneFragmentShader,
  technicalLogicPlaneVertexShader,
  technicalVertexShader,
} from "./technicalShader";
import type { EntityUpdateParams } from "./visualsEntity";

export class TechnicalEntity {
  readonly group: Group;
  private readonly geometries: BufferGeometry[] = [];
  private readonly materials: Material[] = [];

  private leftCasingGroup = new Group();
  private rightCasingGroup = new Group();
  private centralCoreMesh!: Mesh;
  private secondaryPlinthMesh!: Mesh;
  private logicPlanesGroup = new Group();

  private casingMaterial!: ShaderMaterial;
  private coreMaterial!: ShaderMaterial;
  private logicMaterials: ShaderMaterial[] = [];
  private hoverCurrent = 0;

  constructor() {
    this.group = new Group();
    this.group.name = "TechnicalEntity";
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
    // 1. SPLIT-CASING ARCHITECTURAL MONOLITH
    const casingGeo = this.ownGeometry(new BoxGeometry(0.78, 4.8, 1.6, 8, 24, 8));

    this.casingMaterial = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: technicalVertexShader,
        fragmentShader: technicalFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uProgress: { value: 0 },
        },
      }),
    );

    const leftMesh = new Mesh(casingGeo, this.casingMaterial);
    this.leftCasingGroup.add(leftMesh);
    this.leftCasingGroup.position.set(-0.41, 0, 0);
    this.group.add(this.leftCasingGroup);

    const rightMesh = new Mesh(casingGeo, this.casingMaterial);
    this.rightCasingGroup.add(rightMesh);
    this.rightCasingGroup.position.set(0.41, 0, 0);
    this.group.add(this.rightCasingGroup);

    // 2. INNER BACKBONE STRUCTURAL CHASSIS
    const coreGeo = this.ownGeometry(new BoxGeometry(0.74, 4.5, 0.74, 8, 24, 8));
    this.coreMaterial = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: technicalVertexShader,
        fragmentShader: technicalFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uProgress: { value: 0 },
        },
      }),
    );
    this.centralCoreMesh = new Mesh(coreGeo, this.coreMaterial);
    this.group.add(this.centralCoreMesh);

    // 3. INTERNAL DATA / SYSTEM ARCHITECTURE LOGIC PLANES
    this.initLogicPlanes();
    this.group.add(this.logicPlanesGroup);

    // 4. LOWER GROUNDED PLINTH
    const plinthGeo = this.ownGeometry(new BoxGeometry(2.0, 0.4, 2.0, 8, 4, 8));
    this.secondaryPlinthMesh = new Mesh(plinthGeo, this.casingMaterial);
    this.secondaryPlinthMesh.position.y = -2.6;
    this.group.add(this.secondaryPlinthMesh);

    // Position in final selection scene (Right coordinate, in front of camera at Z = -18)
    this.group.position.set(3.6, -0.6, -26.0);
  }

  private initLogicPlanes() {
    const planeGeo = this.ownGeometry(new PlaneGeometry(1.5, 0.8, 8, 8));

    const layers = [
      { y: -1.3, rot: [Math.PI * 0.48, 0.08, 0.1] },
      { y: -0.45, rot: [Math.PI * 0.52, -0.06, -0.08] },
      { y: 0.45, rot: [Math.PI * 0.47, 0.1, 0.05] },
      { y: 1.3, rot: [Math.PI * 0.53, -0.08, -0.1] },
    ];

    layers.forEach((item, index) => {
      const mat = this.ownMaterial(
        new ShaderMaterial({
          vertexShader: technicalLogicPlaneVertexShader,
          fragmentShader: technicalLogicPlaneFragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uHover: { value: 0 },
            uLayerIndex: { value: index },
          },
          transparent: true,
          depthWrite: false,
          side: DoubleSide,
        }),
      );
      this.logicMaterials.push(mat);

      const mesh = new Mesh(planeGeo, mat);
      mesh.position.set(0, item.y, 0);
      mesh.rotation.set(item.rot[0], item.rot[1], item.rot[2]);
      this.logicPlanesGroup.add(mesh);
    });
  }

  tick(deltaSeconds: number, params: EntityUpdateParams, totalTime: number) {
    const isHovered = Math.max(0, params.selectionBias);
    const otherHovered = Math.max(0, -params.selectionBias);

    // Smooth hover damping
    const hoverDamp = params.reducedMotion ? 12 : 5.0;
    this.hoverCurrent +=
      (isHovered - this.hoverCurrent) *
      Math.min(1, deltaSeconds * hoverDamp);

    // Update casing and core uniforms
    const cu = this.casingMaterial.uniforms;
    cu.uTime.value = totalTime;
    cu.uHover.value = this.hoverCurrent;
    cu.uProgress.value = params.progress;

    const ru = this.coreMaterial.uniforms;
    ru.uTime.value = totalTime;
    ru.uHover.value = this.hoverCurrent;
    ru.uProgress.value = params.progress;

    // Update logic plane uniforms
    this.logicMaterials.forEach((mat) => {
      mat.uniforms.uTime.value = totalTime;
      mat.uniforms.uHover.value = this.hoverCurrent;
    });

    if (params.reducedMotion) {
      this.group.scale.setScalar(params.progress > 0.85 ? 1.0 : 0.0001);
      return;
    }

    // Emergence scale from travel progress
    const emergence = Math.min(
      1.0,
      Math.max(0.0, (params.progress - 0.72) / 0.23),
    );
    const smoothEmergence = emergence * emergence * (3 - 2 * emergence);

    const targetScale =
      smoothEmergence * (1.0 + this.hoverCurrent * 0.12 - otherHovered * 0.12);
    this.group.scale.setScalar(Math.max(0.0001, targetScale));

    // MODULAR CASING SEPARATION KINEMATICS
    // Left casing slides laterally and steps forward
    this.leftCasingGroup.position.x = -0.41 - this.hoverCurrent * 0.62;
    this.leftCasingGroup.position.z = this.hoverCurrent * 0.22;

    // Right casing slides laterally and steps backward
    this.rightCasingGroup.position.x = 0.41 + this.hoverCurrent * 0.62;
    this.rightCasingGroup.position.z = -this.hoverCurrent * 0.22;

    // Precise axial slow rotation
    this.group.rotation.y = -0.22 + totalTime * 0.08 + this.hoverCurrent * 0.22;
    this.secondaryPlinthMesh.rotation.y = totalTime * 0.04;

    // Subtle alignment translation when hovered
    this.group.position.y = -0.6 + Math.sin(totalTime * 0.5 + 1.5) * 0.04 + this.hoverCurrent * 0.25;
    this.group.position.x = 3.6 + this.hoverCurrent * 0.35;
  }

  dispose() {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
  }
}
