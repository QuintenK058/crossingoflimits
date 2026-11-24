import { ArrowRight, Check, Minus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useI18n } from "@/i18n";
import { destinationPath, pathFor } from "@/lib/routes";
import { formatPrice, isPlaceholder } from "@/lib/utils";
import { getTrip, publishedTrips, type Trip } from "@/content/trips";
import { media } from "@/content/media.generated";
import { site } from "@/lib/site";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema, touristTripSchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { TripCard, tripDays } from "@/components/sections/TripCard";
import { Timeline } from "@/components/sections/Timeline";
import { StickyBookBar } from "@/components/sections/StickyBookBar";
import { Gallery, type GalleryItem } from "@/components/ui/Lightbox";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { StoNotice } from "@/components/layout/StoBadge";
import NotFound from "./NotFound";


export default function TripDetail() {
  const { slug = "" } = useParams();
  const trip = getTrip(slug);
  if (!trip) return <NotFound />;
  return <TripView trip={trip} />;
}

function TripView({ trip }: { trip: Trip }) {
  const { t, l, lang, fmt } = useI18n();
  const path = pathFor("trip", lang, { slug: trip.slug });
  const countryName = trip.country === "spain" ? t.common.spain : t.common.morocco;
  const days = tripDays(trip, t.common.or);
  const price = typeof trip.priceFrom === "number" ? formatPrice(trip.priceFrom, lang) : null;
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: t.trip.breadcrumbGroup, path: pathFor("groupTours", lang) },
    { name: l(trip.name), path },
  ];
  const img = media[trip.image];

  const facts = [
    { label: t.trip.duration, value: fmt(t.trip.durationValue, { days: trip.durations.join(` ${t.common.or} `) }) },
    { label: t.trip.distance, value: isPlaceholder(trip.distance) ? t.common.onRequest : l(trip.distance as { nl: string; en: string }) },
    { label: t.trip.level, value: trip.level.map(l).join(" · ") || t.common.onRequest },
    { label: t.trip.period, value: l(trip.season) },
    {
      label: t.trip.departures,
      value: Array.isArray(trip.departures)
        ? trip.departures.map((d) => new Date(d).toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "short", year: "numeric" })).join(", ")
        : t.trip.departuresOnRequest,
    },
    { label: t.trip.price, value: price ? `${t.common.from} ${price}` : t.common.onRequest },
  ];

  const gallery: GalleryItem[] = [
    ...trip.maps.map((mp) => ({
      image: mp.image,
      alt: fmt(t.trip.mapAlt, { days: mp.days, name: l(trip.name) }),
      caption: fmt(t.trip.mapCaption, { days: mp.days }),
      fit: "contain" as const,
    })),
    ...trip.gallery.map((g) => ({ image: g, alt: `${t.trip.moodCaption} ${countryName}`, caption: t.trip.moodCaption })),
  ];

  const related = [
    ...publishedTrips.filter((x) => x.slug !== trip.slug && x.country === trip.country),
    ...publishedTrips.filter((x) => x.slug !== trip.slug && x.country !== trip.country),
  ].slice(0, 3);

  const planLink = pathFor("plan", lang, {}, `reis=${trip.slug}&reisvorm=group`);

  return (
    <>
      <Seo
        title={fmt(t.meta.trip.title, { name: l(trip.name), days, country: countryName })}
        description={l(trip.short)}
        image={`${site.url}${img.src}-1280.jpg`}
        imageAlt={l(trip.name)}
        jsonLd={[touristTripSchema(trip, lang, path), breadcrumbSchema(crumbs)]}
      />
      <PageHero
        size="lg"
        eyebrow={`${countryName} · ${days}-${t.common.dayTour}`}
        title={l(trip.name)}
        lead={l(trip.intro)}
        image={trip.image}
        imageAlt={l(trip.name)}
        crumbs={crumbs}
      >
        <ButtonLink to={planLink} size="lg">
          {t.trip.request} <ArrowRight aria-hidden="true" />
        </ButtonLink>
      </PageHero>

      {/* Key facts */}
      <section aria-labelledby="facts-title" className="container mt-16 md:mt-20">
        <h2 id="facts-title" className="sr-only">
          {t.trip.keyFacts}
        </h2>
        <RevealGroup as="dl" className="grid grid-cols-2 border-t border-foreground/15 md:grid-cols-3 xl:grid-cols-6" stagger={0.06}>
          {facts.map((f) => (
            <RevealItem key={f.label} className="border-b border-foreground/15 py-6 pr-4 xl:border-b-0 xl:border-r xl:px-6 xl:first:pl-0 xl:last:border-r-0">
              <dt className="text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground">{f.label}</dt>
              <dd className="mt-3 font-display text-2xl leading-tight">{f.value}</dd>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      <div className="container section">
        <div className="grid-12">
          <div className="col-span-4 space-y-20 md:col-span-7 lg:col-span-8">
            <Reveal as="section" aria-labelledby="char-title">
              <h2 id="char-title" className="heading-3">
                {t.trip.characteristics}
              </h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {trip.characteristics.map((c) => (
                  <li key={c.nl} className="rounded-full border border-border bg-card px-4 py-2 text-sm">
                    {l(c)}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="section" aria-labelledby="route-title">
              <h2 id="route-title" className="heading-3">
                {t.trip.route}
              </h2>
              <p className="font-display mt-5 text-[clamp(1.4rem,2.4vw,2.1rem)] font-semibold leading-snug tracking-[-0.02em] [font-stretch:105%]">
                {l(trip.route)}
              </p>
            </Reveal>

            {trip.itinerary.length > 0 && (
              <section aria-labelledby="days-title">
                <Reveal>
                  <h2 id="days-title" className="heading-3">
                    {t.trip.dayByDay}
                  </h2>
                </Reveal>
                <div className="mt-6">
                  <Timeline
                    defaultOpen={[trip.itinerary[0].day]}
                    items={trip.itinerary.map((d) => ({
                      id: d.day,
                      label: d.variant ? fmt(t.trip.variantLabel, { days: d.day }) : fmt(t.trip.dayLabel, { day: d.day.replace("-", "–") }),
                      title: l(d.title),
                      body: l(d.text),
                    }))}
                  />
                </div>
              </section>
            )}

            <section aria-labelledby="incl-title" className="grid gap-10 md:grid-cols-2">
              <Reveal>
                <h2 id="incl-title" className="heading-3">
                  {t.trip.included}
                </h2>
                <ul className="mt-6 space-y-3">
                  {trip.included.map((i) => (
                    <li key={i.nl} className="flex gap-3">
                      <Check className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                      {l(i)}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="heading-3">{t.trip.excluded}</h2>
                <ul className="mt-6 space-y-3 text-foreground/80">
                  {trip.excluded.map((i) => (
                    <li key={i.nl} className="flex gap-3">
                      <Minus className="mt-0.5 size-5 shrink-0 text-foreground/60" aria-hidden="true" />
                      {l(i)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </section>

            <Reveal as="section" aria-labelledby="acc-title">
              <h2 id="acc-title" className="heading-3">
                {t.trip.accommodation}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground/85">{l(trip.accommodation)}</p>
            </Reveal>

            <section aria-labelledby="gallery-title">
              <Reveal>
                <h2 id="gallery-title" className="heading-3">
                  {t.trip.gallery}
                </h2>
              </Reveal>
              <Reveal className="mt-6">
                <Gallery items={gallery} />
              </Reveal>
            </section>
          </div>

          {/* Sticky booking box */}
          <aside className="col-span-4 md:col-span-5 lg:col-span-4" aria-labelledby="box-title">
            <div className="theme-dark sticky top-[calc(var(--nav-h)+1.5rem)] rounded-[var(--radius)] bg-background p-6 text-foreground md:p-8">
              <h2 id="box-title" className="font-display text-2xl">
                {t.trip.bookingBoxTitle}
              </h2>
              <p className="mt-6 text-sm text-muted-foreground">{t.common.from}</p>
              <p className="font-display text-5xl text-accent">{price ?? t.common.onRequest}</p>
              <p className="mt-1 text-sm text-foreground/75">{l(trip.priceNote)}</p>
              <p className="mt-5 text-sm">
                <span className="text-foreground/70">{t.trip.forms}: </span>
                {trip.forms.map((f) => t.common.tripForms[f]).join(" · ")}
              </p>
              <ButtonLink to={planLink} size="lg" variant="accent" className="mt-6 w-full">
                {t.trip.request} <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-foreground/70">{t.common.noObligation}</p>
              <StoNotice className="mt-6 border-t border-border pt-5" />
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-border bg-sand" aria-labelledby="other-title">
        <div className="container section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="other-title" className="heading-2">
              {t.trip.otherTours}
            </h2>
            <ButtonLink to={destinationPath(trip.country, lang)} variant="outline" size="sm">
              {t.common.discover} {countryName}
            </ButtonLink>
          </div>
          <RevealGroup as="ul" className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-3">
            {related.map((r) => (
              <RevealItem as="li" key={r.slug} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-auto">
                <TripCard trip={r} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
      <StickyBookBar label={t.trip.bookingBoxTitle} price={price ? `${t.common.from} ${price}` : t.common.onRequest} to={planLink} cta={t.trip.request} />
    </>
  );
}
