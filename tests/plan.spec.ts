import { expect, test } from "@playwright/test";
import { hideCookieBanner, mockSupabase, waitHuman } from "./helpers";

test.beforeEach(async ({ page }) => hideCookieBanner(page));

test("plan form: all steps, validation, Supabase insert and confirmation", async ({ page }) => {
  const inserts = await mockSupabase(page, "aanvragen");
  await page.goto("/plan");
  await expect(page.getByText("Stap 1 van 4")).toBeVisible();

  // Step 1 validation
  await page.getByRole("button", { name: "Volgende" }).click();
  await expect(page.getByText("Kies een reisvorm")).toBeVisible();
  await page.getByText("Groepsreis", { exact: true }).click();
  await page.getByLabel("Heb je al een reis op het oog?").selectOption("sahara-route");
  await page.getByRole("button", { name: "Volgende" }).click();

  // Step 2: country follows the chosen trip
  await expect(page.getByText("Stap 2 van 4")).toBeVisible();
  await expect(page.getByLabel("Marokko")).toBeChecked();
  await page.getByLabel("Gewenste periode").fill("Oktober 2027");
  await page.getByLabel("Vroegste vertrekdatum").fill("2027-10-10");
  await page.getByLabel("Uiterste terugkomstdatum").fill("2027-10-01");
  await page.getByRole("button", { name: "Volgende" }).click();
  await expect(page.getByText("De terugkomstdatum ligt vóór de vertrekdatum")).toBeVisible();
  await page.getByLabel("Uiterste terugkomstdatum").fill("2027-10-18");
  await page.getByLabel(/Aantal rijders/).fill("2");
  await page.getByLabel("Aantal duo-passagiers").fill("1");
  await page.getByRole("button", { name: "Volgende" }).click();

  // Step 3
  await expect(page.getByText("Stap 3 van 4")).toBeVisible();
  await page.getByRole("button", { name: "Volgende" }).click();
  await expect(page.getByText("Kies je rijervaring")).toBeVisible();
  await page.getByText("Huurmotor", { exact: true }).click();
  await page.getByLabel(/Rijervaring/).selectOption("5to10");
  await page.getByLabel("Wensen of opmerkingen").fill("Graag een kampvuuravond in de woestijn.");
  await page.getByRole("button", { name: "Volgende" }).click();

  // Step 4 validation
  await expect(page.getByText("Stap 4 van 4")).toBeVisible();
  await page.getByRole("button", { name: "Aanvraag versturen" }).click();
  await expect(page.getByText("Vul je naam in")).toBeVisible();
  await expect(page.getByText("Ongeldig e-mailadres")).toBeVisible();
  await page.getByLabel(/^Naam/).fill("Test Rijder");
  await page.getByLabel(/^E-mailadres/).fill("test@example.com");
  await page.getByLabel(/^Telefoonnummer/).fill("+31 6 12345678");
  await page.getByText("WhatsApp", { exact: true }).click();
  await page.getByRole("button", { name: "Aanvraag versturen" }).click();
  await expect(page.getByText("Ga akkoord met de privacyverklaring om je aanvraag te versturen")).toBeVisible();
  await page.getByLabel(/Ik ga akkoord/).check();
  await waitHuman(page);
  await page.getByRole("button", { name: "Aanvraag versturen" }).click();

  await expect(page.getByRole("heading", { name: "Bedankt voor je aanvraag!" })).toBeVisible();
  expect(inserts).toHaveLength(1);
  const body = inserts[0].postDataJSON();
  const row = Array.isArray(body) ? body[0] : body;
  expect(row).toMatchObject({
    naam: "Test Rijder",
    email: "test@example.com",
    telefoon: "+31 6 12345678",
    land: "Morocco",
    regio: "Sahara route",
    reisperiode: "Oktober 2027",
    reis_start: "2027-10-10",
    reis_eind: "2027-10-18",
    taal: "nl",
    aantal_personen: 3,
    eigen_motor: false,
    transport_motor: false,
    accommodatie: true,
  });
  expect(row.opmerkingen).toContain("Graag een kampvuuravond");
  expect(row.opmerkingen).toContain("Reisvorm: Groepsreis");
  expect(row.opmerkingen).toContain("WhatsApp");
});

test("plan form: prefilled from a trip page and from tailor-made", async ({ page }) => {
  await page.goto("/reizen/andalusie");
  await page.getByRole("link", { name: "Vraag deze reis aan" }).first().click();
  await expect(page).toHaveURL(/\/plan\?reis=andalusie/);
  await expect(page.getByLabel("Groepsreis")).toBeChecked();
  await expect(page.getByLabel("Heb je al een reis op het oog?")).toHaveValue("andalusie");

  await page.goto("/op-maat");
  await page.getByRole("link", { name: "Vraag jouw motorreis op maat aan" }).first().click();
  await expect(page.getByLabel("Op maat")).toBeChecked();
});

test("plan form: English version stores language 'en'", async ({ page }) => {
  const inserts = await mockSupabase(page, "aanvragen");
  await page.goto("/en/plan?reisvorm=individual");
  await expect(page.getByLabel("Individual tour")).toBeChecked();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel(/Riding experience/).selectOption("gt10");
  await page.getByRole("button", { name: "Next" }).click();
  await page.getByLabel(/^Name/).fill("Jane Rider");
  await page.getByLabel(/^Email address/).fill("jane@example.com");
  await page.getByLabel(/^Phone number/).fill("+44 7700 900123");
  await page.getByLabel(/I agree/).check();
  await waitHuman(page);
  await page.getByRole("button", { name: "Send request" }).click();
  await expect(page.getByRole("heading", { name: "Thanks for your request!" })).toBeVisible();
  const body = inserts[0].postDataJSON();
  expect((Array.isArray(body) ? body[0] : body).taal).toBe("en");
});

test("plan form: honeypot blocks bots without storing anything", async ({ page }) => {
  const inserts = await mockSupabase(page, "aanvragen");
  await page.goto("/plan?reisvorm=group");
  await page.getByRole("button", { name: "Volgende" }).click();
  await page.getByRole("button", { name: "Volgende" }).click();
  await page.getByLabel(/Rijervaring/).selectOption("lt2");
  await page.getByRole("button", { name: "Volgende" }).click();
  await page.getByLabel(/^Naam/).fill("Spam Bot");
  await page.getByLabel(/^E-mailadres/).fill("bot@example.com");
  await page.getByLabel(/^Telefoonnummer/).fill("0612345678");
  await page.getByLabel(/Ik ga akkoord/).check();
  await page.locator("#website").fill("http://spam.example", { force: true });
  await waitHuman(page);
  await page.getByRole("button", { name: "Aanvraag versturen" }).click();
  await expect(page.getByRole("heading", { name: "Bedankt voor je aanvraag!" })).toBeVisible();
  expect(inserts).toHaveLength(0);
});

test("plan form: shows an error when Supabase fails", async ({ page }) => {
  await mockSupabase(page, "aanvragen", 500);
  await page.goto("/plan?reisvorm=group");
  await page.getByRole("button", { name: "Volgende" }).click();
  await page.getByRole("button", { name: "Volgende" }).click();
  await page.getByLabel(/Rijervaring/).selectOption("lt2");
  await page.getByRole("button", { name: "Volgende" }).click();
  await page.getByLabel(/^Naam/).fill("Test");
  await page.getByLabel(/^E-mailadres/).fill("t@example.com");
  await page.getByLabel(/^Telefoonnummer/).fill("0612345678");
  await page.getByLabel(/Ik ga akkoord/).check();
  await waitHuman(page);
  await page.getByRole("button", { name: "Aanvraag versturen" }).click();
  await expect(page.getByText(/Er ging iets mis bij het versturen/)).toBeVisible();
});

test("contact form: validation and insert", async ({ page }) => {
  const inserts = await mockSupabase(page, "contact_messages");
  await page.goto("/contact");
  await page.getByRole("button", { name: "Bericht versturen" }).click();
  await expect(page.getByText("Schrijf een kort bericht (minimaal 10 tekens)")).toBeVisible();
  await page.getByLabel(/^Naam/).fill("Test");
  await page.getByLabel(/^E-mail/).fill("test@example.com");
  await page.getByLabel(/^Bericht/).fill("Hebben jullie plek in april?");
  await waitHuman(page);
  await page.getByRole("button", { name: "Bericht versturen" }).click();
  await expect(page.getByText("Bericht verzonden!")).toBeVisible();
  const body = inserts[0].postDataJSON();
  expect(Array.isArray(body) ? body[0] : body).toEqual({ name: "Test", email: "test@example.com", message: "Hebben jullie plek in april?" });
});
