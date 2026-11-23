import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { MediaKey } from "@/content/media.generated";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/hooks/useMotionOk";
import { Picture } from "./Picture";

interface Props {
  image: MediaKey;
  alt: string;
  sizes?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Parallax travel inside the frame, as a fraction (0 = off) */
  parallax?: number;
  /** Direction the curtain leaves to */
  from?: "bottom" | "left";
}

/**
 * Image with a "curtain" reveal when it enters the viewport: a paper-coloured
 * panel scales away (transform only) while the photo settles from a zoom.
 * Plus an optional subtle parallax while scrolling.
 */
export function ImageReveal({ image, alt, sizes, className, imgClassName, priority, parallax = 0.08, from = "bottom" }: Props) {
  const ok = useMotionOk();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const pct = parallax * 50;
  const y = useTransform(scrollYProgress, [0, 1], [`-${pct}%`, `${pct}%`]);
  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-secondary", className)}>
      <m.div
        className="absolute inset-x-0 will-change-transform"
        style={ok && parallax ? { y, top: `-${pct}%`, bottom: `-${pct}%` } : { top: 0, bottom: 0 }}
      >
        <m.div
          className="h-full w-full"
          initial={ok ? { scale: 1.25 } : false}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Picture image={image} alt={alt} sizes={sizes} priority={priority} className="h-full w-full" imgClassName={imgClassName} />
        </m.div>
      </m.div>
      {ok && (
        <m.div
          aria-hidden="true"
          data-reveal=""
          className={cn("absolute inset-0 z-10 bg-background", from === "bottom" ? "origin-top" : "origin-right")}
          initial={from === "bottom" ? { scaleY: 1 } : { scaleX: 1 }}
          whileInView={from === "bottom" ? { scaleY: 0 } : { scaleX: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 1.1, ease }}
        />
      )}
    </div>
  );
}
