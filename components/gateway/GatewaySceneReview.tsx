"use client";

import { useMemo, useState } from "react";

import { deriveDestinationInteraction } from "@/lib/gateway/briefing";
import { deriveGatewayPose } from "@/lib/gateway/choreography";
import type { GatewayDivision } from "@/lib/gateway/state";
import { TunnelCanvas } from "./TunnelCanvas";

/** Development-only still review. The public gateway never renders these controls. */
export function GatewaySceneReview() {
  const [progress, setProgress] = useState(0.08);
  const [briefingProgress, setBriefingProgress] = useState(0);
  const [selection, setSelection] = useState<GatewayDivision | null>(null);
  const [failed, setFailed] = useState(false);
  const selectedDivision = briefingProgress > 0 ? selection : null;
  const interactions = useMemo(
    () =>
      deriveDestinationInteraction({
        previewDivision: selectedDivision ? null : selection,
        selectedDivision,
        briefingProgress,
      }),
    [briefingProgress, selectedDivision, selection],
  );
  const pose = deriveGatewayPose({
    travelProgress: progress,
    briefingProgress,
    interactions,
    selectedDivision,
    exitProgress: 0,
    reducedMotion: false,
    coarsePointer: false,
  });

  return (
    <div className="gateway-page" style={{ position: "fixed", inset: 0 }}>
      <TunnelCanvas
        pose={pose}
        coarsePointer={false}
        onReady={() => undefined}
        onFailure={() => setFailed(true)}
      />
      <nav
        aria-label="Scene review"
        style={{
          position: "fixed",
          zIndex: 50,
          top: 12,
          left: 12,
          maxWidth: "calc(100% - 24px)",
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          background: "#f4f6f3",
          color: "#182b36",
          padding: 10,
          font: "12px monospace",
        }}
      >
        {[0, 0.08, 0.16, 0.25, 0.34, 0.46, 0.54, 0.58, 0.68, 0.74, 0.78, 0.86, 0.9, 0.96, 1].map(
          (value) => (
            <button
              key={value}
              aria-pressed={value === progress}
              onClick={() => setProgress(value)}
              style={{ border: "1px solid #bbc6c9", padding: 5 }}
            >
              {value.toFixed(2)}
            </button>
          ),
        )}
        <button onClick={() => setSelection("visuals")}>Visual</button>
        <button onClick={() => setSelection("creator")}>Creator</button>
        <button onClick={() => setSelection("technical")}>Tech</button>
        <button onClick={() => setSelection(null)}>Neutral</button>
        {[0, 0.5, 1].map((value) => (
          <button
            key={`briefing-${value}`}
            onClick={() => setBriefingProgress(value)}
          >
            Briefing {value.toFixed(1)}
          </button>
        ))}
        <output>
          {failed
            ? "SCENE FAILED"
            : `p=${progress.toFixed(2)} briefing=${briefingProgress.toFixed(2)}`}
        </output>
      </nav>
    </div>
  );
}
