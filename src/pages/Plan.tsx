import { Check, Mail, MessageCircle, Phone } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { site } from "@/lib/site";
import { getTrip } from "@/content/trips";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { PlanForm, type PlanPrefill } from "@/components/form/PlanForm";
import { Reveal } from "@/components/ui/Reveal";
import { StoLogo } from "@/components/layout/StoBadge";

function prefillFromSearch(params: URLSearchParams): PlanPrefill {
  const out: PlanPrefill = {};
  const vorm = params.get("reisvorm");
  if (vorm === "op-maat" || vorm === "tailor-made") out.reisvorm = "tailor-made";
  else if (vorm === "group" || vorm === "groep") out.reisvorm = "group";
  else if (vorm === "individual" || vorm === "individueel") out.reisvorm = "individual";
  const trip = getTrip(params.get("reis") ?? "");
  if (trip) {
    out.reis = trip.slug;
    out.land = trip.country === "spain" ? "Spain" : "Morocco";
    out.reisvorm ??= "group";
  }
  return out;
}

export default function Plan() {
  const { t, lang } = useI18n();
  const [params] = useSearchParams();
  const prefill = prefillFromSearch(params);
  const c = t.plan;
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: c.eyebrow, path: pathFor("plan", lang) },
  ];
  const how = [c.howSteps.s1, c.howSteps.s2, c.howSteps.s3, c.howSteps.s4];

  return (
    <>
      <Seo title={t.meta.plan.title} description={t.meta.plan.description} jsonLd={[breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="photos/sahara-camp" imageAlt={t.tailorMade.imageAlt} crumbs={crumbs}>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {[c.usp1, c.usp2, c.usp3].map((u) => (
            <li key={u} className="flex items-center gap-2">
              <Check className="size-4 text-accent" aria-hidden="true" /> {u}
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="pb-24 md:pb-32">
        <div className="container grid-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-8">
            <PlanForm prefill={prefill} />
          </div>
          <aside className="col-span-4 md:col-span-12 lg:col-span-4" aria-labelledby="how-aside">
            <Reveal className="space-y-10 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
              <div>
                <h2 id="how-aside" className="font-display text-2xl">
                  {c.howTitle}
                </h2>
                <ol className="mt-6 space-y-6 border-l border-border pl-6">
                  {how.map((s) => (
                    <li key={s.title} className="relative">
                      <span className="absolute -left-[29px] top-1.5 size-2.5 rounded-full bg-primary" aria-hidden="true" />
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/75">{s.text}</p>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-xl border border-border p-6">
                <h2 className="font-display text-xl">{t.nav.contact}</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-accent">
                      <Mail className="size-4 text-accent" aria-hidden="true" /> {site.email}
                    </a>
                  </li>
                  <li>
                    <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-accent">
                      <Phone className="size-4 text-accent" aria-hidden="true" /> {site.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                      <MessageCircle className="size-4 text-accent" aria-hidden="true" /> {t.footer.whatsapp}
                      <span className="sr-only">{t.common.opensInNewTab}</span>
                    </a>
                  </li>
                </ul>
                <div className="mt-6 flex items-center gap-3 border-t border-border pt-5 text-xs text-foreground/75">
                  <span className="w-10 rounded bg-sand p-1">
                    <StoLogo />
                  </span>
                  {t.footer.stoTitle}
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </>
  );
}
