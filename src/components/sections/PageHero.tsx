import type { CSSProperties, ReactNode } from "react";
import type { MediaKey } from "@/content/media.generated";
import { cn } from "@/lib/utils";
import { usePreloadImage } from "@/seo/head";
import { srcSet } from "@/components/ui/Picture";
import { ParallaxImage } from "@/components/ui/Parallax";
import { SplitWords } from "@/components/ui/SplitWords";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  image: MediaKey;
  imageAlt: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  size?: "md" | "lg";
}

const d = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;

/** Editorial page header: big split-word title on paper, wide image below. */
export function PageHero({ eyebrow, title, lead, image, imageAlt, crumbs, children, size = "md" }: PageHeroProps) {
  usePreloadImage({ imagesrcset: srcSet(image, "avif"), imagesizes: "100vw", type: "image/avif" });
  return (
    <section className="relative pt-[calc(var(--nav-h)+2rem)] md:pt-[calc(var(--nav-h)+3.5rem)]">
      <div className="container">
        {crumbs && <Breadcrumbs items={crumbs} className="intro-up mb-10" />}
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-4 md:col-span-8">
            {eyebrow && (
              <p className="eyebrow intro-up mb-6" style={d(0.05)}>
                {eyebrow}
              </p>
            )}
            <h1 className={cn("text-balance", size === "lg" ? "heading-1 md:text-[clamp(3rem,7.4vw,7rem)]" : "heading-1")}>
              <SplitWords text={title} delay={0.1} />
            </h1>
          </div>
          {(lead || children) && (
            <div className="col-span-4 md:col-span-4 md:pb-2">
              {lead && (
                <div className="lead intro-up text-pretty" style={d(0.35)}>
                  {lead}
                </div>
              )}
              {children && (
                <div className="intro-up mt-8" style={d(0.45)}>
                  {children}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="container mt-12 md:mt-16">
        <div className={cn("intro-up overflow-hidden rounded-[var(--radius)]", size === "lg" ? "aspect-[4/3] md:aspect-[21/9]" : "aspect-[16/10] md:aspect-[24/9]")} style={d(0.2)}>
          <div className="intro-scale h-full w-full" style={d(0.2)}>
            <ParallaxImage image={image} alt={imageAlt} priority sizes="(min-width: 1320px) 1256px, 100vw" strength={0.16} className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
