import { m, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/hooks/useMotionOk";

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.52, 1]);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <m.span style={{ opacity }}>{children}</m.span>
    </span>
  );
}

/** Large statement whose words "light up" one by one while scrolling. */
export function ScrollWords({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: "p" | "h2" }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const ok = useMotionOk();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  if (!ok) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag ref={ref} className={cn(className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
            {w}
          </Word>
        ))}
      </span>
    </Tag>
  );
}
