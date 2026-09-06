import { BufferGeometry, Float32BufferAttribute } from "three";

export type VaultShape = {
  radius: number; breadth: number; depth: number;
  start: number; sweep: number; eccentricity: number; phase: number;
};

/** A continuous cavity wall: the inner throat recedes and the outer field has no free-floating edge. */
export function createVaultGeometry(shape: VaultShape) {
  const positions: number[] = [];
  const uv: number[] = [];
  const indices: number[] = [];
  const longitudinal = 112;
  const section = 64;
  for (let i = 0; i <= longitudinal; i++) {
    const u = i / longitudinal;
    const a = shape.start + u * shape.sweep;
    // Angular edges turn away into the wall instead of ending as cut ribbons.
    const flare = 28 * Math.exp(-u * 14) + 28 * Math.exp(-(1 - u) * 14);
    const radius = shape.radius + flare + .85 * Math.sin(a * 2 + shape.phase) + .35 * Math.cos(a * 3 - shape.phase);
    for (let j = 0; j <= section; j++) {
      const v = j / section;
      const lip = Math.sin(v * Math.PI);
      const r = radius + shape.breadth * (v * 4.5 - .7 * lip);
      const bend = .16 * Math.sin(a * 1.5 + shape.phase) * lip;
      const x = Math.cos(a + bend) * r;
      const y = Math.sin(a + bend) * r * shape.eccentricity;
      // One broad return folds into a deep inner face, not a closed tube cross-section.
      const z = -shape.depth * 4 * (1 - v) ** 3 + Math.sin(a * 1.7 + shape.phase) * (2 + lip * 2.5) + .012 * x * y;
      positions.push(x, y, z);
      uv.push(u, j / section);
      if (i < longitudinal && j < section) {
        const k = i * (section + 1) + j;
        indices.push(k, k + 1, k + section + 1, k + 1, k + section + 2, k + section + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
