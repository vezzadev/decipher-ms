import { defineConfig, sessionDrivers } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

// SSR on Cloudflare Workers. Pages render on demand so the telemetry
// middleware can run per request (and inject the per-request App Insights
// client config); API + OIDC logic lives in src/pages routes. Static files in
// public/ and built assets are served by the platform, bypassing the worker.
export default defineConfig({
  site: "https://decipher.ms",
  output: "server",
  // This app doesn't use Astro sessions; opt out of the adapter's default
  // Cloudflare-KV session driver so no (id-less) SESSION KV binding is emitted
  // into the generated deploy config.
  session: { driver: sessionDrivers.memory() },
  adapter: cloudflare({
    // Plain <img> with build-emitted assets — no runtime image service / IMAGES binding.
    imageService: "passthrough",
  }),
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
