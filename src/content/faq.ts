/**
 * FAQ – grouped by category. Answers come from the previous website.
 * Add a question: copy an object inside `items` and fill in nl + en.
 */
import type { Localized } from "./types";

export interface FaqItem {
  id: string;
  q: Localized;
  a: Localized;
}

export interface FaqCategory {
  id: string;
  title: Localized;
  items: FaqItem[];
}

export const faq: FaqCategory[] = [
  {
    id: "reizen",
    title: { nl: "Reizen", en: "Tours" },
    items: [
      {
        id: "inbegrepen",
        q: { nl: "Wat is inbegrepen bij de reis?", en: "What's included in the trip?" },
        a: {
          nl: "Standaard: sfeervolle accommodaties, diners (inclusief BBQ-avonden) en routebegeleiding. Vluchten, brandstof en lunch zijn optioneel bij te boeken, jij kiest wat je wilt.",
          en: "Standard: atmospheric accommodations, dinners (including BBQ nights) and route support. Flights, fuel and lunch are optional add-ons, you choose what you want.",
        },
      },
      {
        id: "groepsgrootte",
        q: { nl: "Hoe groot zijn de groepen?", en: "How large are the groups?" },
        a: { nl: "Minimaal 4, maximaal 10 motorrijders.", en: "Minimum 4, maximum 10 riders." },
      },
      {
        id: "alleen",
        q: { nl: "Kan ik alleen meerijden?", en: "Can I join solo?" },
        a: {
          nl: "Ja, veel motorrijders rijden alleen mee. De groepen zijn klein en door de gezamenlijke diners heb je vanaf dag één contact.",
          en: "Yes, plenty of riders join on their own. Groups are small and the shared dinners make it easy to connect from day one.",
        },
      },
      {
        id: "passagier",
        q: { nl: "Kan er een passagier mee?", en: "Can a passenger come along?" },
        a: {
          nl: "Natuurlijk. Duo rijden is geen probleem. Geef het aan in het formulier.",
          en: "Of course. Riding two-up is no problem. Let us know in the form.",
        },
      },
      {
        id: "reisperiode",
        q: { nl: "Wat is de beste reisperiode?", en: "When is the best time to go?" },
        a: { nl: "Spanje en Marokko: oktober t/m mei.", en: "Spain and Morocco: October through May." },
      },
      {
        id: "prive",
        q: { nl: "Organiseren jullie ook privéreizen?", en: "Do you also organise private group trips?" },
        a: {
          nl: "Ja. Rijden met je eigen club of vriendengroep kan. Geef je groepsgrootte door, dan doen wij jullie een reisvoorstel.",
          en: "Yes. Riding with your own club or group of friends is possible. Share your group size and we'll send you a trip proposal.",
        },
      },
      {
        id: "na-aanvraag",
        q: { nl: "Wat gebeurt er nadat ik een aanvraag stuur?", en: "What happens after I send a request?" },
        a: {
          nl: "Binnen 24 uur nemen we persoonlijk contact op. We bespreken je wensen, wat mogelijk is en de planning. Pas als alles klopt gaan we verder, 100% vrijblijvend.",
          en: "Within 24 hours we get in touch personally. We discuss your wishes, what's possible and the planning. Only when everything fits do we move on, 100% no obligation.",
        },
      },
    ],
  },
  {
    id: "motor",
    title: { nl: "Motor & rijbewijs", en: "Motorcycle & licence" },
    items: [
      {
        id: "eigen-motor",
        q: { nl: "Kan ik mijn eigen motor meenemen?", en: "Can I bring my own motorcycle?" },
        a: {
          nl: "Zeker. Neem je eigen motor mee of wij regelen een lokale huurmotor. We kunnen ook het transport van je motor naar Spanje of Marokko organiseren.",
          en: "Absolutely. Bring your own bike or we'll arrange a local rental. We can also organise transport of your motorcycle to Spain or Morocco.",
        },
      },
      {
        id: "type-motor",
        q: { nl: "Wat voor motor heb ik nodig?", en: "What type of motorcycle do I need?" },
        a: {
          nl: "Elke goed onderhouden toer-, allroad- of naked bike voldoet. Voor het zuiden van Marokko adviseren we een allroad-motor.",
          en: "Any well-maintained touring, all-road or naked bike works. For southern Morocco we recommend an all-road motorcycle.",
        },
      },
      {
        id: "pech",
        q: { nl: "Hoe zit het met verzekering en pech?", en: "What about insurance and breakdowns?" },
        a: {
          nl: "Je regelt zelf je reis- en pechhulpverzekering. Onderweg helpen we je met lokale garages en praktische ondersteuning. En mocht er iets met je motor zijn, dan hebben wij altijd een reservemotor mee, zodat je je reis gewoon kunt vervolgen.",
          en: "You arrange your own travel and breakdown insurance. On the road we help you with local garages and practical support. And should something happen to your motorcycle, we always carry a spare bike so you can continue your trip.",
        },
      },
    ],
  },
  {
    id: "niveau",
    title: { nl: "Niveau", en: "Riding level" },
    items: [
      {
        id: "ervaren",
        q: { nl: "Moet ik een ervaren motorrijder zijn?", en: "Do I need to be an experienced rider?" },
        a: {
          nl: "Onze reizen zijn bedoeld voor alle toermotorrijders. Twijfel je? Neem contact op, dan bespreken we wat bij je past.",
          en: "Our trips are meant for all touring riders. Not sure? Get in touch and we'll discuss what suits you.",
        },
      },
      {
        id: "kilometers",
        q: { nl: "Hoeveel kilometer rijden we per dag?", en: "How many kilometres do we ride per day?" },
        a: {
          nl: "Gemiddeld 200 tot 350 km per dag, met voldoende stops. Het tempo is ontspannen: we rijden om te genieten, niet om te racen.",
          en: "On average 200 to 350 km per day, with plenty of stops. The pace is relaxed: we ride to enjoy, not to race.",
        },
      },
    ],
  },
  {
    id: "accommodatie",
    title: { nl: "Accommodatie", en: "Accommodation" },
    items: [
      {
        id: "overnachten",
        q: { nl: "Waar overnachten we?", en: "Where do we stay?" },
        a: {
          nl: "Op zorgvuldig gekozen locaties: goede hotels en karaktervolle finca's in Spanje, sfeervolle riads en kasbah-hotels in Marokko, en soms een glamping. Waar nodig met een veilige parkeerplek voor de motoren.",
          en: "At carefully chosen locations: good hotels and characterful fincas in Spain, atmospheric riads and kasbah hotels in Morocco, and sometimes a glamping. Where needed with secure motorcycle parking.",
        },
      },
      {
        id: "bagage",
        q: { nl: "Wordt mijn bagage vervoerd?", en: "Is my luggage carried for me?" },
        a: {
          nl: "Ja, in alle gevallen door een volgwagen. Voordat je op de verblijfplaats aankomt, staat de bus met je bagage er al.",
          en: "Yes, in all cases by a support vehicle. Before you arrive at the overnight location, the van with your luggage is already there.",
        },
      },
    ],
  },
  {
    id: "betalen",
    title: { nl: "Betalen & garantie", en: "Payment & guarantee" },
    items: [
      {
        id: "betalen",
        q: { nl: "Hoe betaal ik en wanneer staat het vast?", en: "How do I pay and when is it final?" },
        a: {
          nl: "Pas na een persoonlijk gesprek sturen wij een voorstel. Niets staat vast tot dat jij hebt bevestigd en de aanbetaling hebt betaald.",
          en: "Only after a personal conversation do we send a proposal. Nothing is final until you have confirmed and paid the deposit.",
        },
      },
      {
        id: "garantie",
        q: { nl: "Is mijn reissom beschermd?", en: "Is my payment protected?" },
        a: {
          nl: "Ja. Crossing of Limits is aangesloten bij STO Garant, een door de ACM erkende garantieregeling. Als de garantie op je boeking van toepassing is, betaal je de reissom aan de derdengeldenrekening van Stichting Derdengelden Certo Escrow. Die waarborgt je reissom tot na afloop van je reis.",
          en: "Yes. Crossing of Limits participates in STO Garant, a guarantee scheme recognised by the Dutch ACM. If the guarantee applies to your booking, you pay the travel sum into the escrow account of Stichting Derdengelden Certo Escrow, which safeguards your money until after your trip.",
        },
      },
    ],
  },
];

export const allFaqItems = faq.flatMap((c) => c.items);
