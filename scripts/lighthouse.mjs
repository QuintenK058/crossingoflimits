/**
 * Runs Lighthouse (mobile, default throttling) on key pages and writes HTML
 * reports + a summary to reports/lighthouse/. Serve dist first.
 * Usage: node scripts/lighthouse.mjs [baseUrl]
 */
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";
import { executablePath } from "./browser.mjs";

const BASE = process.argv[2] ?? "http://localhost:4173";
const PAGES = (process.env.PAGES ?? "/,/groepsreizen,/reizen/andalusie,/bestemmingen/marokko,/de-ervaring,/veelgestelde-vragen,/plan,/contact,/en").split(",");
const OUT = "reports/lighthouse";
await mkdir(OUT, { recursive: true });

const chrome = await chromeLauncher.launch({ chromePath: executablePath, chromeFlags: ["--headless=new", "--no-sandbox"] });
const rows = [];
for (const p of PAGES) {
  // Median of RUNS runs (Lighthouse varies between runs)
  const runs = [];
  for (let i = 0; i < Number(process.env.RUNS ?? 3); i++) runs.push(await lighthouse(BASE + p, { port: chrome.port, output: "html", logLevel: "error" }));
  runs.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
  const result = runs[Math.floor(runs.length / 2)];
  const c = result.lhr.categories;
  const s = (k) => Math.round(c[k].score * 100);
  const row = { page: p, performance: s("performance"), accessibility: s("accessibility"), bestPractices: s("best-practices"), seo: s("seo"),
    LCP: result.lhr.audits["largest-contentful-paint"].displayValue, CLS: result.lhr.audits["cumulative-layout-shift"].displayValue, TBT: result.lhr.audits["total-blocking-time"].displayValue };
  rows.push(row);
  const failing = Object.values(result.lhr.audits).filter((a) => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== "informative" && a.scoreDisplayMode !== "notApplicable" && a.scoreDisplayMode !== "manual").map((a) => `${a.id} (${a.displayValue ?? a.score})`);
  console.log(JSON.stringify(row), failing.length ? `\n   issues: ${failing.join(", ")}` : "");
  await writeFile(`${OUT}/${p === "/" ? "home" : p.slice(1).replace(/\//g, "_")}.html`, result.report);
}
await chrome.kill();
const md = ["| Pagina | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |", "|---|---|---|---|---|---|---|---|",
  ...rows.map((r) => `| ${r.page} | ${r.performance} | ${r.accessibility} | ${r.bestPractices} | ${r.seo} | ${r.LCP} | ${r.CLS} | ${r.TBT} |`)].join("\n");
await writeFile(`${OUT}/summary.md`, `# Lighthouse (mobiel, gesimuleerde throttling, mediaan van ${process.env.RUNS ?? 3} runs)\n\nGemeten op ${new Date().toISOString().slice(0, 10)} tegen een lokale productiebuild (gzip, cache headers).\n\n${md}\n`);
console.log("\n" + md);
