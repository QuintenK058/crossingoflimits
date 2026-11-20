import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { useMotionOk } from "@/hooks/useMotionOk";
import { prefersReducedMotion } from "@/lib/motion";
import { ButtonLink } from "@/components/ui/button";

const d = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;
const V = "/media/video";

export const heroPosterPreload = [
  {
    imagesrcset: `${V}/hero-poster-720.avif 720w, ${V}/hero-poster-1280.avif 1280w`,
    imagesizes: "100vw",
    type: "image/avif",
  },
];

/**
 * Fullscreen hero with background video.
 * - Poster <picture> paints instantly (and is the LCP element).
 * - Video sources are attached on the client only: 720p on mobile, 1280p on desktop, WebM + MP4.
 * - Pauses when out of view / tab hidden. Never loads with reduced motion or Save-Data.
 */
export function HeroVideo() {
  const { t, lang } = useI18n();
  const ok = useMotionOk();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;
    if (!ok || prefersReducedMotion()) {
      video.pause();
      setPlaying(false);
      return;
    }
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;

    if (!video.dataset.loaded) {
      const size = window.matchMedia("(min-width: 768px)").matches ? "1280" : "720";
      for (const [ext, type] of [
        ["webm", "video/webm"],
        ["mp4", "video/mp4"],
      ]) {
        const s = document.createElement("source");
        s.src = `${V}/hero-${size}.${ext}`;
        s.type = type;
        video.appendChild(s);
      }
      video.dataset.loaded = "1";
      video.load();
    }

    const tryPlay = () => {
      const p = video.play();
      if (p) p.catch(() => setPlaying(false));
    };
    const onPlaying = () => setPlaying(true);
    video.addEventListener("playing", onPlaying);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) tryPlay();
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(section);
    const onVis = () => (document.hidden || !visible ? video.pause() : tryPlay());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      video.removeEventListener("playing", onPlaying);
    };
  }, [ok]);

  const words = t.home.hero.title.split(" ");

  return (
    <section ref={sectionRef} className="relative isolate flex h-[100svh] min-h-[600px] items-end overflow-hidden">
      <picture className="absolute inset-0 -z-20">
        <source type="image/avif" srcSet={`${V}/hero-poster-720.avif 720w, ${V}/hero-poster-1280.avif 1280w`} sizes="100vw" />
        <source type="image/webp" srcSet={`${V}/hero-poster-720.webp 720w, ${V}/hero-poster-1280.webp 1280w`} sizes="100vw" />
        <img
          src={`${V}/hero-poster-1280.jpg`}
          srcSet={`${V}/hero-poster-720.jpg 720w, ${V}/hero-poster-1280.jpg 1280w`}
          sizes="100vw"
          alt={t.home.hero.posterAlt}
          width={1280}
          height={732}
          {...{ fetchpriority: "high" }}
          decoding="sync"
          className="h-full w-full object-cover"
        />
      </picture>
      <video
        ref={videoRef}
        className={cn(
          "absolute inset-0 -z-10 h-full w-full object-cover transition-opacity duration-1000",
          playing ? "opacity-100" : "opacity-0",
        )}
        muted
        loop
        playsInline
        autoPlay={false}
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(20,17,16,0.55)_0%,rgba(20,17,16,0.15)_35%,rgba(20,17,16,0.55)_70%,#141110_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_80%,rgba(224,122,47,0.25),transparent_55%)]" />

      <div className="container pb-24 md:pb-28">
        <p className="eyebrow intro-up mb-5 text-foreground" style={d(0.1)}>
          {t.home.hero.eyebrow}
        </p>
        <h1 className="heading-display max-w-5xl leading-[0.92]" aria-label={t.home.hero.title}>
          {words.map((word, i) => (
            <span key={i} aria-hidden="true" className="mr-[0.22em] inline-block overflow-hidden pb-[0.06em] align-bottom last:mr-0">
              <span className={cn("intro-word", i === words.length - 1 && "text-primary")} style={d(0.2 + i * 0.12)}>
                {word}
              </span>
            </span>
          ))}
        </h1>
        <p className="lead intro-up mt-6 max-w-xl text-foreground/90" style={d(0.3 + words.length * 0.12)}>
          {t.home.hero.subtitle}
        </p>
        <div className="intro-up mt-9 flex flex-wrap gap-3" style={d(0.45 + words.length * 0.12)}>
          <ButtonLink to={pathFor("plan", lang)} size="lg">
            {t.common.planCta} <ArrowRight aria-hidden="true" />
          </ButtonLink>
          <ButtonLink to={pathFor("groupTours", lang)} size="lg" variant="outline">
            {t.home.hero.ctaTours}
          </ButtonLink>
        </div>
      </div>

      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-eyebrow text-foreground/75 hover:text-foreground md:flex"
      >
        <span className="relative block h-9 w-[22px] rounded-full border-2 border-current" aria-hidden="true">
          <span className="absolute left-1/2 top-1.5 -ml-[2px] block heading-2 w-1 rounded-full bg-primary animate-scroll-dot" />
        </span>
        {t.home.hero.scroll}
      </a>
    </section>
  );
}
