"use client";

import Link from "next/link";
import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";

import type {
  GatewayDivision,
  GatewayState,
} from "@/lib/gateway/state";

type SelectionOverlayProps = {
  state: GatewayState;
  leftPercent: number;
  rightPercent: number;
  enhancementReady: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  onPreview(division: GatewayDivision): void;
  onClearPreview(): void;
  onCommit(
    division: GatewayDivision,
    href: string,
    event: MouseEvent<HTMLAnchorElement>,
  ): void;
};

type GatewaySelectionStyle = CSSProperties & {
  "--gateway-left": string;
  "--gateway-right": string;
};

const divisionContent = {
  visuals: {
    name: "BM VISUALS",
    type: "Creative / Digital Experience",
  },
  technical: {
    name: "BMP TECHNICAL",
    type: "Technology / AI Systems",
  },
} as const;

export function SelectionOverlay({
  state,
  leftPercent,
  rightPercent,
  enhancementReady,
  reducedMotion,
  coarsePointer,
  onPreview,
  onClearPreview,
  onCommit,
}: SelectionOverlayProps) {
  const selection = state.committed ?? state.preview ?? "neutral";
  const style: GatewaySelectionStyle = {
    "--gateway-left": `${leftPercent}%`,
    "--gateway-right": `${rightPercent}%`,
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && state.phase === "preview") {
      event.stopPropagation();
      onClearPreview();
    }
  };

  const renderHeading = (division: GatewayDivision) => {
    const content = divisionContent[division];
    if (coarsePointer) {
      return (
        <button
          className="gateway-selection__preview"
          type="button"
          aria-pressed={selection === division}
          onClick={() => onPreview(division)}
        >
          <span className="gateway-selection__name">{content.name}</span>
          <span className="gateway-selection__type">{content.type}</span>
        </button>
      );
    }

    return (
      <div className="gateway-selection__heading">
        <h2 className="gateway-selection__name">{content.name}</h2>
        <p className="gateway-selection__type">{content.type}</p>
      </div>
    );
  };

  return (
    <section
      className="gateway-selection"
      aria-label="Choose a BM division"
      data-gateway-selection={selection}
      data-coarse-pointer={coarsePointer ? "true" : "false"}
      data-enhancement-ready={enhancementReady ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      style={style}
      onKeyDown={handleKeyDown}
      onPointerLeave={onClearPreview}
    >
      <div className="gateway-core-mark" aria-hidden="true">
        BM
      </div>
      <section
        className="gateway-selection__division gateway-selection__division--visuals"
        aria-label="BM Visuals"
        onPointerEnter={() => {
          if (!coarsePointer) onPreview("visuals");
        }}
      >
        {renderHeading("visuals")}
        <p className="gateway-selection__copy">
          <span className="gateway-selection__line gateway-selection__line--one">
            Digital identities
          </span>
          <span className="gateway-selection__line gateway-selection__line--two">
            with motion, story and distinction.
          </span>
        </p>
        <Link
          href="/"
          className="gateway-selection__action"
          data-cursor="gateway"
          data-cursor-label="ENTER VISUALS ↗"
          onFocus={() => onPreview("visuals")}
          onClick={(event) => onCommit("visuals", "/", event)}
        >
          ENTER VISUALS ↗
        </Link>
      </section>
      <section
        className="gateway-selection__division gateway-selection__division--technical"
        aria-label="BMP Technical"
        onPointerEnter={() => {
          if (!coarsePointer) onPreview("technical");
        }}
      >
        {renderHeading("technical")}
        <p className="gateway-selection__copy">
          <span className="gateway-selection__line gateway-selection__line--one">
            AI systems, product logic
          </span>
          <span className="gateway-selection__line gateway-selection__line--two">
            and technical execution.
          </span>
        </p>
        <Link
          href="/gateway-prototype/technical"
          className="gateway-selection__action"
          data-cursor="gateway"
          data-cursor-label="ENTER TECHNICAL ↗"
          onFocus={() => onPreview("technical")}
          onClick={(event) =>
            onCommit(
              "technical",
              "/gateway-prototype/technical",
              event,
            )
          }
        >
          ENTER TECHNICAL ↗
        </Link>
      </section>
    </section>
  );
}
