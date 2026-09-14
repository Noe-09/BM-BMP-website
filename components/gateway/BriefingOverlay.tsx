"use client";

import Link from "next/link";
import type { CSSProperties, MouseEvent, RefObject } from "react";

import type { BriefingFrame } from "@/lib/gateway/briefing";
import { getGatewayDestination } from "@/lib/gateway/destinations";
import type { GatewayDivision, GatewayPhase } from "@/lib/gateway/state";

type BriefingOverlayProps = {
  division: GatewayDivision;
  phase: GatewayPhase;
  frame: BriefingFrame;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onGoBack(): void;
  onContinue(event: MouseEvent<HTMLAnchorElement>): void;
};

type BriefingStyle = CSSProperties & {
  "--gateway-briefing-identity": number;
  "--gateway-briefing-description": number;
  "--gateway-briefing-decision": number;
};

export function BriefingOverlay({
  division,
  phase,
  frame,
  headingRef,
  onGoBack,
  onContinue,
}: BriefingOverlayProps) {
  const destination = getGatewayDestination(division);
  const decisionReady = phase === "decision";
  const style: BriefingStyle = {
    "--gateway-briefing-identity": frame.identity,
    "--gateway-briefing-description": frame.description,
    "--gateway-briefing-decision": frame.decision,
  };

  return (
    <section
      aria-labelledby="gateway-briefing-heading"
      aria-live="polite"
      className="gateway-briefing"
      data-decision-ready={decisionReady ? "true" : "false"}
      data-division={division}
      role="region"
      style={style}
    >
      <p className="gateway-briefing__name">{destination.name}</p>
      <h2
        className="gateway-briefing__headline"
        id="gateway-briefing-heading"
        ref={headingRef}
        tabIndex={-1}
      >
        {destination.headline}
      </h2>
      <p className="gateway-briefing__description">{destination.description}</p>
      <div
        className="gateway-briefing__decisions"
        hidden={!decisionReady}
        inert={!decisionReady}
      >
        <button
          className="gateway-briefing__back"
          onClick={onGoBack}
          type="button"
        >
          GO BACK
        </button>
        <Link
          className="gateway-briefing__continue"
          data-cursor="gateway"
          data-cursor-label={`CONTINUE TO ${destination.publicLabel}`}
          href={destination.href}
          onClick={onContinue}
        >
          CONTINUE →
        </Link>
      </div>
    </section>
  );
}
