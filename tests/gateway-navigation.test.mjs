import assert from "node:assert/strict";
import test from "node:test";
import { shouldEnhanceGatewayNavigation } from "../lib/gateway/navigation.ts";

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
