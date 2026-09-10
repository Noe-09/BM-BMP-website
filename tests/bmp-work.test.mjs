import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import net from "node:net";
import test, { after, before } from "node:test";

import { getPublishedWorkProjects, PROJECT_STATUSES, WORK } from "../content/work.ts";
import { projectRegistry } from "../lib/projects/selected-work.ts";

const nextBin = new URL("../node_modules/next/dist/bin/next", import.meta.url);
let server;
let baseUrl;

async function reservePort() {
  return await new Promise((resolve, reject) => {
    const listener = net.createServer();
    listener.once("error", reject);
    listener.listen(0, "127.0.0.1", () => {
      const address = listener.address();
      const port = typeof address === "object" && address ? address.port : 0;
      listener.close((error) => (error ? reject(error) : resolve(port)));
    });
  });
}

async function waitForServer(url) {
  let lastError;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.status < 500) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

before(async () => {
  const port = await reservePort();
  const requestedUrl = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [nextBin.pathname, "dev", "--hostname", "127.0.0.1", "--port", String(port)],
    {
      cwd: new URL("..", import.meta.url),
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  let startupOutput = "";
  const startup = new Promise((resolve, reject) => {
    let settled = false;
    let readyTimer;
    const finish = (callback) => {
      if (settled) return;
      settled = true;
      if (readyTimer) clearTimeout(readyTimer);
      callback();
    };
    const inspect = (chunk) => {
      startupOutput += chunk.toString();
      const existing = startupOutput.match(
        /existing server at (http:\/\/[^,\s]+)/i,
      )?.[1];
      if (existing) {
        finish(() => {
          baseUrl = existing.replace("localhost", "127.0.0.1");
          server = undefined;
          resolve();
        });
        return;
      }
      if (/Ready in/i.test(startupOutput) && !readyTimer) {
        readyTimer = setTimeout(() => {
          if (server?.exitCode === null) {
            finish(() => {
              baseUrl = requestedUrl;
              resolve();
            });
          }
        }, 2_000);
      }
    };
    server.stdout.on("data", inspect);
    server.stderr.on("data", inspect);
    server.once("error", reject);
    server.once("exit", (code) => {
      if (!settled && !/existing server at/i.test(startupOutput)) {
        finish(() =>
          reject(new Error(`Next dev exited with ${code}: ${startupOutput}`)),
        );
      }
    });
  });
  await startup;
  await waitForServer(baseUrl);
});

after(async () => {
  if (!server || server.exitCode !== null) return;
  server.kill("SIGTERM");
  await new Promise((resolve) => {
    server.once("exit", resolve);
    setTimeout(resolve, 2_000);
  });
});

test("verified repository projects use only the approved public status vocabulary", async () => {
  assert.deepEqual(PROJECT_STATUSES, [
    "Client Work",
    "Concept",
    "Demo",
    "Experiment",
    "Owned Product",
  ]);
  assert.equal(projectRegistry.length, 4);
  assert.equal(getPublishedWorkProjects(WORK.projects).length, 4);

  for (const project of projectRegistry) {
    assert.ok(PROJECT_STATUSES.includes(project.status));
    assert.equal(project.publication.status, "verified");
    assert.ok(project.categories.length > 0);
    assert.ok(project.challenge.length > 0);
    assert.ok(project.created.length > 0);
    assert.ok(project.outcome.length > 0);
    assert.ok(project.previewAssets.length > 0);
    for (const asset of project.previewAssets) {
      await access(new URL(`../public${asset.src}`, import.meta.url));
    }
  }
});

test("Work exposes verified status and proof fields for every published record", async () => {
  const response = await fetch(`${baseUrl}/work`);
  const html = await response.text();

  assert.equal(response.status, 200);
  for (const project of projectRegistry) {
    assert.ok(html.includes(project.title));
    assert.ok(html.includes(project.status));
    assert.ok(html.includes(project.challenge));
    assert.ok(html.includes(project.created));
    assert.ok(html.includes(project.outcome));
    assert.match(html, new RegExp(`href="/work/${project.slug}"`));
  }
  assert.ok(html.includes("View project"));
  assert.ok(html.includes("See process"));
  assert.doesNotMatch(html, /Concept Project|Experimental Concept/);
});

test("every case study uses the BMP shell and canonical five-section structure", async () => {
  const sectionHeadings = [
    "The challenge",
    "The direction",
    "What we built",
    "Why it matters",
    "Next",
  ];

  for (const project of projectRegistry) {
    const response = await fetch(`${baseUrl}/work/${project.slug}`);
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.match(html, /aria-label="Primary navigation"/);
    assert.ok(html.includes(project.status));
    for (const heading of sectionHeadings) assert.ok(html.includes(heading));
    assert.doesNotMatch(html, /BM VISUALS|Digital experience division of BM/);
  }
});

test("route-primary Work imagery opts into eager loading", async () => {
  const caseHero = await readFile(
    new URL("../components/case/CaseHero.tsx", import.meta.url),
    "utf8",
  );
  const workIndex = await readFile(
    new URL("../components/work/WorkProjectIndex.tsx", import.meta.url),
    "utf8",
  );
  const caseScenes = await readFile(
    new URL("../components/case/CaseScenes.tsx", import.meta.url),
    "utf8",
  );

  assert.match(caseHero, /loading="eager"/);
  assert.match(workIndex, /loading=\{[^}]*\? "eager" : "lazy"\}/);
  assert.match(
    caseScenes,
    /asset\.src === caseStudy\.heroAsset\.src \? "eager" : "lazy"/,
  );
});
