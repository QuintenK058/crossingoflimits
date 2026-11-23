import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { MediaKey } from "@/content/media.generated";
import { useMotionOk } from "@/hooks/useMotionOk";
import { Picture } from "@/components/ui/Picture";

interface Step {
  title: string;
  text: string;
  image: MediaKey;
}

function Card({ step, i, total }: { step: Step; i: number; total: number }) {
  const ok = useMotionOk();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Earlier cards shrink slightly as the next one slides over them
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - i) * 0.035]);
  return (
    <div ref={ref} className="sticky h-[78vh] md:h-[70vh]" style={{ top: `calc(var(--nav-h) + ${1 + i * 1.5}rem)` }}>
      <m.article
        style={ok ? { scale } : undefined}
        className="theme-dark grid h-[calc(100%-2rem)] origin-top overflow-hidden rounded-[var(--radius)] bg-background text-foreground md:grid-cols-2"
      >
        <div className="flex flex-col justify-between p-7 md:p-12">
          <span className="font-display text-[clamp(4rem,10vw,9rem)] leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="heading-2">{step.title}</h3>
            <p className="lead mt-5 max-w-md">{step.text}</p>
          </div>
        </div>
        <div className="relative hidden md:block">
          <Picture image={step.image} alt="" sizes="50vw" className="absolute inset-0 h-full w-full" />
        </div>
      </m.article>
    </div>
  );
}

/** "How it works" as cards that stack on top of each other while scrolling. */
export function StackSteps({ steps }: { steps: Step[] }) {
  return (
    <ol className="relative">
      {steps.map((s, i) => (
        <li key={s.title}>
          <Card step={s} i={i} total={steps.length} />
        </li>
      ))}
    </ol>
  );
}
