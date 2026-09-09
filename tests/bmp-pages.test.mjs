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

async function getPage(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} should render`);
  return response.text();
}

test("BM Visual and BM Tech publish every canonical service group and CTA", async () => {
  const pages = [
    {
      path: "/bm-visual",
      copy: [
        "Make the brand worth noticing.",
        "BM Visual helps businesses turn scattered, inconsistent, or forgettable digital presence into a clearer visual system that earns attention and feels more credible.",
        "Brand identity &amp; visual direction",
        "Website visual presentation / landing page creative direction",
        "Social media visual systems &amp; content assets",
        "Marketing creatives / campaign visuals",
        "AI-assisted visual production &amp; concept development",
        "Logo motion, intro/outro and lightweight motion assets",
        "Improve your visual presence",
      ],
    },
    {
      path: "/bm-tech",
      copy: [
        "Build systems around real problems.",
        "BM Tech helps lean businesses replace repetitive work, disconnected information, and manual processes with practical digital systems and lightweight tools.",
        "Business websites &amp; focused web systems",
        "Workflow automation and integrations",
        "AI-assisted internal tools and customer-facing utilities",
        "Chat / support / lead-handling systems",
        "CRM-lite and operational dashboards",
        "Custom MVPs and practical digital prototypes",
        "Tell us the problem",
      ],
    },
  ];

  for (const page of pages) {
    const html = await getPage(page.path);
    for (const value of page.copy) assert.ok(html.includes(value), value);
    assert.match(html, /href="\/contact"/);
  }
});

test("About publishes the canonical story, process, and team position", async () => {
  const html = await getPage("/about");
  const exactCopy = [
    "We are building the kind of studio we would want to work with.",
    "BMP started from a simple belief: good ideas are not enough.",
    "Design makes ideas understood. Technology makes them useful. Distribution makes them matter.",
    "Understand",
    "Start with the problem, audience, context, and desired outcome.",
    "Define",
    "Build",
    "Review",
    "Improve",
    "BMP is a lean studio built around hands-on execution.",
  ];
  for (const value of exactCopy) assert.ok(html.includes(value), value);
});

test("Creator stays honest when no product record is verified", async () => {
  const html = await getPage("/creator");
  assert.ok(html.includes("We build our own things too."));
  assert.ok(
    html.includes(
      "BMP Creator is where we develop our own apps, web products, experiments, and digital tools. It is both a product portfolio and a public record of how we turn ideas into working experiences.",
    ),
  );
  assert.ok(html.includes("See what we are building"));
  assert.match(html, /data-creator-products="0"/);
  assert.doesNotMatch(html, /Client Work|Owned Product/);
});

test("Contact publishes canonical fields without pretending submission works", async () => {
  const html = await getPage("/contact");
  const exactCopy = [
    "Have a problem worth solving?",
    "Tell us what you are trying to improve, build, or simplify. We will look at the problem first and recommend a focused direction before expanding the scope.",
    "Name",
    "Business / brand",
    "Email / contact",
    "What are you trying to improve or build?",
    "Current website / social / reference link",
    "Budget range",
    "Preferred timeline",
    "Start a project",
    "View our work",
  ];
  for (const value of exactCopy) assert.ok(html.includes(value), value);
  assert.match(html, /<button[^>]*disabled[^>]*>Start a project<\/button>/);
  assert.doesNotMatch(html, /<form[^>]+action=/);
  assert.match(html, /href="https:\/\/zalo\.me\/0326034128"/);
  assert.match(html, /href="\/work"/);
});
