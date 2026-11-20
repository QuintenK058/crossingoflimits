import { ArrowRight, MessageCircle } from "lucide-react";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { site } from "@/lib/site";
import { allFaqItems, faq } from "@/content/faq";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema, faqSchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/button";

export default function Faq() {
  const { t, l, lang } = useI18n();
  const c = t.faqPage;
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: c.title, path: pathFor("faq", lang) },
  ];
  return (
    <>
      <Seo title={t.meta.faq.title} description={t.meta.faq.description} jsonLd={[faqSchema(allFaqItems, lang), breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="photos/village-stop" imageAlt={t.experience.stopsImageAlt} crumbs={crumbs} />

      <div className="on-sand bg-sand text-sand-foreground">
        <div className="container section grid-12">
          <nav aria-label={c.categories} className="col-span-4 md:col-span-4 lg:col-span-3">
            <div className="md:sticky md:top-[calc(var(--nav-h)+2rem)]">
              <p className="eyebrow">{c.categories}</p>
              <ul className="mt-4 flex flex-wrap gap-2 md:flex-col md:gap-1">
                {faq.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#${cat.id}`}
                      className="inline-block rounded-full border border-sand-foreground/20 px-4 py-2 text-sm font-medium transition-colors hover:border-sand-foreground hover:bg-sand-foreground hover:text-sand md:border-transparent md:px-3"
                    >
                      {l(cat.title)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="col-span-4 space-y-16 md:col-span-8 lg:col-span-9">
            {faq.map((cat) => (
              <Reveal as="section" key={cat.id} id={cat.id} className="scroll-mt-28">
                <h2 className="heading-3">{l(cat.title)}</h2>
                <Accordion type="multiple" className="mt-4 border-t border-sand-foreground/15">
                  {cat.items.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="border-sand-foreground/15">
                      <AccordionTrigger className="hover:text-primary-ink">{l(item.q)}</AccordionTrigger>
                      <AccordionContent>{l(item.a)}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            ))}
            <Reveal className="rounded-xl bg-sand-foreground p-8 text-sand md:p-10">
              <h2 className="font-display text-3xl">{c.stillQuestion}</h2>
              <p className="mt-3 text-sand/80">{c.stillQuestionText}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to={pathFor("contact", lang)}>
                  {c.contactCta} <ArrowRight aria-hidden="true" />
                </ButtonLink>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-sand/50 px-6 text-sm font-semibold transition-colors hover:bg-sand hover:text-sand-foreground"
                >
                  <MessageCircle className="size-4" aria-hidden="true" /> {t.footer.whatsapp}
                  <span className="sr-only">{t.common.opensInNewTab}</span>
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </>
  );
}
