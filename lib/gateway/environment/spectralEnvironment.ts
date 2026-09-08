import { Color, Group, Mesh, type BufferGeometry, type ShaderMaterial, type Texture } from "three";
import { createVaultGeometry } from "./spectralGeometry.ts";
import { createArchitecturalGeometry, createChamberFieldGeometry } from "./architecturalGeometry.ts";
import { createSpectralMaterial } from "./spectralMaterial.ts";
import type { JourneyFrame } from "../journey/chapterState.ts";
import { createSpectralPalette, sampleSpectralPalette } from "./spectralPalette.ts";
import { deriveBreakthroughFrame } from "./breakthroughState.ts";

const PI = Math.PI;
type Role = "shell" | "fracture" | "core" | "far" | "field" | "optical";
type Boundary = { mesh: Mesh<BufferGeometry, ShaderMaterial>; role: Role; index: number; angle: number };

/** Pearl shell → tectonic fracture → inverted chamber → dark spectral arrival. */
export class SpectralEnvironment {
  readonly group = new Group();
  readonly optics = new Group();
  private boundaries: Boundary[] = [];
  private palette = createSpectralPalette();
  private farPalette = createSpectralPalette();

  constructor() {
    this.group.name = "The parted chamber";
    this.optics.name = "Two optical boundary encounters";
    this.group.add(this.optics);
    for (let i = 0; i < 2; i++) this.add("shell", i, createVaultGeometry({ radius: 3.6, breadth: 2.3, depth: 1.8,
      start: -.18 * PI + i * PI, sweep: 1.12 * PI, eccentricity: .84, phase: .6 + i * 1.8 }), i * PI);
    // Six adjoining portions of a common aperture. The cuts expose solid depth;
    // broad outer faces extend into the field instead of terminating as shards.
    for (let i = 0; i < 6; i++) {
      const angle = i * PI / 3 + .16;
      this.add("fracture", i, createArchitecturalGeometry(angle, PI / 3 - .035, 5.2, 22, 1.8 + i % 3 * .85, 1, 4), angle + PI / 6);
    }
    this.add("core", 0, createArchitecturalGeometry(-.22 * PI, 1.46 * PI, 4.4, 10.5, 3.1, 4, 7), 0);
    this.add("core", 1, createArchitecturalGeometry(.78 * PI, 1.46 * PI, 4.4, 10.5, 3.1, 4, 7), PI);
    const far = createArchitecturalGeometry(-.20 * PI, 1.50 * PI, 14, 46, 4.5, 4);
    for (let i = 0; i < 3; i++) this.add("far", i, far, i * 1.9);
    this.add("field", 0, createChamberFieldGeometry(), 0);
    for (let i = 0; i < 2; i++) this.add("optical", i, createVaultGeometry({ radius: 5.7, breadth: .9, depth: .65,
      start: .5 * PI + i * PI, sweep: .6 * PI, eccentricity: 1, phase: 1.6 + i }), i * PI);
  }

  private add(role: Role, index: number, geometry: BufferGeometry, angle: number) {
    const architectural = role === "fracture" || role === "core" || role === "far";
    const material = createSpectralMaterial(0xe8edf0, index % 2 ? 0xd48b72 : 0x62bfc7,
      index * .83, role === "optical", role === "far", architectural);
    material.uniforms.uField.value = role === "field" ? 1 : 0;
    const mesh = new Mesh(geometry, material);
    mesh.name = `${role} chamber boundary ${index}`;
    (role === "optical" ? this.optics : this.group).add(mesh);
    this.boundaries.push({ mesh, role, index, angle });
  }

  update(frame: JourneyFrame, cameraZ: number, fog: Color) {
    const b = deriveBreakthroughFrame(frame.progress);
    sampleSpectralPalette(b.progress, this.palette);
    sampleSpectralPalette(b.progress - .055 * Math.sin(b.progress * PI), this.farPalette);
    for (const { mesh, role, index, angle } of this.boundaries) {
      const u = mesh.material.uniforms;
      const side = index % 2 ? 1 : -1;
      let x = 0, y = 0, distance = 12, scale = 1, rx = 0, ry = 0, rz = 0;
      mesh.visible = true;
      if (role === "shell") {
        x = -side * (.5 + b.rupture * 5 + b.release * 10);
        y = -side * (.5 + b.rupture * 7 + b.release * 12);
        distance = 10 + b.rupture * 4;
        scale = 1;
        rz = side * (.12 + b.rupture * .30);
        ry = side * b.rupture * .20;
      } else if (role === "fracture") {
        const spread = .18 + b.rupture * (1.1 + index % 2 * .65) - b.compression * .7 + b.release * 17;
        x = Math.cos(angle) * spread;
        y = Math.sin(angle) * spread;
        distance = 34 - b.architecture * 21 + index * 1.85;
        distance += b.exchange * side * 2.0 + b.release * 12;
        rx = Math.sin(angle) * (.10 + b.rupture * .28 - b.compression * .14 + b.release * .32);
        ry = -Math.cos(angle) * (.10 + b.rupture * .40 - b.compression * .12 + b.release * .44);
        rz = side * b.rupture * .06 + b.exchange * .20 - b.release * side * .32;
      } else if (role === "core") {
        const first = index === 0;
        distance = (first ? 24 : 35) - b.compression * 7 + b.exchange * (first ? 9 : -13) + b.release * 18;
        // Compensation preserves the apparent opening while real depth order
        // reverses; opposing tilts reveal the discontinuous spatial relationship.
        scale = distance / 25 * (1 + b.exchange * (first ? -.14 : .15));
        x = (first ? -.5 : .5) + side * b.exchange * 1.4 + side * b.release * 40;
        y = side * (b.exchange * .9 + b.release * 6);
        rx = side * (.14 + b.exchange * .38);
        ry = side * (.12 + b.exchange * .72);
        rz = -.36 + b.exchange * side * .54 + b.release * side * .45;
      } else if (role === "far") {
        distance = 46 + index * 22 - b.architecture * 5;
        x = (index === 1 ? 2.4 : -1.8) + b.exchange * side * 1.4;
        y = index === 2 ? -2 : 1.5;
        scale = 1 + index * .24 + b.release * .38;
        rz = angle - .22 + b.exchange * side * .12;
        rx = .20 * side;
        ry = -.18 + index * .16;
      } else if (role === "field") {
        distance = 122;
        x = -4 + b.exchange * 2;
        y = 2;
        rz = -.12 + b.exchange * .12;
      } else {
        const event = index === 0 ? frame.nearFirst : frame.nearSecond;
        mesh.visible = event > .001;
        x = side * (1 + (1 - event) * 10);
        y = side * .7;
        distance = 7 + (1 - event) * 10;
        rz = side * event * .15;
        u.uOpacity.value = event * .90;
      }
      mesh.position.set(x, y, cameraZ - distance);
      mesh.rotation.set(rx, ry, rz);
      mesh.scale.setScalar(scale);
      const palette = role === "far" ? this.farPalette : this.palette;
      u.uPearl.value.copy(palette.pearl);
      u.uCool.value.copy(palette.cool);
      u.uViolet.value.copy(palette.violet);
      u.uWarm.value.copy(palette.warm);
      u.uShadow.value.copy(palette.shadow);
      u.uFogColor.value.copy(fog);
      u.uSpectral.value = b.spectral;
      u.uDarkness.value = b.blackout;
      u.uOpticalEnergy.value = b.opticalEnergy * (role === "far" ? .4 : role === "optical" ? 1 : .85);
      u.uDestination.value = role === "far" ? (index === 2 ? .85 : .22) * (1 - b.release * .75) : 0;
      u.uExposure.value = .94 - b.blackout * .35 - b.release * .03;
      u.uHaze.value = role === "far" ? .7 : .2;
      u.uGlow.value = b.opticalEnergy * .6;
      u.uRupture.value = b.rupture;
      u.uRelease.value = b.release;
    }
  }

  setRefraction(texture: Texture, width: number, height: number) {
    for (const { role, mesh } of this.boundaries) if (role === "optical") {
      mesh.material.uniforms.uBackground.value = texture;
      mesh.material.uniforms.uResolution.value.set(width, height);
    }
  }

  dispose() {
    for (const geometry of new Set(this.boundaries.map(({ mesh }) => mesh.geometry))) geometry.dispose();
    for (const { mesh } of this.boundaries) mesh.material.dispose();
    this.boundaries = [];
    this.optics.clear();
    this.group.clear();
  }
}
