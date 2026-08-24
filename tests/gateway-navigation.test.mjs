import assert from "node:assert/strict";
import test from "node:test";
import {
  acquireGatewayCommitLock,
  getGatewayExpectedPathname,
  shouldEnhanceGatewayNavigation,
  shouldMarkGatewaySession,
  shouldRequireGatewayPreview,
  shouldUseGatewayLocationFallback,
} from "../lib/gateway/navigation.ts";

const primary = {
  button: 0,
  detail: 1,
  defaultPrevented: false,
  metaKey: false,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  target: undefined,
  download: false,
  reducedMotion: false,
  enhancementReady: true,
};

test("gateway enhances only an ordinary primary-pointer activation", () => {
  assert.equal(shouldEnhanceGatewayNavigation(primary), true);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, button: 1 }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, button: 2 }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, detail: 0 }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, defaultPrevented: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, ctrlKey: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, metaKey: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, shiftKey: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, altKey: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, target: "_blank" }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, target: "external-frame" }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, download: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, reducedMotion: true }), false);
  assert.equal(shouldEnhanceGatewayNavigation({ ...primary, enhancementReady: false }), false);
});

test("same-context keyboard activation marks the session without enhancing navigation", () => {
  const keyboard = { ...primary, detail: 0 };

  assert.equal(shouldEnhanceGatewayNavigation(keyboard), false);
  assert.equal(shouldMarkGatewaySession(keyboard), true);
  assert.equal(shouldMarkGatewaySession({ ...keyboard, button: 2 }), false);
  assert.equal(shouldMarkGatewaySession({ ...keyboard, metaKey: true }), false);
  assert.equal(shouldMarkGatewaySession({ ...keyboard, target: "_blank" }), false);
  assert.equal(shouldMarkGatewaySession({ ...keyboard, download: true }), false);
});

test("coarse ordinary pointer activation requires its division preview first", () => {
  assert.equal(
    shouldRequireGatewayPreview(primary, {
      coarsePointer: true,
      division: "visuals",
      selectedDivision: null,
    }),
    true,
  );
  assert.equal(
    shouldRequireGatewayPreview(primary, {
      coarsePointer: true,
      division: "visuals",
      selectedDivision: "technical",
    }),
    true,
  );
  assert.equal(
    shouldRequireGatewayPreview(primary, {
      coarsePointer: true,
      division: "visuals",
      selectedDivision: "visuals",
    }),
    false,
  );
});

test("coarse preview gate leaves fine, keyboard, modified, and reduced-motion activation native", () => {
  const context = {
    coarsePointer: true,
    division: "technical",
    selectedDivision: null,
  };

  assert.equal(
    shouldRequireGatewayPreview(primary, { ...context, coarsePointer: false }),
    false,
  );
  assert.equal(shouldRequireGatewayPreview({ ...primary, detail: 0 }, context), false);
  assert.equal(shouldRequireGatewayPreview({ ...primary, metaKey: true }, context), false);
  assert.equal(shouldRequireGatewayPreview({ ...primary, button: 1 }, context), false);
  assert.equal(shouldRequireGatewayPreview({ ...primary, button: 2 }, context), false);
  assert.equal(
    shouldRequireGatewayPreview({ ...primary, target: "_blank" }, context),
    false,
  );
  assert.equal(shouldRequireGatewayPreview({ ...primary, download: true }, context), false);
  assert.equal(shouldRequireGatewayPreview({ ...primary, reducedMotion: true }, context), false);
  assert.equal(
    shouldRequireGatewayPreview({ ...primary, enhancementReady: false }, context),
    false,
  );
  assert.equal(
    shouldRequireGatewayPreview({ ...primary, defaultPrevented: true }, context),
    false,
  );
});

test("commit lock is acquired synchronously only once", () => {
  const lock = { current: false };

  assert.equal(acquireGatewayCommitLock(lock), true);
  assert.equal(lock.current, true);
  assert.equal(acquireGatewayCommitLock(lock), false);
});

test("navigation fallback compares the parsed destination pathname", () => {
  const expected = getGatewayExpectedPathname(
    "/gateway-prototype/technical?from=split#entry",
    "https://bm.test/gateway-prototype",
  );

  assert.equal(expected, "/gateway-prototype/technical");
  assert.equal(shouldUseGatewayLocationFallback("/gateway-prototype", expected), true);
  assert.equal(
    shouldUseGatewayLocationFallback("/gateway-prototype/technical", expected),
    false,
  );
});
