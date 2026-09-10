import { HOME } from "../../content/home.ts";
import type { GatewayDivision } from "./state.ts";

export const GATEWAY_DIVISIONS = [
  "visuals",
  "technical",
  "creator",
] as const satisfies readonly GatewayDivision[];

export type GatewayDestination = {
  division: GatewayDivision;
  name: string;
  publicLabel: "BM VISUAL" | "BM TECH" | "BMP CREATOR";
  headline: string;
  description: string;
  href: "/bm-visual" | "/bm-tech" | "/creator";
};

const createDestination = (
  division: GatewayDivision,
  publicLabel: GatewayDestination["publicLabel"],
  capability: (typeof HOME.capabilities)[number],
): GatewayDestination => ({
  division,
  name: capability.name.value,
  publicLabel,
  headline: capability.headline.value,
  description: capability.supportingCopy.value,
  href: capability.href.value,
});

export const GATEWAY_DESTINATIONS = {
  visuals: createDestination("visuals", "BM VISUAL", HOME.capabilities[0]),
  technical: createDestination("technical", "BM TECH", HOME.capabilities[1]),
  creator: createDestination("creator", "BMP CREATOR", HOME.capabilities[2]),
} as const satisfies Record<GatewayDivision, GatewayDestination>;

export function getGatewayDestination(
  division: GatewayDivision,
): GatewayDestination {
  return GATEWAY_DESTINATIONS[division];
}
