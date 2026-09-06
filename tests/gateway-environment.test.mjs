import assert from "node:assert/strict";
import test from "node:test";
import { Color, Mesh } from "three";
import { SpectralEnvironment } from "../lib/gateway/environment/spectralEnvironment.ts";
import { deriveJourneyFrame } from "../lib/gateway/journey/chapterState.ts";

const points = [0, .08, .16, .25, .34, .46, .58, .68, .78, .90, 1];
const environment = new SpectralEnvironment();
const fog = new Color(0xeff3f3);
const meshes = [];
environment.group.traverse(object => { if (object instanceof Mesh) meshes.push(object); });
const sample = p => {
  environment.update(deriveJourneyFrame(p), 12 - p * 30, fog);
  return meshes.map(mesh => ({
    position: mesh.position.toArray(), rotation: mesh.rotation.toArray(),
    scale: mesh.scale.toArray(), visible: mesh.visible,
    spectral: mesh.material.uniforms.uSpectral.value,
    opacity: mesh.material.uniforms.uOpacity.value,
  }));
};

test("real scene transforms reconstruct exactly after forward and reverse scrubbing", () => {
  const expected = points.map(sample);
  for (let i = points.length - 1; i >= 0; i--) assert.deepEqual(sample(points[i]), expected[i]);
  for (const index of [4, 1, 9, 3, 7, 0, 10]) assert.deepEqual(sample(points[index]), expected[index]);
});

test("the core swaps actual depth order and relative scale, not just color", () => {
  const first = meshes.findIndex(mesh => mesh.name === "core mineral boundary 4");
  const second = meshes.findIndex(mesh => mesh.name === "core mineral boundary 5");
  const passage = sample(.46), core = sample(.70);
  assert.ok(passage[first].position[2] > passage[second].position[2]);
  assert.ok(core[first].position[2] < core[second].position[2]);
  assert.ok(core[first].scale[0] < passage[first].scale[0]);
  assert.ok(core[second].scale[0] > passage[second].scale[0]);
});

test("numeric scene transforms remain continuous at every chapter boundary", () => {
  for (const p of [.16, .34, .58, .78, .96, .98]) {
    const before = sample(p - 1e-7), after = sample(p + 1e-7);
    for (let i = 0; i < meshes.length; i++) for (const key of ["position", "rotation", "scale"]) {
      before[i][key].forEach((value, axis) => {
        if (typeof value === "number") assert.ok(Math.abs(value - after[i][key][axis]) < .0001, `${p}: ${i}/${key}/${axis}`);
      });
    }
  }
});

test("optics are two bounded accent encounters; final chamber retains the same opaque world", () => {
  for (const p of [0, .08, .16, .46, .78, .90, 1]) {
    sample(p);
    assert.equal(environment.optics.children.filter(mesh => mesh.visible).length, 0);
  }
  for (const p of [.30, .64]) {
    sample(p);
    assert.equal(environment.optics.children.filter(mesh => mesh.visible).length, 1);
  }
  sample(1);
  assert.equal(meshes.filter(mesh => mesh.visible && !mesh.material.transparent).length, 9);
});

test("meshed solids are finite, bounded, and static; no per-frame geometry allocation", () => {
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
  assert.ok(triangles < 400000, `triangle budget: ${triangles}`);
  points.forEach(sample);
  assert.deepEqual(meshes.map(mesh => mesh.geometry.attributes.position.version), versions);
});

test("every environment geometry and material is released", () => {
  let geometryCount = 0, materialCount = 0;
  for (const mesh of meshes) {
    mesh.geometry.addEventListener("dispose", () => geometryCount++);
    mesh.material.addEventListener("dispose", () => materialCount++);
  }
  environment.dispose();
  assert.equal(geometryCount, meshes.length);
  assert.equal(materialCount, meshes.length);
  assert.equal(environment.group.children.length, 0);
  assert.equal(environment.optics.children.length, 0);
  environment.dispose();
  assert.equal(geometryCount, meshes.length);
});
