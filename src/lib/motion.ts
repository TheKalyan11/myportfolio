// One switch for the whole site: should animations stop when the visitor's phone or computer has "reduce motion" on?
// The owner wants the marquees, the scroll animations and the opening screen to show on every phone, so this is off.
// Set it to true to respect the setting again (the stylesheet has matching `@media not all` blocks to turn back into
// `@media (prefers-reduced-motion: reduce)`).
export const RESPECT_REDUCED_MOTION = false;

export function prefersReducedMotion(): boolean {
  return RESPECT_REDUCED_MOTION && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
