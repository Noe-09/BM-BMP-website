import { formatLoaderNumber } from "@/lib/gateway/progress";
import type { GatewayPhase } from "@/lib/gateway/state";

type LoaderOverlayProps = {
  progress: number;
  returning: boolean;
  phase: GatewayPhase;
  canSkip: boolean;
  onSkip(): void;
};

export function LoaderOverlay({
  progress,
  returning,
  phase,
  canSkip,
  onSkip,
}: LoaderOverlayProps) {
  const ready = phase === "ready";
  const counter = formatLoaderNumber(progress);

  return (
    <section
      aria-label="Gateway loading status"
      className="gateway-loader"
    >
      <p className="gateway-loader__mark">BM</p>
      <div className="gateway-loader__status">
        <p className="gateway-loader__label">
          {ready ? "TWO WORLDS. ONE SYSTEM." : "INITIALIZING"}
        </p>
        <p
          aria-label={`${counter} of 100`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={Math.round(progress * 100)}
          className="gateway-loader__counter"
          role="progressbar"
        >
          {counter}
        </p>
        <p className="gateway-loader__mode">
          {returning ? "SESSION RECONNECTED" : "GATEWAY SEQUENCE"}
        </p>
      </div>
      {canSkip ? (
        <button className="gateway-loader__skip" onClick={onSkip} type="button">
          SKIP
        </button>
      ) : null}
    </section>
  );
}
