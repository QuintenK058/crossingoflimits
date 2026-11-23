import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { Seo } from "@/seo/Seo";
import { ButtonLink } from "@/components/ui/button";
import { LocalLink } from "@/components/ui/LocalLink";
import { Picture } from "@/components/ui/Picture";

export default function NotFound() {
  const { t, lang } = useI18n();
  const c = t.notFound;
  return (
    <>
      <Seo title={t.meta.notFound.title} description={t.meta.notFound.description} noindex alternates={false} />
      <section className="theme-dark relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background text-foreground">
        <Picture image="photos/todra" alt="" priority sizes="100vw" className="absolute inset-0 -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/80 to-background/30" aria-hidden="true" />
        <div className="container pt-[var(--nav-h)]">
          <p className="font-display text-[clamp(6rem,22vw,16rem)] leading-none text-accent stretch-wide">{c.eyebrow}</p>
          <h1 className="heading-1 mt-2 max-w-2xl">{c.title}</h1>
          <p className="lead mt-6 max-w-xl">{c.text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink to={pathFor("home", lang)} size="lg" variant="accent">
              {c.home}
            </ButtonLink>
            <ButtonLink to={pathFor("groupTours", lang)} size="lg" variant="outline">
              {c.tours}
            </ButtonLink>
            <LocalLink to={pathFor("contact", lang)} className="link-underline font-semibold text-accent">
              {c.contact}
            </LocalLink>
          </div>
        </div>
      </section>
    </>
  );
}
