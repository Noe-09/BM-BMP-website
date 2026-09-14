import assert from "node:assert/strict";
import test from "node:test";

import { HOME } from "../content/home.ts";
import {
  GATEWAY_DESTINATIONS,
  GATEWAY_DIVISIONS,
  getGatewayDestination,
} from "../lib/gateway/destinations.ts";

test("the Gateway exposes all three canonical destinations", () => {
  assert.deepEqual(GATEWAY_DIVISIONS, ["visuals", "technical", "creator"]);
  assert.deepEqual(
    GATEWAY_DIVISIONS.map((division) => {
      const destination = getGatewayDestination(division);
      return [
        destination.division,
        destination.publicLabel,
        destination.headline,
        destination.href,
      ];
    }),
    [
      ["visuals", "BM VISUAL", "Make the brand worth noticing.", "/bm-visual"],
      ["technical", "BM TECH", "Build systems around real problems.", "/bm-tech"],
      ["creator", "BMP CREATOR", "We build our own things too.", "/creator"],
    ],
  );
});

test("Gateway descriptions stay sourced from canonical typed content", () => {
  assert.equal(
    GATEWAY_DESTINATIONS.visuals.description,
    HOME.capabilities[0].supportingCopy.value,
  );
  assert.equal(
    GATEWAY_DESTINATIONS.technical.description,
    HOME.capabilities[1].supportingCopy.value,
  );
  assert.equal(
    GATEWAY_DESTINATIONS.creator.description,
    HOME.capabilities[2].supportingCopy.value,
  );
});
