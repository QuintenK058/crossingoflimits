import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { MediaKey } from "@/content/media.generated";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { ButtonLink } from "@/components/ui/button";
import { ParallaxImage } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";

/** Closing call-to-action: dark, full-bleed parallax photo, one primary CTA. */
export function CtaBand({
  title,
  text,
  image = "photos/campfire",
  imageAlt,
  to,
  label,
  secondary,
}: {
  title: ReactNode;
  text: ReactNode;
  image?: MediaKey;
  imageAlt: string;
  to?: string;
  label?: string;
  secondary?: ReactNode;
}) {
  const { t, lang } = useI18n();
  return (
    <section className="theme-dark relative isolate overflow-hidden bg-background text-foreground">
      <ParallaxImage
        image={image}
        alt={imageAlt}
        sizes="100vw"
        strength={0.2}
        className="absolute inset-0 -z-10"
        overlay="bg-gradient-to-r from-[hsl(var(--ink)/0.92)] via-[hsl(var(--ink)/0.65)] to-[hsl(var(--ink)/0.15)]"
      />
      <div className="container py-32 md:py-48">
        <Reveal className="max-w-3xl">
          <h2 className="heading-1 text-balance">{title}</h2>
          <p className="lead mt-8 max-w-xl">{text}</p>
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Magnetic>
              <ButtonLink to={to ?? pathFor("plan", lang)} size="lg" variant="accent" data-cursor={t.common.planCta.split(" ")[0]}>
                {label ?? t.common.planCtaNoObligation} <ArrowRight aria-hidden="true" />
              </ButtonLink>
            </Magnetic>
            {secondary}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{t.common.noObligation}</p>
        </Reveal>
      </div>
    </section>
  );
}
