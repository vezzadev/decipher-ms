/// <reference types="astro/client" />

type ServerEnv = import("./lib/server/env").Env;

// Bindings exposed via `import { env } from "cloudflare:workers"`.
declare namespace Cloudflare {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Env extends ServerEnv {}
}

// Extra request-scoped values set by the telemetry middleware. Merges with the
// adapter's App.Locals (which provides `cfContext`).
declare namespace App {
  interface Locals {
    telemetry: import("./lib/server/telemetry").Telemetry;
    requestId: string;
  }
}
