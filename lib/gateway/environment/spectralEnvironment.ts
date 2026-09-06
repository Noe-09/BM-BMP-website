import { Color, Group, Mesh, type ShaderMaterial, type Texture } from "three";
import { createVaultGeometry } from "./spectralGeometry.ts";
import { createSpectralMaterial } from "./spectralMaterial.ts";
import { createCarvedGeometry } from "./carvedGeometry.ts";
import type { JourneyFrame } from "../journey/chapterState.ts";
import { createSpectralPalette, sampleSpectralPalette } from "./spectralPalette.ts";

const PI = Math.PI;
type Mass = { mesh: Mesh; material: ShaderMaterial; baseX: number; baseY: number; distance: number; turn: number; role: "vault" | "shelf" | "core" | "far" | "optical"; index: number };

/** One continuous vault, with progress-authored cavity and boundary relationships. */
export class SpectralEnvironment {
  readonly group = new Group();
  readonly optics = new Group();
  private masses: Mass[] = [];
  private palette = createSpectralPalette();
  private farPalette = createSpectralPalette();

  constructor() {
    this.group.name = "Spectral mineral vault";
    this.optics.name = "Two optical boundary encounters";
    this.group.add(this.optics);

    // Connected major boundaries: broad sections, nonmatching openings, shared axis.
    this.add("vault", 0, { radius: 5.2, breadth: 2.2, depth: 2.15, start: .02 * PI, sweep: 1.22 * PI, eccentricity: .83, phase: .4 }, 0xf0efef, 0x9cbed0, -1.1, .9, 10, -.20);
    this.add("shelf", 1, { radius: 5.6, breadth: 2.5, depth: 2.8, start: .94 * PI, sweep: 1.13 * PI, eccentricity: .76, phase: 1.8 }, 0xdbe8e6, 0x73aeb4, .9, -1.3, 11, .1);
    this.add("vault", 2, { radius: 5.1, breadth: 2.0, depth: 2.4, start: -.35 * PI, sweep: .93 * PI, eccentricity: 1.02, phase: 2.4 }, 0xdcd6ed, 0x9a87b7, 2.4, 1.1, 17, -.4);
    this.add("shelf", 3, { radius: 5.9, breadth: 2.7, depth: 2.2, start: .67 * PI, sweep: 1.02 * PI, eccentricity: .85, phase: 3.1 }, 0xf1ded5, 0xc18eaa, -2.2, -1.2, 22, .18);

    // These interleaved internal faces separate into contradictory cavities in the core.
    this.add("core", 4, { radius: 4.2, breadth: 1.7, depth: 2.1, start: -.1 * PI, sweep: 1.16 * PI, eccentricity: .86, phase: 4.0 }, 0x83b8c4, 0x367b96, -.45, .5, 27, -.2);
    this.add("core", 5, { radius: 4.5, breadth: 1.65, depth: 2.4, start: .87 * PI, sweep: 1.15 * PI, eccentricity: .92, phase: 4.6 }, 0xc4b5df, 0x75659d, .8, -.35, 32, .15);

    // Far field is architecture, not a painted backdrop; it survives emergence.
    this.add("far", 6, { radius: 9.8, breadth: 3.4, depth: 5, start: -.25 * PI, sweep: 1.42 * PI, eccentricity: .78, phase: .9 }, 0x8ab5c1, 0x4c819b, 1.5, 2.5, 47, -.3);
    this.add("far", 7, { radius: 12, breadth: 4.8, depth: 6, start: .74 * PI, sweep: 1.4 * PI, eccentricity: .78, phase: 2.8 }, 0xd3dbdf, 0x879fb8, -1.2, -3.0, 64, .2);
    this.add("far", 8, { radius: 14, breadth: 4.4, depth: 7, start: -.3 * PI, sweep: 1.6 * PI, eccentricity: .9, phase: 1.4 }, 0xa9c7d0, 0x7796a8, 3.0, 1.0, 91, -.15);

    this.add("optical", 9, { radius: 6.0, breadth: 1.3, depth: .8, start: .55 * PI, sweep: .65 * PI, eccentricity: 1.05, phase: 1.6 }, 0xe7e6ef, 0x7dc9d2, -1, .5, 7, .1);
    this.add("optical", 10, { radius: 5.8, breadth: 1.25, depth: .9, start: -.34 * PI, sweep: .7 * PI, eccentricity: 1, phase: 2.6 }, 0xe7e6ef, 0xe6aba0, 1.5, -.3, 7, -.2);
  }

  private add(role: Mass["role"], index: number, shape: Parameters<typeof createVaultGeometry>[0], color: number, accent: number, x: number, y: number, distance: number, turn: number) {
    const material = createSpectralMaterial(color, accent, shape.phase, role === "optical", role === "far");
    const mesh = new Mesh(role === "core" || index === 0 ? createCarvedGeometry(index) : createVaultGeometry(shape), material);
    mesh.name = `${role} mineral boundary ${index}`;
    (role === "optical" ? this.optics : this.group).add(mesh);
    this.masses.push({ mesh, material, baseX: x, baseY: y, distance, turn, role, index });
  }

  update(frame: JourneyFrame, cameraZ: number, fog: Color) {
    const p = frame.progress;
    sampleSpectralPalette(p, this.palette);
    // A spatial lag, not temporal smoothing: far color evolves more quietly and
    // reaches the same endpoint in either direction without another clock.
    sampleSpectralPalette(p - .06 * Math.sin(p * PI), this.farPalette);
    for (const mass of this.masses) {
      const { mesh, material: { uniforms: u }, index, role } = mass;
      const side = index % 2 ? 1 : -1;
      let x = mass.baseX;
      let y = mass.baseY;
      let distance = mass.distance;
      let scale = 1;
      let rotation = mass.turn;

      if (role === "vault" || role === "shelf") {
        // Gathering, pressure and release share the SAME boundary surfaces.
        x += side * (1 - frame.formation) * (index === 0 ? .5 : 2.6);
        x += side * frame.opening * (index < 2 ? 5.8 : 3.2);
        y += (role === "vault" ? 1 : -1) * frame.opening * 1.8;
        distance -= frame.passage * (index < 2 ? 1.8 : 5.5);
        distance += (1 - frame.formation) * (index < 2 ? 4 : 2);
        distance += frame.opening * 8;
        rotation += Math.sin(p * PI) * side * .16 + frame.core * side * .24;
        scale = 1 + (1 - frame.formation) * .4 + frame.core * .08 + frame.opening * .7;
      } else if (role === "core") {
        // A closer face shrinks while its deeper counterpart expands: apparent depth disagrees.
        const first = index === 4;
        distance -= frame.passage * 8 + frame.core * (first ? 2 : 10);
        distance += frame.opening * 4;
        x += (first ? -1 : 1) * frame.separation * (1 - frame.opening) * .75;
        y += (first ? 1 : -1) * frame.inversion * .65;
        scale = 1 + (1 - frame.formation) * 2.2 + (first ? -.23 : .12) * frame.inversion + frame.opening * 2.2;
        rotation += (first ? -.55 : .65) * frame.inversion;
      } else if (role === "far") {
        x += Math.sin(p * PI) * side * .6;
        distance -= p * 6;
        rotation += Math.sin(p * PI) * .025;
      } else {
        const event = index === 9 ? frame.nearFirst : frame.nearSecond;
        x += side * (1 - event) * 8;
        distance += (1 - event) * 10;
        mesh.visible = event > .001;
        u.uOpacity.value = event * .94;
        rotation += event * side * .12;
      }
      mesh.position.set(x, y, cameraZ - distance);
      mesh.scale.setScalar(scale);
      mesh.rotation.set(.10 * Math.sin(index * 1.4) + frame.core * side * .07, .14 * Math.cos(index * 1.1) + frame.inversion * side * .10, rotation);
      u.uSpectral.value = frame.spectral;
      u.uDarkness.value = frame.darkness;
      u.uFogColor.value.copy(fog);
      const palette = role === "far" ? this.farPalette : this.palette;
      u.uPearl.value.copy(palette.pearl);
      u.uCool.value.copy(palette.cool);
      u.uViolet.value.copy(palette.violet);
      u.uWarm.value.copy(palette.warm);
      u.uShadow.value.copy(palette.shadow);
    }
  }

  setRefraction(texture: Texture, width: number, height: number) {
    for (const { role, material } of this.masses) if (role === "optical") {
      material.uniforms.uBackground.value = texture;
      material.uniforms.uResolution.value.set(width, height);
    }
  }

  dispose() {
    for (const { mesh, material } of this.masses) { mesh.geometry.dispose(); material.dispose(); }
    this.masses = [];
    this.optics.clear();
    this.group.clear();
  }
}
