import { expect, test } from "@playwright/test";
import { hideCookieBanner } from "./helpers";

test("no console errors on key pages, in both languages", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  for (const p of ["/", "/groepsreizen", "/reizen/castilie-la-mancha", "/de-ervaring", "/veelgestelde-vragen", "/en", "/en/destinations/morocco", "/en/plan"]) {
    await page.goto(p);
    await page.waitForLoadState("networkidle");
  }
  expect(errors).toEqual([]);
});

test("language switch keeps the same page", async ({ page }) => {
  await hideCookieBanner(page);
  await page.goto("/bestemmingen/marokko");
  await page.getByRole("link", { name: "Switch to English" }).first().click();
  await expect(page).toHaveURL(/\/en\/destinations\/morocco$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Morocco");
});

test("legacy Lovable URLs redirect", async ({ page }) => {
  await page.goto("/tours/sahara-route");
  await expect(page).toHaveURL(/\/reizen\/sahara-route$/);
  await page.goto("/group-tours");
  await expect(page).toHaveURL(/\/groepsreizen$/);
});

test("unknown URL shows the 404 page", async ({ page }) => {
  const res = await page.goto("/deze-pagina-bestaat-niet");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Hier loopt de weg dood" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("FAQ accordion works with the keyboard and has FAQPage schema", async ({ page }) => {
  await hideCookieBanner(page);
  await page.goto("/veelgestelde-vragen");
  const trigger = page.getByRole("button", { name: "Hoe groot zijn de groepen?" });
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Minimaal 4, maximaal 10 motorrijders.")).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((j) => j.includes('"FAQPage"'))).toBe(true);
});

test("trip page: TouristTrip schema, accordion and lightbox via keyboard", async ({ page }) => {
  await hideCookieBanner(page);
  await page.goto("/reizen/andalusie");
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.some((j) => j.includes('"TouristTrip"') && j.includes('"price":1935'))).toBe(true);
  expect(ld.some((j) => j.includes('"BreadcrumbList"'))).toBe(true);
  await page.getByRole("button", { name: /De 8-daagse route/ }).click();
  await expect(page.getByText(/Dag 5 is de absolute koningsdag/)).toBeVisible();
  const thumb = page.getByRole("button", { name: /Afbeelding vergroten: Routekaart/ }).first();
  await thumb.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("(1/")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog.getByText("(2/")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(thumb).toBeFocused();
});

test("mobile menu: opens, traps focus, closes with Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await hideCookieBanner(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Menu openen" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu.getByRole("link", { name: "Groepsreizen" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await page.getByRole("button", { name: "Menu openen" }).click();
  await page.getByRole("dialog").getByRole("link", { name: "De Ervaring" }).click();
  await expect(page).toHaveURL(/\/de-ervaring$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Meer dan een motorreis");
});

test("skip link moves focus to main content", async ({ page, isMobile }) => {
  test.skip(!!isMobile, "keyboard test on desktop");
  await page.goto("/groepsreizen");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Ga naar de inhoud" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

test("hero slideshow: advances, can be paused, static with reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "no-preference", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem("col-cookie-notice", "1"));
  await page.goto("/");
  const current = page.locator('button[aria-current="true"]');
  await expect(current).toHaveAttribute("aria-label", /Foto 1 van 3/);
  await expect(current).toHaveAttribute("aria-label", /Foto 2 van 3/, { timeout: 9000 });
  await page.getByRole("button", { name: "Diavoorstelling pauzeren" }).click();
  await expect(page.getByRole("button", { name: "Diavoorstelling afspelen" })).toBeVisible();
  await page.waitForTimeout(6500);
  await expect(current).toHaveAttribute("aria-label", /Foto 2 van 3/);
  await page.getByRole("button", { name: /Foto 3 van 3/ }).click();
  await expect(page.locator('button[aria-current="true"]')).toHaveAttribute("aria-label", /Foto 3 van 3/);
  await ctx.close();

  const reduced = await browser.newContext({ reducedMotion: "reduce" });
  const p2 = await reduced.newPage();
  await p2.goto("/");
  await expect(p2.getByRole("button", { name: "Diavoorstelling afspelen" })).toBeVisible();
  await p2.waitForTimeout(6500);
  await expect(p2.locator('button[aria-current="true"]')).toHaveAttribute("aria-label", /Foto 1 van 3/);
  await reduced.close();
});

test("homepage: horizontal trips list links to every trip", async ({ page }) => {
  await page.goto("/");
  const links = page.locator("#trips-title").locator("xpath=ancestor::section").locator('a[href^="/reizen/"]');
  await expect(links).toHaveCount(7);
});

test("reduced motion: content is visible without animation", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(500);
  const opacity = await page.getByRole("heading", { name: "Alles voor een onvergetelijke rit" }).evaluate((el) => {
    let n: HTMLElement | null = el as HTMLElement;
    while (n) {
      if (getComputedStyle(n).opacity !== "1" || getComputedStyle(n).transform !== "none") return getComputedStyle(n).opacity + " " + getComputedStyle(n).transform;
      n = n.parentElement;
    }
    return "ok";
  });
  expect(opacity).toBe("ok");
  await ctx.close();
});
