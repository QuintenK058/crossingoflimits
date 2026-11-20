import Lenis from "lenis";
import { useEffect } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/*
 * Lenis smooth scrolling (wheel only; touch stays native). Off for reduced motion.
 * The instance lives in a module variable instead of React state, so creating it
 * never re-renders the page tree (important during hydration).
 */
let instance: Lenis | null = null;
export const getLenis = () => instance;

export function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const start = () => {
      if (instance || prefersReducedMotion()) return;
      instance = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.95 });
      const loop = (time: number) => {
        instance?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      instance?.destroy();
      instance = null;
    };
    const onChange = () => (mq.matches ? stop() : start());
    start();
    mq.addEventListener("change", onChange);
    return () => {
      mq.removeEventListener("change", onChange);
      stop();
    };
  }, []);
  return null;
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
