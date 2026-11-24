import { ArrowRight, CalendarRange, CircleCheck, Route, Users } from "lucide-react";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { tripsByForm } from "@/content/trips";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { TripCard } from "@/components/sections/TripCard";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { ButtonLink } from "@/components/ui/button";

export default function TailorMade() {
  const { t, lang } = useI18n();
  const c = t.tailorMade;
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: t.nav.tailorMade, path: pathFor("tailorMade", lang) },
  ];
  const pillars = [
    { icon: Route, ...c.pillars.route },
    { icon: CalendarRange, ...c.pillars.dates },
    { icon: Users, ...c.pillars.group },
    { icon: CircleCheck, ...c.pillars.arranged },
  ];
  const planLink = pathFor("plan", lang, {}, "reisvorm=op-maat");
  const examples = tripsByForm("tailor-made");

  return (
    <>
      <Seo title={t.meta.tailorMade.title} description={t.meta.tailorMade.description} jsonLd={[breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="photos/sahara-camp" imageAlt={c.imageAlt} crumbs={crumbs} />

      <section className="section" aria-labelledby="pillars-title">
        <div className="container">
          <SectionHeading title={c.pillarsTitle} id="pillars-title" />
          <RevealGroup as="ul" className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <RevealItem as="li" key={p.title} className="bg-background p-8">
                <p.icon className="size-7 text-accent" aria-hidden="true" />
                <h3 className="mt-6 font-display text-2xl">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-foreground/75">{p.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-sand" aria-labelledby="wishes-title">
        <div className="container section grid-12 items-center">
          <div className="col-span-4 md:col-span-6">
            <Reveal>
              <h2 id="wishes-title" className="heading-2">
                {c.wishesTitle}
              </h2>
              <p className="lead mt-5">{c.wishesLead}</p>
            </Reveal>
            <RevealGroup as="ul" className="mt-8 space-y-3" stagger={0.06}>
              {Object.values(c.wishes).map((w) => (
                <RevealItem as="li" key={w} className="flex gap-3 border-b border-foreground/15 pb-3">
                  <CircleCheck className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{w}</span>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal className="mt-10">
              <ButtonLink to={planLink} size="lg" variant="dark">
                {c.ctaButton} <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </Reveal>
          </div>
          <div className="col-span-4 md:col-span-6">
            <Reveal>
              <ImageReveal image="photos/hero-coast" alt={t.toursPage.group.imageAlt} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[4/5] rounded-[var(--radius)]" />
              <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">{c.support}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {examples.length > 0 && (
        <section className="section">
          <div className="container">
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {examples.map((trip) => (
                <li key={trip.slug}>
                  <TripCard trip={trip} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CtaBand title={c.ctaTitle} text={c.ctaText} image="photos/campfire" imageAlt={t.experience.fireImageAlt} to={planLink} label={c.ctaButton} />
    </>
  );
}
