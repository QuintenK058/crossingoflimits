import { m, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { MediaKey } from "@/content/media.generated";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/lib/motion";
import { useMotionOk, useMounted } from "@/hooks/useMotionOk";
import { srcSet, Picture } from "@/components/ui/Picture";
import { ButtonLink } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/Magnetic";
import { SplitWords } from "@/components/ui/SplitWords";

const SLIDES: MediaKey[] = ["photos/hero-andalusia", "photos/hero-atlas", "photos/hero-coast"];
const DURATION = 6000;
const d = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;

export const heroPreload = [{ imagesrcset: srcSet("photos/hero-andalusia", "avif"), imagesizes: "100vw", type: "image/avif" }];

/**
 * Homepage hero: giant split-word title on paper and a photo montage
 * (cross-fade + slow Ken Burns zoom) that grows to full-bleed while scrolling.
 * Auto-advance can be paused (WCAG 2.2.2) and is off for reduced motion.
 */
export function HeroMontage() {
  const { t, lang, fmt } = useI18n();
  const h = t.home.hero;
  const ok = useMotionOk();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const frame = useRef<HTMLDivElement>(null);
  // Slides 2 and 3 load after hydration so they don't compete with the first paint.
  const mounted = useMounted();

  const { scrollYProgress } = useScroll({ target: frame, offset: ["start end", "start start"] });
  const scale = useTransform(scrollYProgress, [0.35, 1], [0.9, 1]);
  const radius = useTransform(scrollYProgress, [0.35, 1], [12, 0]);

  useEffect(() => {
    if (prefersReducedMotion()) setPlaying(false);
  }, []);
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), DURATION);
    return () => window.clearTimeout(id);
  }, [playing, index]);

  const [first, ...rest] = h.title.split(" ");
  const last = rest.pop() ?? "";

  return (
    <section className="relative pt-[calc(var(--nav-h)+1.5rem)] md:pt-[calc(var(--nav-h)+2.5rem)]">
      <div className="container">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground">
          <p className="eyebrow intro-up">{h.eyebrow}</p>
          <p className="intro-up hidden md:block" style={d(0.1)}>
            {h.meta}
          </p>
        </div>
        <h1 className="heading-display mt-6 stretch-wide md:mt-8" aria-label={h.title}>
          <span aria-hidden="true" className="block">
            <SplitWords text={[first, ...rest].join(" ")} delay={0.15} step={0.09} />
          </span>
          <span aria-hidden="true" className="block text-right">
            <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
              <span className="intro-word serif-accent text-accent [font-size:1.08em]" style={d(0.15 + (rest.length + 1) * 0.09)}>
                {last}
              </span>
            </span>
          </span>
        </h1>
        <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-12 md:items-end">
          <p className="lead intro-up max-w-md md:col-span-5" style={d(0.55)}>
            {h.subtitle}.
          </p>
          <div className="intro-up flex flex-wrap gap-3 md:col-span-7 md:justify-end" style={d(0.65)}>
            <Magnetic>
              <ButtonLink to={pathFor("plan", lang)} size="lg" variant="accent">
                {t.common.planCta} <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </Magnetic>
            <ButtonLink to={pathFor("groupTours", lang)} size="lg" variant="outline">
              {h.ctaTours}
            </ButtonLink>
          </div>
        </div>
      </div>

      <div ref={frame} className="intro-up mt-10 md:mt-14" style={d(0.3)}>
        <m.div
          className="relative mx-auto aspect-[4/5] overflow-hidden bg-secondary sm:aspect-[16/10] md:aspect-auto md:h-[88svh]"
          style={ok ? { scale, borderRadius: radius } : undefined}
        >
          {SLIDES.map((img, i) => (
            <div
              key={img}
              aria-hidden={i !== index}
              className={cn("absolute inset-0 transition-opacity duration-[1400ms] ease-out", i === index ? "opacity-100" : "opacity-0")}
            >
              <div
                className="h-full w-full"
                style={
                  i === index && playing
                    ? { animation: `kenburns ${DURATION + 1400}ms linear both` }
                    : { transform: "scale(1.04)" }
                }
              >
                {(i === 0 || mounted) && <Picture image={img} alt={h.slides[i].alt} priority={i === 0} sizes="100vw" className="h-full w-full" />}
              </div>
            </div>
          ))}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-[hsl(var(--paper))] md:p-8">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="grid size-11 place-items-center rounded-full border border-white/50 transition-colors hover:bg-white hover:text-black"
                aria-label={playing ? h.pause : h.play}
              >
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
              </button>
              <ol className="flex gap-2" aria-label={fmt(h.slideLabel, { current: index + 1, total: SLIDES.length })}>
                {SLIDES.map((img, i) => (
                  <li key={img}>
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`${fmt(h.slideLabel, { current: i + 1, total: SLIDES.length })}: ${h.slides[i].caption}`}
                      aria-current={i === index ? "true" : undefined}
                      className="block py-3"
                    >
                      <span className="block h-[3px] w-10 overflow-hidden rounded-full bg-white/35 md:w-16">
                        <span
                          className="block h-full origin-left bg-white"
                          style={
                            i === index
                              ? playing
                                ? { animation: `progress ${DURATION}ms linear both` }
                                : { transform: "scaleX(1)" }
                              : { transform: i < index ? "scaleX(1)" : "scaleX(0)" }
                          }
                        />
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <p className="serif-accent text-xl md:text-3xl">
              {h.slides[index].caption}
            </p>
          </div>
        </m.div>
      </div>

      <a
        href="#intro"
        className="container mt-6 hidden items-center gap-3 text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground hover:text-foreground md:flex"
      >
        <ArrowDown className="size-4 animate-bounce motion-reduce:animate-none" aria-hidden="true" /> {h.scroll}
      </a>
    </section>
  );
}
