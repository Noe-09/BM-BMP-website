import { BufferGeometry, Float32BufferAttribute, MeshBasicMaterial } from "three";
import { MarchingCubes } from "three/addons/objects/MarchingCubes.js";

const smoothMin = (a: number, b: number, k: number) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * .25;
};

function carvedField(x: number, y: number, z: number, phase: number) {
  const bend = Math.sin(x * .21 + phase) * 2.7 + Math.sin(y * .19 - phase) * 2.4 + .018 * x * y;
  const body = Math.abs(z - bend) - (2.1 + .5 * Math.cos(x * .22 + y * .17));
  const turn = phase > 6 ? -.58 : phase > 1 ? .30 : -.12;
  const cx = x * Math.cos(turn) - y * Math.sin(turn) - .8 * Math.sin(z * .22 + phase);
  const cy = x * Math.sin(turn) + y * Math.cos(turn) - .7 * Math.cos(z * .25 - phase);
  const angle = Math.atan2(cy, cx);
  const radius = 4.6 + .25 * Math.sin(angle * 3 + phase) + .35 * Math.cos(angle * 2 - phase);
  const primary = Math.hypot(cx * (phase > 1 && phase < 6 ? 1.13 : .76), cy * (phase > 1 && phase < 6 ? .84 : 1.2)) - radius - .085 * z * z;
  const secondary = Math.hypot((cx + 6.2 + z * .16) * .83, (cy - 2.1) * 1.12) - 2.9 - .02 * z * z;
  return -smoothMin(-body, smoothMin(primary, secondary, .7), 1.35);
}

/** Authored solid-minus-cavities. Meshed ONCE on CPU, never raymarched or rebuilt per frame. */
export function createCarvedGeometry(variant: number) {
  const resolution = 88;
  const placeholder = new MeshBasicMaterial();
  const field = new MarchingCubes(resolution, placeholder, false, false, 100000);
  field.isolation = 0;
  const phase = variant * 1.3;
  for (let iz = 0; iz < resolution; iz++) {
    const z = (iz / resolution * 2 - 1) * 12;
    for (let iy = 0; iy < resolution; iy++) {
      const y = (iy / resolution * 2 - 1) * 24;
      for (let ix = 0; ix < resolution; ix++) {
        const x = (ix / resolution * 2 - 1) * 24;
        field.field[ix + iy * resolution + iz * resolution * resolution] = -carvedField(x, y, z, phase);
      }
    }
  }
  field.update();
  const count = field.count;
  const positions = field.positionArray.slice(0, count * 3);
  const normals = field.normalArray.slice(0, count * 3);
  const uv = new Float32Array(count * 2);
  for (let i = 0; i < count; i++) {
    positions[i * 3] *= 24;
    positions[i * 3 + 1] *= 24;
    positions[i * 3 + 2] *= 12;
    // Evaluate the authored field gradient rather than reflecting the coarse voxel normals.
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
    const e = .015;
    normals[i * 3] = carvedField(x + e, y, z, phase) - carvedField(x - e, y, z, phase);
    normals[i * 3 + 1] = carvedField(x, y + e, z, phase) - carvedField(x, y - e, z, phase);
    normals[i * 3 + 2] = carvedField(x, y, z + e, phase) - carvedField(x, y, z - e, phase);
    uv[i * 2] = Math.atan2(positions[i * 3 + 1], positions[i * 3]) / (Math.PI * 2) + .5;
    uv[i * 2 + 1] = Math.min(1, Math.hypot(positions[i * 3], positions[i * 3 + 1]) / 13);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.normalizeNormals();
  geometry.computeBoundingSphere();
  field.geometry.dispose();
  placeholder.dispose();
  return geometry;
}
