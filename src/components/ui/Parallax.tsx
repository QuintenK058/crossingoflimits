import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { MediaKey } from "@/content/media.generated";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/hooks/useMotionOk";
import { Picture } from "./Picture";

interface ParallaxImageProps {
  image: MediaKey;
  alt: string;
  sizes?: string;
  className?: string;
  /** Max travel as fraction of height (default 0.12 ≈ 12%) */
  strength?: number;
  priority?: boolean;
  overlay?: string;
}

/** Image that drifts subtly while scrolling (transform only). */
export function ParallaxImage({ image, alt, sizes, className, strength = 0.12, priority, overlay }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pct = strength * 50;
  const y = useTransform(scrollYProgress, [0, 1], [`-${pct}%`, `${pct}%`]);
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div
        className="absolute inset-x-0 will-change-transform"
        style={ok ? { y, top: `-${pct}%`, bottom: `-${pct}%` } : { top: 0, bottom: 0 }}
      >
        <Picture image={image} alt={alt} sizes={sizes} priority={priority} className="h-full w-full" />
      </m.div>
      {overlay && <div className={cn("pointer-events-none absolute inset-0", overlay)} aria-hidden="true" />}
    </div>
  );
}
