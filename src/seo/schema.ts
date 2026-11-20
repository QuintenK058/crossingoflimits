import type { Lang } from "@/lib/routes";
import { site } from "@/lib/site";
import type { Trip } from "@/content/trips";
import type { FaqItem } from "@/content/faq";
import { media } from "@/content/media.generated";
import { isPlaceholder } from "@/lib/utils";
import { absoluteUrl } from "./Seo";

export function travelAgencySchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: absoluteUrl(lang === "nl" ? "/" : "/en"),
    logo: `${site.url}/media/brand/logo-640.png`,
    image: `${site.url}/og-image.jpg`,
    email: site.email,
    telephone: site.phoneHref.replace("tel:", ""),
    description:
      lang === "nl"
        ? "Georganiseerde motorreizen door Spanje en Marokko: groepsreizen, individuele reizen en reizen op maat."
        : "Guided motorcycle tours through Spain and Morocco: group tours, individual tours and tailor-made trips.",
    address: { "@type": "PostalAddress", addressCountry: "NL" },
    areaServed: [
      { "@type": "Country", name: lang === "nl" ? "Spanje" : "Spain" },
      { "@type": "Country", name: lang === "nl" ? "Marokko" : "Morocco" },
    ],
    identifier: { "@type": "PropertyValue", propertyID: "KVK", value: site.kvk },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: site.email,
      telephone: site.phoneHref.replace("tel:", ""),
      availableLanguage: ["Dutch", "English"],
    },
    ...(site.socials.length ? { sameAs: site.socials.map((s) => s.href) } : {}),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function touristTripSchema(trip: Trip, lang: Lang, path: string) {
  const img = media[trip.image];
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.name[lang],
    description: trip.intro[lang],
    url: absoluteUrl(path),
    image: `${site.url}${img.src}-${img.widths[img.widths.length - 1]}.jpg`,
    touristType: lang === "nl" ? "Motorrijders" : "Motorcyclists",
    provider: { "@id": `${site.url}/#organization` },
    itinerary: {
      "@type": "ItemList",
      itemListElement: trip.itinerary.map((d, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: d.title[lang],
        description: d.text[lang].slice(0, 300),
      })),
    },
    ...(typeof trip.priceFrom === "number" && !isPlaceholder(trip.priceFrom)
      ? {
          offers: {
            "@type": "Offer",
            price: trip.priceFrom,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: absoluteUrl(path),
            description: trip.priceNote[lang],
          },
        }
      : {}),
  };
}

export function faqSchema(items: FaqItem[], lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q[lang],
      acceptedAnswer: { "@type": "Answer", text: it.a[lang] },
    })),
  };
}
