import assert from "node:assert/strict";
import test from "node:test";
import { Color, Mesh } from "three";
import { SpectralEnvironment } from "../lib/gateway/environment/spectralEnvironment.ts";
import { deriveJourneyFrame } from "../lib/gateway/journey/chapterState.ts";
import { createSpectralPalette, sampleSpectralPalette } from "../lib/gateway/environment/spectralPalette.ts";

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
    colors: ["uPearl", "uCool", "uViolet", "uWarm", "uShadow"].flatMap(key => mesh.material.uniforms[key].value.toArray()),
    opticalEnergy: mesh.material.uniforms.uOpticalEnergy?.value,
    destination: mesh.material.uniforms.uDestination?.value,
    exposure: mesh.material.uniforms.uExposure?.value,
    haze: mesh.material.uniforms.uHaze?.value,
    glow: mesh.material.uniforms.uGlow?.value,
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

test("three cinematic events create readable reveal, core disagreement, and release", () => {
  const index = name => meshes.findIndex(mesh => mesh.name === name);
  const vault = index("vault mineral boundary 2"), shelf = index("shelf mineral boundary 3");
  const first = index("core mineral boundary 4"), second = index("core mineral boundary 5");
  const revealStart = sample(.26), revealPeak = sample(.36);
  const startGap = Math.abs(revealStart[vault].position[0] - revealStart[shelf].position[0]);
  const revealGap = Math.abs(revealPeak[vault].position[0] - revealPeak[shelf].position[0]);
  assert.ok(revealGap > startGap + 2, `reveal gap ${startGap} → ${revealGap}`);

  const coreStart = sample(.60), corePeak = sample(.75);
  const startDepth = Math.abs(coreStart[first].position[2] - coreStart[second].position[2]);
  const coreDepth = Math.abs(corePeak[first].position[2] - corePeak[second].position[2]);
  assert.ok(coreDepth > startDepth + 3.5, `core depth disagreement ${startDepth} → ${coreDepth}`);

  const releasePeak = sample(.91);
  const releaseGap = Math.abs(releasePeak[vault].position[0] - releasePeak[shelf].position[0]);
  assert.ok(releaseGap > 3, `release gap ${releaseGap}`);
});

test("cinematic density uses exactly three subordinate shared-geometry far echoes", () => {
  const echoes = meshes.filter(mesh => mesh.name.startsWith("echo spectral boundary"));
  const farGeometry = new Set(meshes.filter(mesh => mesh.name.startsWith("far mineral boundary")).map(mesh => mesh.geometry));
  assert.equal(echoes.length, 3);
  assert.ok(echoes.every(mesh => farGeometry.has(mesh.geometry)));
  assert.equal(new Set(echoes.map(mesh => mesh.geometry)).size, 3);
  assert.ok(echoes.every(mesh => !mesh.material.transparent));
});

test("numeric scene transforms remain continuous at every chapter boundary", () => {
  for (const p of [.16, .34, .58, .78, .96, .98]) {
    const before = sample(p - 1e-7), after = sample(p + 1e-7);
    for (let i = 0; i < meshes.length; i++) for (const key of ["position", "rotation", "scale", "colors"]) {
      before[i][key].forEach((value, axis) => {
        if (typeof value === "number") assert.ok(Math.abs(value - after[i][key][axis]) < .0001, `${p}: ${i}/${key}/${axis}`);
      });
    }
  }
});

test("chapter colors are continuous, bounded, spatially delayed and reversible", () => {
  const palette = createSpectralPalette();
  const colors = p => Object.values(sampleSpectralPalette(p, palette)).flatMap(color => color.toArray());
  const expected = points.map(colors);
  for (let i = points.length - 1; i >= 0; i--) assert.deepEqual(colors(points[i]), expected[i]);
  for (const p of [0, .16, .34, .46, .68, .78, .9, 1]) {
    const before = colors(p - 1e-7), after = colors(p + 1e-7);
    before.forEach((value, i) => {
      assert.ok(value >= 0 && value <= 1);
      assert.ok(Math.abs(value - after[i]) < .00001);
    });
  }
  sample(.46);
  const near = meshes.find(mesh => mesh.name.startsWith("optical"));
  const mid = meshes.find(mesh => mesh.name.startsWith("vault"));
  const far = meshes.find(mesh => mesh.name.startsWith("far"));
  assert.deepEqual(near.material.uniforms.uCool.value, mid.material.uniforms.uCool.value);
  assert.notDeepEqual(far.material.uniforms.uCool.value, mid.material.uniforms.uCool.value);
  assert.notDeepEqual(colors(1), colors(0));
});

test("cinematic light hierarchy is progress-authored and layered by depth", () => {
  const at = (state, name) => state[meshes.findIndex(mesh => mesh.name === name)];
  const origin = sample(0), passage = sample(.46), core = sample(.75), emergence = sample(.91);
  for (const state of [origin, passage, core, emergence]) for (const mesh of state) {
    for (const key of ["opticalEnergy", "destination", "exposure", "haze", "glow"])
      assert.ok(Number.isFinite(mesh[key]) && mesh[key] >= 0 && mesh[key] <= 1, `${key}: ${mesh[key]}`);
  }

  const mid = at(core, "vault mineral boundary 2");
  const near = at(core, "optical mineral boundary 9");
  const far = at(core, "far mineral boundary 7");
  assert.ok(near.opticalEnergy > mid.opticalEnergy);
  assert.ok(far.opticalEnergy < mid.opticalEnergy);
  assert.ok(at(passage, "far mineral boundary 6").destination > at(passage, "far mineral boundary 7").destination);
  assert.ok(at(core, "vault mineral boundary 2").haze !== at(origin, "vault mineral boundary 2").haze);
  assert.ok(at(emergence, "vault mineral boundary 2").exposure > at(core, "vault mineral boundary 2").exposure);
  assert.ok(mid.glow > at(origin, "vault mineral boundary 2").glow);
});

test("cinematic material uniforms reconstruct exactly in reverse and shuffled order", () => {
  const points = [0, .08, .16, .26, .34, .36, .44, .46, .58, .60, .68, .72, .75, .78, .80, .82, .90, .91, .98, 1];
  const expected = points.map(sample);
  for (let i = points.length - 1; i >= 0; i--) assert.deepEqual(sample(points[i]), expected[i]);
  for (const index of [12, 3, 17, 0, 9, 19, 6]) assert.deepEqual(sample(points[index]), expected[index]);
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
  assert.equal(meshes.filter(mesh => mesh.visible && !mesh.material.transparent).length, 12);
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
