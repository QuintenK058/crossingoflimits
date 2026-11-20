# Plan – nieuwe website Crossing of Limits

## Uitgangssituatie
De Lovable-repo was niet beschikbaar in deze omgeving. De inhoud is daarom overgenomen van de
live site (crossingoflimits.nl, Lovable/TanStack Start + Supabase):

- **Routes (oud):** `/`, `/group-tours`, `/individual-tours`, `/tailor-made`, `/destinations`, `/experience`,
  `/faq`, `/plan`, `/contact`, `/garantieregeling`, `/reisvoorwaarden`, `/tours/:slug`, `/auth`, `/admin`.
- **Supabase:** project `wgsbzlimdzaaqqflalrh`, tabellen `aanvragen` (planformulier) en `contact_messages`
  (contactformulier), admin via Supabase Auth (e-mail + wachtwoord) op `/auth` → `/admin`.
- **Plan-formulier (oud):** één stap; velden naam, email, telefoon, land, regio, reisperiode, reis_start/eind,
  aantal_personen, eigen_motor, transport_motor, accommodatie, opmerkingen, taal. Notificatiemail via een
  TanStack server function (niet overdraagbaar naar een statische Vite-site).
- **Content:** 7 reizen met echte prijzen en (deels) dagprogramma's + routekaarten, NL/EN-dictionary (354 strings),
  14 FAQ's, STO Garant-teksten.
- **Assets:** hero-video (18 MB), logo, STO-logo, 12 sfeerfoto's, 8 routekaarten, favicons.

## Sitemap (nieuw)
| NL | EN |
|---|---|
| `/` | `/en` |
| `/groepsreizen` | `/en/group-tours` |
| `/individuele-reizen` | `/en/individual-tours` |
| `/op-maat` | `/en/tailor-made` |
| `/bestemmingen`, `/bestemmingen/spanje`, `/bestemmingen/marokko` | `/en/destinations`, `/en/destinations/spain`, `/en/destinations/morocco` |
| `/reizen/:slug` | `/en/tours/:slug` |
| `/de-ervaring` | `/en/the-experience` |
| `/veelgestelde-vragen` | `/en/faq` |
| `/plan` | `/en/plan` |
| `/contact` | `/en/contact` |
| `/garantieregeling`, `/reisvoorwaarden` | `/en/guarantee-scheme`, `/en/travel-terms` |
| `/privacyverklaring`, `/cookieverklaring` | `/en/privacy-policy`, `/en/cookie-policy` |
| 404, `/auth`, `/admin` (noindex) | |

Oude Lovable-URL's worden 301-doorgestuurd.

## Componenten
Layout (Navbar, MobileMenu, Footer, CookieBanner, SmoothScroll), secties (HeroVideo, PageHero, CtaBand,
TripCard/TripList, SectionHeading, Breadcrumbs, LegalPage), UI (Button met fill-animatie, Picture,
Reveal/RevealGroup, ParallaxImage, Counter, Accordion, Lightbox/Gallery), formulieren (PlanForm, velden).

## Animatieaanpak
- Framer Motion (`LazyMotion` + `m`) voor scroll-reveals, parallax, paginaovergangen, menu, route-lijn.
- Intro-animaties van hero's in pure CSS (starten bij eerste paint → goede LCP).
- Alleen `transform`/`opacity`; `prefers-reduced-motion` schakelt alles uit (Reveal rendert plain HTML,
  parallax staat stil, Lenis uit, video wordt niet geladen).
- Lenis alleen voor muiswiel; touch blijft native.

## Fases
fundament → layout/navigatie → homepage → overige pagina's → formulier → i18n → SEO/performance → QA.
