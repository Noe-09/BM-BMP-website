import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import net from "node:net";
import test, { after, before } from "node:test";

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

test("Home establishes the BMP proposition before any experimental presentation", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  assert.equal(response.status, 200);
  assert.match(html, /Creative × Technology × Products/);
  assert.match(
    html,
    /We turn ideas and business problems into brands, systems, and digital products\./,
  );
  assert.match(
    html,
    /BMP is a creative-tech studio working across visual identity, digital experiences, practical business systems, and products of our own\./,
  );
  assert.match(html, /href="\/work"[^>]*>Explore our work/);
  assert.match(html, /href="\/contact"[^>]*>Start a project/);
  assert.doesNotMatch(html, /<canvas\b/i);
  assert.doesNotMatch(html, /loading[^<]*experience/i);
});

test("Home presents three canonical capability worlds with exact copy", async () => {
  const response = await fetch(baseUrl);
  const html = await response.text();

  const worlds = [
    [
      "BM Visual",
      "Make the brand worth noticing.",
      "Brand identity, visual systems, social creative, website presentation, and marketing assets designed to improve recognition and credibility.",
      "/bm-visual",
    ],
    [
      "BM Tech",
      "Build systems around real problems.",
      "Practical web systems, automation, AI-assisted tools, workflows, and custom digital solutions that reduce friction and help teams work smarter.",
      "/bm-tech",
    ],
    [
      "BMP Creator",
      "We build our own things too.",
      "Apps, experiments, and digital products built by BMP — a public proof of how we think, design, ship, and learn.",
      "/creator",
    ],
  ];

  for (const [name, headline, supportingCopy, href] of worlds) {
    assert.match(html, new RegExp(name));
    assert.ok(html.includes(headline));
    assert.ok(html.includes(supportingCopy));
    assert.match(html, new RegExp(`href="${href}"`));
  }
  assert.doesNotMatch(html, /bmp-capability-card/);
});
