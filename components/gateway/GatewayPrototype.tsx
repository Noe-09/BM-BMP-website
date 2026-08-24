"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";

import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { damp } from "@/lib/motion/physics";
import { deriveGatewayPose } from "@/lib/gateway/choreography";
import {
  applyTravelDelta,
  GATEWAY_TIMING,
  getLoaderTarget,
  shouldShowSkip,
  stepTravelProgress,
  type LoaderMode,
} from "@/lib/gateway/progress";
import {
  createGatewayState,
  gatewayReducer,
  getSelectionBias,
  type GatewayPhase,
} from "@/lib/gateway/state";
import { GatewayFallback } from "./GatewayFallback";
import { LoaderOverlay } from "./LoaderOverlay";
import { TunnelCanvas } from "./TunnelCanvas";

const SESSION_KEY = "bmGatewaySeen";

type SkipTarget = {
  from: number;
  startedAt: number;
};

const isAnimatedPhase = (phase: GatewayPhase) =>
  phase === "loading" ||
  phase === "ready" ||
  phase === "auto-entry" ||
  phase === "user-travel" ||
  phase === "exit";

export function GatewayPrototype() {
  const profile = useInteractionProfile();
  const [state, dispatch] = useReducer(
    gatewayReducer,
    false,
    createGatewayState,
  );
  const [sceneReady, setSceneReady] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [travelProgress, setTravelProgress] = useState(0);
  const [exitProgress, setExitProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);
  const phaseRef = useRef<GatewayPhase>(state.phase);
  const returningRef = useRef(state.returning);
  const reducedMotionRef = useRef(profile.reducedMotion);
  const coarsePointerRef = useRef(profile.pointer === "coarse");
  const sceneReadyRef = useRef(false);
  const fontsReadyRef = useRef(false);
  const failedRef = useRef(false);
  const loadReadyDispatchedRef = useRef(false);
  const displayedProgressRef = useRef(0);
  const canSkipRef = useRef(false);
  const exitCompleteRef = useRef(false);
  const targetProgressRef = useRef(0);
  const renderedProgressRef = useRef(0);
  const dragYRef = useRef<number | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const skipTargetRef = useRef<SkipTarget | null>(null);
  const requestFrameRef = useRef<() => void>(() => undefined);
  const sessionWrittenRef = useRef(false);

  const loaderMode: LoaderMode =
    state.returning || profile.reducedMotion ? "short" : "first";
  const enhancementStarted = state.sessionResolved && profile.ready;
  const enhancementActive = enhancementStarted && state.phase !== "fallback";
  const enhancementHealthy = enhancementActive && sceneReady;
  const selectionBias = getSelectionBias(state);
  const committed = state.committed;

  const pose = useMemo(
    () =>
      deriveGatewayPose({
        travelProgress,
        selectionBias,
        exitProgress,
        committed,
        reducedMotion: profile.reducedMotion,
        coarsePointer: profile.pointer === "coarse",
      }),
    [
      committed,
      exitProgress,
      profile.pointer,
      profile.reducedMotion,
      selectionBias,
      travelProgress,
    ],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    phaseRef.current = state.phase;
    returningRef.current = state.returning;
    reducedMotionRef.current = profile.reducedMotion;
    coarsePointerRef.current = profile.pointer === "coarse";
    requestFrameRef.current();
  }, [profile.pointer, profile.reducedMotion, state.phase, state.returning]);

  useEffect(() => {
    let returning = false;
    try {
      returning = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      returning = false;
    }
    dispatch({ type: "SESSION_RESOLVED", returning });
  }, []);

  useEffect(() => {
    if (!enhancementStarted) return;

    let cancelled = false;
    const fontsPromise = document.fonts?.ready ?? Promise.resolve();
    void fontsPromise.then(() => {
      if (cancelled || !mountedRef.current || failedRef.current) return;
      fontsReadyRef.current = true;
      setFontsReady(true);
      requestFrameRef.current();
    });

    return () => {
      cancelled = true;
    };
  }, [enhancementStarted]);

  useEffect(() => {
    if (!enhancementStarted) return;

    const fallbackTimer = window.setTimeout(() => {
      if (
        mountedRef.current &&
        !failedRef.current &&
        phaseRef.current === "loading"
      ) {
        failedRef.current = true;
        dispatch({ type: "FAIL" });
      }
    }, GATEWAY_TIMING.fallbackMs);

    return () => window.clearTimeout(fallbackTimer);
  }, [enhancementStarted]);

  useEffect(() => {
    if (!enhancementStarted || state.phase === "fallback") return;

    let frame = 0;
    let disposed = false;
    let previousTime = performance.now();
    const loaderStartedAt = previousTime;
    let observedPhase = phaseRef.current;
    let phaseStartedAt = previousTime;
    let exitStartedAt = previousTime;

    const schedule = () => {
      if (
        disposed ||
        frame ||
        !isAnimatedPhase(phaseRef.current) ||
        (phaseRef.current === "exit" && exitCompleteRef.current)
      ) {
        return;
      }
      frame = requestAnimationFrame(runFrame);
    };

    const runFrame = (time: number) => {
      frame = 0;
      if (disposed || failedRef.current) return;

      const deltaSeconds = Math.min(
        0.05,
        Math.max(0, (time - previousTime) / 1000),
      );
      previousTime = time;

      const phase = phaseRef.current;
      if (phase !== observedPhase) {
        observedPhase = phase;
        phaseStartedAt = time;
        if (phase === "exit") exitStartedAt = time;
      }

      if (phase === "loading") {
        const elapsed = Math.max(0, time - loaderStartedAt);
        const mode: LoaderMode =
          returningRef.current || reducedMotionRef.current ? "short" : "first";
        const minimumMs =
          mode === "short"
            ? GATEWAY_TIMING.shortLoaderMs
            : GATEWAY_TIMING.loaderMinMs;
        const realProgress =
          (sceneReadyRef.current ? 0.8 : 0) +
          (fontsReadyRef.current ? 0.2 : 0);
        const target = getLoaderTarget(realProgress, elapsed, mode);
        let next = damp(
          displayedProgressRef.current,
          target,
          12,
          deltaSeconds,
        );
        if (elapsed >= minimumMs && target === 1 && next >= 0.965) next = 1;
        if (next !== displayedProgressRef.current) {
          displayedProgressRef.current = next;
          setDisplayedProgress(next);
        }

        const nextCanSkip = shouldShowSkip(elapsed, mode);
        if (nextCanSkip !== canSkipRef.current) {
          canSkipRef.current = nextCanSkip;
          setCanSkip(nextCanSkip);
        }

        const skipRequested = skipTargetRef.current !== null;
        if (
          !loadReadyDispatchedRef.current &&
          sceneReadyRef.current &&
          (next >= 1 || skipRequested)
        ) {
          loadReadyDispatchedRef.current = true;
          if (skipRequested) {
            displayedProgressRef.current = 1;
            setDisplayedProgress(1);
          }
          dispatch({ type: "LOAD_READY" });
        }
      } else if (phase === "ready") {
        if (time - phaseStartedAt >= GATEWAY_TIMING.readyHoldMs) {
          if (returningRef.current || reducedMotionRef.current) {
            targetProgressRef.current = 1;
            renderedProgressRef.current = 1;
            setTravelProgress(1);
          }
          dispatch({
            type: "BEGIN_ENTRY",
            reducedMotion: reducedMotionRef.current,
          });
        }
      } else if (phase === "auto-entry") {
        const skipTarget = skipTargetRef.current;
        if (skipTarget) {
          if (skipTarget.startedAt === 0) {
            skipTarget.startedAt = time;
            skipTarget.from = renderedProgressRef.current;
          }
          const amount = Math.min(
            1,
            (time - skipTarget.startedAt) / GATEWAY_TIMING.skipFastForwardMs,
          );
          targetProgressRef.current =
            skipTarget.from + (1 - skipTarget.from) * amount;
          renderedProgressRef.current = stepTravelProgress(
            renderedProgressRef.current,
            targetProgressRef.current,
            deltaSeconds,
          );
          if (amount >= 1 && renderedProgressRef.current >= 0.995) {
            targetProgressRef.current = 1;
            renderedProgressRef.current = 1;
            setTravelProgress(1);
            dispatch({ type: "AUTO_COMPLETE" });
            dispatch({ type: "TRAVEL_COMPLETE" });
          } else {
            setTravelProgress(renderedProgressRef.current);
          }
        } else {
          const duration = coarsePointerRef.current
            ? GATEWAY_TIMING.autoEntryCoarseMs
            : GATEWAY_TIMING.autoEntryMs;
          const endpoint = coarsePointerRef.current ? 0.72 : 0.68;
          const amount = Math.min(1, (time - phaseStartedAt) / duration);
          const next = endpoint * amount;
          targetProgressRef.current = next;
          renderedProgressRef.current = next;
          setTravelProgress(next);
          if (amount >= 1) dispatch({ type: "AUTO_COMPLETE" });
        }
      } else if (phase === "user-travel") {
        renderedProgressRef.current = stepTravelProgress(
          renderedProgressRef.current,
          targetProgressRef.current,
          deltaSeconds,
        );
        if (renderedProgressRef.current >= 0.995) {
          targetProgressRef.current = 1;
          renderedProgressRef.current = 1;
          setTravelProgress(1);
          dispatch({ type: "TRAVEL_COMPLETE" });
        } else {
          setTravelProgress(renderedProgressRef.current);
        }
      } else if (phase === "exit") {
        const next = Math.min(
          1,
          (time - exitStartedAt) / GATEWAY_TIMING.exitMs,
        );
        exitCompleteRef.current = next >= 1;
        setExitProgress(next);
      }

      schedule();
    };

    requestFrameRef.current = schedule;
    schedule();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      requestFrameRef.current = () => undefined;
    };
  }, [enhancementStarted, state.phase]);

  const handleSceneReady = useCallback(() => {
    if (!mountedRef.current || sceneReadyRef.current || failedRef.current) return;
    sceneReadyRef.current = true;
    setSceneReady(true);
    requestFrameRef.current();
  }, []);

  const handleFailure = useCallback(() => {
    if (!mountedRef.current || failedRef.current) return;
    failedRef.current = true;
    dispatch({ type: "FAIL" });
  }, []);

  const handleSkip = useCallback(() => {
    const mode: LoaderMode =
      returningRef.current || reducedMotionRef.current ? "short" : "first";
    if (
      phaseRef.current !== "loading" ||
      mode !== "first" ||
      skipTargetRef.current
    ) {
      return;
    }
    skipTargetRef.current = {
      from: renderedProgressRef.current,
      startedAt: 0,
    };
    requestFrameRef.current();
  }, []);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (phaseRef.current !== "user-travel") return;
    event.preventDefault();
    targetProgressRef.current = applyTravelDelta(
      targetProgressRef.current,
      event.deltaY,
    );
    requestFrameRef.current();
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (
      phaseRef.current !== "user-travel" ||
      event.button !== 0 ||
      dragPointerIdRef.current !== null ||
      (event.target instanceof Element && event.target.closest("a, button"))
    ) {
      return;
    }
    dragYRef.current = event.clientY;
    dragPointerIdRef.current = event.pointerId;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }, []);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    const previousY = dragYRef.current;
    if (
      phaseRef.current !== "user-travel" ||
      previousY === null ||
      dragPointerIdRef.current !== event.pointerId
    ) {
      return;
    }
    const delta = previousY - event.clientY;
    dragYRef.current = event.clientY;
    targetProgressRef.current = applyTravelDelta(
      targetProgressRef.current,
      delta,
    );
    requestFrameRef.current();
  }, []);

  const handlePointerEnd = useCallback((event: PointerEvent) => {
    if (dragPointerIdRef.current !== event.pointerId) return;
    dragYRef.current = null;
    dragPointerIdRef.current = null;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || state.phase !== "user-travel") return;

    root.addEventListener("wheel", handleWheel, { passive: false });
    root.addEventListener("pointerdown", handlePointerDown);
    root.addEventListener("pointermove", handlePointerMove);
    root.addEventListener("pointerup", handlePointerEnd);
    root.addEventListener("pointercancel", handlePointerEnd);
    root.addEventListener("lostpointercapture", handlePointerEnd);

    return () => {
      const pointerId = dragPointerIdRef.current;
      if (pointerId !== null && root.hasPointerCapture(pointerId)) {
        root.releasePointerCapture(pointerId);
      }
      dragYRef.current = null;
      dragPointerIdRef.current = null;
      root.removeEventListener("wheel", handleWheel);
      root.removeEventListener("pointerdown", handlePointerDown);
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerup", handlePointerEnd);
      root.removeEventListener("pointercancel", handlePointerEnd);
      root.removeEventListener("lostpointercapture", handlePointerEnd);
    };
  }, [
    handlePointerDown,
    handlePointerEnd,
    handlePointerMove,
    handleWheel,
    state.phase,
  ]);

  useEffect(() => {
    if (
      state.phase !== "commit" ||
      state.committed === null ||
      sessionWrittenRef.current
    ) {
      return;
    }
    sessionWrittenRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Navigation remains valid when storage is unavailable.
    }
  }, [state.committed, state.phase]);

  return (
    <div
      className="gateway-prototype"
      data-phase={state.phase}
      data-scene-ready={sceneReady ? "true" : "false"}
      data-fonts-ready={fontsReady ? "true" : "false"}
      ref={rootRef}
    >
      {enhancementActive ? (
        <div className="gateway-enhancement">
          <TunnelCanvas
            coarsePointer={profile.pointer === "coarse"}
            onFailure={handleFailure}
            onReady={handleSceneReady}
            pose={pose}
          />
          {enhancementHealthy &&
          (state.phase === "loading" || state.phase === "ready") ? (
            <LoaderOverlay
              canSkip={loaderMode === "first" && canSkip}
              onSkip={handleSkip}
              phase={state.phase}
              progress={displayedProgress}
              returning={state.returning}
            />
          ) : null}
          {state.phase === "user-travel" ? (
            <p className="gateway-travel-cue">MOVE FORWARD</p>
          ) : null}
        </div>
      ) : null}
      <GatewayFallback enhanced={enhancementHealthy} />
    </div>
  );
}
