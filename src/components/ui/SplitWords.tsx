import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * Splits a heading into words that slide up from a mask, staggered (pure CSS,
 * runs before JS – good for LCP). Text stays real text for SEO and screen readers.
 */
export function SplitWords({ text, delay = 0, step = 0.07, className, accentLast }: { text: string; delay?: number; step?: number; className?: string; accentLast?: boolean }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i}>
          <span className="inline-block max-w-full overflow-hidden pb-[0.08em] align-bottom">
            <span
              className={cn("intro-word", className, accentLast && i === words.length - 1 && "serif-accent text-accent")}
              style={{ "--d": `${delay + i * step}s` } as CSSProperties}
            >
              {w}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
