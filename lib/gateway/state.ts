export type GatewayDivision = "visuals" | "technical";

export type GatewayPhase =
  | "loading"
  | "ready"
  | "auto-entry"
  | "user-travel"
  | "split"
  | "preview"
  | "commit"
  | "exit"
  | "fallback";

export type GatewayState = {
  phase: GatewayPhase;
  preview: GatewayDivision | null;
  committed: GatewayDivision | null;
  returning: boolean;
  sessionResolved: boolean;
};

export type GatewayEvent =
  | { type: "SESSION_RESOLVED"; returning: boolean }
  | { type: "LOAD_READY" }
  | { type: "BEGIN_ENTRY"; reducedMotion: boolean }
  | { type: "AUTO_COMPLETE" }
  | { type: "TRAVEL_COMPLETE" }
  | { type: "PREVIEW"; division: GatewayDivision }
  | { type: "CLEAR_PREVIEW" }
  | { type: "COMMIT"; division: GatewayDivision }
  | { type: "EXIT" }
  | { type: "FAIL" };

export function createGatewayState(returning: boolean): GatewayState {
  // Retained for the public API; session resolution owns the initial value.
  void returning;
  return {
    phase: "loading",
    preview: null,
    committed: null,
    returning: false,
    sessionResolved: false,
  };
}

export function gatewayReducer(
  state: GatewayState,
  event: GatewayEvent,
): GatewayState {
  if (
    event.type === "SESSION_RESOLVED" &&
    state.phase === "loading" &&
    !state.sessionResolved
  ) {
    return { ...state, returning: event.returning, sessionResolved: true };
  }

  if (event.type === "SESSION_RESOLVED") return state;

  if (event.type === "FAIL") {
    return state.phase === "exit" ? state : { ...state, phase: "fallback" };
  }

  switch (event.type) {
    case "LOAD_READY":
      return state.phase === "loading" && state.sessionResolved
        ? { ...state, phase: "ready" }
        : state;
    case "BEGIN_ENTRY":
      if (state.phase !== "ready") return state;
      return {
        ...state,
        phase: state.returning || event.reducedMotion ? "split" : "auto-entry",
      };
    case "AUTO_COMPLETE":
      return state.phase === "auto-entry"
        ? { ...state, phase: "user-travel" }
        : state;
    case "TRAVEL_COMPLETE":
      return state.phase === "user-travel" ? { ...state, phase: "split" } : state;
    case "PREVIEW":
      return (state.phase === "split" || state.phase === "preview") &&
        state.committed === null
        ? { ...state, phase: "preview", preview: event.division }
        : state;
    case "CLEAR_PREVIEW":
      return state.phase === "preview" && state.committed === null
        ? { ...state, phase: "split", preview: null }
        : state;
    case "COMMIT":
      return (state.phase === "split" || state.phase === "preview") &&
        state.committed === null
        ? {
            ...state,
            phase: "commit",
            preview: event.division,
            committed: event.division,
          }
        : state;
    case "EXIT":
      return state.phase === "commit" ? { ...state, phase: "exit" } : state;
  }
}

export function getSelectionBias(state: GatewayState): -1 | 0 | 1 {
  const selection = state.committed ?? state.preview;
  return selection === "visuals" ? -1 : selection === "technical" ? 1 : 0;
}
