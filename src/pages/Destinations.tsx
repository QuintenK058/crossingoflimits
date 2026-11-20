import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { destinationPath, pathFor } from "@/lib/routes";
import { destinations, glance } from "@/content/destinations";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/Parallax";
import { ButtonLink } from "@/components/ui/button";
import { StoNotice } from "@/components/layout/StoBadge";

export default function Destinations() {
  const { t, l, lang, fmt } = useI18n();
  const c = t.destinationsPage;
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: t.nav.destinations, path: pathFor("destinations", lang) },
  ];
  return (
    <>
      <Seo title={t.meta.destinations.title} description={t.meta.destinations.description} jsonLd={[breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="photos/sunset" imageAlt={t.home.closing.imageAlt} crumbs={crumbs}>
        <StoNotice className="max-w-xl" />
      </PageHero>

      <section className="section-tight" aria-labelledby="regions-title">
        <div className="container">
          <SectionHeading title={c.regionsTitle} lead={c.regionsLead} id="regions-title" />
        </div>
      </section>

      {destinations.map((d, i) => (
        <section key={d.id} className="pb-24 md:pb-32" aria-labelledby={`dest-${d.id}`}>
          <div className="container grid-12 items-start">
            <div className={`col-span-4 md:col-span-6 ${i % 2 ? "md:order-2" : ""}`}>
              <Reveal>
                <ParallaxImage image={d.image} alt={l(d.imageAlt)} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] rounded-xl md:aspect-[4/5]" />
              </Reveal>
            </div>
            <div className="col-span-4 md:col-span-6 md:pt-10">
              <Reveal>
                <p className="eyebrow">{fmt(c.destinationLabel, { number: d.number })}</p>
                <h2 id={`dest-${d.id}`} className="heading-1 mt-3">
                  {l(d.name)}
                </h2>
                <p className="lead mt-5">{l(d.intro)}</p>
                <p className="mt-4 leading-relaxed text-foreground/75">{l(d.mood)}</p>
              </Reveal>
              <RevealGroup as="ul" className="mt-8 space-y-5">
                {d.regions.map((r) => (
                  <RevealItem as="li" key={r.name.nl} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-display text-xl">
                      {l(r.name)} <span className="text-foreground/60">· {l(r.title)}</span>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/75">{l(r.text)}</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {r.highlights.map((hl) => (
                        <li key={hl.nl} className="rounded-full bg-secondary px-3 py-1 text-xs">
                          {l(hl)}
                        </li>
                      ))}
                    </ul>
                  </RevealItem>
                ))}
              </RevealGroup>
              <Reveal className="mt-8">
                <ButtonLink to={destinationPath(d.id, lang)} variant="outline">
                  {fmt(c.viewDestination, { name: l(d.name) })} <ArrowRight aria-hidden="true" />
                </ButtonLink>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section className="on-sand bg-sand text-sand-foreground" aria-labelledby="glance-title">
        <div className="container section">
          <SectionHeading eyebrow={c.glanceEyebrow} title={c.glanceTitle} lead={c.glanceLead} id="glance-title" />
          <RevealGroup as="dl" className="mt-12 grid gap-px overflow-hidden rounded-xl border border-sand-foreground/15 bg-sand-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
            {glance.map((g) => (
              <RevealItem key={g.label.nl} className="bg-sand p-6 md:p-8">
                <dt className="text-xs font-semibold uppercase tracking-eyebrow text-primary-ink">{l(g.label)}</dt>
                <dd className="mt-2 font-display text-2xl">{l(g.value)}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
          <p className="mt-8 max-w-2xl text-sm text-sand-foreground/75">{c.glanceNote}</p>
        </div>
      </section>

      <CtaBand title={t.home.closing.title} text={t.home.closing.text} image="photos/hero-road" imageAlt={t.toursPage.group.imageAlt} />
    </>
  );
}
