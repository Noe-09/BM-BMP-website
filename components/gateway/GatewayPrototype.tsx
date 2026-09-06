"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { CSSProperties, MouseEvent } from "react";

import { useInteractionProfile } from "@/lib/motion/useInteractionProfile";
import { damp } from "@/lib/motion/physics";
import { deriveGatewayPose } from "@/lib/gateway/choreography";
import { createJourney, impulseJourney, seekJourney, stepJourney } from "@/lib/gateway/journey/controller";
import {
  acquireGatewayCommitLock,
  getGatewayExpectedPathname,
  shouldEnhanceGatewayNavigation,
  shouldMarkGatewaySession,
  shouldRequireGatewayPreview,
  shouldUseGatewayLocationFallback,
  type GatewayNavigationIntent,
} from "@/lib/gateway/navigation";
import {
  GATEWAY_TIMING,
  getGatewayPresentation,
  getLoaderTarget,
  shouldShowSkip,
  type LoaderMode,
} from "@/lib/gateway/progress";
import {
  createGatewayState,
  gatewayReducer,
  getSelectionBias,
  type GatewayDivision,
  type GatewayPhase,
} from "@/lib/gateway/state";
import { GatewayFallback } from "./GatewayFallback";
import { LoaderOverlay } from "./LoaderOverlay";
import { SelectionOverlay } from "./SelectionOverlay";
import { TunnelCanvas } from "./TunnelCanvas";

const SESSION_KEY = "bmGatewaySeen";

type SkipTarget = {
  startedAt: number;
};

type GatewayPageStyle = CSSProperties & {
  "--gateway-loader-progress": number;
};

const isAnimatedPhase = (phase: GatewayPhase) =>
  phase === "loading" ||
  phase === "ready" ||
  phase === "auto-entry" ||
  phase === "user-travel" ||
  phase === "split" ||
  phase === "preview" ||
  phase === "commit";

const isJourneyPhase = (phase: GatewayPhase) =>
  phase === "auto-entry" || phase === "user-travel" || phase === "split" || phase === "preview";

export function GatewayPrototype() {
  const pathname = usePathname();
  const router = useRouter();
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
  const sceneReadyRef = useRef(false);
  const fontsReadyRef = useRef(false);
  const failedRef = useRef(false);
  const loadReadyDispatchedRef = useRef(false);
  const displayedProgressRef = useRef(0);
  const canSkipRef = useRef(false);
  const exitCompleteRef = useRef(false);
  const exitStartedAtRef = useRef<number | null>(null);
  const journeyRef = useRef(createJourney());
  const dragYRef = useRef<number | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const skipTargetRef = useRef<SkipTarget | null>(null);
  const requestFrameRef = useRef<() => void>(() => undefined);
  const sessionWrittenRef = useRef(false);
  const committedGuardRef = useRef(false);
  const commitHrefRef = useRef<string | null>(null);
  const expectedPathnameRef = useRef<string | null>(null);
  const safetyTimeoutRef = useRef<number | null>(null);

  const loaderMode: LoaderMode =
    state.returning || profile.reducedMotion ? "short" : "first";
  const enhancementStarted = state.sessionResolved && profile.ready;
  const presentation = getGatewayPresentation({
    phase: state.phase,
    enhancementStarted,
    sceneReady,
    selectionOverlayPresent: true,
  });
  const selectionBias = getSelectionBias(state);
  const selection = state.committed ?? state.preview ?? "neutral";
  const committed = state.committed;
  const pageStyle: GatewayPageStyle = {
    "--gateway-loader-progress": displayedProgress,
  };

  const pose = useMemo(
    () =>
      deriveGatewayPose({
        travelProgress,
        selectionBias: travelProgress >= .985 ? selectionBias : 0,
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

  const clearSafetyTimeout = useCallback(() => {
    if (safetyTimeoutRef.current === null) return;
    window.clearTimeout(safetyTimeoutRef.current);
    safetyTimeoutRef.current = null;
  }, []);

  const writeSessionSeen = useCallback(() => {
    if (sessionWrittenRef.current) return;
    sessionWrittenRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Native and enhanced navigation remain valid without storage.
    }
  }, []);

  const finishCommit = useCallback(() => {
    const href = commitHrefRef.current;
    const expectedPathname = expectedPathnameRef.current;
    if (!href || !expectedPathname) return;

    dispatch({ type: "EXIT" });
    router.push(href);
    clearSafetyTimeout();
    safetyTimeoutRef.current = window.setTimeout(() => {
      safetyTimeoutRef.current = null;
      if (
        shouldUseGatewayLocationFallback(
          window.location.pathname,
          expectedPathname,
        )
      ) {
        window.location.assign(href);
      }
    }, GATEWAY_TIMING.navigationFallbackMs);
  }, [clearSafetyTimeout, router]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (
      expectedPathnameRef.current &&
      pathname === expectedPathnameRef.current
    ) {
      clearSafetyTimeout();
    }

    return clearSafetyTimeout;
  }, [clearSafetyTimeout, pathname]);

  useEffect(() => {
    phaseRef.current = state.phase;
    returningRef.current = state.returning;
    reducedMotionRef.current = profile.reducedMotion;
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

    let fallbackTimer: number | null = null;
    const armVisibleTimeout = () => {
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
      if (document.hidden) return;
      fallbackTimer = window.setTimeout(() => {
        if (
          mountedRef.current && !failedRef.current &&
          phaseRef.current === "loading" &&
          (!sceneReadyRef.current || !fontsReadyRef.current)
        ) {
          failedRef.current = true;
          dispatch({ type: "FAIL" });
        }
      }, GATEWAY_TIMING.fallbackMs);
    };
    document.addEventListener("visibilitychange", armVisibleTimeout);
    armVisibleTimeout();
    return () => {
      if (fallbackTimer !== null) window.clearTimeout(fallbackTimer);
      document.removeEventListener("visibilitychange", armVisibleTimeout);
    };
  }, [enhancementStarted]);

  useEffect(() => {
    if (!enhancementStarted || state.phase === "fallback") return;

    let frame = 0;
    let disposed = false;
    let previousTime = performance.now();
    const loaderStartedAt = previousTime;
    let observedPhase = phaseRef.current;
    let phaseStartedAt = previousTime;

    const schedule = () => {
      if (
        disposed ||
        frame ||
        !isAnimatedPhase(phaseRef.current) ||
        (phaseRef.current === "commit" && exitCompleteRef.current)
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
            journeyRef.current = createJourney(1);
            setTravelProgress(1);
          }
          dispatch({
            type: "BEGIN_ENTRY",
            reducedMotion: reducedMotionRef.current,
          });
        }
      } else if (isJourneyPhase(phase)) {
        const skipTarget = skipTargetRef.current;
        if (skipTarget && skipTarget.startedAt === 0) {
          skipTarget.startedAt = time;
          journeyRef.current = seekJourney(journeyRef.current, 1, time, GATEWAY_TIMING.skipFastForwardMs);
        }
        const before = journeyRef.current.renderProgress;
        journeyRef.current = reducedMotionRef.current
          ? createJourney(1)
          : stepJourney(journeyRef.current, document.hidden ? 0 : deltaSeconds, time, !document.hidden);
        const next = journeyRef.current.renderProgress;
        if (next !== before) setTravelProgress(next);
        // Lifecycle milestones only move forward. Rewinding is solely visual.
        if (phase === "auto-entry" && next >= .68) {
          dispatch({ type: "AUTO_COMPLETE" });
        } else if (phase === "user-travel" && next === 1) {
          dispatch({ type: "TRAVEL_COMPLETE" });
        }
      } else if (phase === "commit") {
        if (exitStartedAtRef.current === null) {
          exitStartedAtRef.current = time;
        }
        const next = Math.min(
          1,
          (time - exitStartedAtRef.current) / GATEWAY_TIMING.exitMs,
        );
        exitCompleteRef.current = next >= 1;
        setExitProgress(next);
        if (exitCompleteRef.current) finishCommit();
      }

      // The endpoint sleeps until input or a lifecycle change explicitly wakes it.
      if (!(isJourneyPhase(phase) && journeyRef.current.renderProgress === 1 && journeyRef.current.targetProgress === 1)) schedule();
    };

    requestFrameRef.current = schedule;
    schedule();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      requestFrameRef.current = () => undefined;
    };
  }, [enhancementStarted, finishCommit, state.phase]);

  const handleSceneReady = useCallback(() => {
    if (!mountedRef.current || sceneReadyRef.current || failedRef.current) return;
    sceneReadyRef.current = true;
    setSceneReady(true);
    requestFrameRef.current();
  }, []);

  const handleFailure = useCallback(() => {
    if (
      !mountedRef.current ||
      failedRef.current ||
      committedGuardRef.current
    ) {
      return;
    }
    failedRef.current = true;
    dispatch({ type: "FAIL" });
  }, []);

  const handlePreview = useCallback((division: GatewayDivision) => {
    if (committedGuardRef.current || journeyRef.current.renderProgress < .985) return;
    dispatch({ type: "PREVIEW", division });
  }, []);

  const handleClearPreview = useCallback(() => {
    if (committedGuardRef.current || journeyRef.current.renderProgress < .985) return;
    dispatch({ type: "CLEAR_PREVIEW" });
  }, []);

  useEffect(() => {
    if (state.phase !== "preview") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleClearPreview();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClearPreview, state.phase]);

  const handleCommit = useCallback(
    (
      division: GatewayDivision,
      href: string,
      event: MouseEvent<HTMLAnchorElement>,
    ) => {
      const anchor = event.currentTarget;
      const intent: GatewayNavigationIntent = {
        button: event.button,
        detail: event.detail,
        defaultPrevented: event.defaultPrevented,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        target: anchor.target || undefined,
        download: anchor.hasAttribute("download"),
        reducedMotion: profile.reducedMotion,
        enhancementReady: presentation.showSelection,
      };

      if (
        shouldRequireGatewayPreview(intent, {
          coarsePointer: profile.pointer === "coarse",
          division,
          selectedDivision: state.committed ?? state.preview,
        })
      ) {
        event.preventDefault();
        handlePreview(division);
        return;
      }

      if (shouldMarkGatewaySession(intent)) {
        writeSessionSeen();
        return;
      }

      if (!shouldEnhanceGatewayNavigation(intent)) return;

      event.preventDefault();
      if (!acquireGatewayCommitLock(committedGuardRef)) return;

      exitCompleteRef.current = false;
      exitStartedAtRef.current = null;
      commitHrefRef.current = href;
      expectedPathnameRef.current = getGatewayExpectedPathname(
        href,
        window.location.href,
      );
      setExitProgress(0);
      dispatch({ type: "COMMIT", division });
      writeSessionSeen();
    },
    [
      handlePreview,
      presentation.showSelection,
      profile.pointer,
      profile.reducedMotion,
      state.committed,
      state.preview,
      writeSessionSeen,
    ],
  );

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
      startedAt: 0,
    };
    requestFrameRef.current();
  }, []);

  const handleWheel = useCallback((event: WheelEvent) => {
    if (!isJourneyPhase(phaseRef.current) || reducedMotionRef.current || committedGuardRef.current || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    journeyRef.current = impulseJourney(journeyRef.current, event.deltaY * unit, performance.now());
    requestFrameRef.current();
  }, []);

  const handleTravelControl = useCallback(() => {
    if (!isJourneyPhase(phaseRef.current) || committedGuardRef.current) return;
    journeyRef.current = seekJourney(journeyRef.current, 1, performance.now());
    requestFrameRef.current();
  }, []);

  const handlePointerDown = useCallback((event: PointerEvent) => {
    if (
      !isJourneyPhase(phaseRef.current) ||
      reducedMotionRef.current || committedGuardRef.current ||
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
      !isJourneyPhase(phaseRef.current) ||
      reducedMotionRef.current || committedGuardRef.current ||
      previousY === null ||
      dragPointerIdRef.current !== event.pointerId
    ) {
      return;
    }
    const delta = previousY - event.clientY;
    dragYRef.current = event.clientY;
    journeyRef.current = impulseJourney(journeyRef.current, delta, performance.now());
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
    if (!root || !isJourneyPhase(state.phase)) return;

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

  return (
    <div
      className="gateway-page gateway-prototype"
      data-gateway-enhanced={
        presentation.enhancementHealthy ? "true" : "false"
      }
      data-gateway-phase={state.phase}
      data-gateway-visual-progress={travelProgress.toFixed(5)}
      data-gateway-selection={selection}
      data-scene-ready={sceneReady ? "true" : "false"}
      data-fonts-ready={fontsReady ? "true" : "false"}
      data-layer-owner={presentation.layerOwner}
      ref={rootRef}
      style={pageStyle}
    >
      {presentation.enhancementActive ? (
        <div className="gateway-enhancement">
          <TunnelCanvas
            coarsePointer={profile.pointer === "coarse"}
            onFailure={handleFailure}
            onReady={handleSceneReady}
            pose={pose}
          />
          {presentation.showLoader ? (
            <LoaderOverlay
              canSkip={loaderMode === "first" && canSkip}
              onSkip={handleSkip}
              phase={state.phase}
              progress={displayedProgress}
            />
          ) : null}
          {presentation.showTravelCue || (presentation.showSelection && travelProgress < .985) ? (
            <button
              className="gateway-travel-cue"
              type="button"
              onClick={handleTravelControl}
            >
              MOVE FORWARD
            </button>
          ) : null}
          {presentation.showSelection ? (
            <div hidden={travelProgress < .985} inert={travelProgress < .985}>
              <SelectionOverlay
                state={state}
                leftPercent={pose.leftPercent}
                rightPercent={pose.rightPercent}
                enhancementReady={presentation.enhancementHealthy}
                reducedMotion={profile.reducedMotion}
                coarsePointer={profile.pointer === "coarse"}
                onPreview={handlePreview}
                onClearPreview={handleClearPreview}
                onCommit={handleCommit}
              />
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        hidden={!presentation.fallbackActive}
        aria-hidden={!presentation.fallbackActive}
      >
        <GatewayFallback
          enhanced={presentation.enhancementHealthy}
          onCommit={handleCommit}
        />
      </div>
    </div>
  );
}
