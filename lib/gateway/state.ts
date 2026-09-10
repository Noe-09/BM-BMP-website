export type GatewayDivision = "visuals" | "technical" | "creator";

export type GatewayPhase =
  | "loading"
  | "ready"
  | "auto-entry"
  | "user-travel"
  | "split"
  | "preview"
  | "briefing"
  | "decision"
  | "commit"
  | "exit"
  | "fallback";

export type GatewayState = {
  phase: GatewayPhase;
  previewDivision: GatewayDivision | null;
  selectedDivision: GatewayDivision | null;
  briefingDirection: "idle" | "forward" | "reverse";
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
  | { type: "SELECT"; division: GatewayDivision }
  | { type: "BRIEFING_COMPLETE" }
  | { type: "GO_BACK" }
  | { type: "GO_BACK_COMPLETE" }
  | { type: "COMMIT"; division: GatewayDivision }
  | { type: "EXIT" }
  | { type: "FAIL" };

export function createGatewayState(returning: boolean): GatewayState {
  // Retained for the public API; session resolution owns the initial value.
  void returning;
  return {
    phase: "loading",
    previewDivision: null,
    selectedDivision: null,
    briefingDirection: "idle",
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
        state.selectedDivision === null
        ? { ...state, phase: "preview", previewDivision: event.division }
        : state;
    case "CLEAR_PREVIEW":
      return state.phase === "preview" && state.selectedDivision === null
        ? { ...state, phase: "split", previewDivision: null }
        : state;
    case "SELECT":
      return (state.phase === "split" || state.phase === "preview") &&
        state.selectedDivision === null
        ? {
            ...state,
            phase: "briefing",
            previewDivision: null,
            selectedDivision: event.division,
            briefingDirection: "forward",
          }
        : state;
    case "BRIEFING_COMPLETE":
      return state.phase === "briefing" &&
        state.selectedDivision !== null &&
        state.briefingDirection === "forward"
        ? { ...state, phase: "decision", briefingDirection: "idle" }
        : state;
    case "GO_BACK":
      return (state.phase === "briefing" || state.phase === "decision") &&
        state.selectedDivision !== null
        ? { ...state, phase: "briefing", briefingDirection: "reverse" }
        : state;
    case "GO_BACK_COMPLETE":
      return state.phase === "briefing" &&
        state.selectedDivision !== null &&
        state.briefingDirection === "reverse"
        ? {
            ...state,
            phase: "split",
            previewDivision: null,
            selectedDivision: null,
            briefingDirection: "idle",
          }
        : state;
    case "COMMIT":
      return state.phase === "decision" &&
        state.selectedDivision === event.division
        ? {
            ...state,
            phase: "commit",
            briefingDirection: "idle",
          }
        : state;
    case "EXIT":
      return state.phase === "commit" ? { ...state, phase: "exit" } : state;
  }
}
