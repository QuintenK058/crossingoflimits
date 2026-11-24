import { ArrowRight, CalendarDays, Route } from "lucide-react";
import { useParams } from "react-router-dom";
import { useI18n } from "@/i18n";
import { destinationIdFromSlug, destinationPath, pathFor } from "@/lib/routes";
import { destinations, getDestination } from "@/content/destinations";
import { tripsByCountry } from "@/content/trips";
import { media } from "@/content/media.generated";
import { site } from "@/lib/site";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { TripCard } from "@/components/sections/TripCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/Parallax";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Marquee } from "@/components/ui/Marquee";
import { LocalLink } from "@/components/ui/LocalLink";
import NotFound from "./NotFound";

export default function DestinationDetail() {
  const { slug = "" } = useParams();
  const { t, l, lang, fmt } = useI18n();
  const id = destinationIdFromSlug(slug);
  if (!id) return <NotFound />;
  const d = getDestination(id);
  const other = destinations.find((x) => x.id !== id)!;
  const trips = tripsByCountry(d.country);
  const c = t.destinationPage;
  const path = destinationPath(id, lang);
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: t.nav.destinations, path: pathFor("destinations", lang) },
    { name: l(d.name), path },
  ];
  const img = media[d.image];

  return (
    <>
      <Seo
        title={fmt(t.meta.destination.title, { name: l(d.name) })}
        description={fmt(t.meta.destination.description, { name: l(d.name), tagline: l(d.tagline) })}
        image={`${site.url}${img.src}-1280.jpg`}
        jsonLd={[breadcrumbSchema(crumbs)]}
      />
      <PageHero size="lg" eyebrow={fmt(t.destinationsPage.destinationLabel, { number: d.number })} title={l(d.name)} lead={l(d.intro)} image={d.image} imageAlt={l(d.imageAlt)} crumbs={crumbs} />

      <Marquee
        items={d.regions.flatMap((r) => r.highlights.map(l))}
        className="font-display mt-20 border-y border-foreground/15 py-5 text-[clamp(2rem,5.5vw,4.5rem)] leading-none stretch-wide"
      />

      <section className="section" aria-labelledby="mood-title">
        <div className="container grid-12 items-center">
          <div className="col-span-4 md:col-span-6">
            <Reveal>
              <p className="eyebrow">{c.mood}</p>
              <h2 id="mood-title" className="mt-5 text-balance text-[clamp(1.9rem,3.2vw,3rem)]">
                {l(d.tagline)}
              </h2>
              <p className="lead mt-6">{l(d.mood)}</p>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <Reveal>
                <h3 className="flex items-center gap-2 font-display text-xl">
                  <Route className="size-5 text-accent" aria-hidden="true" /> {c.roads}
                </h3>
                <ul className="mt-4 space-y-2 text-foreground/80">
                  {d.roads.map((r) => (
                    <li key={r.nl} className="border-b border-border pb-2">
                      {l(r)}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.1}>
                <h3 className="flex items-center gap-2 font-display text-xl">
                  <CalendarDays className="size-5 text-accent" aria-hidden="true" /> {c.bestPeriod}
                </h3>
                <p className="mt-4 font-display text-3xl text-accent">{l(d.bestPeriod)}</p>
              </Reveal>
            </div>
          </div>
          <div className="col-span-4 md:col-span-6">
            <Reveal>
              <ImageReveal image={d.secondaryImage} alt={l(d.secondaryImageAlt)} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] rounded-[var(--radius)]" />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-sand" aria-labelledby="regions-title">
        <div className="container section">
          <SectionHeading eyebrow={c.regions} title={t.destinationsPage.regionsTitle} id="regions-title" />
          <RevealGroup as="ul" className={`mt-12 grid gap-6 ${d.regions.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
            {d.regions.map((r) => (
              <RevealItem as="li" key={r.name.nl} className="flex flex-col rounded-xl bg-sand-deep/60 p-6 md:p-8">
                <p className="eyebrow">{l(r.name)}</p>
                <h3 className="mt-3 font-display text-2xl">{l(r.title)}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{l(r.text)}</p>
                <h4 className="mt-6 text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground">{c.highlights}</h4>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {r.highlights.map((hl) => (
                    <li key={hl.nl} className="rounded-full border border-foreground/25 px-3 py-1 text-sm">
                      {l(hl)}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="section" aria-labelledby="related-title">
        <div className="container">
          <SectionHeading title={fmt(c.relatedTours, { name: l(d.name) })} id="related-title" />
          {trips.length ? (
            <RevealGroup as="ul" className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {trips.map((trip) => (
                <RevealItem as="li" key={trip.slug}>
                  <TripCard trip={trip} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <p className="mt-8 text-foreground/80">{c.noTours}</p>
          )}
        </div>
      </section>

      <section className="theme-dark relative isolate overflow-hidden bg-background text-foreground" aria-label={fmt(c.otherDestination, { name: l(other.name) })}>
        <ParallaxImage image={other.image} alt="" sizes="100vw" className="absolute inset-0 -z-10" overlay="bg-[hsl(var(--ink)/0.55)]" />
        <div className="container py-20 md:py-28">
          <LocalLink to={destinationPath(other.id, lang)} className="group inline-flex items-center gap-4 font-display text-[clamp(2.2rem,6vw,5.5rem)] leading-none stretch-wide hover:text-primary">
            {fmt(c.otherDestination, { name: l(other.name) })}
            <ArrowRight className="size-8 transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true" />
          </LocalLink>
        </div>
      </section>

      <CtaBand title={t.home.closing.title} text={t.home.closing.text} image="photos/hero-andalusia" imageAlt={t.home.closing.imageAlt} />
    </>
  );
}
