import { ArrowRight, Bike, CalendarDays, Hotel, Navigation, Truck } from "lucide-react";
import { useI18n } from "@/i18n";
import { pathFor, type RouteKey } from "@/lib/routes";
import { tripsByForm, type TripForm } from "@/content/trips";
import type { MediaKey } from "@/content/media.generated";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/schema";
import { PageHero } from "./PageHero";
import { TripList } from "./TripList";
import { CtaBand } from "./CtaBand";
import { SectionHeading } from "./SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/button";

const icons = { bike: Bike, routes: Navigation, luggage: Truck, date: CalendarDays, stays: Hotel };

interface Props {
  form: Extract<TripForm, "group" | "individual">;
}

/** Shared layout for the group + individual tour overview pages. */
export function ToursOverview({ form }: Props) {
  const { t, lang } = useI18n();
  const isGroup = form === "group";
  const copy = isGroup ? t.toursPage.group : t.toursPage.individual;
  const meta = isGroup ? t.meta.groupTours : t.meta.individualTours;
  const key: RouteKey = isGroup ? "groupTours" : "individualTours";
  const image: MediaKey = isGroup ? "photos/hero-atlas" : "photos/hero-coast";
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: copy.title, path: pathFor(key, lang) },
  ];
  const perks = Object.entries(copy.perks) as [keyof typeof icons, { title: string; text: string }][];

  return (
    <>
      <Seo title={meta.title} description={meta.description} jsonLd={[breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={t.toursPage.eyebrow} title={copy.title} lead={copy.lead} image={image} imageAlt={copy.imageAlt} crumbs={crumbs} />

      <section className="bg-sand" aria-labelledby="perks-title">
        <div className="container section-tight">
          <SectionHeading title={copy.perksTitle} id="perks-title" />
          <RevealGroup as="ul" className="mt-10 grid gap-8 md:grid-cols-3">
            {perks.map(([k, p]) => {
              const Icon = icons[k];
              return (
                <RevealItem as="li" key={k} className="border-t border-foreground/15 pt-6">
                  <Icon className="size-7 text-accent" aria-hidden="true" />
                  <h3 className="mt-4 font-display text-2xl">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{p.text}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>
      </section>

      <TripList trips={tripsByForm(form)} title={t.toursPage.listTitle} />

      <CtaBand
        title={copy.ctaTitle}
        text={copy.ctaText}
        image={isGroup ? "photos/campfire" : "photos/sierra-nevada"}
        imageAlt={isGroup ? t.experience.fireImageAlt : t.experience.imageAlt}
        secondary={
          <ButtonLink to={pathFor(isGroup ? "tailorMade" : "groupTours", lang)} variant="outline" size="lg">
            {copy.ctaButton} <ArrowRight aria-hidden="true" />
          </ButtonLink>
        }
      />
    </>
  );
}
