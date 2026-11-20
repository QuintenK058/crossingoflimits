import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { MediaKey } from "@/content/media.generated";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { ButtonLink } from "@/components/ui/button";
import { ParallaxImage } from "@/components/ui/Parallax";
import { Reveal } from "@/components/ui/Reveal";

/** Closing call-to-action with a big parallax image. One primary CTA. */
export function CtaBand({
  title,
  text,
  image = "photos/sunset",
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
    <section className="relative isolate overflow-hidden">
      <ParallaxImage
        image={image}
        alt={imageAlt}
        sizes="100vw"
        className="absolute inset-0 -z-10"
        overlay="bg-gradient-to-r from-background/90 via-background/65 to-background/20"
      />
      <div className="container py-28 md:py-40">
        <Reveal className="max-w-2xl">
          <h2 className="heading-1 text-balance">{title}</h2>
          <p className="lead mt-6">{text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink to={to ?? pathFor("plan", lang)} size="lg">
              {label ?? t.common.planCtaNoObligation} <ArrowRight aria-hidden="true" />
            </ButtonLink>
            {secondary}
          </div>
          <p className="mt-5 text-sm text-foreground/75">{t.common.noObligation}</p>
        </Reveal>
      </div>
    </section>
  );
}
