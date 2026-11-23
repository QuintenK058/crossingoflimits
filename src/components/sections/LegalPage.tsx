import { Fragment, type ReactNode } from "react";
import { useI18n } from "@/i18n";
import { pathFor, type RouteKey } from "@/lib/routes";
import type { LegalDoc } from "@/content/legal";
import type { MediaKey } from "@/content/media.generated";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema } from "@/seo/schema";
import { LocalLink } from "@/components/ui/LocalLink";
import { PageHero } from "./PageHero";

/** Renders [label](href) links inside a string. */
export function RichText({ text }: { text: string }) {
  const { t } = useI18n();
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = re.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const [, label, href] = match;
    if (href.startsWith("/")) {
      parts.push(
        <LocalLink key={match.index} to={href}>
          {label}
        </LocalLink>,
      );
    } else {
      const external = href.startsWith("http");
      parts.push(
        <a key={match.index} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {label}
          {external && <span className="sr-only"> {t.common.opensInNewTab}</span>}
        </a>,
      );
    }
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Block({ text }: { text: string }) {
  const lines = text.split("\n");
  if (lines.every((l) => l.startsWith("- "))) {
    return (
      <ul>
        {lines.map((l, i) => (
          <li key={i}>
            <RichText text={l.slice(2)} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      <RichText text={text} />
    </p>
  );
}

export function LegalPage({
  routeKey,
  doc,
  title,
  description,
  eyebrow,
  image = "photos/hero-andalusia",
  aside,
}: {
  routeKey: RouteKey;
  doc: LegalDoc;
  title: string;
  description: string;
  eyebrow?: string;
  image?: MediaKey;
  aside?: ReactNode;
}) {
  const { t, l, lang, fmt } = useI18n();
  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: title, path: pathFor(routeKey, lang) },
  ];
  const date = new Date(doc.updated).toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <Seo title={`${title} | Crossing of Limits`} description={description} jsonLd={[breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={eyebrow} title={title} image={image} imageAlt="" crumbs={crumbs} lead={<span className="text-base">{fmt(t.legal.lastUpdated, { date })}</span>} />
      <div className="container pb-24 md:pb-32">
        <div className="grid-12">
          <nav aria-labelledby="toc-title" className="col-span-4 md:col-span-4 lg:col-span-3">
            <div className="rounded-xl border border-border p-6 md:sticky md:top-[calc(var(--nav-h)+2rem)]">
              <h2 id="toc-title" className="font-display text-lg">
                {t.legal.toc}
              </h2>
              <ol className="mt-4 space-y-2 text-sm">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="flex gap-2 text-foreground/80 hover:text-accent">
                      <span className="text-accent">{i + 1}.</span> {l(s.title)}
                    </a>
                  </li>
                ))}
              </ol>
              {aside && <div className="mt-6 border-t border-border pt-6">{aside}</div>}
            </div>
          </nav>
          <article className="prose-legal col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
            {doc.sections.map((s, i) => (
              <Fragment key={s.id}>
                <h2 id={s.id} className="scroll-mt-28">
                  <span className="text-accent">{i + 1}.</span> {l(s.title)}
                </h2>
                {s.body.map((b, j) => (
                  <Block key={j} text={l(b)} />
                ))}
              </Fragment>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
