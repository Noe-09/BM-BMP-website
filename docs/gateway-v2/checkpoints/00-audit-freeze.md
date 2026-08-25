# V2.0 Audit + Freeze

## Frozen engine files

- `lib/gateway/state.ts`
- `lib/gateway/navigation.ts`
- `lib/gateway/progress.ts`

## Frozen behavioral contracts

**Session resolution:**
- `SESSION_RESOLVED` gates loader progression. `LOAD_READY` requires `sessionResolved: true`.
- `bmGatewaySeen` controls return-session loader behavior via `returning` flag.
- Session resolution accepted only once during `loading` phase when `!state.sessionResolved`.
- Late session resolution cannot change entry behavior after loading becomes ready.

**Native navigation preservation:**
- Real links remain native for keyboard activation (`detail === 0`).
- Modifier click (meta/ctrl/shift/alt) remains native.
- Middle click (`button !== 0`) remains native.
- Target/download navigation remains native.
- Reduced-motion navigation remains native.
- Failed enhancement navigation remains native via fallback.
- `defaultPrevented` events remain native.

**Enhanced navigation gates:**
- `event.detail > 0` required for enhanced pointer navigation.
- Enhancement requires `button === 0`, no modifiers, `_self` target, no download, no reduced motion, and `enhancementReady`.
- Keyboard same-context activation marks session without enhancing navigation.

**Reduced motion:**
- Removes camera travel while preserving semantic selection.
- Entry skips long journey: `returning || reducedMotion` → `"split"` phase directly.
- Preview does not bias camera; selection contrast remains accessible.
- Exit remains static at endpoint.

**Coarse pointer:**
- Uses preview-first behavior: requires division preview before commit.
- Coarse preview gate preserves fine/keyboard/modified/reduced-motion native activation.
- Uses absolute camera endpoints and 68/32 committed ownership.

**WebGL/readiness fallback:**
- Scene failure enters `"fallback"` phase unless already in `"exit"`.
- Fallback exposes semantic DOM selection with real links.
- Hard readiness timeout at 9000ms.
- Loader minimum enforced: 2400ms first-visit, 600ms return/reduced-motion.

**Commit lock:**
- Acquired synchronously only once via mutable `lock.current` guard.
- Once `committed !== null`, state ignores further preview/commit events.

**Presentation layer ownership:**
- Orchestrator owns session resolution, loader modes, fallback timing, semantic fallback.
- Enhancement owns top sibling stacking layer during its lifecycle phases.
- Fallback becomes visible when enhancement unhealthy or selection overlay absent.

## Allowed V2 visual surfaces

- `lib/gateway/scene.ts`
- `lib/gateway/choreography.ts`
- `components/gateway/TunnelCanvas.tsx` — only for async asset readiness
- `components/gateway/GatewayPrototype.tsx` — only for visual-progress plumbing
- `components/gateway/LoaderOverlay.tsx`
- `components/gateway/SelectionOverlay.tsx` — visual structure only
- `app/gateway-prototype/gateway.css`
- `tools/blender/*`
- `public/gateway/*`

## Baseline verification

**Branch:** `feat/bm-gateway-tunnel-v2`

**Working tree:** clean

**Command executed:**
```bash
node --test tests/gateway-*.test.mjs
```

**Result:** 49 passing, 0 failing, 226.95ms duration

**Test coverage:**
- Gateway state machine progression and session resolution
- Navigation intent classification and commit lock
- Choreography camera/light/opening values for neutral, desktop preview, coarse preview, reduced motion, identity leak, and exit asymmetry
- Gateway fallback and selection overlay markup
- Enhanced selection exposure
- Context cursor mode
- Gateway route isolation
- Canvas decorative role and dependency constraints
- Loader counter language
- Orchestrator lifecycle ownership
- Frame loop cleanup
- Semantic selection integration
- CSS layer hierarchy
- Coarse-pointer and reduced-motion CSS modes
- Scoped progressive-enhancement hooks
- Art direction constraints
- Mobile/tablet whole-word wrapping
- Unselected division legibility
- CTA state selector specificity
