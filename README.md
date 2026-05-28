# decipher.ms

Source for [decipher.ms](https://decipher.ms) — an independent Microsoft advisory operated by Vezza LLC. A marketing site plus server routes that handle briefing-form intake, anonymous telemetry, and transactional email — all running on Cloudflare Workers via Astro's SSR adapter.

## Stack

- **Frontend** — Astro (SSR) + TypeScript, Tailwind CSS v4
- **Backend** — Astro server routes on the Cloudflare Workers adapter, D1 (briefing storage), Microsoft Graph (outbound email), Cloudflare Turnstile (bot protection)
- **Telemetry** — Azure Application Insights, ingested directly via raw envelope POSTs (no SDK). See [`AGENTS.md`](AGENTS.md).

## Development

```bash
npm install
npm run dev          # Astro dev server (Cloudflare bindings via the adapter)
npm run build        # SSR build to ./dist/{client,server}
npm run preview      # Preview the built worker (wrangler dev)
npm run lint
```

`npm run build` emits an SSR worker to `./dist/server` and static assets to
`./dist/client`. Server logic lives in `src/`:

- `src/pages/api/briefing.ts` — briefing intake (`POST /api/briefing`)
- `src/pages/.well-known/*` — OIDC discovery + JWKS
- `src/middleware.ts` — per-request App Insights telemetry
- `src/lib/server/*` — D1, Microsoft Graph, JWT/OIDC, Turnstile, telemetry

Bindings are read via `import { env } from "cloudflare:workers"`; the execution
context is `Astro.locals.cfContext`. Secrets (`OIDC_PRIVATE_KEY`,
`TURNSTILE_SECRET_KEY`, `APPLICATIONINSIGHTS_CONNECTION_STRING`) and `vars`
(`GRAPH_*`, `OIDC_*`) come from [`wrangler.jsonc`](wrangler.jsonc); set secrets
per environment with `npx wrangler secret put <NAME>`.

## Deployment

Cloudflare Workers Builds. Pushes to `main` deploy production; branch pushes get a preview at `<branch>-decipher-ms.*.workers.dev`. Deploy targets the adapter-generated `dist/server/wrangler.json` — see [`AGENTS.md`](AGENTS.md) for the exact build/deploy commands.

## License

[GNU Affero General Public License v3.0 or later](LICENSE) — modifications offered over a network must publish source under the same terms.
