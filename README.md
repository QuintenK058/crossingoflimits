# Crossing of Limits – website

Motorreizen door Spanje en Marokko. Vite + React + TypeScript + Tailwind CSS (shadcn/ui-stijl), React Router,
Framer Motion, Lenis, Supabase, react-hook-form + zod. Lichte, editoriale vormgeving (papier/inkt/amber),
lettertypes Archivo (variabel, eigen subset) en Instrument Serif. Nederlands is de standaardtaal, Engels staat onder `/en`.

Alle pagina's worden bij `npm run build` **geprerenderd** naar statische HTML (eigen title, meta, hreflang en
JSON-LD per pagina en taal) en daarna in de browser gehydrateerd.

## Snel starten

```bash
npm install
```

```bash
npm run dev          # ontwikkelserver op http://localhost:8080
```

```bash
npm run build        # productiebuild + prerender → dist/
```

```bash
node scripts/serve.mjs 4173   # dist lokaal serveren (zoals een statische host)
```

| Script | Wat |
|---|---|
| `npm run lint` / `npm run typecheck` | ESLint (0 warnings) en TypeScript |
| `npm run test:e2e` | Playwright end-to-end tests (desktop + mobiel). Supabase wordt in tests onderschept, er wordt niets in de echte database geschreven |
| `npm run check:links` | Controleert alle interne links en assets van de build (eerst serveren) |
| `npm run screenshots` | Screenshots van alle pagina's op 375/768/1280/1440 px → `reports/screenshots` |
| `npm run lighthouse` | Lighthouse mobiel (mediaan van 3 runs) → `reports/lighthouse` |
| `npm run optimize:media` | Genereert AVIF/WebP/JPEG-varianten uit `media-src/` |
| `npm run subset:font` | Bouwt de Archivo-fontsubset opnieuw (vereist `pip install fonttools brotli`) |

## Content aanpassen (reizen, FAQ, teksten)

Alle content staat in getypeerde bestanden met een `nl`- en `en`-versie. TypeScript waarschuwt als je iets vergeet.

| Wat | Bestand |
|---|---|
| Reizen (prijs, dagprogramma, inbegrepen, routekaarten, vertrekdata) | `src/content/trips.ts` |
| Bestemmingen en regio's | `src/content/destinations.ts` |
| Veelgestelde vragen (per categorie) | `src/content/faq.ts` |
| Garantieregeling, voorwaarden, privacy, cookies | `src/content/legal.ts` |
| Alle overige teksten (knoppen, koppen, formulieren, SEO-titels) | `src/i18n/nl.ts` en `src/i18n/en.ts` |
| Bedrijfsgegevens (e-mail, telefoon, KVK, socials) | `src/lib/site.ts` |

### Een reis toevoegen
1. Kopieer in `src/content/trips.ts` een bestaand reis-object en geef het een unieke `slug` (wordt de URL `/reizen/<slug>`).
2. Vul de velden in. Onbekend? Laat `"TODO_PRIJS"`, `"TODO_DATUM"` of `"TODO_KM"` staan: de site toont dan "op aanvraag".
3. `forms` bepaalt waar de reis verschijnt: `"group"`, `"individual"` en/of `"tailor-made"`. Met `published: false` verberg je hem.
4. Vertrekdata: `departures: ["2027-04-12", "2027-10-04"]`.
5. `npm run build` – de reis krijgt automatisch een pagina in NL en EN, staat in de sitemap en heeft TouristTrip-structured data.

### Foto's toevoegen
Zet de originele foto (jpg/png, liefst ≥ 1920 px breed) in `media-src/photos/` en draai `npm run optimize:media`.
Gebruik daarna de sleutel `photos/<bestandsnaam>` in de content-bestanden (bijv. `image: "photos/sahara-kamp"`).
Routekaarten gaan in `media-src/itineraries/`. De hero op de homepage is een fotomontage van
`photos/hero-andalusia`, `photos/hero-atlas` en `photos/hero-coast` (zie `src/components/home/HeroMontage.tsx`).

De huidige foto's zijn met AI gegenereerd (Higgsfield) als sfeerbeeld. Vervang ze bij voorkeur door echte foto's
van de reizen: zelfde bestandsnaam in `media-src/photos/` zetten en `npm run optimize:media` draaien.

## Omgevingsvariabelen

Zie `.env.example` (kopiëren naar `.env`):

| Variabele | Uitleg |
|---|---|
| `VITE_SUPABASE_URL` | URL van het bestaande Supabase-project |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Publieke (anon/publishable) sleutel – is openbaar, de data wordt beschermd door Row Level Security |
| `VITE_AANVRAGEN_EXTENDED` | `true` nadat `supabase/migrations/20261120_extend_aanvragen.sql` is uitgevoerd; anders komen de nieuwe formuliervelden in `opmerkingen` |
| `VITE_NOTIFY_FUNCTION` | Naam van een Supabase Edge Function voor een notificatiemail (bijv. `notify-aanvraag`). Leeg = uit |
| `VITE_SITE_URL` | Publieke URL voor canonical, hreflang en sitemap (standaard `https://crossingoflimits.nl`) |

## Supabase en admin

- Formulieren schrijven naar de bestaande tabellen `aanvragen` en `contact_messages` (zie `src/components/form/submitPlan.ts`).
- Admin: `/auth` (inloggen met het bestaande eigenaarsaccount) → `/admin`: aanvragen en berichten, filters, CSV-export,
  beantwoorden per e-mail. De admin staat niet in de navigatie en heeft `noindex`.
- Optioneel: `supabase/migrations/` (extra kolommen + server-side rate limit) en `supabase/functions/notify-aanvraag`
  (notificatiemail via Resend). Zie `supabase/migrations/README.md`.

## Deploy

De build is een map met statische bestanden (`dist/`), dus elke statische host werkt:

- **Lovable**: blijft een Vite + React-project (`npm run dev` op poort 8080). Publiceren kan zoals voorheen; de
  prerender draait mee in `npm run build`.
- **Vercel**: `vercel.json` is aanwezig (build, redirects van oude URL's, cache-headers).
- **Netlify**: `netlify.toml` + automatisch gegenereerde `dist/_redirects` (oude URL's 301, 404-pagina).
- **Andere host**: upload `dist/`, laat onbekende URL's `404.html` serveren en stel `/assets/*` in op lange cache.

Zet de omgevingsvariabelen bij de host. Ze worden tijdens de build ingebakken.

## Structuur

```
src/
  content/       reizen, bestemmingen, FAQ, juridische teksten, media-manifest (gegenereerd)
  i18n/          nl.ts (bron) + en.ts
  lib/           routes (NL/EN-paden), site-gegevens, supabase, antispam
  components/    layout/, sections/, ui/, form/
  pages/         één bestand per pagina (lazy geladen, geprerenderd)
  admin/         login + dashboard
  seo/           head-beheer en structured data
scripts/         prerender, media, link-check, screenshots, lighthouse, serve
tests/           Playwright end-to-end
supabase/        optionele migratie + edge function
```
