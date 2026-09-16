import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("BM Tech route owns Systems Observatory instead of generic services grammar", async () => {
  const page = await read("app/bm-tech/page.tsx");
  const experience = await read("components/tech/TechExperience.tsx");

  assert.match(page, /TechExperience/);
  assert.match(page, /SiteHeader/);
  assert.match(page, /SiteFooter/);
  assert.doesNotMatch(page, /PageHero|ServiceIndex/);
  assert.match(experience, /data-tech-experience/);
  assert.match(experience, /SystemObservatory/);
  assert.match(experience, /SystemState/);
  assert.match(experience, /SystemSpectrum/);
  assert.match(experience, /SystemsRegister/);
  assert.match(experience, /TechClosing/);
});

test("BM Tech owns route-scoped styling", async () => {
  const layout = await read("app/bm-tech/layout.tsx");
  assert.match(layout, /import "\.\/tech\.css"/);
});

test("flagship observatory exposes causal semantics without relying on SVG alone", async () => {
  const [observatory, topology, checkpoint] = await Promise.all([
    read("components/tech/SystemObservatory.tsx"),
    read("components/tech/SystemTopology.tsx"),
    read("components/tech/HumanCheckpoint.tsx"),
  ]);

  assert.match(observatory, /AI SOCIAL MEDIA POSTING SYSTEM/);
  assert.match(observatory, /data-tech-stage="ingest"/);
  assert.match(observatory, /data-tech-stage="normalize"/);
  assert.match(observatory, /data-tech-stage="orchestrate"/);
  assert.match(observatory, /data-tech-stage="assist"/);
  assert.match(observatory, /data-tech-stage="checkpoint"/);
  assert.match(observatory, /data-tech-stage="execute"/);
  assert.match(observatory, /data-tech-stage="return"/);

  assert.match(topology, /<svg/);
  assert.match(topology, /aria-hidden="true"/);
  assert.match(topology, /system\.nodes|nodes\.map/);
  assert.match(topology, /routes\.map/);

  assert.match(checkpoint, /APPROVE/);
  assert.match(checkpoint, /ADJUST/);
  assert.match(checkpoint, /HOLD/);
  assert.match(checkpoint, /button|tabIndex/);
});

test("Tech flagship does not use forbidden generic tech tropes", async () => {
  const source = (
    await Promise.all([
      read("components/tech/SystemObservatory.tsx"),
      read("components/tech/SystemTopology.tsx"),
      read("components/tech/HumanCheckpoint.tsx"),
    ])
  ).join("\n");

  assert.doesNotMatch(source, /iframe|dangerouslySetInnerHTML/);
  assert.doesNotMatch(source, /terminal|matrix|glassmorphism|AI orb/i);
  assert.doesNotMatch(source, /OpenAI|Zapier|Make\.com|n8n|HubSpot|Salesforce/);
});

test("checkpoint propagation resumes after local human inspection without making the controls a form", async () => {
  const [css, checkpoint] = await Promise.all([
    read("app/bm-tech/tech.css"),
    read("components/tech/HumanCheckpoint.tsx"),
  ]);

  assert.match(
    css,
    /data-tech-phase="execute"\] \.tech-topology__route\[data-route-id="checkpoint-execute"\]/,
  );
  assert.match(
    css,
    /data-tech-phase="return"\] \.tech-topology__route\[data-route-id="checkpoint-execute"\]/,
  );
  assert.match(checkpoint, /role="group"/);
  assert.match(checkpoint, /aria-label="Local decision inspection"/);
  assert.doesNotMatch(checkpoint, /<form|onSubmit/);
});

test("Tech state and capabilities remain semantically distinct", async () => {
  const [state, spectrum, register, closing] = await Promise.all([
    read("components/tech/SystemState.tsx"),
    read("components/tech/SystemSpectrum.tsx"),
    read("components/tech/SystemsRegister.tsx"),
    read("components/tech/TechClosing.tsx"),
  ]);

  assert.match(state, /SYSTEM STATE/);
  assert.match(state, /WHAT IS DESIGNED/);
  assert.match(state, /data-state-record-state/);

  assert.match(spectrum, /SYSTEM FAMILIES/);
  assert.match(spectrum, /causalSteps/);

  assert.match(register, /SYSTEMS REGISTER/);
  assert.match(register, /capabilityState/);
  assert.match(register, /AVAILABLE/);

  assert.match(closing, /SHOW US THE PROCESS/);
  assert.match(closing, /TELL US THE PROBLEM/);
  assert.match(closing, /href=\{tech\.action\.href\}/);
});

test("Tech does not present state as fake analytics", async () => {
  const state = await read("components/tech/SystemState.tsx");
  assert.doesNotMatch(state, /progress|chart|percentage|uptime|metric/i);
});

test("Tech transitions from one system to the wider practice through typed copy", async () => {
  const [experience, transition, content] = await Promise.all([
    read("components/tech/TechExperience.tsx"),
    read("components/tech/SystemPracticeTransition.tsx"),
    read("content/tech.ts"),
  ]);

  assert.match(transition, /tech\.transitionStatement\.map/);
  assert.match(content, /"ONE SYSTEM IS NOT THE PRACTICE\."/);
  assert.match(content, /"THE PRACTICE IS BUILDING THE RIGHT SYSTEM AROUND THE PROBLEM\."/);
  assert.match(experience, /SystemPracticeTransition/);
  assert.ok(
    experience.indexOf("<SystemState") < experience.indexOf("<SystemPracticeTransition") &&
      experience.indexOf("<SystemPracticeTransition") < experience.indexOf("<SystemSpectrum"),
  );
});

test("Tech visibly renders its canonical delivery scope without a clipped legacy surface", async () => {
  const [content, experience, spectrum, css] = await Promise.all([
    read("content/tech.ts"),
    read("components/tech/TechExperience.tsx"),
    read("components/tech/SystemSpectrum.tsx"),
    read("app/bm-tech/tech.css"),
  ]);

  assert.match(content, /export const TECH_PRACTICE_SCOPE/);
  assert.match(content, /SERVICES\.tech/);
  assert.match(experience, /TECH_PRACTICE_SCOPE/);
  assert.doesNotMatch(experience, /@\/content\/services|tech-canonical-scope/);
  assert.match(spectrum, /scope\.headline/);
  assert.match(spectrum, /scope\.supportingCopy/);
  assert.match(spectrum, /scope\.deliveryScopes\.map/);
  assert.doesNotMatch(spectrum, /sr-only|visually-hidden|hidden/);
  assert.doesNotMatch(css, /tech-canonical-scope/);
});

test("Tech CSS has explicit mobile and reduced-motion causal modes", async () => {
  const [css, topology] = await Promise.all([
    read("app/bm-tech/tech.css"),
    read("components/tech/SystemTopology.tsx"),
  ]);

  assert.match(css, /@media[^{]*max-width:\s*768px/);
  assert.match(css, /@media[^{]*max-width:\s*480px/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.tech-page \.tech-observatory__stage-index[\s\S]*?transition:\s*none/,
  );
  assert.match(css, /--tech-signal:\s*#C6F35B/i);
  assert.match(css, /--tech-human:\s*#E89A52/i);
  assert.match(css, /--tech-planned:\s*#82939E/i);
  assert.match(css, /data-tech-consequence="signal-enter"/);
  assert.match(css, /data-tech-consequence="data-structure"/);
  assert.match(css, /data-tech-consequence="route-resolve"/);
  assert.match(css, /data-tech-consequence="assist-form"/);
  assert.match(css, /data-tech-consequence="output-propagate"/);
  assert.match(css, /data-tech-consequence="feedback-return"/);
  assert.match(
    css,
    /data-tech-consequence="output-propagate"\][\s\S]{0,320}data-route-id="checkpoint-execute"\][\s\S]{0,220}stroke:\s*var\(--tech-signal\)/,
  );
  assert.match(css, /data-tech-propagation="hold"/);
  assert.match(topology, /data-glyph-type=\{node\.type\}/);
  assert.match(topology, /tech-topology__glyph-line/);
  assert.match(topology, /tech-topology__glyph-frame/);
  assert.match(topology, /tech-topology__glyph-branch/);
  assert.doesNotMatch(css, /backdrop-filter:\s*blur/i);
});

test("lower-page hierarchy stays structural instead of relying on clipping or decorative color fields", async () => {
  const css = await read("app/bm-tech/tech.css");

  assert.doesNotMatch(
    css,
    /\.tech-page \.tech-system-spectrum\s*\{[^}]*overflow:\s*hidden/,
  );
  assert.match(css, /\.tech-system-spectrum__family[\s\S]{0,260}min-height:\s*clamp\(12rem,\s*20vw,\s*17rem\)/);
  assert.match(css, /\.tech-systems-register table[\s\S]{0,180}table-layout:\s*fixed/);
  assert.match(
    css,
    /@media \(max-width:\s*768px\)[\s\S]*?\.tech-page \.tech-systems-register :is\(th, td\):nth-child\(n\)\s*\{[\s\S]*?width:\s*auto/,
  );
  assert.match(css, /\.tech-closing__action[\s\S]{0,260}border-bottom:\s*1px solid var\(--tech-signal\)/);
});

test("Tech visual system keeps planned state distinguishable beyond color", async () => {
  const css = await read("app/bm-tech/tech.css");
  assert.match(css, /\[data-maturity="planned"\][\s\S]*stroke-dasharray/);
});
