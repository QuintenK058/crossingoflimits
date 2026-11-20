import { ArrowUpRight } from "lucide-react";
import type { Trip } from "@/content/trips";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { cn, formatPrice, isPlaceholder } from "@/lib/utils";
import { LocalLink } from "@/components/ui/LocalLink";
import { Picture } from "@/components/ui/Picture";

/** "5- of 8" → used before "-daagse" / "-day" */
export function tripDays(trip: Trip, or: string) {
  return trip.durations.join(`- ${or} `);
}

/** Card with lift + slow image zoom on hover; the whole card is one link. */
export function TripCard({ trip, headingLevel = "h3", className }: { trip: Trip; headingLevel?: "h2" | "h3"; className?: string }) {
  const { t, l, lang } = useI18n();
  const H = headingLevel;
  const price = typeof trip.priceFrom === "number" && !isPlaceholder(trip.priceFrom) ? formatPrice(trip.priceFrom, lang) : null;
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_rgba(224,122,47,0.35)] focus-within:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Picture
          image={trip.image}
          alt=""
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          className="h-full w-full"
          imgClassName="transition-transform [transition-duration:1200ms] ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur">
          {trip.country === "spain" ? t.common.spain : t.common.morocco}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-eyebrow text-primary">
          {tripDays(trip, t.common.or)}-{t.common.dayTour}
        </p>
        <H className="mt-3 font-display text-2xl leading-tight">
          <LocalLink to={pathFor("trip", lang, { slug: trip.slug })} className="after:absolute after:inset-0 focus-visible:outline-none">
            {l(trip.name)}
          </LocalLink>
        </H>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75">{l(trip.short)}</p>
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
          <p className="text-sm text-foreground/75">
            {price ? (
              <>
                {t.common.from} <span className="font-display text-2xl text-foreground">{price}</span>
              </>
            ) : (
              <span className="text-foreground">{t.common.onRequest}</span>
            )}
          </p>
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full border border-foreground/25 transition-colors duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
          </span>
        </div>
      </div>
    </article>
  );
}
