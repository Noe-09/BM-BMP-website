import { ExtrudeGeometry, PlaneGeometry, Shape, Vector2 } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/** A solid tectonic wall section, with a polygonal void and a bevelled cut face.
 * The outer edges extend beyond the view: these are portions of architecture,
 * not floating shards. The angular inner profile is shared across the assembly.
 */
export function createArchitecturalGeometry(start: number, sweep: number, inner: number, outer: number, depth: number, facets = 3, laminae = 1) {
  const sections = [];
  for (let layer = 0; layer < laminae; layer++) {
    const inset = layer * .23;
    const shape = sectionShape(start, sweep, inner + inset, outer, facets);
    const section = new ExtrudeGeometry(shape, {
      depth: depth / laminae * .86, steps: 1, bevelEnabled: true,
      bevelThickness: .065, bevelSize: .06, bevelSegments: 3, curveSegments: 1,
    });
    section.translate(0, 0, -depth * .5 + layer * depth / laminae);
    sections.push(section);
  }
  const geometry = mergeGeometries(sections);
  for (const section of sections) section.dispose();
  geometry.computeBoundingSphere();
  return geometry;
}

function sectionShape(start: number, sweep: number, inner: number, outer: number, facets: number) {
  const points: Vector2[] = [];
  const profile = (angle: number, radius: number) => new Vector2(
    Math.cos(angle) * radius * (1 + .10 * Math.sin(angle * 3 + .6)),
    Math.sin(angle) * radius * .82,
  );
  for (let i = 0; i <= facets; i++) points.push(profile(start + sweep * i / facets, inner));
  for (let i = facets; i >= 0; i--) points.push(profile(start + sweep * i / facets, outer));
  return new Shape(points);
}

/** Distant concave light receiver. Its luminous contours live in this space. */
export function createChamberFieldGeometry() {
  const geometry = new PlaneGeometry(210, 150, 32, 24);
  const position = geometry.attributes.position;
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i), y = position.getY(i);
    position.setZ(i, -.0018 * x * x - .0026 * y * y);
  }
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}
