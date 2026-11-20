import type { CSSProperties, ReactNode } from "react";
import type { MediaKey } from "@/content/media.generated";
import { cn } from "@/lib/utils";
import { usePreloadImage } from "@/seo/head";
import { srcSet } from "@/components/ui/Picture";
import { ParallaxImage } from "@/components/ui/Parallax";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  image: MediaKey;
  imageAlt: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  size?: "md" | "lg";
}

/** Dark image header used on every inner page (navbar sits transparent on top). */
export function PageHero({ eyebrow, title, lead, image, imageAlt, crumbs, children, size = "md" }: PageHeroProps) {
  usePreloadImage({ imagesrcset: srcSet(image, "avif"), imagesizes: "100vw", type: "image/avif" });
  const d = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;
  return (
    <section
      className={cn(
        "relative isolate flex items-end overflow-hidden",
        size === "lg" ? "min-h-[78svh] md:min-h-[86svh]" : "min-h-[62svh] md:min-h-[70svh]",
      )}
    >
      <ParallaxImage
        image={image}
        alt={imageAlt}
        priority
        sizes="100vw"
        strength={0.14}
        className="absolute inset-0 -z-10"
        overlay="bg-gradient-to-t from-background via-background/70 to-background/45"
      />
      <div className="container pb-14 pt-[calc(var(--nav-h)+3rem)] md:pb-20">
        {crumbs && <Breadcrumbs items={crumbs} className="mb-6" />}
        {eyebrow && (
          <p className="eyebrow intro-up mb-4" style={d(0.05)}>
            {eyebrow}
          </p>
        )}
        <h1 className="heading-1 intro-up max-w-4xl text-balance" style={d(0.12)}>
          {title}
        </h1>
        {lead && (
          <div className="lead intro-up mt-6 max-w-2xl text-pretty" style={d(0.22)}>
            {lead}
          </div>
        )}
        {children && (
          <div className="intro-up mt-8" style={d(0.32)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
