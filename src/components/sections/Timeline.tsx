import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { m, useScroll, useSpring } from "framer-motion";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/hooks/useMotionOk";

export interface TimelineItem {
  id: string;
  label: string;
  title: string;
  body: string;
}

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((p, i) => (
        <p key={i} className="mb-4 last:mb-0">
          {p}
        </p>
      ))}
    </>
  );
}

/**
 * Day-by-day programme as a vertical route: the line draws itself while you
 * scroll; every stop is an accessible accordion item (Radix).
 */
export function Timeline({ items, defaultOpen }: { items: TimelineItem[]; defaultOpen?: string[] }) {
  const ok = useMotionOk();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div ref={ref} className="relative">
      {/* track + drawn line */}
      <span aria-hidden="true" className="absolute bottom-6 left-[11px] top-6 w-[2px] bg-foreground/12" />
      <m.span
        aria-hidden="true"
        className="absolute bottom-6 left-[11px] top-6 w-[2px] origin-top bg-primary"
        style={ok ? { scaleY: progress } : undefined}
      />
      <AccordionPrimitive.Root type="multiple" defaultValue={defaultOpen}>
        {items.map((it) => (
          <AccordionPrimitive.Item key={it.id} value={it.id} className="group relative pl-12">
            <span
              aria-hidden="true"
              className="absolute left-0 top-7 grid size-6 place-items-center rounded-full border-2 border-foreground/25 bg-background transition-colors duration-500 group-data-[state=open]:border-primary"
            >
              <span className="size-2 rounded-full bg-foreground/25 transition-colors duration-500 group-data-[state=open]:bg-primary" />
            </span>
            <AccordionPrimitive.Header asChild>
              <h3 className="m-0">
                <AccordionPrimitive.Trigger className="flex w-full items-start justify-between gap-6 py-6 text-left [&[data-state=open]>span:last-child>svg]:rotate-45">
                  <span className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-eyebrow text-accent [font-stretch:100%]">{it.label}</span>
                    <span className="font-display text-2xl leading-tight md:text-3xl">{it.title}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-foreground/25 transition-colors group-hover:border-foreground"
                  >
                    <Plus className="size-4 transition-transform duration-300" />
                  </span>
                </AccordionPrimitive.Trigger>
              </h3>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className={cn("overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down")}>
              <div className="max-w-2xl pb-8 text-lg leading-relaxed text-muted-foreground">
                <Paragraphs text={it.body} />
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        ))}
      </AccordionPrimitive.Root>
    </div>
  );
}
