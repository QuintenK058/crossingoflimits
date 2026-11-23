import { useState } from "react";
import type { Country, Trip } from "@/content/trips";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { StoNotice } from "@/components/layout/StoBadge";
import { TripCard } from "./TripCard";

/** Trip overview with an accessible country filter (toggle buttons). */
export function TripList({ trips, title }: { trips: Trip[]; title: string }) {
  const { t, fmt } = useI18n();
  const [country, setCountry] = useState<Country | "all">("all");
  const shown = country === "all" ? trips : trips.filter((x) => x.country === country);
  const options: { value: Country | "all"; label: string }[] = [
    { value: "all", label: t.toursPage.all },
    { value: "spain", label: t.common.spain },
    { value: "morocco", label: t.common.morocco },
  ];
  return (
    <section className="section" aria-labelledby="trip-list-title">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id="trip-list-title" className="heading-2">
              {title} <sup className="serif-accent align-super text-[0.45em] text-accent">({shown.length})</sup>
            </h2>
            <p className="sr-only" aria-live="polite">
              {fmt(t.toursPage.count, { count: shown.length })}
            </p>
          </div>
          <div role="group" aria-label={t.toursPage.filterLabel} className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                aria-pressed={country === o.value}
                onClick={() => setCountry(o.value)}
                className={cn(
                  "h-10 rounded-full border px-5 text-sm font-medium transition-colors",
                  country === o.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/25 hover:border-foreground",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
        <RevealGroup key={country} as="ul" className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((trip) => (
            <RevealItem as="li" key={trip.slug}>
              <TripCard trip={trip} />
            </RevealItem>
          ))}
        </RevealGroup>
        <StoNotice className="mt-10 max-w-3xl" />
      </div>
    </section>
  );
}
