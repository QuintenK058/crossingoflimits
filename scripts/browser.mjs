import { existsSync } from "node:fs";

/** Use a preinstalled Chromium when Playwright's own download is not available (e.g. CI images). */
export const executablePath =
  process.env.PW_CHROMIUM_PATH ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
