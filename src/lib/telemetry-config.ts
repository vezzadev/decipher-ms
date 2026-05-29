// App Insights client identifiers, shared by the browser RUM client
// (telemetry.ts) and the server request tracer (server/telemetry.ts).
//
// These are NOT secret: the instrumentation key and ingestion endpoint are
// shipped to every visitor in the client telemetry payload (visible in
// view-source), so a "connection string secret" only ever protected public
// values. Keeping them in source lets prerendered (static) pages configure
// telemetry with zero per-request server work — no SSR round-trip just to
// learn an iKey that is already public.
//
// The `environment` dimension is resolved from the request/location hostname
// at runtime (below), so a single build serves production and preview Workers
// while still tagging telemetry correctly.
export const AI_IKEY = "b122de9d-24eb-4bdc-adc7-4d0a68490740";
export const AI_INGESTION_ENDPOINT = "https://westus2-2.in.applicationinsights.azure.com";

export function resolveEnvironment(hostname: string): string {
  if (hostname === "decipher.ms" || hostname === "www.decipher.ms") return "production";
  const previewMatch = hostname.match(/^([a-z0-9-]+)-decipher-ms\.[^.]+\.workers\.dev$/i);
  if (previewMatch) return `preview:${previewMatch[1]}`;
  if (hostname.endsWith(".workers.dev")) return "preview";
  return "development";
}
