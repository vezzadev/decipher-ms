import { defineConfig, fontProviders, sessionDrivers } from "astro/config";
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
  // Self-host the two webfonts (downloaded + subset at build time, served as
  // static /_astro assets by the platform). This removes the render-blocking
  // cross-origin Google Fonts stylesheet from the critical path; the <Font>
  // component instead inlines @font-face CSS and preloads the body font.
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: ["400 800"],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["system-ui", "sans-serif"],
    },
    {
      provider: fontProviders.google(),
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      weights: ["700 900"],
      styles: ["normal", "italic"],
      subsets: ["latin"],
      fallbacks: ["Georgia", "serif"],
    },
  ],
  adapter: cloudflare({
    // Plain <img> with build-emitted assets — no runtime image service / IMAGES binding.
    imageService: "passthrough",
  }),
  // Inline the (small, ~6KB) global stylesheet into each page's <head> instead
  // of emitting a render-blocking <link>. Pages are SSR'd per request, so there
  // is no shared-CSS-cache benefit to give up, and FCP/LCP improve.
  build: { inlineStylesheets: "always" },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": new URL("./src", import.meta.url).pathname,
      },
    },
  },
});
