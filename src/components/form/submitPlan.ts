import { en } from "@/i18n/en";
import { nl } from "@/i18n/nl";
import type { Lang } from "@/lib/routes";
import { aanvragenExtended, getSupabase, notifyFunction } from "@/lib/supabase";
import { getTrip } from "@/content/trips";
import type { PlanValues } from "./planSchema";

/**
 * Maps the form to the existing `aanvragen` table.
 *
 * Existing columns (from the previous site): naam, email, telefoon, land, regio,
 * reisperiode, reis_start, reis_eind, taal, aantal_personen, eigen_motor,
 * transport_motor, accommodatie, opmerkingen.
 *
 * New fields (reisvorm, gekozen reis, rijders/duo, rijervaring, contactvoorkeur)
 * are written to their own columns once the migration has run
 * (VITE_AANVRAGEN_EXTENDED=true). Until then they are added to `opmerkingen`
 * so no information is lost and the existing admin keeps working.
 */
export function buildAanvraagRow(v: PlanValues, lang: Lang): Record<string, unknown> {
  const trip = v.reis ? getTrip(v.reis) : undefined;
  const regionKey = v.regio as "north" | "south" | "east" | "";
  const countryKey = v.land === "Spain" ? "spain" : "morocco";
  const regionLabels = en.plan.regionOptions[countryKey] as Record<string, string>;
  const regio = trip ? trip.name.en : regionKey ? regionLabels[regionKey] ?? null : null;

  const nlFields = nl.plan.fields;
  const extras = [
    `${nl.plan.steps.form}: ${nl.plan.tripFormOptions[v.reisvorm].title}`,
    trip ? `${nl.trip.route}: ${trip.name.nl} (${trip.slug})` : null,
    `${nlFields.riders}: ${v.aantal_rijders} · ${nlFields.passengers}: ${v.aantal_duo}`,
    `${nlFields.bike}: ${{ own: nlFields.bikeOwn, rent: nlFields.bikeRent, undecided: nlFields.bikeUndecided }[v.motor]}`,
    `${nlFields.experience}: ${nlFields.experienceOptions[v.ervaring]}`,
    `${nlFields.contactPref}: ${nlFields.contactPrefOptions[v.contact_voorkeur]}`,
  ].filter(Boolean);

  const base = {
    naam: v.naam,
    email: v.email,
    telefoon: v.telefoon,
    land: v.land,
    regio,
    reisperiode: v.reisperiode || null,
    reis_start: v.reis_start || null,
    reis_eind: v.reis_eind || v.reis_start || null,
    taal: lang,
    aantal_personen: v.aantal_rijders + v.aantal_duo,
    eigen_motor: v.motor === "own",
    transport_motor: v.motor === "own" && v.transport_motor,
    accommodatie: v.accommodatie,
  };

  if (aanvragenExtended) {
    return {
      ...base,
      opmerkingen: v.wensen || null,
      reisvorm: v.reisvorm,
      reis_slug: trip?.slug ?? null,
      aantal_rijders: v.aantal_rijders,
      aantal_duo: v.aantal_duo,
      motor_keuze: v.motor,
      rijervaring: v.ervaring,
      contact_voorkeur: v.contact_voorkeur,
      privacy_akkoord: true,
    };
  }
  const opmerkingen = [v.wensen.trim(), `— Aanvraagdetails —\n${extras.join("\n")}`].filter(Boolean).join("\n\n");
  return { ...base, opmerkingen };
}

export async function submitPlan(v: PlanValues, lang: Lang) {
  const row = buildAanvraagRow(v, lang);
  const supabase = await getSupabase();
  const { error } = await supabase.from("aanvragen").insert(row);
  if (error) throw error;
  if (notifyFunction) {
    // Best effort: the request is saved even if the e-mail notification fails.
    supabase.functions.invoke(notifyFunction, { body: row }).catch((e: unknown) => console.warn("notify failed", e));
  }
  return row;
}
