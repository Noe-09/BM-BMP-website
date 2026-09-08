import assert from "node:assert/strict";
import test from "node:test";
import { Color, Mesh, Raycaster, Vector3 } from "three";
import { SpectralEnvironment } from "../lib/gateway/environment/spectralEnvironment.ts";
import { deriveJourneyFrame } from "../lib/gateway/journey/chapterState.ts";
import { createSpectralPalette, sampleSpectralPalette } from "../lib/gateway/environment/spectralPalette.ts";

const points = [0, .08, .16, .25, .34, .46, .54, .58, .60, .68, .74, .78, .80, .86, .90, .96, 1];
const environment = new SpectralEnvironment();
const fog = new Color(0xeff3f3);
const meshes = [];
environment.group.traverse(object => { if (object instanceof Mesh) meshes.push(object); });
const sample = p => {
  environment.update(deriveJourneyFrame(p), 12 - p * 30, fog);
  return meshes.map(mesh => ({
    position: mesh.position.toArray(), rotation: mesh.rotation.toArray(),
    scale: mesh.scale.toArray(), visible: mesh.visible,
    uniforms: Object.fromEntries(Object.entries(mesh.material.uniforms)
      .filter(([key]) => key !== "uBackground")
      .map(([key, { value }]) => [key, value?.toArray ? value.toArray() : value])),
  }));
};
const index = name => meshes.findIndex(mesh => mesh.name === name);

test("every scene transform and uniform reconstructs exactly in reverse and shuffled order", () => {
  const expected = points.map(sample);
  for (let i = points.length - 1; i >= 0; i--) assert.deepEqual(sample(points[i]), expected[i]);
  for (const i of [4, 1, 9, 3, 7, 0, 16]) assert.deepEqual(sample(points[i]), expected[i]);
});

test("impossible core exchanges actual depth order with opposing projected scale", () => {
  const a = index("core chamber boundary 0"), b = index("core chamber boundary 1");
  const entry = sample(.54), exchanged = sample(.74);
  assert.ok(entry[a].position[2] > entry[b].position[2]);
  assert.ok(exchanged[a].position[2] < exchanged[b].position[2]);
  assert.ok(exchanged[a].scale[0] > entry[a].scale[0]);
  assert.ok(exchanged[b].scale[0] < entry[b].scale[0]);
  assert.ok(Math.abs(exchanged[a].rotation[1] - exchanged[b].rotation[1]) > 1.5);
});

test("rupture opens the pearl shell and release physically parts the chamber", () => {
  const a = index("shell chamber boundary 0"), b = index("shell chamber boundary 1");
  const origin = sample(.08), rupture = sample(.34);
  assert.ok(Math.abs(rupture[a].position[1] - rupture[b].position[1]) > Math.abs(origin[a].position[1] - origin[b].position[1]) + 12);
  const core = index("core chamber boundary 0");
  const pressure = sample(.78), released = sample(.96);
  assert.ok(Math.abs(released[core].position[0]) > Math.abs(pressure[core].position[0]) + 20);
});

test("scene state is continuous at event and chapter boundaries", () => {
  const numeric = value => typeof value === "number" ? [value] : Array.isArray(value) ? value.flatMap(numeric) : value && typeof value === "object" ? Object.values(value).flatMap(numeric) : [];
  for (const p of [.08, .14, .16, .34, .38, .54, .58, .60, .68, .74, .78, .80, .90, .94, .96, .98]) {
    const before = numeric(sample(p - 1e-7)), after = numeric(sample(p + 1e-7));
    before.forEach((v, i) => assert.ok(Math.abs(v - after[i]) < .0002, `${p}/${i}`));
  }
});

test("chapter color is bounded, continuous, reversible and separated by depth", () => {
  const palette = createSpectralPalette();
  const colors = p => Object.values(sampleSpectralPalette(p, palette)).flatMap(c => c.toArray());
  const expected = points.map(colors);
  points.forEach((p, i) => assert.deepEqual(colors(p), expected[i]));
  for (const p of points) {
    const before = colors(p - 1e-7), after = colors(p + 1e-7);
    before.forEach((v, i) => { assert.ok(v >= 0 && v <= 1); assert.ok(Math.abs(v - after[i]) < .00001); });
  }
  const core = sample(.68);
  assert.notDeepEqual(core[index("far chamber boundary 0")].uniforms.uCool, core[index("fracture chamber boundary 0")].uniforms.uCool);
  assert.ok(core[index("optical chamber boundary 0")].uniforms.uOpticalEnergy > core[index("fracture chamber boundary 0")].uniforms.uOpticalEnergy);
  assert.ok(core[index("far chamber boundary 0")].uniforms.uOpticalEnergy < core[index("fracture chamber boundary 0")].uniforms.uOpticalEnergy);
});

test("optics remain bounded accent encounters, with no capture needed at final", () => {
  for (const p of [0, .08, .16, .46, .78, .90, 1]) {
    sample(p);
    assert.equal(environment.optics.children.filter(mesh => mesh.visible).length, 0);
  }
  for (const p of [.30, .64]) {
    sample(p);
    assert.equal(environment.optics.children.filter(mesh => mesh.visible).length, 1);
  }
});

test("final hero sightlines are clear of foreground environment walls", () => {
  sample(1);
  environment.group.updateMatrixWorld(true);
  const camera = new Vector3(0, 0, -18);
  // At the fixed hero plane (~14m), test left, center, right and vertical extents.
  for (const x of [-4.2, -2, 0, 2, 4.2]) for (const y of [-2, 0, 2]) {
    const ray = new Raycaster(camera, new Vector3(x, y, -14).normalize(), 0, 14);
    const hits = ray.intersectObjects(meshes.filter(m => m.visible && !m.material.transparent));
    assert.equal(hits.length, 0, `occlusion at ${x}/${y}: ${hits[0]?.object.name}`);
  }
});

test("architecture has static finite geometry, unit normals, and bounded triangle cost", () => {
  const versions = meshes.map(mesh => mesh.geometry.attributes.position.version);
  let triangles = 0;
  for (const mesh of meshes) {
    const { position, normal } = mesh.geometry.attributes;
    for (const value of position.array) assert.ok(Number.isFinite(value));
    for (let i = 0; i < normal.count; i++) {
      const length = Math.hypot(normal.getX(i), normal.getY(i), normal.getZ(i));
      assert.ok(length > .98 && length < 1.02);
    }
    triangles += (mesh.geometry.index?.count ?? position.count) / 3;
  }
  assert.ok(triangles < 100000, `triangle budget: ${triangles}`);
  points.forEach(sample);
  assert.deepEqual(meshes.map(mesh => mesh.geometry.attributes.position.version), versions);
});

test("unique geometry and materials dispose exactly once, including shared distant buffers", () => {
  const geometries = new Set(meshes.map(m => m.geometry));
  let geometryCount = 0, materialCount = 0;
  for (const geometry of geometries) geometry.addEventListener("dispose", () => geometryCount++);
  for (const mesh of meshes) mesh.material.addEventListener("dispose", () => materialCount++);
  environment.dispose();
  environment.dispose();
  assert.equal(geometryCount, geometries.size);
  assert.equal(materialCount, meshes.length);
  assert.equal(environment.group.children.length, 0);
});
