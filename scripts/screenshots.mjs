/**
 * Full-page screenshots of every page at several widths.
 * Requires the site to be served (node scripts/serve.mjs 4173).
 * Usage: node scripts/screenshots.mjs [baseUrl] [outDir] [widths]
 */
import { chromium } from "playwright";
import { executablePath } from "./browser.mjs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.argv[2] ?? "http://localhost:4173";
const OUT = process.argv[3] ?? "reports/screenshots";
const WIDTHS = (process.argv[4] ?? "375,768,1280,1440").split(",").map(Number);
const PAGES = (process.env.PAGES ?? [
  "/", "/groepsreizen", "/individuele-reizen", "/op-maat", "/bestemmingen", "/bestemmingen/spanje", "/bestemmingen/marokko",
  "/reizen/andalusie", "/reizen/sahara-route", "/de-ervaring", "/veelgestelde-vragen", "/plan", "/contact",
  "/garantieregeling", "/reisvoorwaarden", "/privacyverklaring", "/cookieverklaring", "/bestaat-niet", "/auth",
  "/en", "/en/tours/castilie-la-mancha", "/en/plan",
].join(",")).split(",");

const browser = await chromium.launch({ executablePath });
await mkdir(OUT, { recursive: true });
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 812 : 900 }, deviceScaleFactor: 1, reducedMotion: process.env.MOTION === "1" ? "no-preference" : "reduce" });
  await ctx.addInitScript(() => localStorage.setItem("col-cookie-notice", "1"));
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(`${page.url()}: ${m.text()}`));
  page.on("pageerror", (e) => errors.push(`${page.url()}: ${e.message}`));
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: "networkidle" });
    // scroll through the page so lazy images / in-view effects trigger
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(400);
    // check horizontal overflow
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) console.log(`⚠ horizontal overflow ${overflow}px on ${p} @${w}`);
    const name = (p === "/" ? "home" : p.replace(/^\//, "").replace(/\//g, "_")) + `@${w}.png`;
    await page.screenshot({ path: path.join(OUT, name), fullPage: true });
  }
  if (errors.length) console.log(errors.join("\n"));
  await ctx.close();
}
await browser.close();
console.log(`✓ screenshots in ${OUT}`);
