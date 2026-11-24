# Eindrapportage – nieuwe website Crossing of Limits

## Update 23 november 2026 – remake (versie 2)

Op verzoek opnieuw vormgegeven: "te veel zoals de oude, meer animaties, duidelijk en strak, andere beelden".

- **Nieuwe look**: licht en editorial. Papierkleurige basis (#F3EEE5), inkt-zwarte typografie, amber alleen als
  accent, donkere secties alleen voor beeld (CTA, cijfers, footer, menu). Nieuwe letters: Archivo (variabel, extra
  breed voor koppen; eigen subset van 48 KB) met Instrument Serif-cursief als accent.
- **Nieuwe beelden**: 18 nieuwe foto's gegenereerd met Higgsfield (≈ 13,5 credits van het budget van 15): per reis
  een eigen hoofdfoto, plus sfeer (BBQ, kampvuur, bar, riad, volgbus, cockpit). De oude foto's en de oude video zijn
  verwijderd. **Let op: het zijn AI-beelden.** Ze zijn bedoeld als sfeerbeeld, maar echte foto's van jullie reizen
  blijven de beste vervanging. De beelden komen in 1344/1024 px binnen en zijn opgeschaald naar 1920/1600 px.
- **Geen video meer**: op jouw keuze (alleen foto's) is de hero een fotomontage geworden: crossfade + langzame zoom,
  voortgangsbalkjes, pauzeknop (WCAG 2.2.2) en een frame dat bij het scrollen naar volledige breedte groeit.
- **Nieuwe animaties**: woord-voor-woord titel-reveals (CSS, vóór JS), marquee waarvan snelheid en richting met het
  scrollen meegaan, een statement waarvan de woorden oplichten tijdens het scrollen, horizontaal scrollende
  reizen (vastgezet op desktop, swipe op mobiel), reisvormen als grote lijst met een foto die de cursor volgt,
  beeld-reveals met een "gordijn", "zo werkt het" als kaarten die over elkaar schuiven, magnetische knoppen,
  een eigen cursor met label ("Bekijk", "Ontdek"), een gordijn-overgang tussen pagina's en een fullscreen menu
  dat van boven inschuift. Alles uitgeschakeld bij `prefers-reduced-motion`.
- **Kwaliteit**: build, lint en typecheck schoon. 32 Playwright-tests slagen, nu met tests voor de diavoorstelling
  en de horizontale reizen; 0 dode links. Lighthouse mobiel (mediaan van 3): Performance 89–100,
  Accessibility/Best Practices/SEO 100 op 9 pagina's. De homepage zit rond de 90: in de simulatie
  telt Lighthouse het logo als LCP en het lettertype + de JS concurreren daarmee. De Engelse homepage scoorde 89 in
  de laatste meting, net onder de grens. Zie `reports/lighthouse/summary.md`.

### Vervolg 24 november 2026
- **Reisdetailpagina** vernieuwd: grote kerngegevens, dagprogramma als tijdlijn met een lijn die meetekent tijdens
  het scrollen, route als grote typografie, donker aanvraagblok, "andere reizen" als swipe-rij en op mobiel een
  vaste boekingsbalk (prijs + "Vraag deze reis aan") die na de hero inschuift.
- **Bestemmingen / De Ervaring / Op maat**: beelden met gordijn-reveal, marquee met hoogtepunten per bestemming,
  donker blok naar de andere bestemming, nieuwe foto's bij de dagmomenten.
- **Snelheid**: Archivo als eigen subset (88 → 48 KB) en een responsief logo (8,5 KB op mobiel). Lighthouse mobiel
  (mediaan van 3): Performance 91–100 op alle 9 gemeten pagina's, Accessibility/Best Practices/SEO 100.
- 35 E2E-tests (o.a. tijdlijn en mobiele boekingsbalk), 0 dode links, geen horizontale overflow van 375 tot 1440 px.

---


Opgeleverd: 20 november 2026

## 1. Wat er gebouwd is

Een volledig nieuwe, geprerenderde Vite + React + TypeScript-site met dezelfde Supabase-backend.

- **22 pagina's, elk in NL en EN (44 URL's)**: home, groepsreizen, individuele reizen, op maat, bestemmingen +
  Spanje + Marokko, 7 reisdetailpagina's, De Ervaring, FAQ, plan je avontuur, contact, garantieregeling,
  (reis)voorwaarden, privacy- en cookieverklaring. Daarnaast 404, `/auth` en `/admin`.
- **Homepage**: fullscreen video (WebM + MP4, 720p op mobiel en 1280p op desktop, poster direct zichtbaar,
  pauzeert buiten beeld), woord-voor-woord titelreveal, concept, 3 reisvormen, split-screen bestemmingen met parallax,
  6 kenmerken, tellers (alleen echte cijfers uit de content: 2 landen, 5 regio's, 7 reizen, max. 10 rijders),
  "zo werkt het" in 3 stappen, STO Garant-blok, afsluitende CTA.
- **Reisdetail**: hero, kerngegevens (duur, afstand, niveau, periode, vertrekdata, prijs), dag-voor-dag-accordeon,
  inbegrepen / niet inbegrepen, accommodatie, galerij met routekaarten en lightbox (toetsenbord: pijltjes en Esc),
  sticky aanvraagblok met de reis vooraf geselecteerd, andere reizen.
- **De Ervaring**: de dag van een rijder in 6 momenten (ochtend → kampvuur) met een horizontale route-lijn
  die meetekent tijdens het scrollen (SVG path draw) en waypoints die oplichten.
- **Plan je avontuur**: formulier in 4 stappen met voortgangsbalk, validatie per stap, honeypot, minimale
  invultijd, rate-limit (3 per 10 min per browser), opslag in Supabase en een geanimeerd bevestigingsscherm.
  Vooraf invullen via `?reis=<slug>` en `?reisvorm=op-maat`.
- **Contact** met klikbare e-mail, telefoon, WhatsApp-knop, KVK en een kort formulier (`contact_messages`).
- **Admin** (`/auth` → `/admin`): aanvragen en berichten, filters (taal, land, datumveld, van/tot, zoeken),
  CSV-export, beantwoorden per e-mail, NL/EN.
- **Animaties**: scroll-reveals met stagger, parallax (max ~14%), navbar transparant → blur en
  verbergen/tonen bij scrollen, fullscreen mobiel menu met gestaggerde links, hover-lift + langzame zoom op
  kaarten, fill-animatie op knoppen, paginaovergangen, Lenis smooth scroll. Bij `prefers-reduced-motion` staat
  alles stil, de video wordt niet geladen en de poster blijft staan.
- **SEO**: unieke title en description per pagina en taal, canonical, hreflang (nl/en/x-default), Open Graph en
  Twitter-cards, `sitemap.xml` (44 URL's met alternates), `robots.txt`. Structured data: TravelAgency,
  TouristTrip (met prijs), FAQPage, BreadcrumbList. Oude Lovable-URL's sturen door (301).

## 2. Opleverchecklist

| Punt | Status | Toelichting |
|---|---|---|
| Alle pagina's uit §4 in NL en EN, geen dode links | ✓ | `npm run check:links`: 46 pagina's en 244 assets gecontroleerd, 0 fouten |
| Hero-video speelt, poster laadt direct | ✓ | Getest in Chromium (desktop 1280p, mobiel 720p) met Playwright. Op echte iOS/Android-toestellen is hij niet getest (zie §5) |
| Animaties werken en staan uit bij reduced motion | ✓ | E2E-tests: geen video-requests en alle content zichtbaar bij `reduce` |
| Formulier: stappen, validatie, opslag, bevestiging (E2E) | ✓ | 31 Playwright-tests slagen (desktop + mobiel). De Supabase-insert wordt in de tests onderschept en de payload gecontroleerd. Er is **niet** in de productiedatabase geschreven |
| Build en lint zonder errors of warnings, geen console errors | ✓ | `npm run build`, `npm run lint --max-warnings 0` en `tsc` schoon. Geen console errors in productie en dev |
| Lighthouse-scores uit §7 | ✓ | Zie `reports/lighthouse/summary.md`: Performance 92–96, Accessibility 100, Best Practices 100, SEO 100 op 15 pagina's (mobiel, mediaan van 3 runs, lokale build) |
| Playwright-screenshots van elke pagina gecontroleerd | ✓ | 22 pagina's × 375/768/1280/1440 px, geen horizontale overflow. Overzicht: `reports/overview/` |
| README | ✓ | Content aanpassen, env-variabelen, deploy |
| Eindrapportage | ✓ | Dit document |

Lighthouse is gemeten tegen een lokale server met gzip. Op de echte host (CDN, HTTP/2) liggen de scores
meestal gelijk of hoger, maar dat is niet gemeten.

## 3. Placeholders die nog ingevuld moeten worden

Alles staat in `src/content/trips.ts` en verschijnt op de site als "op aanvraag".

| Wat | Waar | Waarde nu |
|---|---|---|
| Vertrekdata groepsreizen (alle 7 reizen) | `departures` | `TODO_DATUM` → "Op aanvraag" |
| Afstand per reis (6 van de 7; alleen Centraal Spanje heeft "± 1.200 km (5-daagse)") | `distance` | `TODO_KM` |
| Voorbeeldreis "op maat" (verborgen, `published: false`) | laatste item | `TODO_NAAM`, `TODO_PRIJS`, `TODO_TEKST`… |
| Social-media-links | `src/lib/site.ts` → `socials` | leeg (footer toont ze pas als ze ingevuld zijn) |

**Ontbrekende content (bewust niet verzonnen):**
- Volledige reisvoorwaarden: annulering, hoogte en termijn van de aanbetaling, wijzigingen. De pagina bevat
  nu alleen de bestaande STO Garant-tekst plus feiten die al op de site stonden.
- De **privacy- en cookieverklaring** zijn nieuw geschreven op basis van hoe de site werkt (geen tracking,
  alleen functionele localStorage, Supabase als verwerker). Laat ze juridisch controleren. De bewaartermijn
  is algemeen geformuleerd.
- Een FAQ over het benodigde **rijbewijs** (de categorie "Motor & rijbewijs" bevat nu alleen motorvragen).
- **Reviews**: niet getoond. Het oude Lovable-project bevatte voorbeeldreviews en cijfers ("4,9/5 door 500+
  motorrijders", "8 jaar") die niet op de live site stonden. Die zijn niet overgenomen.
- De dagprogramma's van Aragón, Valencia en de drie Marokko-reizen zijn kort (blokken van dagen). Andalusië en
  Centraal Spanje hebben een uitgebreide beschrijving.

**Inconsistenties in de bestaande content (niet aangepast, wel opvallend):**
- De regio "Noord-Spanje" op de bestemmingspagina beschrijft de Picos de Europa, Asturië en de Baskische keuken,
  maar de reis Noord-Spanje gaat door Aragón en Catalonië.
- De FAQ zegt "bedoeld voor alle toermotorrijders", het blok "De reis in het kort" zegt "Ervaren toermotorrijder".
- "Volgbus" (groepsreizen) en "volgwagen" (FAQ) worden door elkaar gebruikt.

## 4. Assets die ontbreken of beter kunnen

- **Foto's**: de 12 sfeerfoto's lijken gegenereerd of stockbeeld en worden op meerdere reizen hergebruikt.
  Echte foto's per reis (route, accommodaties, de groep, BBQ en kampvuur, de volgbus) zouden veel meer
  vertrouwen geven. Zeker 3–6 per reis, minimaal 1920 px breed.
- **Marokko**: geen routekaarten (Spanje heeft er per reis twee).
- **Video**: één clip van 10 seconden (1344×768). Een langere loop in 1920×1080 met eigen beelden zou de
  hero sterker maken. De pipeline (`npm run optimize:media`) maakt er automatisch lichte versies van.
- **Team/over ons**: geen foto of verhaal van de organisatoren. Dat helpt bij een "persoonlijk contact"-belofte.
- **Logo**: alleen als rasterafbeelding (PNG). Een SVG-versie zou scherper en lichter zijn.
- **OG-afbeelding** is gegenereerd uit de hero-foto + logo (`public/og-image.jpg`). Reispagina's gebruiken hun eigen foto.

## 5. Keuzes en aandachtspunten

- **Lovable-repo niet beschikbaar**: content, assets, Supabase-tabellen en formulierlogica zijn
  gereconstrueerd uit de live site en de gebundelde JavaScript. Alle teksten zijn letterlijk overgenomen
  en alleen waar nodig licht herschreven. Feiten zijn niet veranderd.
- **Supabase**: het bestaande schema is ongewijzigd in gebruik. De nieuwe formuliervelden (reisvorm, gekozen
  reis, rijders/duo, rijervaring, contactvoorkeur) komen in `opmerkingen` terecht, totdat je de optionele
  migratie in `supabase/migrations/` draait en `VITE_AANVRAGEN_EXTENDED=true` zet. Die migratie voegt ook
  een server-side rate-limit toe. Controleer de RLS-policies (zie `supabase/migrations/README.md`).
- **Notificatiemail**: de oude site verstuurde die via een TanStack server function. Die bestaat niet in een
  statische site. Er staat een kant-en-klare Edge Function klaar (`supabase/functions/notify-aanvraag`, via
  Resend). Die staat uit tot je hem deployt en `VITE_NOTIFY_FUNCTION` zet. **Tot die tijd komt er dus geen
  mail binnen bij een aanvraag. Kijk in `/admin`.**
- **Admin**: alleen inloggen. Account aanmaken (stond in de oude versie) is weggelaten. Zet sign-ups ook uit in Supabase.
- **URL's** zijn nu Nederlands (`/groepsreizen`, `/reizen/…`). De oude Engelstalige URL's sturen door.
- **Fonts**: Oswald (koppen) en Inter (tekst), zelf gehost via `@fontsource`.
- **Niet getest**: echte iOS/Android-toestellen (de video gebruikt `muted` + `playsInline`, wat op iOS vereist
  is), Safari en Firefox (alleen Chromium beschikbaar), en een echte insert in de productiedatabase. Doe na
  livegang één testaanvraag en verwijder die daarna in Supabase.
