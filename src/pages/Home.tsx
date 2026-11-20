import { ArrowRight, ArrowUpRight, BedDouble, CircleCheck, Compass, Flame, MapPin, Mountain, Route, Users, UtensilsCrossed } from "lucide-react";
import { useI18n } from "@/i18n";
import { destinationPath, pathFor } from "@/lib/routes";
import { destinations } from "@/content/destinations";
import { publishedTrips } from "@/content/trips";
import type { MediaKey } from "@/content/media.generated";
import { Seo } from "@/seo/Seo";
import { travelAgencySchema } from "@/seo/schema";
import { HeroVideo, heroPosterPreload } from "@/components/sections/HeroVideo";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ParallaxImage } from "@/components/ui/Parallax";
import { Picture } from "@/components/ui/Picture";
import { Counter } from "@/components/ui/Counter";
import { LocalLink } from "@/components/ui/LocalLink";
import { StoLogo } from "@/components/layout/StoBadge";

export default function Home() {
  const { t, lang, l } = useI18n();
  const h = t.home;

  const forms: { key: "group" | "individual" | "tailorMade"; to: string; image: MediaKey; alt: string }[] = [
    { key: "group", to: pathFor("groupTours", lang), image: "photos/group-ride", alt: t.toursPage.group.imageAlt },
    { key: "individual", to: pathFor("individualTours", lang), image: "photos/coast", alt: t.toursPage.individual.imageAlt },
    { key: "tailorMade", to: pathFor("tailorMade", lang), image: "photos/dune-road", alt: t.tailorMade.imageAlt },
  ];

  const features = [
    { icon: Route, ...h.features.items.roads },
    { icon: MapPin, ...h.features.items.stops },
    { icon: UtensilsCrossed, ...h.features.items.food },
    { icon: Flame, ...h.features.items.fire },
    { icon: BedDouble, ...h.features.items.stays },
    { icon: CircleCheck, ...h.features.items.arranged },
  ];

  // Only real numbers, derived from the content files.
  const regionCount = destinations.reduce((n, d) => n + d.regions.length, 0);
  const numbers = [
    { value: destinations.length, label: h.numbers.countries },
    { value: regionCount, label: h.numbers.regions },
    { value: publishedTrips.length, label: h.numbers.tours },
    { value: 10, label: h.numbers.maxRiders },
  ];

  const steps = [h.how.steps.request, h.how.steps.contact, h.how.steps.ride];

  return (
    <>
      <Seo title={t.meta.home.title} description={t.meta.home.description} jsonLd={[travelAgencySchema(lang)]} preload={heroPosterPreload} />
      <HeroVideo />

      {/* Intro / concept */}
      <section id="intro" className="section relative scroll-mt-0">
        <div className="container grid-12 items-center">
          <div className="col-span-4 md:col-span-7">
            <Reveal>
              <p className="eyebrow mb-4">{h.intro.eyebrow}</p>
              <h2 className="heading-2 text-balance">{h.intro.title}</h2>
              <p className="lead mt-6 max-w-2xl">{h.intro.text}</p>
              <p className="font-display mt-8 text-2xl uppercase leading-tight md:text-3xl">
                <span className="text-primary">{h.intro.valuesLead}</span> {h.intro.valuesTail}
              </p>
            </Reveal>
            <RevealGroup as="ul" className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { icon: Compass, ...h.intro.values.freedom },
                { icon: Mountain, ...h.intro.values.adventure },
                { icon: Users, ...h.intro.values.connection },
              ].map((v) => (
                <RevealItem as="li" key={v.title} className="border-t border-border pt-5">
                  <v.icon className="size-6 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-xl">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/75">{v.text}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal className="mt-10">
              <LocalLink to={pathFor("experience", lang)} className="link-underline font-semibold text-primary">
                {h.intro.cta} <ArrowRight className="size-4" aria-hidden="true" />
              </LocalLink>
            </Reveal>
          </div>
          <div className="col-span-4 md:col-span-5">
            <Reveal className="relative">
              <ParallaxImage
                image="photos/bbq"
                alt={t.experience.bbqImageAlt}
                sizes="(min-width: 768px) 40vw, 100vw"
                className="aspect-[4/5] rounded-xl"
                strength={0.1}
              />
              <div className="absolute -bottom-6 -left-6 hidden w-40 overflow-hidden rounded-lg border-4 border-background md:block lg:w-52">
                <Picture image="photos/campfire" alt={t.experience.fireImageAlt} sizes="208px" className="aspect-square" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reisvormen */}
      <section className="section-tight pb-24 md:pb-32" aria-labelledby="forms-title">
        <div className="container">
          <SectionHeading eyebrow={h.forms.eyebrow} title={h.forms.title} id="forms-title" />
          <RevealGroup as="ul" className="mt-12 grid gap-5 md:grid-cols-3">
            {forms.map((f) => {
              const copy = h.forms[f.key];
              return (
                <RevealItem as="li" key={f.key}>
                  <article className="group relative isolate flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-xl p-6 transition-transform duration-500 ease-out hover:-translate-y-1.5 focus-within:-translate-y-1.5 motion-reduce:transition-none md:aspect-[4/5] lg:aspect-[3/4] lg:p-8">
                    <Picture
                      image={f.image}
                      alt=""
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="absolute inset-0 -z-20"
                      imgClassName="transition-transform [transition-duration:1400ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none"
                    />
                    <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/60 to-background/5" />
                    <h3 className="heading-3">
                      <LocalLink to={f.to} className="after:absolute after:inset-0 focus-visible:outline-none">
                        {copy.title}
                      </LocalLink>
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">{copy.text}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      {copy.cta}
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" aria-hidden="true" />
                    </span>
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-foreground/10 transition group-hover:ring-primary/50 group-focus-within:ring-2 group-focus-within:ring-primary" />
                  </article>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      {/* Bestemmingen: split screen */}
      <section aria-labelledby="dest-title" className="bg-[#0f0d0c]">
        <div className="container section-tight pb-12 md:pb-14">
          <SectionHeading eyebrow={h.destinations.eyebrow} title={h.destinations.title} lead={h.destinations.text} id="dest-title" />
        </div>
        <ul className="grid md:grid-cols-2">
          {destinations.map((d) => (
            <li key={d.id} className="group relative isolate min-h-[70svh] overflow-hidden md:min-h-[88svh]">
              <ParallaxImage
                image={d.image}
                alt={l(d.imageAlt)}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="absolute inset-0 -z-10"
                strength={0.15}
                overlay="bg-gradient-to-t from-background via-background/30 to-transparent transition-opacity duration-700 group-hover:opacity-80"
              />
              <div className="flex h-full min-h-[inherit] flex-col justify-end p-6 md:p-10 lg:p-14">
                <Reveal>
                  <p className="eyebrow text-foreground/80">{d.number}</p>
                  <h3 className="mt-3 font-display text-[clamp(3rem,7vw,6rem)] leading-none">
                    <LocalLink to={destinationPath(d.id, lang)} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {l(d.name)}
                    </LocalLink>
                  </h3>
                  <p className="mt-4 max-w-md text-foreground/85">{l(d.tagline)}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                    {t.common.discover} {l(d.name)}
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Reveal>
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 group-focus-within:ring-4 group-focus-within:ring-inset group-focus-within:ring-primary" />
            </li>
          ))}
        </ul>
      </section>

      {/* Kenmerken (light section) */}
      <section className="on-sand section bg-sand text-sand-foreground" aria-labelledby="features-title">
        <div className="container">
          <SectionHeading eyebrow={h.features.eyebrow} title={h.features.title} id="features-title" />
          <RevealGroup as="ul" className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {features.map((f) => (
              <RevealItem as="li" key={f.title} className="group">
                <span className="grid size-14 place-items-center rounded-full bg-sand-foreground text-sand transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105">
                  <f.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 font-display text-2xl">{f.title}</h3>
                <p className="mt-2 max-w-xs leading-relaxed text-sand-foreground/75">{f.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Cijfers – only real figures from the content files */}
      <section aria-label={h.numbers.label} className="border-y border-border bg-[#0f0d0c]">
        <div className="container">
          <ul className="grid grid-cols-2 md:grid-cols-4">
            {numbers.map((n, i) => (
              <li
                key={n.label}
                className={`flex flex-col gap-2 py-10 md:py-14 ${i % 2 === 1 ? "pl-6 md:pl-0" : ""} ${i > 0 ? "md:border-l md:border-border md:pl-8" : ""} ${i > 1 ? "border-t border-border md:border-t-0" : ""}`}
              >
                <Counter value={n.value} className="font-display text-[clamp(3rem,6vw,5rem)] leading-none text-primary" />
                <span className="text-sm uppercase tracking-wider text-foreground/75">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Zo werkt het */}
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <SectionHeading eyebrow={h.how.eyebrow} title={h.how.title} id="how-title" />
          <RevealGroup as="ol" className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8" stagger={0.15}>
            <span aria-hidden="true" className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-primary via-primary/40 to-transparent md:block" />
            {steps.map((s, i) => (
              <RevealItem as="li" key={s.title} className="relative">
                <span className="relative grid size-14 place-items-center rounded-full border border-primary bg-background font-display text-xl text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-6 font-display text-2xl">{s.title}</h3>
                <p className="mt-3 max-w-sm leading-relaxed text-foreground/75">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Vertrouwen */}
      <section className="on-sand bg-sand text-sand-foreground" aria-labelledby="trust-title">
        <div className="container py-14 md:py-16">
          <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
            <div className="w-24 shrink-0 md:w-28">
              <StoLogo size={192} />
            </div>
            <div className="max-w-2xl">
              <p className="eyebrow mb-2">{h.trust.eyebrow}</p>
              <h2 id="trust-title" className="font-display text-3xl md:text-4xl">
                {h.trust.title}
              </h2>
              <p className="mt-3 leading-relaxed text-sand-foreground/80">{h.trust.text}</p>
            </div>
            <LocalLink
              to={pathFor("guarantee", lang)}
              className="link-underline shrink-0 font-semibold text-primary-ink md:ml-auto"
            >
              {h.trust.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </LocalLink>
          </Reveal>
        </div>
      </section>

      <CtaBand title={h.closing.title} text={h.closing.text} image="photos/sunset" imageAlt={h.closing.imageAlt} />
    </>
  );
}
