/**
 * DESTINATIONS – Spain and Morocco, with their regions.
 * Texts come from the previous website. Edit freely; every field has nl + en.
 */
import type { DestinationId } from "@/lib/routes";
import type { MediaKey } from "./media.generated";
import type { Localized } from "./types";
import type { Country } from "./trips";

export interface Region {
  name: Localized;
  title: Localized;
  text: Localized;
  highlights: Localized[];
}

export interface Destination {
  id: DestinationId;
  country: Country;
  number: string;
  name: Localized;
  tagline: Localized;
  intro: Localized;
  /** Mood / atmosphere */
  mood: Localized;
  /** Type of roads */
  roads: Localized[];
  /** Best travel period (from the FAQ) */
  bestPeriod: Localized;
  image: MediaKey;
  imageAlt: Localized;
  secondaryImage: MediaKey;
  secondaryImageAlt: Localized;
  regions: Region[];
}

export const destinations: Destination[] = [
  {
    id: "spain",
    country: "spain",
    number: "01",
    name: { nl: "Spanje", en: "Spain" },
    tagline: {
      nl: "Bergpassen, zonnige kustwegen en karakteristieke dorpjes.",
      en: "Mountain passes, sunny coastal roads and characterful villages.",
    },
    intro: {
      nl: "Bergpassen, kustwegen en zon. Drie regio's, elk met een eigen karakter en keuken.",
      en: "Mountain passes, coastal roads and sunshine. Three regions, each with its own character and cuisine.",
    },
    mood: {
      nl: "Van de groene Atlantische kust tot het zonnige Andalusië: Spanje biedt eindeloze afwisseling in één motorreis.",
      en: "From the green Atlantic coast to sunny Andalusia, Spain offers endless variety on a single motorcycle trip.",
    },
    roads: [
      { nl: "Bergpassen met haarspeldbochten", en: "Mountain passes with hairpins" },
      { nl: "Zonnige kustwegen langs de Middellandse Zee", en: "Sunny Mediterranean coastal roads" },
      { nl: "Verrassend lege binnenwegen", en: "Surprisingly empty backroads" },
      { nl: "Snelle, vloeiende bochten", en: "Fast, flowing bends" },
    ],
    bestPeriod: { nl: "Oktober t/m mei", en: "October through May" },
    image: "photos/pyrenees",
    imageAlt: { nl: "Bergweg in Noord-Spanje", en: "Mountain road in Northern Spain" },
    secondaryImage: "photos/white-village",
    secondaryImageAlt: {
      nl: "Motoren geparkeerd op een Spaans dorpsplein",
      en: "Motorcycles parked on a Spanish village square",
    },
    regions: [
      {
        name: { nl: "Noord-Spanje", en: "Northern Spain" },
        title: { nl: "Picos, groene bergen & Atlantische kust", en: "Picos, green mountains & Atlantic coast" },
        text: {
          nl: "Een meerdaagse motorreis langs bergpassen, groene valleien en pittoreske dorpjes. Pintxos in San Sebastián en bochtige wegen door de Picos de Europa.",
          en: "A multi-day motorcycle trip along mountain passes, lush valleys and picturesque villages. Pintxos in San Sebastián, twisty roads through the Picos de Europa.",
        },
        highlights: [
          { nl: "Picos de Europa", en: "Picos de Europa" },
          { nl: "Asturische kust", en: "Asturian coast" },
          { nl: "Baskische keuken", en: "Basque cuisine" },
        ],
      },
      {
        name: { nl: "Zuid-Spanje", en: "Southern Spain" },
        title: { nl: "Andalusië: zon, sierras & witte dorpjes", en: "Andalusia: sun, sierras & whitewashed villages" },
        text: {
          nl: "Warme dorpjes, weidse uitzichten over de Sierra Nevada en de bochtige Caminito del Rey. Diners op sfeervolle fincas met livegitaar.",
          en: "Warm villages, sweeping views over the Sierra Nevada and the twisting Caminito del Rey. Dinners at atmospheric fincas with live guitar.",
        },
        highlights: [
          { nl: "Sierra Nevada", en: "Sierra Nevada" },
          { nl: "Ronda & witte dorpjes", en: "Ronda & white villages" },
          { nl: "Costa del Sol", en: "Costa del Sol" },
        ],
      },
      {
        name: { nl: "Oost-Spanje", en: "Eastern Spain" },
        title: { nl: "Kust, bergen & karakteristieke wegen", en: "Coast, mountains & characterful roads" },
        text: {
          nl: "Een mix van Middellandse Zeekust, bergpassen in het binnenland en verrassend lege wegen. Ideaal voor motorrijders die van afwisseling houden.",
          en: "A mix of Mediterranean coastline, inland mountain passes and surprisingly empty roads. Ideal for riders who love variety.",
        },
        highlights: [
          { nl: "Costa Blanca", en: "Costa Blanca" },
          { nl: "Sierra de Aitana", en: "Sierra de Aitana" },
          { nl: "Achterland van Valencia", en: "Valencia hinterland" },
        ],
      },
    ],
  },
  {
    id: "morocco",
    country: "morocco",
    number: "02",
    name: { nl: "Marokko", en: "Morocco" },
    tagline: {
      nl: "Ruige landschappen, woestijnvergezichten en echt avontuur.",
      en: "Rugged landscapes, desert horizons and real adventure.",
    },
    intro: {
      nl: "Ruig, warm en avontuurlijk. Van het Rifgebergte tot de duinen van de Sahara.",
      en: "Rugged, warm and adventurous. From the Rif mountains to the dunes of the Sahara.",
    },
    mood: {
      nl: "Van blauwe stadjes tot gouden duinen: Marokko voelt op twee wielen als een andere planeet.",
      en: "From blue towns to golden dunes, Morocco feels like another planet on two wheels.",
    },
    roads: [
      { nl: "Hoge passen door de Atlas", en: "High passes through the Atlas" },
      { nl: "Bochtige wegen door het Rifgebergte", en: "Twisting roads through the Rif mountains" },
      { nl: "Kloven en kasbah-routes", en: "Gorges and kasbah routes" },
      { nl: "Woestijnwegen naar de Sahara", en: "Desert roads to the Sahara" },
    ],
    bestPeriod: { nl: "Oktober t/m mei", en: "October through May" },
    image: "photos/atlas-pass",
    imageAlt: { nl: "Woestijnweg in Zuid-Marokko", en: "Desert road in Southern Morocco" },
    secondaryImage: "photos/sahara-camp",
    secondaryImageAlt: { nl: "Motorrijder op een lege woestijnweg", en: "Motorcyclist on an empty desert road" },
    regions: [
      {
        name: { nl: "Noord-Marokko", en: "Northern Morocco" },
        title: { nl: "Rifgebergte, Chefchaouen & Middellandse Zee", en: "Rif mountains, Chefchaouen & Mediterranean Sea" },
        text: {
          nl: "Van het blauwe stadje Chefchaouen tot de bochtige wegen door het Rifgebergte. Een unieke sfeer, warm welkom en prachtige landschappen.",
          en: "From the blue town of Chefchaouen to the twisting roads through the Rif mountains. A unique atmosphere, warm welcome and stunning landscapes.",
        },
        highlights: [
          { nl: "Chefchaouen", en: "Chefchaouen" },
          { nl: "Rifgebergte", en: "Rif mountains" },
          { nl: "Middellandse Zeekust", en: "Mediterranean coast" },
        ],
      },
      {
        name: { nl: "Zuid-Marokko", en: "Southern Morocco" },
        title: { nl: "Atlas, kasbahs & de rand van de Sahara", en: "Atlas, kasbahs & the edge of the Sahara" },
        text: {
          nl: "Rijd over de Hoge Atlas, langs kasbahs en oasedorpen naar de duinen van Merzouga. Nachten onder een sterrenhemel die je bijblijft.",
          en: "Ride across the High Atlas, past kasbahs and oasis villages to the dunes of Merzouga. Nights under a starry sky you won't forget.",
        },
        highlights: [
          { nl: "Hoge Atlas", en: "High Atlas" },
          { nl: "Dades- & Todrakloof", en: "Dades & Todra gorges" },
          { nl: "Saharaduinen (Merzouga)", en: "Sahara dunes (Merzouga)" },
        ],
      },
    ],
  },
];

export const getDestination = (id: DestinationId) => destinations.find((d) => d.id === id)!;

/** "Trip at a glance" guidelines that apply to most tours (from the previous site). */
export const glance: { label: Localized; value: Localized }[] = [
  { label: { nl: "Duur", en: "Duration" }, value: { nl: "5 tot 10 dagen", en: "5 to 10 days" } },
  { label: { nl: "Afstand", en: "Distance" }, value: { nl: "200 tot 350 km per dag", en: "125 to 220 mi / day" } },
  { label: { nl: "Groepsgrootte", en: "Group size" }, value: { nl: "4 tot 10 motorrijders", en: "4 to 10 riders" } },
  { label: { nl: "Niveau", en: "Level" }, value: { nl: "Ervaren toermotorrijder", en: "Experienced tourer" } },
  { label: { nl: "Motor", en: "Motorcycle" }, value: { nl: "Je eigen motor of lokale huurmotor", en: "Your own or local rental" } },
  { label: { nl: "Inbegrepen", en: "Included" }, value: { nl: "Overnachting, diner, gids", en: "Lodging, dinner, guide" } },
];
