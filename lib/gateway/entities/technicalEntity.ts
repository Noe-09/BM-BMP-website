import {
  BoxGeometry,
  BufferGeometry,
  Group,
  Mesh,
  ShaderMaterial,
  type Material,
} from "three";
import {
  technicalFragmentShader,
  technicalVertexShader,
} from "./technicalShader";
import type { EntityUpdateParams } from "./visualsEntity";

export class TechnicalEntity {
  readonly group: Group;
  private readonly geometries: BufferGeometry[] = [];
  private readonly materials: Material[] = [];

  private coreMesh!: Mesh;
  private secondaryPlinthMesh!: Mesh;
  private material!: ShaderMaterial;
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
    // Vertical monolith architecture with precision faceted plinth
    const pillarGeo = this.ownGeometry(new BoxGeometry(1.6, 4.8, 1.6, 12, 24, 12));
    const plinthGeo = this.ownGeometry(new BoxGeometry(2.0, 0.4, 2.0, 8, 4, 8));

    // Dedicated cold prismatic steel / spectral mineral shader
    this.material = this.ownMaterial(
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

    this.coreMesh = new Mesh(pillarGeo, this.material);
    this.group.add(this.coreMesh);

    this.secondaryPlinthMesh = new Mesh(plinthGeo, this.material);
    this.secondaryPlinthMesh.position.y = -2.6;
    this.group.add(this.secondaryPlinthMesh);

    // Position in final selection scene (Right coordinate, in front of camera at Z = -18)
    this.group.position.set(3.6, -0.6, -26.0);
  }

  tick(deltaSeconds: number, params: EntityUpdateParams, totalTime: number) {
    const isHovered = Math.max(0, params.selectionBias);
    const otherHovered = Math.max(0, -params.selectionBias);

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

    // Precise, structural slow axial rotation
    this.coreMesh.rotation.y = -0.25 + totalTime * 0.10 + this.hoverCurrent * 0.25;
    this.secondaryPlinthMesh.rotation.y = totalTime * 0.05;

    // Subtle alignment translation when hovered
    this.group.position.y = -0.6 + Math.sin(totalTime * 0.6 + 1.5) * 0.05 + this.hoverCurrent * 0.25;
    this.group.position.x = 3.6 + this.hoverCurrent * 0.35;
  }

  dispose() {
    for (const geo of this.geometries) geo.dispose();
    for (const mat of this.materials) mat.dispose();
  }
}
