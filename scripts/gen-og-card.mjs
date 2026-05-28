// Renders scripts/og-card.html at 1200x630 (2x density) via headless Chrome
// and writes public/og-image.png. Requires `google-chrome` on PATH (override
// with CHROME_BIN=/path/to/chrome).
//
// Run with: node scripts/gen-og-card.mjs
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { existsSync, statSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = resolve(__dirname, "og-card.html");
const out = resolve(__dirname, "..", "public", "og-image.png");

const chromeBin = process.env.CHROME_BIN ?? "google-chrome";

const result = spawnSync(
  chromeBin,
  [
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--force-device-scale-factor=2",
    "--window-size=1200,630",
    "--virtual-time-budget=5000",
    `--screenshot=${out}`,
    `file://${html}`,
  ],
  { stdio: "inherit" },
);

if (result.error) {
  console.error("failed to spawn", chromeBin + ":", result.error.message);
  process.exit(1);
}
if (result.status !== 0) {
  console.error("chrome exited with status", result.status);
  process.exit(result.status ?? 1);
}
if (!existsSync(out)) {
  console.error("expected output not written:", out);
  process.exit(1);
}

const { size } = statSync(out);
console.log(`wrote ${out} (${size} bytes)`);
