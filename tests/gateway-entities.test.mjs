import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";
import { Mesh } from "three";

import {
  CreatorEntity,
  deriveCreatorAssemblyFrame,
} from "../lib/gateway/entities/creatorEntity.ts";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("Creator assembly is deterministic for neutral, hover, and selected states", () => {
  const interactions = [
    { hoverWeight: 0, selectedWeight: 0, recedeWeight: 0, focusWeight: 0 },
    { hoverWeight: 1, selectedWeight: 0, recedeWeight: 0, focusWeight: 0.2 },
    { hoverWeight: 0, selectedWeight: 0.75, recedeWeight: 0, focusWeight: 1 },
  ];

  for (const interaction of interactions) {
    const expected = deriveCreatorAssemblyFrame(14.25, interaction, false);
    assert.deepEqual(
      deriveCreatorAssemblyFrame(14.25, interaction, false),
      expected,
    );
    deriveCreatorAssemblyFrame(2, interaction, false);
    assert.deepEqual(
      deriveCreatorAssemblyFrame(14.25, interaction, false),
      expected,
    );
  }
});

test("Creator uses a restrained mesh and triangle budget", () => {
  const creator = new CreatorEntity();
  const meshes = [];
  creator.group.traverse((object) => {
    if (object instanceof Mesh) meshes.push(object);
  });
  const triangles = meshes.reduce(
    (total, mesh) =>
      total +
      (mesh.geometry.index?.count ?? mesh.geometry.attributes.position.count) /
        3,
    0,
  );

  assert.ok(meshes.length >= 8 && meshes.length <= 11, `mesh count: ${meshes.length}`);
  assert.ok(triangles < 12000, `triangle count: ${triangles}`);
  assert.ok(meshes.some((mesh) => mesh.name === "creator mineral seed"));
  assert.ok(meshes.some((mesh) => mesh.name.startsWith("creator shell")));
  assert.ok(meshes.some((mesh) => mesh.name.startsWith("creator module")));
  creator.dispose();
});

test("Creator resources dispose once and leave an empty group", () => {
  const creator = new CreatorEntity();
  const geometries = new Set();
  const materials = new Set();
  creator.group.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    materials.add(object.material);
  });
  let disposedGeometries = 0;
  let disposedMaterials = 0;
  for (const geometry of geometries) {
    geometry.addEventListener("dispose", () => disposedGeometries += 1);
  }
  for (const material of materials) {
    material.addEventListener("dispose", () => disposedMaterials += 1);
  }

  creator.dispose();
  creator.dispose();
  assert.equal(disposedGeometries, geometries.size);
  assert.equal(disposedMaterials, materials.size);
  assert.equal(creator.group.children.length, 0);
});

test("scene owns a neutral three-entity system without a binary alias", async () => {
  const system = await read("../lib/gateway/entities/destinationEntitySystem.ts");
  const scene = await read("../lib/gateway/scene.ts");

  assert.match(system, /VisualsEntity/);
  assert.match(system, /TechnicalEntity/);
  assert.match(system, /CreatorEntity/);
  assert.match(scene, /DestinationEntitySystem/);
  assert.doesNotMatch(scene, /DualEntitySystem/);
  await assert.rejects(
    access(new URL("../lib/gateway/entities/dualEntitySystem.ts", import.meta.url)),
  );
});
