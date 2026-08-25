import type { GatewayDivision } from "./state";

export type GatewayNavigationIntent = {
  button: number;
  detail: number;
  defaultPrevented: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  target?: string;
  download: boolean;
  reducedMotion: boolean;
  enhancementReady: boolean;
};

export type GatewayCommitLock = {
  current: boolean;
};

export type GatewayPreviewRequirement = {
  coarsePointer: boolean;
  division: GatewayDivision;
  selectedDivision: GatewayDivision | null;
};

export function shouldEnhanceGatewayNavigation(
  intent: GatewayNavigationIntent,
): boolean {
  return (
    intent.button === 0 &&
    intent.detail > 0 &&
    !intent.defaultPrevented &&
    !intent.metaKey &&
    !intent.ctrlKey &&
    !intent.shiftKey &&
    !intent.altKey &&
    (!intent.target || intent.target === "_self") &&
    !intent.download &&
    !intent.reducedMotion &&
    intent.enhancementReady
  );
}

export function shouldMarkGatewaySession(
  intent: GatewayNavigationIntent,
): boolean {
  return (
    intent.button === 0 &&
    intent.detail === 0 &&
    !intent.defaultPrevented &&
    !intent.metaKey &&
    !intent.ctrlKey &&
    !intent.shiftKey &&
    !intent.altKey &&
    (!intent.target || intent.target === "_self") &&
    !intent.download
  );
}

export function shouldRequireGatewayPreview(
  intent: GatewayNavigationIntent,
  context: GatewayPreviewRequirement,
): boolean {
  return (
    context.coarsePointer &&
    context.selectedDivision !== context.division &&
    shouldEnhanceGatewayNavigation(intent)
  );
}

export function acquireGatewayCommitLock(lock: GatewayCommitLock): boolean {
  if (lock.current) return false;
  lock.current = true;
  return true;
}

export function getGatewayExpectedPathname(
  href: string,
  baseHref: string,
): string {
  return new URL(href, baseHref).pathname;
}

export function shouldUseGatewayLocationFallback(
  currentPathname: string,
  expectedPathname: string,
): boolean {
  return currentPathname !== expectedPathname;
}
