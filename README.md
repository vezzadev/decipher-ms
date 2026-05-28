# decipher.ms

Source for [decipher.ms](https://decipher.ms) — an independent Microsoft advisory operated by Vezza LLC. A marketing site plus a Cloudflare Worker that handles briefing-form intake, anonymous telemetry, and transactional email.

## Stack

- **Frontend** — Vite, React 19 + TypeScript, React Router, Tailwind CSS v4, `react-helmet-async`
- **Backend** — Cloudflare Worker, D1 (briefing storage), Microsoft Graph (outbound email), Cloudflare Turnstile (bot protection)
- **Telemetry** — Azure Application Insights, ingested directly via raw envelope POSTs (no SDK). See [`AGENTS.md`](AGENTS.md).

## Development

```bash
npm install
npm run dev          # Vite dev server
npm run build        # Production build
npm run lint
```

The worker reads its configuration from [`wrangler.jsonc`](wrangler.jsonc) and the secrets declared in [`worker/env.ts`](worker/env.ts) (`GRAPH_*`, `OIDC_*`, `TURNSTILE_SECRET_KEY`, `APPLICATIONINSIGHTS_CONNECTION_STRING`). Set them per environment with `npx wrangler secret put <NAME>`.

## Deployment

Cloudflare Pages / Workers Builds. Pushes to `main` deploy production; branch pushes get a preview at `<branch>-decipher-ms.*.workers.dev`.

## License

[GNU Affero General Public License v3.0 or later](LICENSE) — modifications offered over a network must publish source under the same terms.
