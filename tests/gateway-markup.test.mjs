import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("gateway fallback exposes both BM divisions and approved short descriptions", async () => {
  const source = await read("../components/gateway/GatewayFallback.tsx");

  assert.match(source, /BM VISUALS/);
  assert.match(source, /Creative \/ Digital Experience/);
  assert.match(source, /Digital identities/);
  assert.match(source, /with motion, story and distinction\./);
  assert.match(source, /href="\/"/);

  assert.match(source, /BMP TECHNICAL/);
  assert.match(source, /Technology \/ AI Systems/);
  assert.match(source, /AI systems, product logic/);
  assert.match(source, /and technical execution\./);
  assert.match(source, /href="\/gateway-prototype\/technical"/);
});

test("selection overlay contains approved short copy and both real CTAs", async () => {
  const source = await read("../components/gateway/SelectionOverlay.tsx");

  assert.match(source, /Digital identities/);
  assert.match(source, /with motion, story and distinction\./);
  assert.match(source, /AI systems, product logic/);
  assert.match(source, /and technical execution\./);
  assert.match(source, /ENTER VISUALS/);
  assert.match(source, /ENTER TECHNICAL/);
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/gateway-prototype\/technical"/);
  assert.match(source, /gateway-core-mark/);
  assert.match(source, />\s*BM\s*</);
  assert.match(source, /<Link/);
  assert.match(source, /<button/);
  for (const button of source.matchAll(/<button\b[^]*?<\/button>/g)) {
    assert.doesNotMatch(button[0], /<Link/);
  }
  for (const link of source.matchAll(/<Link\b[^]*?<\/Link>/g)) {
    assert.doesNotMatch(link[0], /<button/);
  }
});

test("context cursor adds isolated gateway mode while retaining existing modes", async () => {
  const source = await read("../components/motion/ContextCursor.tsx");
  const css = await read("../app/motion.css");

  assert.match(source, /"gateway"/);
  assert.match(source, /"default"/);
  assert.match(source, /"view"/);
  assert.match(source, /"explore"/);
  assert.match(css, /\.context-cursor\[data-mode="gateway"\]/);
  assert.match(css, /\.context-cursor\[data-mode="view"\],\s*\.context-cursor\[data-mode="explore"\]\s*\{[^}]*width:\s*84px;/s);
});

test("gateway route is isolated from the production homepage", async () => {
  const gateway = await read("../app/gateway-prototype/page.tsx");
  const home = await read("../app/page.tsx");

  assert.match(gateway, /gateway\.css/);
  assert.doesNotMatch(home, /GatewayPrototype|gateway-prototype/i);
});

test("technical prototype route loads the gateway fallback stylesheet directly", async () => {
  const technical = await read("../app/gateway-prototype/technical/page.tsx");

  assert.match(technical, /gateway\.css/);
});

test("gateway canvas is decorative and scene stays dependency-light", async () => {
  const canvas = await read("../components/gateway/TunnelCanvas.tsx");
  const scene = await read("../lib/gateway/scene.ts");

  assert.match(canvas, /aria-hidden="true"/);
  assert.match(scene, /from "three"/);
  assert.match(scene, /BoxGeometry|PlaneGeometry/);
  assert.doesNotMatch(scene, /@react-three|drei|gsap|postprocessing|EffectComposer/);
  assert.doesNotMatch(scene, /TextureLoader|GLTFLoader/);
});

test("loader uses BM counter language without percent", async () => {
  const source = await read("../components/gateway/LoaderOverlay.tsx");

  assert.match(source, /INITIALIZING/);
  assert.match(source, /TWO WORLDS\. ONE SYSTEM\./);
  assert.match(source, /SKIP/);
  assert.doesNotMatch(source, /%/);
});

test("orchestrator owns session resolution, loader modes, fallback timing, and semantic fallback", async () => {
  const source = await read("../components/gateway/GatewayPrototype.tsx");

  assert.match(source, /bmGatewaySeen/);
  assert.match(source, /SESSION_RESOLVED/);
  assert.match(source, /LoaderMode/);
  assert.match(source, /shortLoaderMs/);
  assert.match(source, /fallbackMs/);
  assert.match(source, /GatewayFallback/);
  assert.match(source, /<GatewayFallback/);
  assert.match(source, /getGatewayPresentation/);
  assert.match(source, /enhanced=\{presentation\.enhancementHealthy\}/);
});

test("gateway route renders the shared client orchestrator from a server component", async () => {
  const source = await read("../app/gateway-prototype/page.tsx");

  assert.match(source, /GatewayPrototype/);
  assert.doesNotMatch(source, /[\"']use client[\"']/);
});

test("orchestrator owns one frame loop and cleans up travel input ownership", async () => {
  const source = await read("../components/gateway/GatewayPrototype.tsx");

  assert.equal(source.match(/requestAnimationFrame\(/g)?.length, 1);
  assert.equal(source.match(/setTimeout\(/g)?.length, 2);
  assert.match(source, /dragPointerIdRef/);
  assert.match(source, /exitCompleteRef/);
  assert.match(source, /releasePointerCapture/);
  assert.match(source, /removeEventListener\("wheel"/);
  assert.match(source, /removeEventListener\("pointercancel"/);
  assert.match(source, /safetyTimeoutRef/);
  assert.match(source, /cancelAnimationFrame/);
});

test("orchestrator integrates semantic selection and preserves native activation paths", async () => {
  const source = await read("../components/gateway/GatewayPrototype.tsx");

  assert.match(source, /SelectionOverlay/);
  assert.match(source, /event\.detail/);
  assert.match(source, /committedGuardRef/);
  assert.match(source, /shouldEnhanceGatewayNavigation/);
  assert.match(source, /shouldMarkGatewaySession/);
  assert.match(source, /router\.push\(href\)/);
  assert.match(source, /window\.location\.assign\(href\)/);
  assert.match(source, /navigationFallbackMs/);
  assert.match(source, /hidden=\{!presentation\.fallbackActive\}/);
  assert.match(source, /aria-hidden=\{!presentation\.fallbackActive\}/);
});

test("gateway CSS gives the lifecycle owner the top sibling stacking layer", async () => {
  const css = await read("../app/gateway-prototype/gateway.css");
  const source = await read("../components/gateway/GatewayPrototype.tsx");

  assert.match(source, /data-layer-owner=\{presentation\.layerOwner\}/);
  assert.match(
    css,
    /\.gateway-enhancement\s*\{[^}]*z-index:\s*3;/s,
  );
  assert.match(
    css,
    /\[data-layer-owner="fallback"\][^{]*\.gateway-fallback\s*\{[^}]*z-index:\s*4;/s,
  );
});
