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
