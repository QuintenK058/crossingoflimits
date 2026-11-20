/**
 * LEGAL TEXTS – garantieregeling, (reis)voorwaarden, privacy- en cookieverklaring.
 * Links: write [label](https://…) inside a paragraph.
 * The guarantee/terms texts come from the previous website. The privacy and cookie
 * statements describe how this website actually works; have them checked by a
 * legal advisor before publishing.
 */
import type { Localized } from "./types";

export interface LegalSection {
  id: string;
  title: Localized;
  /** Paragraphs. Lines starting with "- " are rendered as a bullet list. */
  body: Localized[];
}

export interface LegalDoc {
  updated: string; // ISO date
  sections: LegalSection[];
}

const STO = "[www.sto-garant.nl](https://www.sto-garant.nl)";
const STO_P = "[www.sto-garant.nl/deelnemers](https://www.sto-garant.nl/deelnemers)";
const STO_D = "[www.sto-garant.nl/downloads](https://www.sto-garant.nl/downloads)";

export const guarantee: LegalDoc = {
  updated: "2026-11-20",
  sections: [
    {
      id: "sto-garant",
      title: { nl: "Garantie geregeld: STO Garant", en: "Guarantee arranged: STO Garant" },
      body: [
        {
          nl: `Om te voldoen aan de wettelijk verplichte garantiestelling maakt Crossing of Limits gebruik van STO Garant, een door de Autoriteit Consument en Markt (ACM) erkende garantieregeling. U kunt dit controleren via de STO Garant deelnemerspagina (${STO_P}). Alle informatie over STO Garant vindt u op ${STO}.`,
          en: `To comply with the legally required guarantee, Crossing of Limits uses STO Garant, a guarantee scheme recognised by the Netherlands Authority for Consumers and Markets (ACM). You can verify this on the STO Garant participants page (${STO_P}). All information about STO Garant can be found at ${STO}.`,
        },
        {
          nl: `Bij elk (reis)aanbod van Crossing of Limits op deze website leest u of de garantie van STO Garant van toepassing is. In de garantieregeling leest u wat de garantie inhoudt en welke voorwaarden van toepassing zijn. U vindt deze garantieregeling op de website van STO Garant (${STO_D}).`,
          en: `Every (travel) offer by Crossing of Limits on this website states whether the STO Garant guarantee applies. The guarantee scheme explains what the guarantee covers and which conditions apply. You can find the guarantee scheme on the STO Garant website (${STO_D}).`,
        },
      ],
    },
    {
      id: "werking",
      title: { nl: "De werking", en: "How it works" },
      body: [
        {
          nl: "Indien de garantie van STO Garant van toepassing is op uw boeking, dan betaalt u de reissom niet aan Crossing of Limits, maar aan de derdengeldenrekening van Stichting Derdengelden Certo Escrow, een bij De Nederlandsche Bank (DNB) en de Autoriteit Financiële Markten (AFM) geregistreerde betaaldienstverlener. Deze stichting derdengelden waarborgt uw reissom tot na afloop van uw boeking. De dag na afloop wordt de reissom vrijgegeven aan Crossing of Limits.",
          en: "If the STO Garant guarantee applies to your booking, you do not pay the travel sum to Crossing of Limits but into the third-party account of Stichting Derdengelden Certo Escrow, a payment service provider registered with De Nederlandsche Bank (DNB) and the Dutch Authority for the Financial Markets (AFM). This escrow foundation safeguards your travel sum until after your booking has ended. The day after it ends, the travel sum is released to Crossing of Limits.",
        },
        {
          nl: "Mocht Crossing of Limits voor het einde van uw boeking in financieel onvermogen geraken, dan voert STO Garant de garantie uit. In de garantieregeling leest u hoe u daar in dat geval aanspraak op maakt.",
          en: "Should Crossing of Limits become insolvent before the end of your booking, STO Garant will execute the guarantee. The guarantee scheme explains how to make a claim in that case.",
        },
      ],
    },
  ],
};

export const terms: LegalDoc = {
  updated: "2026-11-20",
  sections: [
    {
      id: "garantieregeling",
      title: { nl: "Garantieregeling STO Garant", en: "STO Garant guarantee scheme" },
      body: [
        {
          nl: `Om te voldoen aan de wettelijk verplichte garantiestelling maakt Crossing of Limits gebruik van STO Garant. U kunt dit controleren via de STO Garant deelnemerspagina (${STO_P}). Alle informatie over STO Garant vindt u op ${STO}.`,
          en: `To comply with the legally required guarantee, Crossing of Limits uses STO Garant. You can verify this on the STO Garant participants page (${STO_P}). All information about STO Garant can be found at ${STO}.`,
        },
        {
          nl: `Bij elk (reis)aanbod van Crossing of Limits wordt duidelijk vermeld of de garantie van STO Garant van toepassing is. In de garantieregeling leest u wat de garantie inhoudt en welke voorwaarden van toepassing zijn. U vindt deze garantieregeling op de website van STO Garant (${STO_D}).`,
          en: `Every (travel) offer by Crossing of Limits clearly states whether the STO Garant guarantee applies. The guarantee scheme explains what the guarantee covers and which conditions apply. You can find it on the STO Garant website (${STO_D}).`,
        },
      ],
    },
    {
      id: "betaling",
      title: { nl: "Betaling van de reissom", en: "Payment of the travel sum" },
      body: [
        {
          nl: "Indien de garantie van STO Garant van toepassing is op uw boeking, dan betaalt u de reissom niet aan Crossing of Limits, maar aan de derdengeldenrekening van Stichting Derdengelden Certo Escrow, een bij De Nederlandsche Bank (DNB) en de Autoriteit Financiële Markten (AFM) geregistreerde betaaldienstverlener. Deze stichting derdengelden waarborgt uw reissom tot na afloop van uw boeking.",
          en: "If the STO Garant guarantee applies to your booking, you do not pay the travel sum to Crossing of Limits but into the third-party account of Stichting Derdengelden Certo Escrow, a payment service provider registered with De Nederlandsche Bank (DNB) and the Dutch Authority for the Financial Markets (AFM). This escrow foundation safeguards your travel sum until after your booking has ended.",
        },
        {
          nl: "Wanneer diensten door financieel onvermogen van Crossing of Limits niet (volledig en/of tijdig) worden verleend, dan voert STO Garant de garantie uit. In de garantieregeling leest u hoe u daar in dat geval aanspraak op maakt.",
          en: "If services are not (fully and/or timely) provided due to the insolvency of Crossing of Limits, STO Garant will execute the guarantee. The guarantee scheme explains how to make a claim in that case.",
        },
      ],
    },
    {
      id: "aanvraag",
      title: { nl: "Aanvraag, voorstel en bevestiging", en: "Request, proposal and confirmation" },
      body: [
        {
          nl: "Op deze website kun je niet direct boeken. Je stuurt een vrijblijvende aanvraag, waarna we binnen 24 uur persoonlijk contact opnemen. Pas na een persoonlijk gesprek sturen wij een voorstel. Niets staat vast tot dat jij hebt bevestigd en de aanbetaling hebt betaald.",
          en: "You cannot book directly on this website. You send a request without obligation, after which we contact you personally within 24 hours. Only after a personal conversation do we send a proposal. Nothing is final until you have confirmed and paid the deposit.",
        },
      ],
    },
    {
      id: "prijzen",
      title: { nl: "Prijzen", en: "Prices" },
      body: [
        {
          nl: "De prijzen op deze website zijn vanaf-prijzen per rijder, exclusief vlucht. Brandstof en tolwegen, motortransport of motorhuur en je reis- en annuleringsverzekering zijn niet inbegrepen, tenzij anders vermeld in je reisvoorstel.",
          en: "Prices on this website are starting prices per rider, excluding flights. Fuel and toll roads, motorcycle transport or rental and your travel and cancellation insurance are not included, unless stated otherwise in your trip proposal.",
        },
      ],
    },
    {
      id: "verzekering",
      title: { nl: "Verzekering en pech", en: "Insurance and breakdowns" },
      body: [
        {
          nl: "Je regelt zelf je reis- en pechhulpverzekering. Onderweg helpen we je met lokale garages en praktische ondersteuning.",
          en: "You arrange your own travel and breakdown insurance. On the road we help you with local garages and practical support.",
        },
      ],
    },
  ],
};

export const privacy: LegalDoc = {
  updated: "2026-11-20",
  sections: [
    {
      id: "wie",
      title: { nl: "Wie zijn wij", en: "Who we are" },
      body: [
        {
          nl: "Crossing of Limits (KVK 93081723) organiseert motorreizen door Spanje en Marokko en is verantwoordelijk voor de verwerking van persoonsgegevens via deze website. Vragen over privacy? Mail naar [info@crossingoflimits.nl](mailto:info@crossingoflimits.nl) of bel [+31 6 37 69 51 65](tel:+31637695165).",
          en: "Crossing of Limits (Dutch Chamber of Commerce 93081723) organises motorcycle tours through Spain and Morocco and is responsible for processing personal data via this website. Questions about privacy? Email [info@crossingoflimits.nl](mailto:info@crossingoflimits.nl) or call [+31 6 37 69 51 65](tel:+31637695165).",
        },
      ],
    },
    {
      id: "gegevens",
      title: { nl: "Welke gegevens we verwerken", en: "What data we process" },
      body: [
        {
          nl: "We verwerken alleen de gegevens die je zelf invult:",
          en: "We only process the data you enter yourself:",
        },
        {
          nl: "- Aanvraagformulier: naam, e-mailadres, telefoonnummer, contactvoorkeur, gewenste reisvorm, reis, bestemming, periode en data, aantal rijders en duo-passagiers, motorkeuze, rijervaring en je wensen.\n- Contactformulier: naam, e-mailadres en je bericht.",
          en: "- Request form: name, email address, phone number, contact preference, preferred type of tour, tour, destination, period and dates, number of riders and pillion passengers, motorcycle choice, riding experience and your wishes.\n- Contact form: name, email address and your message.",
        },
        {
          nl: "Vul in het vrije tekstveld geen gevoelige gegevens in, zoals medische informatie.",
          en: "Please do not enter sensitive data, such as medical information, in the free text field.",
        },
      ],
    },
    {
      id: "doel",
      title: { nl: "Waarom we deze gegevens gebruiken", en: "Why we use this data" },
      body: [
        {
          nl: "We gebruiken je gegevens om je aanvraag of vraag te beantwoorden, contact met je op te nemen op de manier die je kiest en een reisvoorstel voor je te maken. De grondslag is het nemen van stappen op jouw verzoek voorafgaand aan een overeenkomst (art. 6 lid 1 sub b AVG). We gebruiken je gegevens niet voor nieuwsbrieven of advertenties en verkopen ze nooit aan derden.",
          en: "We use your data to answer your request or question, contact you in the way you choose and prepare a trip proposal for you. The legal basis is taking steps at your request prior to entering into a contract (Art. 6(1)(b) GDPR). We do not use your data for newsletters or advertising and never sell it to third parties.",
        },
      ],
    },
    {
      id: "opslag",
      title: { nl: "Opslag, beveiliging en bewaartermijn", en: "Storage, security and retention" },
      body: [
        {
          nl: "Formulierinzendingen worden opgeslagen in een beveiligde database bij onze verwerker Supabase. Alleen Crossing of Limits heeft na inloggen toegang. De verbinding met de website is versleuteld (HTTPS). We bewaren je gegevens niet langer dan nodig is voor het doel waarvoor ze zijn verzameld, of zolang de wet dat verplicht (bijvoorbeeld de fiscale bewaarplicht als je een reis boekt).",
          en: "Form submissions are stored in a secure database with our processor Supabase. Only Crossing of Limits has access after signing in. The connection to the website is encrypted (HTTPS). We do not keep your data longer than necessary for the purpose for which it was collected, or as long as required by law (for example the tax retention obligation if you book a trip).",
        },
      ],
    },
    {
      id: "rechten",
      title: { nl: "Jouw rechten", en: "Your rights" },
      body: [
        {
          nl: "Je hebt het recht om je gegevens in te zien, te laten corrigeren of verwijderen, de verwerking te beperken, bezwaar te maken en je gegevens over te laten dragen. Stuur je verzoek naar [info@crossingoflimits.nl](mailto:info@crossingoflimits.nl); we reageren binnen een maand. Ben je niet tevreden over hoe we met je gegevens omgaan, dan kun je een klacht indienen bij de [Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl).",
          en: "You have the right to access, correct or delete your data, restrict processing, object and have your data transferred. Send your request to [info@crossingoflimits.nl](mailto:info@crossingoflimits.nl); we respond within one month. If you are not satisfied with how we handle your data, you can file a complaint with the Dutch Data Protection Authority ([Autoriteit Persoonsgegevens](https://www.autoriteitpersoonsgegevens.nl)).",
        },
      ],
    },
    {
      id: "cookies",
      title: { nl: "Cookies", en: "Cookies" },
      body: [
        {
          nl: "Deze website gebruikt geen tracking- of advertentiecookies. Lees meer in onze [cookieverklaring](/cookieverklaring).",
          en: "This website does not use tracking or advertising cookies. Read more in our [cookie policy](/en/cookie-policy).",
        },
      ],
    },
  ],
};

export const cookies: LegalDoc = {
  updated: "2026-11-20",
  sections: [
    {
      id: "kort",
      title: { nl: "In het kort", en: "In short" },
      body: [
        {
          nl: "Deze website plaatst geen tracking-, analyse- of advertentiecookies en laadt geen inhoud van externe partijen zoals Google Fonts of YouTube. Lettertypes, foto's en video's worden vanaf onze eigen server geladen.",
          en: "This website does not place tracking, analytics or advertising cookies and does not load content from third parties such as Google Fonts or YouTube. Fonts, photos and videos are served from our own server.",
        },
      ],
    },
    {
      id: "functioneel",
      title: { nl: "Functionele opslag", en: "Functional storage" },
      body: [
        {
          nl: "We gebruiken alleen lokale opslag (localStorage) in je browser die nodig is om de website goed te laten werken:",
          en: "We only use local storage (localStorage) in your browser that is needed for the website to work properly:",
        },
        {
          nl: "- col-lang: onthoudt je taalkeuze (NL/EN).\n- col-cookie-notice: onthoudt dat je deze melding hebt gezien.\n- col-plan-submits / col-contact-submits: tijdstippen van verzonden formulieren, om spam tegen te gaan (na 10 minuten niet meer gebruikt).",
          en: "- col-lang: remembers your language choice (NL/EN).\n- col-cookie-notice: remembers that you have seen this notice.\n- col-plan-submits / col-contact-submits: times of submitted forms, to prevent spam (no longer used after 10 minutes).",
        },
        {
          nl: "Voor deze functionele opslag is geen toestemming nodig. Je kunt hem altijd wissen via de instellingen van je browser.",
          en: "No consent is required for this functional storage. You can always clear it via your browser settings.",
        },
      ],
    },
    {
      id: "beheer",
      title: { nl: "Beheeromgeving", en: "Admin area" },
      body: [
        {
          nl: "Alleen in de afgeschermde beheeromgeving van Crossing of Limits wordt een inlogsessie van Supabase opgeslagen. Bezoekers van de website komen daar niet mee in aanraking.",
          en: "Only in the protected admin area of Crossing of Limits is a Supabase sign-in session stored. Website visitors never encounter it.",
        },
      ],
    },
    {
      id: "vragen",
      title: { nl: "Vragen", en: "Questions" },
      body: [
        {
          nl: "Vragen over cookies of privacy? Mail naar [info@crossingoflimits.nl](mailto:info@crossingoflimits.nl) of lees onze [privacyverklaring](/privacyverklaring).",
          en: "Questions about cookies or privacy? Email [info@crossingoflimits.nl](mailto:info@crossingoflimits.nl) or read our [privacy policy](/en/privacy-policy).",
        },
      ],
    },
  ],
};
