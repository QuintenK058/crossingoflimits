import { AnimatePresence, m, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState } from "react";
import type { MediaKey } from "@/content/media.generated";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { useMotionOk } from "@/hooks/useMotionOk";
import { LocalLink } from "@/components/ui/LocalLink";
import { Picture } from "@/components/ui/Picture";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

/** Big editorial list of the three travel styles; a photo follows the cursor on hover (desktop). */
export function FormsList() {
  const { t, lang } = useI18n();
  const h = t.home.forms;
  const ok = useMotionOk();
  const items: { key: "group" | "individual" | "tailorMade"; to: string; image: MediaKey }[] = [
    { key: "group", to: pathFor("groupTours", lang), image: "photos/hero-coast" },
    { key: "individual", to: pathFor("individualTours", lang), image: "photos/cockpit" },
    { key: "tailorMade", to: pathFor("tailorMade", lang), image: "photos/support-van" },
  ];
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.6 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 28, mass: 0.6 });

  return (
    <section className="section" aria-labelledby="forms-title">
      <div className="container">
        <Reveal>
          <p className="eyebrow mb-6">{h.eyebrow}</p>
          <h2 id="forms-title" className="heading-2 max-w-3xl text-balance">
            {h.title}
          </h2>
        </Reveal>
        <div ref={wrapRef} className="relative mt-14">
        <RevealGroup as="ul" className="border-t border-foreground/15" stagger={0.08}>
          {items.map((it, i) => {
            const copy = h[it.key];
            return (
              <RevealItem as="li" key={it.key} className="border-b border-foreground/15">
                <LocalLink
                  to={it.to}
                  data-cursor={h.explore}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-3 py-8 md:grid-cols-[4rem_1.1fr_1fr_auto] md:py-10"
                  onPointerEnter={() => setActive(i)}
                  onPointerLeave={() => setActive(null)}
                  onPointerMove={(e) => {
                    const r = wrapRef.current!.getBoundingClientRect();
                    x.set(e.clientX - r.left);
                    y.set(e.clientY - r.top);
                  }}
                >
                  <span className="serif-accent text-2xl text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-[clamp(2rem,5vw,4.25rem)] leading-none transition-transform duration-500 ease-out group-hover:translate-x-3 motion-reduce:transition-none">
                    {copy.title}
                  </span>
                  <span className="col-span-3 max-w-md text-muted-foreground md:col-span-1">{copy.text}</span>
                  <span className="row-start-1 col-start-3 grid size-12 place-items-center rounded-full border border-foreground/25 transition-colors duration-300 group-hover:border-primary group-hover:bg-primary md:col-start-4">
                    <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
                  </span>
                </LocalLink>
              </RevealItem>
            );
          })}
        </RevealGroup>
          {ok && (
            <m.div aria-hidden="true" className="pointer-events-none absolute left-0 top-0 z-10 hidden lg:block" style={{ x, y }}>
              <AnimatePresence>
                {active !== null && (
                  <m.div
                    key={active}
                    className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[var(--radius)] shadow-2xl"
                    initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
                    animate={{ opacity: 1, scale: 1, rotate: -3 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 260, damping: 24 }}
                  >
                    <Picture image={items[active].image} alt="" sizes="320px" className="h-56 w-80" />
                  </m.div>
                )}
              </AnimatePresence>
            </m.div>
          )}
        </div>
      </div>
    </section>
  );
}
