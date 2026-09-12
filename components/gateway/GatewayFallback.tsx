import Link from "next/link";
import type { MouseEvent } from "react";

import {
  GATEWAY_DIVISIONS,
  getGatewayDestination,
} from "@/lib/gateway/destinations";
import type { GatewayDivision } from "@/lib/gateway/state";

type GatewayFallbackProps = {
  enhanced?: boolean;
  onNavigate?(
    division: GatewayDivision,
    href: string,
    event: MouseEvent<HTMLAnchorElement>,
  ): void;
};

export function GatewayFallback({
  enhanced = false,
  onNavigate,
}: GatewayFallbackProps) {
  return (
    <main
      className={`gateway-page gateway-fallback${enhanced ? " gateway-fallback--enhanced" : ""}`}
    >
      <div className="gateway-fallback__inner">
        <p className="gateway-fallback__mark">BM</p>
        <h1>Creative × Technology × Products.</h1>
        <nav className="gateway-fallback__divisions" aria-label="BMP divisions">
          {GATEWAY_DIVISIONS.map((division) => {
            const destination = getGatewayDestination(division);
            return (
              <Link
                href={destination.href}
                className="gateway-fallback__division"
                key={division}
                onClick={(event) =>
                  onNavigate?.(division, destination.href, event)
                }
              >
                <span className="gateway-fallback__division-name">
                  {destination.publicLabel}
                </span>
                <span className="gateway-fallback__division-copy">
                  {destination.headline}
                </span>
                <span className="gateway-fallback__action">ENTER →</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </main>
  );
}
