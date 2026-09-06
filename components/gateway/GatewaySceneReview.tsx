"use client";

import { useState } from "react";
import { deriveGatewayPose } from "@/lib/gateway/choreography";
import { TunnelCanvas } from "./TunnelCanvas";

/** Development-only still review. The public gateway never renders these controls. */
export function GatewaySceneReview() {
  const [progress, setProgress] = useState(.08);
  const [selection, setSelection] = useState<-1 | 0 | 1>(0);
  const [failed, setFailed] = useState(false);
  return (
    <div className="gateway-page" style={{ position: "fixed", inset: 0 }}>
      <TunnelCanvas pose={deriveGatewayPose({ travelProgress: progress, selectionBias: selection, exitProgress: 0, committed: null, reducedMotion: false, coarsePointer: false })} coarsePointer={false} onReady={() => undefined} onFailure={() => setFailed(true)} />
      <nav aria-label="Scene review" style={{ position: "fixed", zIndex: 50, top: 12, left: 12, maxWidth: "calc(100% - 24px)", display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", background: "#f4f6f3", color: "#182b36", padding: 10, font: "12px monospace" }}>
        {[0, .08, .16, .25, .34, .46, .58, .68, .78, .9, 1].map(p => <button key={p} aria-pressed={p === progress} onClick={() => setProgress(p)} style={{ border: "1px solid #bbc6c9", padding: 5 }}>{p.toFixed(2)}</button>)}
        <button onClick={() => setSelection(-1)}>Visuals</button>
        <button onClick={() => setSelection(0)}>Neutral</button>
        <button onClick={() => setSelection(1)}>Technical</button>
        <output>{failed ? "SCENE FAILED" : `p=${progress.toFixed(2)}`}</output>
      </nav>
    </div>
  );
}
