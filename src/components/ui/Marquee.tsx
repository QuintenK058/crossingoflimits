import { m, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/hooks/useMotionOk";

/**
 * Infinite marquee whose speed (and direction) reacts to scroll velocity.
 * Text is duplicated for the loop; the copy is hidden from assistive tech.
 */
export function Marquee({ items, className, baseVelocity = 3 }: { items: string[]; className?: string; baseVelocity?: number }) {
  const ok = useMotionOk();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const dir = useRef(1);
  const pos = useRef(0);

  useAnimationFrame((_, delta) => {
    if (!ok) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    pos.current += dir.current * baseVelocity * (delta / 1000) * (1 + Math.abs(f));
    // wrap between -50% and 0
    pos.current = ((pos.current % 50) + 50) % 50;
    x.set(-pos.current);
  });

  const row = (
    <>
      {items.map((it, i) => (
        <span key={i} className="flex shrink-0 items-center gap-[0.5em] pr-[0.5em]">
          <span>{it}</span>
          <span aria-hidden="true" className="text-accent">
            ✦
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <p className="sr-only">{items.join(" · ")}</p>
      <m.div aria-hidden="true" className="flex w-max" style={{ x: useTransform(x, (v) => `${v}%`) }}>
        <div className="flex">{row}</div>
        <div className="flex">{row}</div>
      </m.div>
    </div>
  );
}
