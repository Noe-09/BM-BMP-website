## Task 5: Signature Boot with Session and Reduced-Motion Semantics

**Files:**
- Create: `components/tech/TechBoot.tsx`
- Modify: `components/tech/TechExperience.tsx`
- Modify: `app/bm-tech/tech.css`
- Extend: `tests/tech-journey.test.mjs`

**Interfaces:**
- `TechBoot` uses session key: `bmp-tech-boot-seen-v1`.
- Renders state vocabulary: `SIGNAL`, `ROUTE`, `VERIFY`, `ONLINE`.
- Writes boot completion through `data-tech-boot`.
- Does not gate semantic page content.

- [x] **Step 1: Add failing boot regression**

Append:

```js
test("Tech boot is short, session-aware, reduced-motion-aware, and non-blocking", async () => {
  const boot = await read("components/tech/TechBoot.tsx");
  const experience = await read("components/tech/TechExperience.tsx");
  const css = await read("app/bm-tech/tech.css");

  assert.match(boot, /bmp-tech-boot-seen-v1/);
  assert.match(boot, /sessionStorage/);
  assert.match(boot, /prefers-reduced-motion/);
  assert.match(boot, /SIGNAL/);
  assert.match(boot, /ROUTE/);
  assert.match(boot, /VERIFY/);
  assert.match(boot, /ONLINE/);
  assert.match(experience, /<TechBoot/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(boot, /setTimeout\([^,]+,\s*(?:[2-9]\d{3}|\d{5,})/);
});
```

- [x] **Step 2: Run to verify failure**

```bash
node --test tests/tech-journey.test.mjs
```

Expected: FAIL.

- [x] **Step 3: Implement `TechBoot`**

Rules:
- page content exists under the overlay from first render;
- first-session overlay animates through the four state words;
- total authored timing <= 1200 ms;
- returning session either skips or uses a <= 300 ms reacquire;
- reduced motion resolves nearly immediately;
- sessionStorage access is guarded for browser availability and errors;
- if JS fails, server-rendered content is still present.

Use one small client component; do not turn the whole page client-side.

- [x] **Step 4: Make boot topology visually continuous with the opening**

In `tech.css`, boot route lines and opening observatory lines must share the same:
- route thickness;
- node geometry vocabulary;
- signal accent;
- graphite/carbon palette;
- alignment basis.

The handoff can be optical rather than DOM identity morphing. Do not add complexity solely to achieve literal shared-element morphing.

- [x] **Step 5: Verify tests and typecheck**

```bash
node --test tests/tech-journey.test.mjs
npm run typecheck
```

Expected: PASS.

- [x] **Step 6: Commit**

```bash
git add components/tech/TechBoot.tsx \
        components/tech/TechExperience.tsx \
        app/bm-tech/tech.css \
        tests/tech-journey.test.mjs
git commit -m "feat: add BMP Tech signature system boot"
```

---
