import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

// Production break caught: BMP Tech falls back to generic service-card content instead of its typed system truth model.
test("BMP Tech owns a typed system truth model instead of reusing generic service cards", async () => {
  const source = await read("content/tech.ts");

  assert.match(source, /export type TechMaturity = "active" \| "verified" \| "planned"/);
  assert.match(source, /export type TechCapabilityState = "available"/);
  assert.match(source, /export type TechStateRecord/);
  assert.match(source, /SYSTEM PROTOTYPE 01/);
  assert.match(source, /AI SOCIAL MEDIA POSTING SYSTEM/);
  assert.match(source, /PROTOTYPE \/ PLANNED/);
  assert.match(source, /SYSTEM STATE/);
  assert.match(source, /SYSTEMS IN MOTION/);
  assert.match(source, /TELL US THE PROBLEM/);
  assert.match(source, /WORKFLOW SYSTEMS/);
  assert.match(source, /INTERNAL TOOLS/);
  assert.match(source, /CUSTOMER SYSTEMS/);
  assert.match(source, /LEAD SYSTEMS/);
  assert.match(source, /OPERATION SYSTEMS/);
  assert.match(source, /FOCUSED WEB SYSTEMS/);
  assert.match(source, /CUSTOM MVPs/);
});

// Production break caught: capability availability is conflated with unsupported implementation maturity.
test("implementation maturity and capability availability remain separate vocabularies", async () => {
  const source = await read("content/tech.ts");

  assert.match(source, /maturity:\s*TechMaturity/);
  assert.match(source, /capabilityState:\s*TechCapabilityState/);
  assert.doesNotMatch(source, /capabilityState:\s*"verified"/);
  assert.doesNotMatch(source, /maturity:\s*"(?:active|verified)"/);
  assert.doesNotMatch(source, /state:\s*"(?:active|verified)"/);
});

// Production break caught: a flagship stage is omitted or presented as anything other than the approved planned state.
test("all seven flagship stages are represented as planned state records", async () => {
  const source = await read("content/tech.ts");

  for (const label of [
    "INGEST",
    "NORMALIZE",
    "ORCHESTRATE",
    "ASSIST",
    "CHECKPOINT",
    "EXECUTE",
    "RETURN",
  ]) {
    assert.match(
      source,
      new RegExp(`label: "${label}",[\\s\\S]{0,120}?state: "planned"`),
    );
  }
});

// Production break caught: unsupported performance claims enter the canonical Tech content.
test("Tech canonical content contains no fabricated metric grammar", async () => {
  const source = await read("content/tech.ts");

  assert.doesNotMatch(source, /\b(?:uptime|conversion|revenue|engagement rate|posts processed)\b/i);
  assert.doesNotMatch(source, /\b\d+(?:\.\d+)?%\b/);
});
