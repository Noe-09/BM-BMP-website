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
  for (const slug of ["weins", "slyour", "the-xide"]) {
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
    assert.doesNotMatch(html, /VISIT LIVE/);
    assert.doesNotMatch(html, /components\/case|data-bm-visual/);
  }
});
