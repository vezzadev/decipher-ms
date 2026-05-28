import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Static multi-page build. Output goes to ./dist, which the Cloudflare Worker
// (worker/index.ts) serves via its ASSETS binding alongside the /api and
// /.well-known routes. See wrangler.jsonc.
export default defineConfig({
  site: "https://decipher.ms",
  build: { format: "directory" },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
