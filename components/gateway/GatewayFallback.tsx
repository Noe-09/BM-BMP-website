import Link from "next/link";
import type { MouseEvent } from "react";

import type { GatewayDivision } from "@/lib/gateway/state";

type GatewayFallbackProps = {
  enhanced?: boolean;
  onCommit?(
    division: GatewayDivision,
    href: string,
    event: MouseEvent<HTMLAnchorElement>,
  ): void;
};

export function GatewayFallback({
  enhanced = false,
  onCommit,
}: GatewayFallbackProps) {
  return (
    <main
      className={`gateway-page gateway-fallback${enhanced ? " gateway-fallback--enhanced" : ""}`}
    >
      <div className="gateway-fallback__inner">
        <p className="gateway-fallback__mark">BM</p>
        <h1>TWO WORLDS. ONE SYSTEM.</h1>
        <nav className="gateway-fallback__divisions" aria-label="BM divisions">
          <Link
            href="/"
            className="gateway-fallback__division"
            onClick={(event) => onCommit?.("visuals", "/", event)}
          >
            <span className="gateway-fallback__division-name">BM VISUALS</span>
            <span className="gateway-fallback__division-type">
              Creative / Digital Experience
            </span>
            <span className="gateway-fallback__division-copy">
              Digital identities
              <br />
              with motion, story and distinction.
            </span>
            <span className="gateway-fallback__action">ENTER VISUALS →</span>
          </Link>
          <Link
            href="/gateway-prototype/technical"
            className="gateway-fallback__division"
            onClick={(event) =>
              onCommit?.(
                "technical",
                "/gateway-prototype/technical",
                event,
              )
            }
          >
            <span className="gateway-fallback__division-name">BMP TECHNICAL</span>
            <span className="gateway-fallback__division-type">
              Technology / AI Systems
            </span>
            <span className="gateway-fallback__division-copy">
              AI systems, product logic
              <br />
              and technical execution.
            </span>
            <span className="gateway-fallback__action">ENTER TECHNICAL →</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
