"use client";

import type { KeyboardEvent } from "react";

import {
  GATEWAY_DIVISIONS,
  getGatewayDestination,
} from "@/lib/gateway/destinations";
import type {
  GatewayDivision,
  GatewayState,
} from "@/lib/gateway/state";

type SelectionOverlayProps = {
  state: GatewayState;
  enhancementReady: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  onPreview(division: GatewayDivision): void;
  onClearPreview(): void;
  onSelect(division: GatewayDivision): void;
  registerDestinationControl(
    division: GatewayDivision,
    node: HTMLButtonElement | null,
  ): void;
};

export function SelectionOverlay({
  state,
  enhancementReady,
  reducedMotion,
  coarsePointer,
  onPreview,
  onClearPreview,
  onSelect,
  registerDestinationControl,
}: SelectionOverlayProps) {
  const previewDivision = state.previewDivision;
  const selection = previewDivision ?? "neutral";

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && state.phase === "preview") {
      event.stopPropagation();
      onClearPreview();
    }
  };

  const handleActivation = (division: GatewayDivision) => {
    if (coarsePointer && previewDivision !== division) {
      onPreview(division);
      return;
    }
    onSelect(division);
  };

  return (
    <section
      className="gateway-selection"
      aria-label="Choose a BMP division"
      data-gateway-selection={selection}
      data-coarse-pointer={coarsePointer ? "true" : "false"}
      data-enhancement-ready={enhancementReady ? "true" : "false"}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      onKeyDown={handleKeyDown}
      onPointerLeave={onClearPreview}
    >
      <header className="gateway-selection__intro">
        <h1>BM</h1>
        <p>Creative × Technology × Products.</p>
      </header>

      <div className="gateway-core-mark" aria-hidden="true">
        BM
      </div>

      {GATEWAY_DIVISIONS.map((division) => {
        const destination = getGatewayDestination(division);
        const previewed = previewDivision === division;
        return (
          <section
            className={`gateway-selection__division gateway-selection__division--${division}`}
            aria-label={destination.name}
            data-depth={previewed ? "foreground" : previewDivision ? "deep" : "mid"}
            key={division}
            onPointerEnter={() => {
              if (!coarsePointer) onPreview(division);
            }}
          >
            <button
              aria-describedby={`gateway-${division}-summary`}
              aria-pressed={previewed}
              className="gateway-selection__preview"
              data-cursor="gateway"
              data-cursor-label={
                previewed ? `SELECT ${destination.publicLabel}` : `PREVIEW ${destination.publicLabel}`
              }
              onBlur={onClearPreview}
              onClick={() => handleActivation(division)}
              onFocus={() => onPreview(division)}
              ref={(node) => registerDestinationControl(division, node)}
              type="button"
            >
              <span className="gateway-selection__name">
                {destination.publicLabel}
              </span>
              <span
                className="gateway-selection__summary"
                id={`gateway-${division}-summary`}
              >
                {previewed ? destination.headline : null}
              </span>
              {coarsePointer && previewed ? (
                <span className="gateway-selection__activate">SELECT →</span>
              ) : null}
            </button>
          </section>
        );
      })}
    </section>
  );
}
