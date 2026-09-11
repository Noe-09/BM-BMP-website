import {
  BufferGeometry,
  DodecahedronGeometry,
  Group,
  IcosahedronGeometry,
  Mesh,
  ShaderMaterial,
  TetrahedronGeometry,
  TorusGeometry,
  type Material,
} from "three";

import type { EntityInteraction } from "../briefing.ts";
import { clamp01 } from "../../motion/physics.ts";
import {
  creatorFragmentShader,
  creatorVertexShader,
} from "./creatorShader.ts";

export type CreatorUpdateParams = {
  progress: number;
  interaction: EntityInteraction;
  pointerX: number;
  pointerY: number;
  reducedMotion: boolean;
};

export type CreatorAssemblyFrame = {
  authority: number;
  recede: number;
  shellGap: number;
  corePulse: number;
  modules: ReadonlyArray<{
    orbitX: number;
    orbitY: number;
    dock: number;
    rotation: number;
  }>;
};

const PIECE_PHASES = [0.15, 1.2, 2.35, 3.6, 4.8] as const;
const MODULE_BASES = [
  [-1.12, 0.42, 0.16],
  [-0.64, -0.88, 0.34],
  [0.18, 1.08, -0.18],
  [0.82, 0.62, 0.24],
  [1.02, -0.58, -0.08],
] as const;

export function deriveCreatorAssemblyFrame(
  totalTime: number,
  interaction: EntityInteraction,
  reducedMotion: boolean,
): CreatorAssemblyFrame {
  const motionTime = reducedMotion ? 0 : totalTime;
  const authority = Math.max(
    interaction.hoverWeight * 0.62,
    interaction.selectedWeight,
  );
  return {
    authority,
    recede: clamp01(interaction.recedeWeight),
    shellGap: authority * 0.34,
    corePulse: reducedMotion
      ? authority
      : authority + (Math.sin(motionTime * 0.42) * 0.5 + 0.5) * 0.08,
    modules: PIECE_PHASES.map((phase, index) => ({
      orbitX: reducedMotion
        ? 0
        : Math.sin(motionTime * 0.11 + phase) * (0.08 + index * 0.008),
      orbitY: reducedMotion
        ? 0
        : Math.cos(motionTime * 0.09 + phase) * (0.06 + index * 0.006),
      dock: interaction.selectedWeight * (0.18 + index * 0.025),
      rotation: reducedMotion
        ? phase
        : phase + motionTime * (0.035 + index * 0.004),
    })),
  };
}

export class CreatorEntity {
  readonly group = new Group();

  private readonly geometries: BufferGeometry[] = [];
  private readonly materials: Material[] = [];
  private readonly shellMeshes: Mesh[] = [];
  private readonly moduleMeshes: Mesh[] = [];
  private coreMesh!: Mesh;
  private coreMaterial!: ShaderMaterial;
  private shellMaterial!: ShaderMaterial;
  private moduleMaterial!: ShaderMaterial;
  private disposed = false;

  constructor() {
    this.group.name = "CreatorEntity";
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

  private makeMaterial(kind: number): ShaderMaterial {
    return this.ownMaterial(
      new ShaderMaterial({
        vertexShader: creatorVertexShader,
        fragmentShader: creatorFragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uSelected: { value: 0 },
          uKind: { value: kind },
        },
      }),
    );
  }

  private init() {
    this.moduleMaterial = this.makeMaterial(0);
    this.shellMaterial = this.makeMaterial(1);
    this.coreMaterial = this.makeMaterial(2);

    const seedGeometry = this.ownGeometry(new DodecahedronGeometry(0.68, 1));
    this.coreMesh = new Mesh(seedGeometry, this.coreMaterial);
    this.coreMesh.name = "creator mineral seed";
    this.coreMesh.scale.set(0.82, 1.18, 0.74);
    this.group.add(this.coreMesh);

    const innerGeometry = this.ownGeometry(new IcosahedronGeometry(0.31, 1));
    const inner = new Mesh(innerGeometry, this.coreMaterial);
    inner.name = "creator internal source";
    inner.rotation.set(0.4, -0.2, 0.25);
    this.group.add(inner);

    const shellGeometry = this.ownGeometry(
      new TorusGeometry(1.03, 0.12, 8, 22, Math.PI * 0.72),
    );
    for (let index = 0; index < 3; index += 1) {
      const shell = new Mesh(shellGeometry, this.shellMaterial);
      shell.name = `creator shell ${index}`;
      shell.rotation.set(
        Math.PI * (0.18 + index * 0.31),
        Math.PI * (0.08 + index * 0.46),
        Math.PI * (0.12 + index * 0.28),
      );
      this.shellMeshes.push(shell);
      this.group.add(shell);
    }

    const moduleGeometry = this.ownGeometry(new TetrahedronGeometry(0.32, 0));
    MODULE_BASES.forEach((position, index) => {
      const module = new Mesh(moduleGeometry, this.moduleMaterial);
      module.name = `creator module ${index}`;
      module.position.set(position[0], position[1], position[2]);
      module.scale.set(1 + index * 0.07, 0.72 + index * 0.04, 0.8);
      this.moduleMeshes.push(module);
      this.group.add(module);
    });

    this.group.position.set(0, 0.08, -27.1);
  }

  tick(
    _deltaSeconds: number,
    params: CreatorUpdateParams,
    totalTime: number,
  ) {
    const frame = deriveCreatorAssemblyFrame(
      totalTime,
      params.interaction,
      params.reducedMotion,
    );
    const emergence = clamp01((params.progress - 0.72) / 0.23);
    const smoothEmergence = emergence * emergence * (3 - 2 * emergence);
    const scale =
      smoothEmergence *
      (0.9 + frame.authority * 0.1 - frame.recede * 0.16);
    this.group.scale.setScalar(Math.max(0.0001, scale));
    this.group.position.y =
      0.08 +
      (params.reducedMotion ? 0 : Math.sin(totalTime * 0.31) * 0.055) +
      frame.authority * 0.12;
    this.group.rotation.y = params.reducedMotion
      ? -0.15
      : -0.15 + totalTime * 0.045;
    this.group.rotation.x = params.reducedMotion
      ? 0.04
      : 0.04 + Math.sin(totalTime * 0.17) * 0.035;

    this.shellMeshes.forEach((shell, index) => {
      const direction = index === 1 ? -1 : 1;
      shell.position.x = direction * frame.shellGap * (0.34 + index * 0.08);
      shell.position.y = (index - 1) * frame.shellGap * 0.26;
    });

    this.moduleMeshes.forEach((module, index) => {
      const base = MODULE_BASES[index];
      const moduleFrame = frame.modules[index];
      const dockDirection = index % 2 === 0 ? -1 : 1;
      module.position.set(
        base[0] + moduleFrame.orbitX + dockDirection * moduleFrame.dock,
        base[1] + moduleFrame.orbitY - moduleFrame.dock * 0.35,
        base[2] + moduleFrame.dock * (index % 2 === 0 ? 0.5 : -0.45),
      );
      module.rotation.set(
        moduleFrame.rotation * 0.6,
        moduleFrame.rotation,
        moduleFrame.rotation * 0.35,
      );
    });

    for (const material of [
      this.moduleMaterial,
      this.shellMaterial,
      this.coreMaterial,
    ]) {
      material.uniforms.uTime.value = totalTime;
      material.uniforms.uReveal.value = frame.authority;
      material.uniforms.uSelected.value = params.interaction.selectedWeight;
    }
    this.coreMesh.scale.setScalar(1 + frame.corePulse * 0.035);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    for (const geometry of this.geometries) geometry.dispose();
    for (const material of this.materials) material.dispose();
    this.group.clear();
  }
}
