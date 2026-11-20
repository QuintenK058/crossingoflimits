const QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

/** Set once the app has hydrated (see App.tsx). */
let hydrated = false;
export const markHydrated = () => {
  hydrated = true;
};
export const isHydrated = () => hydrated;
