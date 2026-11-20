/**
 * TRIPS – edit this file to add or change trips.
 *
 * Every text has a Dutch (nl) and English (en) version.
 * Values that still need to be filled in are marked with TODO_… and are shown on
 * the site as "op aanvraag" / "on request" until you replace them.
 *
 * - forms: in which overview the trip is shown ("group", "individual", "tailor-made")
 * - published: false hides a trip everywhere (handy for drafts)
 * - image / gallery / maps: keys from src/content/media.generated.ts
 *   (add new photos to media-src/photos and run `npm run optimize:media`)
 */
import type { MediaKey } from "./media.generated";
import type { Localized } from "./types";

export type TripForm = "group" | "individual" | "tailor-made";
export type Country = "spain" | "morocco";
export type Placeholder = `TODO_${string}`;

export interface ItineraryItem {
  /** "1", "2-4" or a variant length like "5" / "8" */
  day: string;
  /** true when this item describes a full 5- or 8-day variant instead of a day */
  variant?: boolean;
  title: Localized;
  text: Localized;
}

export interface Trip {
  slug: string;
  published: boolean;
  forms: TripForm[];
  country: Country;
  name: Localized;
  /** Possible trip lengths in days */
  durations: number[];
  /** Price "from", per rider in euro. Use "TODO_PRIJS" when unknown → shown as "op aanvraag". */
  priceFrom: number | Placeholder;
  priceNote: Localized;
  image: MediaKey;
  short: Localized;
  intro: Localized;
  route: Localized;
  characteristics: Localized[];
  included: Localized[];
  excluded: Localized[];
  accommodation: Localized;
  /** Character of the roads / level tags */
  level: Localized[];
  /** Total or daily distance. "TODO_KM" when unknown. */
  distance: Localized | Placeholder;
  /** Travel season */
  season: Localized;
  /** Fixed departure dates (ISO yyyy-mm-dd). "TODO_DATUM" when not yet known. */
  departures: string[] | Placeholder;
  itinerary: ItineraryItem[];
  /** Route maps / day schedules per variant */
  maps: { days: number; image: MediaKey }[];
  gallery: MediaKey[];
}

const characteristics: Localized[] = [{ nl: "Groepsreis in klein gezelschap", en: "Group tour in a small group" }, { nl: "Volgbus met bagage en technische ondersteuning", en: "Support van with luggage and technical support" }, { nl: "Eigen motor meenemen of ter plaatse huren", en: "Bring your own bike or rent one locally" }];
const included: Localized[] = [{ nl: "Volgbus met rijdersbagage en technische ondersteuning", en: "Support van with riders' luggage and technical support" }, { nl: "Alle routes, te laden in je telefoon of navigatiesysteem", en: "All routes, ready to load into your phone or navigation system" }, { nl: "Nederlandstalige begeleiding", en: "Dutch-speaking guidance" }];
const excluded: Localized[] = [{ nl: "Vlucht", en: "Flight" }, { nl: "Brandstof en tolwegen", en: "Fuel and toll roads" }, { nl: "Motortransport of motorhuur (optioneel bij te boeken)", en: "Motorcycle transport or rental (optional add-on)" }, { nl: "Reis- en annuleringsverzekering", en: "Travel and cancellation insurance" }];
const priceNote: Localized = { nl: "per rijder, excl. vlucht", en: "per rider, excl. flight" };
/** From the FAQ: "Spanje en Marokko: oktober t/m mei." */
const season: Localized = { nl: "Oktober t/m mei", en: "October through May" };

export const trips: Trip[] = [
  {
    slug: "noord-spanje-aragon-catalonie",
    published: true,
    forms: ["group", "individual"],
    country: "spain",
    name: { nl: "Noord-Spanje · Aragón & Catalonië", en: "Northern Spain · Aragón & Catalonia" },
    durations: [5,8],
    priceFrom: 1450,
    priceNote,
    image: "photos/spain-mountain",
    short: { nl: "Groene bergen, lege passen en de ruige Pyreneeën aan de grens van Aragón en Catalonië.", en: "Green mountains, empty passes and the rugged Pyrenees on the border of Aragón and Catalonia." },
    intro: { nl: "Een groepsreis door het noorden van Spanje: Aragón en Catalonië. Bergpassen, stuwmeren en rustige binnenwegen, met elke avond een sfeervolle verblijfplaats.", en: "A group tour through northern Spain: Aragón and Catalonia. Mountain passes, reservoirs and quiet backroads, with an atmospheric place to stay every night." },
    route: { nl: "Rondrit door Aragón en Catalonië, te kiezen als 5- of 8-daagse reis.", en: "Loop through Aragón and Catalonia, available as a 5- or 8-day trip." },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "Goede hotels en karaktervolle finca's met veilige parkeerplek voor de motoren.", en: "Good hotels and characterful fincas with secure motorcycle parking." },
    level: [{ nl: "Uitdagend", en: "Challenging" }, { nl: "Spannend", en: "Exciting" }],
    distance: "TODO_KM",
    season,
    departures: "TODO_DATUM",
    itinerary: [
      {
        day: "1",
        title: { nl: "Aankomst & kennismaking", en: "Arrival & meet-up" },
        text: { nl: "Ontvangst, briefing en gezamenlijk diner.", en: "Welcome, briefing and a shared dinner." },
      },
      {
        day: "2-4",
        title: { nl: "Aragón", en: "Aragón" },
        text: { nl: "Lege bergwegen en spectaculaire passen.", en: "Empty mountain roads and spectacular passes." },
      },
      {
        day: "5-7",
        title: { nl: "Catalonië", en: "Catalonia" },
        text: { nl: "Bochtige wegen door de uitlopers van de Pyreneeën.", en: "Twisty roads through the foothills of the Pyrenees." },
      },
      {
        day: "8",
        title: { nl: "Afsluiting", en: "Finale" },
        text: { nl: "Laatste rit en afscheidsdiner.", en: "Final ride and farewell dinner." },
      },
    ],
    maps: [{ days: 5, image: "itineraries/aragon-5-daagse-reis" }, { days: 8, image: "itineraries/aragon-8-daagse-reis" }],
    gallery: ["photos/riders-mountain","photos/village-stop","photos/accommodation","photos/bbq","photos/coast","photos/campfire"],
  },
  {
    slug: "valencia",
    published: true,
    forms: ["group", "individual"],
    country: "spain",
    name: { nl: "Zuid-Oost Spanje · Valencia", en: "South-East Spain · Valencia" },
    durations: [5,8],
    priceFrom: 1275,
    priceNote,
    image: "photos/coast",
    short: { nl: "Zon, kustwegen en het bergachtige binnenland van Valencia.", en: "Sun, coastal roads and the mountainous hinterland of Valencia." },
    intro: { nl: "Een groepsreis door Zuid-Oost Spanje met Valencia als basis: warme kustwegen, oranjeboomgaarden en verrassend lege bergwegen in het achterland.", en: "A group tour through south-east Spain based around Valencia: warm coastal roads, orange groves and surprisingly empty mountain roads inland." },
    route: { nl: "Rondrit door de regio Valencia, te kiezen als 5- of 8-daagse reis.", en: "Loop through the Valencia region, available as a 5- or 8-day trip." },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "Goede hotels en karaktervolle finca's met veilige parkeerplek voor de motoren.", en: "Good hotels and characterful fincas with secure motorcycle parking." },
    level: [{ nl: "Uitdagend", en: "Challenging" }, { nl: "Spannend", en: "Exciting" }],
    distance: "TODO_KM",
    season,
    departures: "TODO_DATUM",
    itinerary: [
      {
        day: "1",
        title: { nl: "Aankomst & kennismaking", en: "Arrival & meet-up" },
        text: { nl: "Ontvangst, briefing en gezamenlijk diner.", en: "Welcome, briefing and a shared dinner." },
      },
      {
        day: "2-4",
        title: { nl: "Kust & binnenland", en: "Coast & interior" },
        text: { nl: "Afwisselende dagen langs de Middellandse Zee en door de sierras.", en: "Alternating days along the Mediterranean and through the sierras." },
      },
      {
        day: "5-7",
        title: { nl: "Bergwegen", en: "Mountain roads" },
        text: { nl: "Lange bochten door het Valenciaanse achterland.", en: "Long sweepers through the Valencian hinterland." },
      },
      {
        day: "8",
        title: { nl: "Afsluiting", en: "Finale" },
        text: { nl: "Laatste rit en afscheidsdiner.", en: "Final ride and farewell dinner." },
      },
    ],
    maps: [{ days: 5, image: "itineraries/valencia-5-daagse-reis" }, { days: 8, image: "itineraries/valencia-8-daagse-reis" }],
    gallery: ["photos/riders-mountain","photos/village-stop","photos/accommodation","photos/bbq","photos/coast","photos/campfire"],
  },
  {
    slug: "andalusie",
    published: true,
    forms: ["group", "individual"],
    country: "spain",
    name: { nl: "Zuid-Spanje · Andalusië", en: "Southern Spain · Andalusia" },
    durations: [5,8],
    priceFrom: 1935,
    priceNote,
    image: "photos/riders-mountain",
    short: { nl: "De koninginnenrit van Spanje: Ronda, Córdoba, Granada, de Alpujarras en de Sierra Nevada.", en: "Spain's royal ride: Ronda, Córdoba, Granada, the Alpujarras and the Sierra Nevada." },
    intro: { nl: "De meest complete motorreis door Zuid-Spanje. Van de beroemde wegen rond Ronda via Córdoba en Granada naar de haarspeldbochten van de Alpujarras, met de Sierra Nevada als decor.", en: "The most complete motorcycle tour through southern Spain. From the famous roads around Ronda via Córdoba and Granada to the hairpins of the Alpujarras, with the Sierra Nevada as the backdrop." },
    route: { nl: "Málaga – Zahara de la Sierra – Córdoba – Granada – Alpujarras – Motril – Málaga", en: "Málaga – Zahara de la Sierra – Córdoba – Granada – Alpujarras – Motril – Málaga" },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "Goede hotels en karaktervolle finca's, van historische steden tot bergdorpjes.", en: "Good hotels and characterful fincas, from historic cities to mountain villages." },
    level: [{ nl: "Uitdagend", en: "Challenging" }, { nl: "Spannend", en: "Exciting" }],
    distance: "TODO_KM",
    season,
    departures: "TODO_DATUM",
    itinerary: [
      {
        day: "5",
        variant: true,
        title: { nl: "De 5-daagse route", en: "The 5-day route" },
        text: { nl: "We gaan richting Ronda, een van de beroemdste motorwegen van Spanje: strak asfalt, brede bochten en fantastisch uitzicht. Na een koffiestop in Ronda rijd je via de spectaculaire bergpas Puerto de las Palomas naar Zahara. We trekken naar het noorden, steken de rivier de Guadalquivir over en rijden door het rustige, bochtige natuurpark Sierra de Hornachuelos naar het historische Córdoba. De volgende dag zuidoostwaarts door het hart van de Spaanse olijfolie-productie, glooiend door miljoenen olijfbomen, met de toppen van de Sierra Nevada in zicht en Granada als eindpunt. Daarna de koninginnenrit: de zuidkant van de Sierra Nevada via Trevélez, het hoogste dorp van Spanje, over een technische weg met honderden haarspeldbochten richting kustplaats Motril. De laatste dag start langs de kust richting het oosten met weidse zeezichten, en sluit af met de vloeiende bochten van natuurpark Sierra de Tejeda voor we afzakken naar Málaga.", en: "We head for Ronda, one of Spain's most famous motorcycle roads: tight asphalt, wide corners and fantastic views. After a coffee stop in Ronda you ride the spectacular Puerto de las Palomas pass to Zahara. We head north, cross the Guadalquivir river and ride through the quiet, twisty Sierra de Hornachuelos nature park to historic Córdoba. The next day south-east through the heart of Spain's olive oil production, rolling past millions of olive trees with the Sierra Nevada peaks in sight, ending in Granada. Then the queen's stage: the southern side of the Sierra Nevada via Trevélez, Spain's highest village, on a technical road with hundreds of hairpins down to coastal Motril. The final day starts along the coast with wide sea views and finishes with the flowing corners of the Sierra de Tejeda nature park before descending to Málaga." },
      },
      {
        day: "8",
        variant: true,
        title: { nl: "De 8-daagse route", en: "The 8-day route" },
        text: { nl: "Málaga → Ronda → Arcos de la Frontera → Sevilla → Sierra de Hornachuelos → Córdoba → Sierra de Cazorla → Tabernas → Alpujarras → Granada → Sierra de Tejeda → Nerja → binnenland van Antequera → Málaga. Je trapt direct af richting Ronda op een van Europa's beste motorwegen. Dag 2 dwars door het Grazalema-natuurpark over de Puerto de las Palomas naar sinaasappelstad Sevilla. Dag 3 via de glooiende Sierra de Hornachuelos naar de Mezquita in Córdoba. Dag 4 naar het grootste beschermde natuurgebied van Spanje: de Sierra de Cazorla, via Úbeda en het stuwmeer Embalse del Tranco. Dag 5 is de absolute koningsdag: over de Sierra de los Filabres en de Alto de Velefique naar de gortdroge Tabernas-woestijn. Dag 6 klim je naar de zuidflanken van de Sierra Nevada, door de Alpujarras-vallei langs Trevélez naar Granada. Dag 7 via de achterdeur van Granada het ruige Sierra de Tejeda-gebergte in, afdalend naar de Middellandse Zee en het kuststadje Nerja. De laatste dag duik je het binnenland in richting Antequera, langs het indrukwekkende karstlandschap van El Torcal, en daal je via een laatste serie vloeiende bochten af naar Málaga.", en: "Málaga → Ronda → Arcos de la Frontera → Seville → Sierra de Hornachuelos → Córdoba → Sierra de Cazorla → Tabernas → Alpujarras → Granada → Sierra de Tejeda → Nerja → the Antequera interior → Málaga. You kick off towards Ronda on one of Europe's finest motorcycle roads. Day 2 crosses the Grazalema nature park over the Puerto de las Palomas to the orange city of Seville. Day 3 follows the rolling Sierra de Hornachuelos to the Mezquita in Córdoba. Day 4 heads into Spain's largest protected nature area: the Sierra de Cazorla, via Úbeda and the Embalse del Tranco reservoir. Day 5 is the ultimate king's stage: across the Sierra de los Filabres and the Alto de Velefique into the bone-dry Tabernas desert. Day 6 climbs the southern flanks of the Sierra Nevada through the Alpujarras valley past Trevélez to Granada. Day 7 enters the rugged Sierra de Tejeda via Granada's back door, descending to the Mediterranean and the coastal town of Nerja. The final day dives inland towards Antequera, past the impressive karst landscape of El Torcal, before one last series of flowing corners down to Málaga." },
      },
    ],
    maps: [{ days: 5, image: "itineraries/andalusie-5-daagse-reis" }, { days: 8, image: "itineraries/andalusie-8-daagse-reis" }],
    gallery: ["photos/riders-mountain","photos/village-stop","photos/accommodation","photos/bbq","photos/coast","photos/campfire"],
  },
  {
    slug: "castilie-la-mancha",
    published: true,
    forms: ["group", "individual"],
    country: "spain",
    name: { nl: "Centraal Spanje · Sevilla, Extremadura & Castilië", en: "Central Spain · Seville, Extremadura & Castile" },
    durations: [5,8],
    priceFrom: 1650,
    priceNote,
    image: "photos/sunset",
    short: { nl: "Een loop door het hart van Zuid- en Centraal-Spanje vanuit Sevilla: Sierra Morena, Extremadura, de middeleeuwse steden Cáceres en Mérida en de ongerepte bergen van Castilië.", en: "A loop through the heart of southern and central Spain from Seville: Sierra Morena, Extremadura, the medieval cities of Cáceres and Mérida and the unspoilt mountains of Castile." },
    intro: { nl: "Een groepsreis die start in het zwoele Sevilla en het binnenland van Spanje verkent. We rijden door de Sierra Morena, de regio Extremadura en, in de 8-daagse versie, verder naar de bergen van Castilië en León. Een afwisselende rit met lege wegen, historische steden en technisch bochtig asfalt.", en: "A group tour starting in sultry Seville and exploring Spain's interior. We ride through the Sierra Morena, the Extremadura region and, on the 8-day version, onwards into the mountains of Castile and León. A varied ride with empty roads, historic cities and technically twisty asphalt." },
    route: { nl: "Sevilla – Sierra Morena – Aracena – Zafra – Sierra de Guadalupe – Trujillo – Cáceres – Mérida – Sevilla (5 dagen) of Sevilla – Aracena – Zafra – Cáceres – Valle del Jerte – Sierra de Gredos – Sierra de Francia – Los Arribes del Duero – Ciudad Rodrigo – Sierra de Gata – Trujillo – Guadalupe – Sevilla (8 dagen)", en: "Seville – Sierra Morena – Aracena – Zafra – Sierra de Guadalupe – Trujillo – Cáceres – Mérida – Seville (5 days) or Seville – Aracena – Zafra – Cáceres – Valle del Jerte – Sierra de Gredos – Sierra de Francia – Los Arribes del Duero – Ciudad Rodrigo – Sierra de Gata – Trujillo – Guadalupe – Seville (8 days)" },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "Goede hotels en karaktervolle finca's met veilige parkeerplek voor de motoren.", en: "Good hotels and characterful fincas with secure motorcycle parking." },
    level: [{ nl: "Uitdagend", en: "Challenging" }, { nl: "Spannend", en: "Exciting" }],
    distance: { nl: "± 1.200 km (5-daagse route)", en: "± 1,200 km (5-day route)" },
    season,
    departures: "TODO_DATUM",
    itinerary: [
      {
        day: "5",
        variant: true,
        title: { nl: "De 5-daagse route", en: "The 5-day route" },
        text: { nl: "We starten in het zwoele Sevilla en trekken direct naar het noorden. Vervolgens rijden we de Sierra Morena in. De weg naar Cazalla de la Sierra staat bekend om zijn scherpe bochten en schaduwrijke kurkeikbossen. Vervolgens sturen we in westelijke richting over de Aracena. Een bezoek aan de Gruta de las Maravillas (grotten) in Aracena en genieten van de beroemde Pata Negra-ham is een absolute must.\n\nDe volgende dag verlaten we Andalusië en rijden we de regio Extremadura binnen via de Sierra Suroeste. De weg naar Jerez de los Caballeros is een droom voor motorrijders: rustig asfalt, lange overzichtelijke bochten en glooiende heuvels. We eindigen in Zafra, ook wel bekend als 'Klein Sevilla' vanwege de witte straatjes en het indrukwekkende Alcázar.\n\nDag 3, de langste en meest uitdagende stuurdag. We verlaten Zafra in noordoostelijke richting richting de ruige Sierra de Guadalupe. De weg omhoog naar het bergstadje Guadalupe is technisch en bochtig, met spectaculaire uitzichten. Na een stop bij het indrukwekkende koninklijke klooster rijden we over snellere, open wegen door naar het middeleeuwse Trujillo.\n\nDe daaropvolgende dag hebben we een kortere etappe met veel cultuur, zodat we tijd hebben om eventueel de steden te verkennen. We rijden via de kronkelige weg naar Cáceres (een ommuurde UNESCO-werelderfgoedstad). Vanaf Cáceres pakken we de schilderachtige secundaire weg richting het zuiden naar Mérida. Stal de motor en bekijk het gigantische Romeinse theater en het aquaduct in Mérida.\n\nDe laatste dag, om de reis in stijl af te sluiten, mijden we de snelweg terug naar het zuiden. We nemen de weg richting Llerena. Vanaf daar steken we via de adembenemende bergpistes en de Rivera del Huéznar de Sierra Morena weer over. We finishen de 1200 kilometer met een vloeiende afdaling richting de vlakte van Sevilla.", en: "We start in sultry Seville and head straight north. Then we ride into the Sierra Morena. The road to Cazalla de la Sierra is known for its sharp bends and shady cork oak forests. Next we steer west towards Aracena. A visit to the Gruta de las Maravillas caves in Aracena and tasting the famous Pata Negra ham is an absolute must.\n\nThe next day we leave Andalusia and enter the Extremadura region via the Sierra Suroeste. The road to Jerez de los Caballeros is a motorcyclist's dream: quiet asphalt, long sweeping bends and rolling hills. We end in Zafra, also known as 'Little Seville' because of its white streets and impressive Alcázar.\n\nDay 3 is the longest and most challenging riding day. We leave Zafra heading north-east towards the rugged Sierra de Guadalupe. The climb up to the mountain village of Guadalupe is technical and twisty, with spectacular views. After a stop at the impressive royal monastery we continue on faster, open roads to medieval Trujillo.\n\nThe following day we have a shorter stage with plenty of culture, so we have time to explore the cities. We ride the winding road to Cáceres (a walled UNESCO World Heritage city). From Cáceres we take the picturesque secondary road south to Mérida. Park the bike and see the giant Roman theatre and aqueduct in Mérida.\n\nOn the final day, to round off the trip in style, we avoid the motorway back south. We take the road towards Llerena. From there we cross the Sierra Morena again via breathtaking mountain tracks and the Rivera del Huéznar. We finish the 1,200 kilometres with a flowing descent towards the plain of Seville." },
      },
      {
        day: "8",
        variant: true,
        title: { nl: "De 8-daagse route", en: "The 8-day route" },
        text: { nl: "Op dag 1 verlaten we Sevilla in noordwestelijke richting. De reis begint direct goed op de N-433, een van de favoriete weekendwegen voor lokale motorrijders. We slingeren door het groene hart van de Sierra de Aracena en rijden via rustige, glooiende provinciale wegen Extremadura binnen naar het witte stadje Zafra.\n\nDe 2e dag rijden we via de rustige EX-105 richting het historische Mérida. Na een koffiestop bij het Romeinse aquaduct vervolg je de route door het weidse binnenland. Je mijdt de snelweg en pakt de golvende secundaire wegen via Alcuéscar om te eindigen in de perfect bewaarde middeleeuwse binnenstad van Cáceres.\n\nDe dag daarna brengt de etappe ons richting het échte hooggebergte. We passeren Plasencia en rijden de prachtige Valle del Jerte (bekend om de kersenbloesem) in. Via vloeiende bochten klimmen we omhoog over de Puerto de Tornavacas om de regio Castilië en León binnen te rijden, tot aan de zuidvoet van de gigantische Sierra de Gredos.\n\nOp dag 4 hebben we een absolute topdag voor liefhebbers van het scherpere stuurwerk. We trotseren de Puerto del Pico, een pas met fantastische haarspeldbochten en perfect asfalt. We rijden over de hoogvlaktes langs de grillige granieten toppen van Gredos en dalen via de uitdagende bergwegen van de Sierra de Francia af naar het historische textielstadje Béjar.\n\nDag 5, we zoeken de grens met Portugal op. De route voert ons naar Los Arribes del Duero, een nationaal park waar de rivier de Duero een diepe, spectaculaire kloof in de rotsen heeft uitgesleten. De wegen hier zijn spectaculair, rustig en bieden weidse uitzichten over de grens. We overnachten in de vestingstad Ciudad Rodrigo.\n\nOp dag 6 zakken we weer af naar het zuiden via de Sierra de Gata. Dit is een van de meest geïsoleerde en ongerepte berggebieden van Spanje, met smalle wegen en dichte dennenbossen. Eenmaal de bergen uit veranderen de wegen in lange, overzichtelijke bochten die ons vlot naar het indrukwekkende conquistadores-stadje Trujillo brengen.\n\nDe een na laatste dag, vandaag staat de Sierra de Guadalupe centraal. De EX-102 richting het bergklooster van Guadalupe is een droom van een motorweg: vloeiend, uitstekend asfalt en prachtig landschap. Na Guadalupe rijd je via de weidse, snellere stuurwegen van de Siberia Extremeña door naar het zuiden van Extremadura (Llerena).\n\nDe laatste dag, we steken de grens met Andalusië weer over en duiken de Sierra Morena in. Via de legendarische motorweg van Cazalla de la Sierra (de A-432) rijden we de laatste honderden bochten van de reis. De weg daalt uiteindelijk spectaculair af uit de bergen, waarna we met een voldaan gevoel weer de palmbomen van Sevilla binnen rijden.", en: "On day 1 we leave Seville heading north-west. The trip starts well on the N-433, one of the favourite weekend roads for local motorcyclists. We wind through the green heart of the Sierra de Aracena and ride into Extremadura on quiet, rolling provincial roads to the white town of Zafra.\n\nDay 2 takes us via the quiet EX-105 towards historic Mérida. After a coffee stop at the Roman aqueduct you continue through the wide interior. Avoiding the motorway, you take the rolling secondary roads via Alcuéscar to end in the perfectly preserved medieval old town of Cáceres.\n\nThe next day the stage takes us towards the real high mountains. We pass Plasencia and enter the beautiful Valle del Jerte (known for its cherry blossom). Via flowing bends we climb up over the Puerto de Tornavacas to enter the region of Castile and León, reaching the southern foot of the giant Sierra de Gredos.\n\nDay 4 is an absolute highlight for fans of sharper riding. We tackle the Puerto del Pico, a pass with fantastic hairpins and perfect asphalt. We ride across the high plateaus past the rugged granite peaks of Gredos and descend via the challenging mountain roads of the Sierra de Francia to the historic textile town of Béjar.\n\nDay 5 we head for the Portuguese border. The route takes us to Los Arribes del Duero, a national park where the Duero river has carved a deep, spectacular gorge into the rocks. The roads here are spectacular, quiet and offer wide views across the border. We spend the night in the fortified town of Ciudad Rodrigo.\n\nOn day 6 we descend south again via the Sierra de Gata. This is one of Spain's most isolated and unspoilt mountain areas, with narrow roads and dense pine forests. Once out of the mountains the roads become long, sweeping bends that take us quickly to the impressive conquistador town of Trujillo.\n\nThe penultimate day is centred on the Sierra de Guadalupe. The EX-102 towards the mountain monastery of Guadalupe is a dream motorcycle road: flowing, excellent asphalt and beautiful scenery. After Guadalupe you ride via the wide, faster twisty roads of the Siberia Extremeña southwards through Extremadura to Llerena.\n\nOn the final day we cross back into Andalusia and dive into the Sierra Morena. Via the legendary motorcycling road from Cazalla de la Sierra (the A-432) we ride the last hundreds of bends of the trip. The road eventually descends spectacularly from the mountains, after which we ride back into the palm trees of Seville with a satisfied feeling." },
      },
    ],
    maps: [{ days: 5, image: "itineraries/extremadura-5-daagse-reis" }, { days: 8, image: "itineraries/extremadura-8-daagse-reis" }],
    gallery: ["photos/riders-mountain","photos/village-stop","photos/accommodation","photos/bbq","photos/coast","photos/campfire"],
  },
  {
    slug: "rif-atlas-marrakech",
    published: true,
    forms: ["group", "individual"],
    country: "morocco",
    name: { nl: "Rif & Atlas tot Marrakech", en: "Rif & Atlas to Marrakech" },
    durations: [8],
    priceFrom: 2375,
    priceNote,
    image: "photos/hero-road",
    short: { nl: "Van het Rifgebergte over de Hoge Atlas, met Marrakech als zuidelijkste punt.", en: "From the Rif mountains across the High Atlas, with Marrakech as the southernmost point." },
    intro: { nl: "De grote Marokko-reis: van de groene heuvels van het Rifgebergte naar de hoge passen van de Atlas, met de sfeer en het kleurrijke chaos van Marrakech als hoogtepunt.", en: "The grand Morocco tour: from the green hills of the Rif mountains to the high passes of the Atlas, with the atmosphere and colourful buzz of Marrakech as the highlight." },
    route: { nl: "Rondrit door Noord- en Midden-Marokko, met Marrakech als zuidelijkste plaats.", en: "Loop through northern and central Morocco, with Marrakech as the southernmost stop." },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "Sfeervolle riads en goede hotels, zorgvuldig gekozen op sfeer en ligging.", en: "Atmospheric riads and good hotels, carefully chosen for character and location." },
    level: [{ nl: "Uitdagend", en: "Challenging" }, { nl: "Spannend", en: "Exciting" }],
    distance: "TODO_KM",
    season,
    departures: "TODO_DATUM",
    itinerary: [
      {
        day: "1-2",
        title: { nl: "Aankomst & Rifgebergte", en: "Arrival & Rif mountains" },
        text: { nl: "Kennismaking en de eerste bochtige kilometers door het Rifgebergte.", en: "Meet-up and the first twisty kilometres through the Rif mountains." },
      },
      {
        day: "3-5",
        title: { nl: "Midden-Atlas", en: "Middle Atlas" },
        text: { nl: "Cederbossen, hoogvlaktes en lange bochten.", en: "Cedar forests, high plateaus and long corners." },
      },
      {
        day: "6-7",
        title: { nl: "Hoge Atlas & Marrakech", en: "High Atlas & Marrakech" },
        text: { nl: "Over de passen naar het zuidelijkste punt van de reis.", en: "Across the passes to the southernmost point of the trip." },
      },
      {
        day: "8",
        title: { nl: "Terugreis", en: "Return" },
        text: { nl: "Laatste rit en afscheidsdiner.", en: "Final ride and farewell dinner." },
      },
    ],
    maps: [],
    gallery: ["photos/morocco-desert","photos/dune-road","photos/hero-road","photos/campfire","photos/bbq","photos/accommodation"],
  },
  {
    slug: "noord-midden-marokko",
    published: true,
    forms: ["group", "individual"],
    country: "morocco",
    name: { nl: "Noord- & Midden-Marokko", en: "Northern & Central Morocco" },
    durations: [8],
    priceFrom: 2125,
    priceNote,
    image: "photos/morocco-desert",
    short: { nl: "Kennismaking met Marokko: Rifgebergte, keizersteden en de eerste uitlopers van de Atlas.", en: "Discover Morocco: the Rif mountains, imperial cities and the first foothills of the Atlas." },
    intro: { nl: "De ideale eerste Marokko-reis. Acht dagen door het noorden en midden van het land, met een perfecte mix van bergwegen, cultuur en Marokkaanse gastvrijheid.", en: "The ideal first Morocco tour. Eight days through the north and centre of the country, with a perfect mix of mountain roads, culture and Moroccan hospitality." },
    route: { nl: "Rondrit door Noord- en Midden-Marokko.", en: "Loop through northern and central Morocco." },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "Sfeervolle riads en goede hotels, zorgvuldig gekozen op sfeer en ligging.", en: "Atmospheric riads and good hotels, carefully chosen for character and location." },
    level: [{ nl: "Uitdagend", en: "Challenging" }, { nl: "Spannend", en: "Exciting" }],
    distance: "TODO_KM",
    season,
    departures: "TODO_DATUM",
    itinerary: [
      {
        day: "1-2",
        title: { nl: "Aankomst & het noorden", en: "Arrival & the north" },
        text: { nl: "Kennismaking en de eerste rit door het groene noorden.", en: "Meet-up and a first ride through the green north." },
      },
      {
        day: "3-5",
        title: { nl: "Rif & keizersteden", en: "Rif & imperial cities" },
        text: { nl: "Bergwegen, medina's en Marokkaanse keuken.", en: "Mountain roads, medinas and Moroccan cuisine." },
      },
      {
        day: "6-7",
        title: { nl: "Midden-Atlas", en: "Middle Atlas" },
        text: { nl: "Hoogvlaktes en eindeloze bochten.", en: "High plateaus and endless corners." },
      },
      {
        day: "8",
        title: { nl: "Terugreis", en: "Return" },
        text: { nl: "Laatste rit en afscheidsdiner.", en: "Final ride and farewell dinner." },
      },
    ],
    maps: [],
    gallery: ["photos/morocco-desert","photos/dune-road","photos/hero-road","photos/campfire","photos/bbq","photos/accommodation"],
  },
  {
    slug: "sahara-route",
    published: true,
    forms: ["group", "individual"],
    country: "morocco",
    name: { nl: "Sahara-route", en: "Sahara route" },
    durations: [8],
    priceFrom: 2550,
    priceNote,
    image: "photos/dune-road",
    short: { nl: "De meest avontuurlijke reis: over de Atlas naar de duinen van de Sahara.", en: "The most adventurous tour: across the Atlas to the dunes of the Sahara." },
    intro: { nl: "Acht dagen richting het zuiden. Hoge bergpassen, kloven, kasbahs en uiteindelijk de duinen van de Sahara, inclusief een onvergetelijke avond onder de sterrenhemel.", en: "Eight days heading south. High mountain passes, gorges, kasbahs and finally the dunes of the Sahara, including an unforgettable evening under the stars." },
    route: { nl: "Rondrit vanuit het noorden over de Atlas naar de rand van de Sahara.", en: "Loop from the north across the Atlas to the edge of the Sahara." },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "Riads, kasbah-hotels en een sfeervol kamp aan de rand van de woestijn.", en: "Riads, kasbah hotels and an atmospheric camp at the edge of the desert." },
    level: [{ nl: "Uitdagend", en: "Challenging" }, { nl: "Spannend", en: "Exciting" }],
    distance: "TODO_KM",
    season,
    departures: "TODO_DATUM",
    itinerary: [
      {
        day: "1-2",
        title: { nl: "Aankomst & Atlas", en: "Arrival & Atlas" },
        text: { nl: "Kennismaking en de eerste grote passen.", en: "Meet-up and the first big passes." },
      },
      {
        day: "3-5",
        title: { nl: "Kloven & kasbahs", en: "Gorges & kasbahs" },
        text: { nl: "Indrukwekkende kloven en oude lemen forten.", en: "Impressive gorges and ancient mud-brick forts." },
      },
      {
        day: "6-7",
        title: { nl: "Sahara", en: "Sahara" },
        text: { nl: "Duinen, kampvuur en een sterrenhemel die je nooit vergeet.", en: "Dunes, campfire and a starry sky you'll never forget." },
      },
      {
        day: "8",
        title: { nl: "Terugreis", en: "Return" },
        text: { nl: "Laatste rit en afscheidsdiner.", en: "Final ride and farewell dinner." },
      },
    ],
    maps: [],
    gallery: ["photos/morocco-desert","photos/dune-road","photos/hero-road","photos/campfire","photos/bbq","photos/accommodation"],
  },
  /**
   * EXAMPLE tailor-made trip (not published). Fill in the TODO values and set
   * published: true to show it on the "Op maat" page as an inspiration route.
   */
  {
    slug: "voorbeeld-op-maat",
    published: false,
    forms: ["tailor-made"],
    country: "spain",
    name: { nl: "TODO_NAAM voorbeeldreis op maat", en: "TODO_NAME example tailor-made tour" },
    durations: [5],
    priceFrom: "TODO_PRIJS",
    priceNote,
    image: "photos/group-ride",
    short: { nl: "TODO_TEKST", en: "TODO_TEXT" },
    intro: { nl: "TODO_TEKST", en: "TODO_TEXT" },
    route: { nl: "TODO_ROUTE", en: "TODO_ROUTE" },
    characteristics,
    included,
    excluded,
    accommodation: { nl: "TODO_TEKST", en: "TODO_TEXT" },
    level: [],
    distance: "TODO_KM",
    season,
    departures: "TODO_DATUM",
    itinerary: [],
    maps: [],
    gallery: ["photos/group-ride"],
  },
];

export const publishedTrips = trips.filter((t) => t.published);
export const tripsByForm = (form: TripForm) => publishedTrips.filter((t) => t.forms.includes(form));
export const getTrip = (slug: string) => publishedTrips.find((t) => t.slug === slug);
export const tripsByCountry = (country: Country) => publishedTrips.filter((t) => t.country === country);
