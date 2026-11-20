import { z } from "zod";
import type { Dict } from "@/i18n/nl";

export const TRIP_FORMS = ["group", "individual", "tailor-made"] as const;
export const COUNTRIES = ["Spain", "Morocco"] as const;
export const REGIONS = {
  Spain: ["north", "south", "east"],
  Morocco: ["north", "south"],
} as const;
export const BIKE = ["own", "rent", "undecided"] as const;
export const EXPERIENCE = ["lt2", "2to5", "5to10", "gt10"] as const;
export const CONTACT_PREF = ["email", "phone", "whatsapp"] as const;

export function planSchema(t: Dict) {
  const e = t.plan.errors;
  return z
    .object({
      // step 1
      reisvorm: z.enum(TRIP_FORMS, { errorMap: () => ({ message: e.tripForm }) }),
      reis: z.string().max(80),
      // step 2
      land: z.enum(COUNTRIES, { errorMap: () => ({ message: e.destination }) }),
      regio: z.string().max(40),
      reisperiode: z.string().trim().max(120, e.tooLong),
      reis_start: z.string().max(10),
      reis_eind: z.string().max(10),
      aantal_rijders: z.coerce.number({ invalid_type_error: e.riders }).int().min(1, e.riders).max(50, e.ridersMax),
      aantal_duo: z.coerce.number({ invalid_type_error: e.passengers }).int().min(0, e.passengers).max(50, e.passengers),
      // step 3
      motor: z.enum(BIKE),
      transport_motor: z.boolean(),
      accommodatie: z.boolean(),
      ervaring: z.enum(EXPERIENCE, { errorMap: () => ({ message: e.experience }) }),
      wensen: z.string().max(2000, e.tooLong),
      // step 4
      naam: z.string().trim().min(2, e.name).max(100, e.tooLong),
      email: z.string().trim().email(e.email).max(255, e.tooLong),
      telefoon: z
        .string()
        .trim()
        .min(6, e.phone)
        .max(30, e.phone)
        .regex(/^[+()\d\s.-]+$/, e.phone),
      contact_voorkeur: z.enum(CONTACT_PREF),
      privacy: z.literal(true, { errorMap: () => ({ message: e.privacy }) }),
      // honeypot
      website: z.string().optional(),
    })
    .superRefine((v, ctx) => {
      if (v.reis_start && v.reis_eind && v.reis_eind < v.reis_start) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["reis_eind"], message: e.endBeforeStart });
      }
    });
}

export type PlanValues = z.infer<ReturnType<typeof planSchema>>;

export const STEP_FIELDS: (keyof PlanValues)[][] = [
  ["reisvorm", "reis"],
  ["land", "regio", "reisperiode", "reis_start", "reis_eind", "aantal_rijders", "aantal_duo"],
  ["motor", "transport_motor", "accommodatie", "ervaring", "wensen"],
  ["naam", "email", "telefoon", "contact_voorkeur", "privacy"],
];

export const planDefaults = {
  reisvorm: undefined as unknown as PlanValues["reisvorm"],
  reis: "",
  land: "Spain" as PlanValues["land"],
  regio: "",
  reisperiode: "",
  reis_start: "",
  reis_eind: "",
  aantal_rijders: 1,
  aantal_duo: 0,
  motor: "own" as PlanValues["motor"],
  transport_motor: false,
  accommodatie: true,
  ervaring: undefined as unknown as PlanValues["ervaring"],
  wensen: "",
  naam: "",
  email: "",
  telefoon: "",
  contact_voorkeur: "email" as PlanValues["contact_voorkeur"],
  privacy: false as unknown as true,
  website: "",
};
