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
  for (let attempt = 0; attempt < 100; attempt += 1) {
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
  baseUrl = `http://127.0.0.1:${port}`;
  server = spawn(
    process.execPath,
    [
      nextBin.pathname,
      "dev",
      "--webpack",
      "--hostname",
      "127.0.0.1",
      "--port",
      String(port),
    ],
    {
      cwd: new URL("..", import.meta.url),
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  server.stdout.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.stderr.on("data", (chunk) => {
    output += chunk.toString();
  });
  server.once("exit", (code) => {
    if (code && code !== 0) process.stderr.write(output);
  });
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

test("Creator publishes only the three approved detail routes", async () => {
  for (const slug of ["weins", "slyour", "the-xide"]) {
    const response = await fetch(`${baseUrl}/creator/${slug}`);
    assert.equal(response.status, 200, `${slug} should be published`);
  }

  for (const slug of ["pawsona", "relationship", "miner", "not-a-world"]) {
    const response = await fetch(`${baseUrl}/creator/${slug}`);
    assert.equal(response.status, 404, `${slug} should remain unavailable`);
  }
});

test("Creator details use the approved exhibition grammar", async () => {
  const destinations = new Map([
    ["weins", "https://weins-chi.vercel.app/"],
    ["slyour", "https://slyour.vercel.app/"],
    ["the-xide", "https://thexide.vercel.app/"],
  ]);

  for (const [slug, liveUrl] of destinations) {
    const response = await fetch(`${baseUrl}/creator/${slug}`);
    const html = await response.text();

    assert.equal(html.match(/<h1\b/g)?.length, 1);
    assert.match(html, new RegExp(`data-creator-theme="${slug}"`));
    for (const marker of [
      "ENTRY",
      "THE IDEA",
      "THE WORLD",
      "WHAT EXISTS",
      "HOW IT BEHAVES",
      "CURRENT STATE",
      "WHAT&#x27;S NEXT",
      "ENTER / EXIT",
    ]) {
      assert.ok(html.includes(marker), `${slug} should include ${marker}`);
    }
    assert.match(
      html,
      new RegExp(
        `href="${liveUrl.replaceAll(".", "\\.")}"[^>]*target="_blank"[^>]*rel="noopener noreferrer"`,
      ),
    );
    assert.match(html, /VISIT LIVE/);
    assert.match(html, /opens in a new tab/);
    assert.doesNotMatch(html, /components\/case|data-bm-visual/);
  }
});

test("Creator overview keeps portals internal and adds LIVE only in eligible Index rows", async () => {
  const response = await fetch(`${baseUrl}/creator`);
  const html = await response.text();
  const portalsStart = html.indexOf('data-creator-stage="01-06-worlds"');
  const indexStart = html.indexOf('data-creator-index="worlds"');
  const indexEnd = html.indexOf("</section>", indexStart);
  const portals = html.slice(portalsStart, indexStart);
  const index = html.slice(indexStart, indexEnd);

  for (const slug of ["weins", "slyour", "the-xide"]) {
    assert.match(portals, new RegExp(`href="/creator/${slug}"`));
  }
  assert.equal(portals.match(/ENTER WORLD/g)?.length, 3);

  for (const liveUrl of [
    "https://weins-chi.vercel.app/",
    "https://slyour.vercel.app/",
    "https://thexide.vercel.app/",
  ]) {
    assert.match(index, new RegExp(`href="${liveUrl.replaceAll(".", "\\.")}"`));
  }
  assert.equal(index.match(/LIVE/g)?.length, 3);
  assert.equal(index.match(/target="_blank"/g)?.length, 3);
  assert.equal(index.match(/rel="noopener noreferrer"/g)?.length, 3);

  for (const slug of ["pawsona", "relationship", "miner"]) {
    const rowStart = index.indexOf(`data-index-world="${slug}"`);
    const rowEnd = index.indexOf("</li>", rowStart);
    const row = index.slice(rowStart, rowEnd);
    assert.doesNotMatch(row, /<a\b|LIVE/);
  }
});
