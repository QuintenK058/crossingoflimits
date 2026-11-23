import { m, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { MediaKey } from "@/content/media.generated";
import { useMotionOk } from "@/hooks/useMotionOk";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/Parallax";

/* Waypoints on a 1000×80 canvas; the road passes exactly through each one. */
const POINTS = Array.from({ length: 6 }, (_, i) => ({ x: 80 + i * 168, y: i % 2 ? 58 : 22 }));
function buildPath() {
  const pts = [{ x: 0, y: 40 }, ...POINTS, { x: 1000, y: 40 }];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const dx = (b.x - a.x) / 2;
    d += ` C ${a.x + dx} ${a.y} ${b.x - dx} ${b.y} ${b.x} ${b.y}`;
  }
  return d;
}
const ROAD = buildPath();

type MomentKey = "morning" | "ride" | "stops" | "arrival" | "dinner" | "fire";
const MOMENTS: { key: MomentKey; image: MediaKey }[] = [
  { key: "morning", image: "photos/pyrenees" },
  { key: "ride", image: "photos/sierra-nevada" },
  { key: "stops", image: "photos/white-village" },
  { key: "arrival", image: "photos/riad" },
  { key: "dinner", image: "photos/bbq" },
  { key: "fire", image: "photos/campfire" },
];

function RouteLine({ progress, active, label, times }: { progress: ReturnType<typeof useSpring> | null; active: number; label: string; times: string[] }) {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="container py-3 md:py-4">
        <svg viewBox="0 0 1000 80" className="h-12 w-full md:h-16" role="img" aria-label={label} preserveAspectRatio="none">
          <path d={ROAD} fill="none" stroke="hsl(var(--border))" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d={ROAD} fill="none" stroke="hsl(var(--foreground) / 0.25)" strokeWidth="1.5" strokeDasharray="10 12" vectorEffect="non-scaling-stroke" />
          {progress ? (
            <m.path
              d={ROAD}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="4"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: progress }}
            />
          ) : (
            <path d={ROAD} fill="none" stroke="hsl(var(--primary))" strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          )}
          {POINTS.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i <= active ? 9 : 7}
              className="transition-all duration-500"
              fill={i <= active ? "hsl(var(--primary))" : "hsl(var(--background))"}
              stroke={i <= active ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.5)"}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        <ol className="mt-1 hidden grid-cols-6 text-center text-[11px] font-semibold uppercase tracking-wider md:grid" aria-hidden="true">
          {times.map((time, i) => (
            <li key={time} className={cn("transition-colors duration-500", i <= active ? "text-accent" : "text-foreground/60")}>
              {time}
            </li>
          ))}
        </ol>
        <p className="mt-1 text-center text-xs font-semibold uppercase tracking-wider text-accent md:hidden" aria-hidden="true">
          {times[Math.max(0, active)]}
        </p>
      </div>
    </div>
  );
}

export default function Experience() {
  const { t, lang } = useI18n();
  const c = t.experience;
  const ok = useMotionOk();
  const dayRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: dayRef, offset: ["start 70%", "end 70%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const [active, setActive] = useState(ok ? -1 : MOMENTS.length - 1);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Waypoint i lights up when the drawn line reaches it (x / 1000 ≈ fraction of the path).
    let idx = -1;
    POINTS.forEach((p, i) => {
      if (v >= p.x / 1000 - 0.02) idx = i;
    });
    setActive(idx);
  });

  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: t.nav.experience, path: pathFor("experience", lang) },
  ];

  return (
    <>
      <Seo title={t.meta.experience.title} description={t.meta.experience.description} jsonLd={[breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="photos/sierra-nevada" imageAlt={c.imageAlt} crumbs={crumbs} size="lg" />

      <section aria-labelledby="day-title" className="pt-24 md:pt-32">
        <div className="container">
          <SectionHeading eyebrow={c.dayEyebrow} title={c.dayTitle} lead={c.dayLead} id="day-title" />
        </div>
        <div ref={dayRef} className="relative mt-12">
          <RouteLine
            progress={ok ? progress : null}
            active={ok ? active : MOMENTS.length - 1}
            label={c.routeLabel}
            times={MOMENTS.map((mo) => c.moments[mo.key].time)}
          />
          <ol className="container">
            {MOMENTS.map((mo, i) => {
              const copy = c.moments[mo.key];
              return (
                <li key={mo.key} className="grid-12 items-center py-16 md:py-24">
                  <div className={cn("col-span-4 md:col-span-6", i % 2 ? "md:order-2 md:col-start-7" : "")}>
                    <Reveal>
                      <ParallaxImage image={mo.image} alt="" sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/3] rounded-xl" strength={0.12} />
                    </Reveal>
                  </div>
                  <div className={cn("col-span-4 md:col-span-5", i % 2 ? "md:col-start-1 md:row-start-1" : "md:col-start-8")}>
                    <Reveal>
                      <p className="flex items-center gap-3 font-display text-sm uppercase tracking-eyebrow text-accent">
                        <span className="grid size-9 place-items-center rounded-full border border-primary text-xs">{String(i + 1).padStart(2, "0")}</span>
                        {copy.time}
                      </p>
                      <h3 className="heading-2 mt-5">{copy.title}</h3>
                      <p className="lead mt-5">{copy.text}</p>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="bg-sand" aria-labelledby="stays-title">
        <div className="container section grid-12 items-center">
          <div className="col-span-4 md:col-span-5">
            <Reveal>
              <p className="eyebrow">{c.staysEyebrow}</p>
              <h2 id="stays-title" className="heading-2 mt-3">
                {c.staysTitle}
              </h2>
              <p className="lead mt-5">{c.staysText}</p>
            </Reveal>
          </div>
          <div className="col-span-4 md:col-span-7">
            <Reveal>
              <ParallaxImage image="photos/riad" alt={c.staysImageAlt} sizes="(min-width: 768px) 58vw, 100vw" className="aspect-[16/10] rounded-xl" />
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand title={c.ctaTitle} text={c.ctaText} image="photos/campfire" imageAlt={c.fireImageAlt} />
    </>
  );
}
