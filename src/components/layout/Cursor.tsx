import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Decorative custom cursor for mouse users: a small dot that grows into a label
 * ("Bekijk", "Ontdek"…) over elements with [data-cursor="label"].
 * Purely visual (aria-hidden); the native cursor stays visible.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(t ? t.dataset.cursor || null : null);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <m.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[95]" style={{ x: sx, y: sy }}>
      <m.div
        className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-[11px] font-semibold uppercase tracking-wider text-[hsl(var(--ink))]"
        animate={{ width: label ? 92 : 10, height: label ? 92 : 10, opacity: label ? 1 : 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label && <span>{label}</span>}
      </m.div>
    </m.div>
  );
}
