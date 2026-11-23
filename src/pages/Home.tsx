import { ArrowRight, BedDouble, CircleCheck, Flame, MapPin, Route, UtensilsCrossed } from "lucide-react";
import { useI18n } from "@/i18n";
import { destinationPath, pathFor } from "@/lib/routes";
import { destinations } from "@/content/destinations";
import { publishedTrips } from "@/content/trips";
import { Seo } from "@/seo/Seo";
import { travelAgencySchema } from "@/seo/schema";
import { HeroMontage, heroPreload } from "@/components/home/HeroMontage";
import { HorizontalTrips } from "@/components/home/HorizontalTrips";
import { FormsList } from "@/components/home/FormsList";
import { StackSteps } from "@/components/home/StackSteps";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ImageReveal } from "@/components/ui/ImageReveal";
import { Marquee } from "@/components/ui/Marquee";
import { ScrollWords } from "@/components/ui/ScrollWords";
import { Counter } from "@/components/ui/Counter";
import { LocalLink } from "@/components/ui/LocalLink";
import { StoLogo } from "@/components/layout/StoBadge";

export default function Home() {
  const { t, lang, l } = useI18n();
  const h = t.home;

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

  const steps = [
    { ...h.how.steps.request, image: "photos/bar" as const },
    { ...h.how.steps.contact, image: "photos/support-van" as const },
    { ...h.how.steps.ride, image: "photos/atlas-pass" as const },
  ];

  return (
    <>
      <Seo title={t.meta.home.title} description={t.meta.home.description} jsonLd={[travelAgencySchema(lang)]} preload={heroPreload} />
      <HeroMontage />

      <Marquee items={h.marquee} className="font-display mt-20 border-y border-foreground/15 py-6 text-[clamp(2.5rem,7vw,6rem)] leading-none stretch-wide md:mt-28" />

      {/* Intro / concept */}
      <section id="intro" className="section scroll-mt-20" aria-labelledby="intro-eyebrow">
        <div className="container">
          <h2 id="intro-eyebrow" className="eyebrow mb-10">
            {h.intro.eyebrow}
          </h2>
          <ScrollWords
            text={h.intro.text}
            className="font-display max-w-6xl text-[clamp(1.7rem,3.6vw,3.4rem)] font-semibold leading-[1.1] tracking-[-0.03em] [font-stretch:105%]"
          />
          <div className="mt-20 grid-12 items-end">
            <div className="col-span-4 md:col-span-5">
              <ImageReveal image="photos/bbq" alt={t.experience.bbqImageAlt} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5] rounded-[var(--radius)]" />
            </div>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <Reveal>
                <p className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight">
                  {h.intro.valuesLead} <span className="serif-accent text-accent">{h.intro.valuesTail}</span>
                </p>
              </Reveal>
              <RevealGroup as="ul" className="mt-10 divide-y divide-foreground/15 border-y border-foreground/15">
                {[h.intro.values.freedom, h.intro.values.adventure, h.intro.values.connection].map((v, i) => (
                  <RevealItem as="li" key={v.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                    <span className="serif-accent text-2xl text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="text-2xl">{v.title}</h3>
                      <p className="mt-2 text-muted-foreground">{v.text}</p>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
              <Reveal className="mt-8">
                <LocalLink to={pathFor("experience", lang)} className="link-underline font-semibold text-accent">
                  {h.intro.cta} <ArrowRight className="size-4" aria-hidden="true" />
                </LocalLink>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <HorizontalTrips />

      <FormsList />

      {/* Destinations */}
      <section className="pb-24 md:pb-32" aria-labelledby="dest-title">
        <div className="container">
          <SectionHeading eyebrow={h.destinations.eyebrow} title={h.destinations.title} lead={h.destinations.text} id="dest-title" />
          <ul className="mt-14 grid gap-6 md:grid-cols-2">
            {destinations.map((d, i) => (
              <li key={d.id} className="group relative" data-cursor={t.common.discover}>
                <ImageReveal
                  image={d.image}
                  alt={l(d.imageAlt)}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="aspect-[4/5] rounded-[var(--radius)] md:aspect-[3/4]"
                  imgClassName="transition-transform [transition-duration:1600ms] ease-out group-hover:scale-105"
                  from={i ? "left" : "bottom"}
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[var(--radius)] bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-[hsl(var(--paper))] md:p-10">
                  <p className="serif-accent text-xl">{d.number}</p>
                  <h3 className="mt-2 text-[clamp(3rem,7vw,6.5rem)] leading-[0.85] stretch-wide">
                    <LocalLink to={destinationPath(d.id, lang)} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {l(d.name)}
                    </LocalLink>
                  </h3>
                  <p className="mt-4 max-w-sm text-white/85">{l(d.tagline)}</p>
                  <ul className="mt-5 flex translate-y-2 flex-wrap gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    {d.regions.map((r) => (
                      <li key={r.name.nl} className="rounded-full border border-white/40 px-3 py-1 text-xs">
                        {l(r.name)}
                      </li>
                    ))}
                  </ul>
                </div>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[var(--radius)] group-focus-within:ring-4 group-focus-within:ring-primary" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-sand" aria-labelledby="features-title">
        <div className="container">
          <SectionHeading eyebrow={h.features.eyebrow} title={h.features.title} id="features-title" />
          <RevealGroup as="ul" className="mt-16 grid border-l border-t border-foreground/15 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {features.map((f, i) => (
              <RevealItem
                as="li"
                key={f.title}
                className="group relative border-b border-r border-foreground/15 p-8 transition-colors duration-500 hover:bg-foreground hover:text-background md:p-10"
              >
                <div className="flex items-start justify-between">
                  <f.icon className="size-7 text-accent transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 group-hover:text-primary" aria-hidden="true" />
                  <span className="serif-accent text-lg opacity-75">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-16 text-2xl md:mt-20">{f.title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed opacity-80">{f.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Numbers */}
      <section aria-label={h.numbers.label} className="theme-dark bg-background text-foreground">
        <div className="container">
          <ul className="grid grid-cols-2 md:grid-cols-4">
            {numbers.map((n, i) => (
              <li
                key={n.label}
                className={`flex flex-col gap-3 py-14 md:py-20 ${i % 2 === 1 ? "pl-6 md:pl-0" : ""} ${i > 0 ? "md:border-l md:border-border md:pl-8" : ""} ${i > 1 ? "border-t border-border md:border-t-0" : ""}`}
              >
                <Counter value={n.value} className="font-display text-[clamp(4rem,9vw,8rem)] leading-none text-accent stretch-wide" />
                <span className="text-sm text-muted-foreground">{n.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works: stacking cards */}
      <section className="section" aria-labelledby="how-title">
        <div className="container">
          <SectionHeading eyebrow={h.how.eyebrow} title={h.how.title} id="how-title" />
          <div className="mt-14">
            <StackSteps steps={steps} />
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-foreground/15" aria-labelledby="trust-title">
        <div className="container py-14 md:py-16">
          <Reveal className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12">
            <div className="w-24 shrink-0 md:w-28">
              <StoLogo size={192} />
            </div>
            <div className="max-w-2xl">
              <p className="eyebrow mb-3">{h.trust.eyebrow}</p>
              <h2 id="trust-title" className="heading-3">
                {h.trust.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{h.trust.text}</p>
            </div>
            <LocalLink to={pathFor("guarantee", lang)} className="link-underline shrink-0 font-semibold text-accent md:ml-auto">
              {h.trust.cta} <ArrowRight className="size-4" aria-hidden="true" />
            </LocalLink>
          </Reveal>
        </div>
      </section>

      <CtaBand title={h.closing.title} text={h.closing.text} image="photos/campfire" imageAlt={t.experience.fireImageAlt} />
    </>
  );
}
