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
    <article className={cn("group relative flex h-full flex-col", className)} data-cursor={t.common.viewTour.split(" ")[0]}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius)] bg-secondary">
        <Picture
          image={trip.image}
          alt=""
          sizes="(min-width: 1280px) 420px, (min-width: 768px) 50vw, 90vw"
          className="h-full w-full"
          imgClassName="transition-transform [transition-duration:1400ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
        <span className="absolute left-4 top-4 rounded-full bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wider">
          {trip.country === "spain" ? t.common.spain : t.common.morocco}
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-4 right-4 grid size-12 translate-y-2 place-items-center rounded-full bg-primary text-[hsl(var(--ink))] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          <ArrowUpRight className="size-5" />
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-baseline justify-between gap-4 text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground">
          <span>
            {tripDays(trip, t.common.or)}-{t.common.dayTour}
          </span>
          <span className="normal-case tracking-normal text-foreground">
            {price ? (
              <>
                <span className="text-muted-foreground">{t.common.from}</span> <span className="text-base font-bold">{price}</span>
              </>
            ) : (
              t.common.onRequest
            )}
          </span>
        </div>
        <H className="mt-3 text-[1.6rem] leading-[1.02]">
          <LocalLink to={pathFor("trip", lang, { slug: trip.slug })} className="link-underline after:absolute after:inset-0 focus-visible:outline-none">
            {l(trip.name)}
          </LocalLink>
        </H>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{l(trip.short)}</p>
      </div>
    </article>
  );
}
