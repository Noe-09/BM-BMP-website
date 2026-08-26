import {
  BufferGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  ShaderMaterial,
  type Material,
} from "three";
import {
  visualsFragmentShader,
  visualsVertexShader,
} from "./visualsShader";

export type EntityUpdateParams = {
  progress: number;
  selectionBias: number;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
};

export class VisualsEntity {
  readonly group: Group;
  private readonly geometries: BufferGeometry[] = [];
  private readonly materials: Material[] = [];

  private coreMesh!: Mesh;
  private material!: ShaderMaterial;
  private hoverCurrent = 0;

  constructor() {
    this.group = new Group();
    this.group.name = "VisualsEntity";
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
    // Spherical creative worldform geometry (higher tessellation for subtle surface undulating life)
    const geo = this.ownGeometry(new IcosahedronGeometry(2.2, 5));

    // Dedicated prismatic pearl / nebula atmosphere shader
    this.material = this.ownMaterial(
      new ShaderMaterial({
        vertexShader: visualsVertexShader,
        fragmentShader: visualsFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uHover: { value: 0 },
          uProgress: { value: 0 },
        },
      }),
    );

    this.coreMesh = new Mesh(geo, this.material);
    this.group.add(this.coreMesh);

    // Position in final selection scene (Left coordinate, in front of camera at Z = -18)
    this.group.position.set(-3.6, 0.6, -26.0);
  }

  tick(deltaSeconds: number, params: EntityUpdateParams, totalTime: number) {
    const isHovered = Math.max(0, -params.selectionBias);
    const otherHovered = Math.max(0, params.selectionBias);

    // Smooth hover damping
    const hoverDamp = params.reducedMotion ? 12 : 5.0;
    this.hoverCurrent +=
      (isHovered - this.hoverCurrent) *
      Math.min(1, deltaSeconds * hoverDamp);

    // Update custom shader uniforms
    const u = this.material.uniforms;
    u.uTime.value = totalTime;
    u.uHover.value = this.hoverCurrent;
    u.uProgress.value = params.progress;

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
      smoothEmergence * (1.0 + this.hoverCurrent * 0.14 - otherHovered * 0.12);
    this.group.scale.setScalar(Math.max(0.0001, targetScale));

    // Organic floating rotation with subtle dynamic response on hover
    this.coreMesh.rotation.y = totalTime * 0.22 + this.hoverCurrent * 0.35;
    this.coreMesh.rotation.x = Math.sin(totalTime * 0.25) * 0.08;
    this.coreMesh.rotation.z = Math.cos(totalTime * 0.18) * 0.06;

    // Subtle position lift when hovered
    this.group.position.y = 0.6 + Math.sin(totalTime * 0.7) * 0.08 + this.hoverCurrent * 0.35;
    this.group.position.x = -3.6 - this.hoverCurrent * 0.35;
  }

  dispose() {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
  }
}
