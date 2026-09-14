"use client";

import { useState } from "react";

type HumanCheckpointProps = {
  statement: readonly string[];
};

const OPTIONS = ["APPROVE", "ADJUST", "HOLD"] as const;

export function HumanCheckpoint({ statement }: HumanCheckpointProps) {
  const [inspection, setInspection] = useState<(typeof OPTIONS)[number] | null>(null);

  return (
    <div className="human-checkpoint" data-inspection={inspection ?? "idle"}>
      <p className="human-checkpoint__statement">
        {statement.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </p>
      <div
        aria-label="Local decision inspection"
        className="human-checkpoint__options"
        role="group"
      >
        {OPTIONS.map((option) => (
          <button
            aria-pressed={inspection === option}
            key={option}
            onClick={() => setInspection(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="human-checkpoint__status">
        {inspection ? `LOCAL INSPECTION / ${inspection}` : "LOCAL INSPECTION / CHOOSE A VIEW"}
      </p>
    </div>
  );
}
