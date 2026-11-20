import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Counts up from 0 when it scrolls into view. The final value is rendered on the
 * server (good for crawlers / no-JS); the count-up only runs on the client.
 */
export function Counter({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(value);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // Only reset to 0 when the counter is still out of view, so nothing visible jumps.
    if (!prefersReducedMotion() && ref.current) {
      const r = ref.current.getBoundingClientRect();
      if (r.top > window.innerHeight) {
        setDisplay(0);
        setArmed(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [armed, inView, value]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
