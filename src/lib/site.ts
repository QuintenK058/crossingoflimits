/**
 * Company details. Edit here – used in footer, contact page, structured data.
 */
export const site = {
  name: "Crossing of Limits",
  url: (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://crossingoflimits.nl",
  email: "info@crossingoflimits.nl",
  phoneDisplay: "+31 6 37 69 51 65",
  phoneHref: "tel:+31637695165",
  whatsappHref: "https://wa.me/31637695165",
  kvk: "93081723",
  country: "NL",
  stoGarant: {
    home: "https://www.sto-garant.nl",
    participants: "https://www.sto-garant.nl/deelnemers",
    downloads: "https://www.sto-garant.nl/downloads",
  },
  /**
   * Social media profiles. Empty = not shown. Add e.g.
   * { label: "Instagram", href: "https://www.instagram.com/…" }
   */
  socials: [] as { label: "Instagram" | "Facebook" | "YouTube"; href: string }[],
} as const;
