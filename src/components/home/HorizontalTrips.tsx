import { m, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { publishedTrips } from "@/content/trips";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { prefersReducedMotion } from "@/lib/motion";
import { TripCard } from "@/components/sections/TripCard";
import { ButtonLink } from "@/components/ui/button";

/**
 * Trips in a horizontal track. On desktop the section pins and vertical scroll
 * moves the track sideways; on touch / small screens / reduced motion it is a
 * native swipeable scroll-snap row.
 */
export function HorizontalTrips() {
  const { t, lang } = useI18n();
  const c = t.home.trips;
  const outer = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const measure = () => {
      const on = mq.matches && !prefersReducedMotion();
      setPinned(on);
      if (on && track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 64));
    };
    measure();
    window.addEventListener("resize", measure);
    mq.addEventListener("change", measure);
    return () => {
      window.removeEventListener("resize", measure);
      mq.removeEventListener("change", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={outer}
      aria-labelledby="trips-title"
      className="relative bg-sand"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : "py-24 md:py-32"}>
        <div className="container flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow mb-6">{c.eyebrow}</p>
            <h2 id="trips-title" className="heading-2 text-balance">
              {c.title}
            </h2>
            <p className="lead mt-5 max-w-lg">{c.text}</p>
          </div>
          <ButtonLink to={pathFor("groupTours", lang)} variant="outline">
            {c.cta} <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </div>
        <m.ul
          ref={track}
          style={pinned ? { x } : undefined}
          className={
            pinned
              ? "mt-12 flex w-max gap-6 px-[max(1rem,calc((100vw-1320px)/2+2rem))]"
              : "no-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8"
          }
        >
          {publishedTrips.map((trip) => (
            <li key={trip.slug} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[25vw]">
              <TripCard trip={trip} />
            </li>
          ))}
        </m.ul>
        <div className="container mt-8 flex items-center gap-4 text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground">
          <span aria-hidden="true" className="h-[2px] w-40 overflow-hidden bg-foreground/15">
            <m.span className="block h-full origin-left bg-foreground" style={pinned ? { scaleX: bar } : { scaleX: 0.15 }} />
          </span>
          <span aria-hidden="true">{c.hint}</span>
        </div>
      </div>
    </section>
  );
}
