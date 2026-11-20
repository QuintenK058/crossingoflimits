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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Gallery, type GalleryItem } from "@/components/ui/Lightbox";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/button";
import { StoNotice } from "@/components/layout/StoBadge";
import NotFound from "./NotFound";

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
      <section aria-labelledby="facts-title" className="border-y border-border bg-[#0f0d0c]">
        <h2 id="facts-title" className="sr-only">
          {t.trip.keyFacts}
        </h2>
        <dl className="container grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
          {facts.map((f) => (
            <div key={f.label} className="border-b border-border py-6 pr-4 xl:border-b-0 xl:border-r xl:px-6 xl:first:pl-0 xl:last:border-r-0">
              <dt className="text-xs font-semibold uppercase tracking-eyebrow text-foreground/70">{f.label}</dt>
              <dd className="mt-2 font-display text-xl leading-tight">{f.value}</dd>
            </div>
          ))}
        </dl>
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
              <p className="mt-4 text-lg leading-relaxed text-foreground/85">{l(trip.route)}</p>
            </Reveal>

            {trip.itinerary.length > 0 && (
              <section aria-labelledby="days-title">
                <Reveal>
                  <h2 id="days-title" className="heading-3">
                    {t.trip.dayByDay}
                  </h2>
                </Reveal>
                <Reveal className="mt-4">
                  <Accordion type="multiple" defaultValue={[trip.itinerary[0].day]} className="border-t border-current/15">
                    {trip.itinerary.map((d) => (
                      <AccordionItem key={d.day} value={d.day}>
                        <AccordionTrigger>
                          <span className="flex items-baseline gap-4">
                            <span className="w-24 shrink-0 font-display text-sm uppercase tracking-wider text-primary">
                              {d.variant ? fmt(t.trip.variantLabel, { days: d.day }) : fmt(t.trip.dayLabel, { day: d.day.replace("-", "–") })}
                            </span>
                            <span>{l(d.title)}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="md:pl-28">
                          <Paragraphs text={l(d.text)} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </Reveal>
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
                      <Check className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
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
            <div className="sticky top-[calc(var(--nav-h)+1.5rem)] rounded-xl border border-border bg-card p-6 md:p-8">
              <h2 id="box-title" className="font-display text-2xl">
                {t.trip.bookingBoxTitle}
              </h2>
              <p className="mt-4 text-sm text-foreground/75">{t.common.from}</p>
              <p className="font-display text-5xl text-primary">{price ?? t.common.onRequest}</p>
              <p className="mt-1 text-sm text-foreground/75">{l(trip.priceNote)}</p>
              <p className="mt-5 text-sm">
                <span className="text-foreground/70">{t.trip.forms}: </span>
                {trip.forms.map((f) => t.common.tripForms[f]).join(" · ")}
              </p>
              <ButtonLink to={planLink} size="lg" className="mt-6 w-full">
                {t.trip.request} <ArrowRight aria-hidden="true" />
              </ButtonLink>
              <p className="mt-3 text-center text-xs text-foreground/70">{t.common.noObligation}</p>
              <StoNotice className="mt-6 border-t border-border pt-5" />
            </div>
          </aside>
        </div>
      </div>

      <section className="border-t border-border bg-[#0f0d0c]" aria-labelledby="other-title">
        <div className="container section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="other-title" className="heading-2">
              {t.trip.otherTours}
            </h2>
            <ButtonLink to={destinationPath(trip.country, lang)} variant="outline" size="sm">
              {t.common.discover} {countryName}
            </ButtonLink>
          </div>
          <RevealGroup as="ul" className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.map((r) => (
              <RevealItem as="li" key={r.slug}>
                <TripCard trip={r} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
