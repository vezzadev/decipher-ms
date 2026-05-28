# AGENTS.md

## Database & migrations (D1)

Briefing submissions are stored in Cloudflare **D1**. Two databases, both on
account `vezza.dev` / `d1db42c1ac42b3aee886f219b8f56e16`, binding `DB` (see
`wrangler.jsonc`):

| Database | id | Used by |
| --- | --- | --- |
| `decipher-ms-db` | `7fa5214b-5743-43cb-86e1-b679428f1d17` | production only |
| `decipher-ms-preview` | `e13ad566-bc05-49f8-890e-1d5820189be7` | all preview branches (shared) |

Production has its **own** database — branch builds never read, write, or
migrate it. Every non-prod branch shares the single `decipher-ms-preview` DB.

### Migrations ship with the deploy

Migrations live in `migrations/` and are tracked by `wrangler`. The Cloudflare
**Workers Builds** deploy commands (dashboard → Worker → Settings → Builds, not
in the repo) handle them per environment:

| Build | Deploy command | Database it migrates |
| --- | --- | --- |
| Production (main) | `npx wrangler d1 migrations apply decipher-ms-db --remote && npx wrangler deploy` | `decipher-ms-db` |
| Non-production (branches) | `bash scripts/preview-deploy.sh` | `decipher-ms-preview` |

Production order matters: migrate **before** deploy, so new code never runs
against an old schema. `migrations apply` is idempotent — a clean no-op when
nothing is pending — so it's safe on every build.

`scripts/preview-deploy.sh` derives `wrangler.preview.jsonc` (gitignored) from
`wrangler.jsonc` by swapping only the D1 name + id to the preview database, then
migrates *that* and runs `versions upload`. `wrangler.jsonc` stays the single
source of truth; the worker name is unchanged, so the branch preview URL
(`<branch>-decipher-ms.*.workers.dev`) is unaffected.

Auth: the migrate step needs D1 write. The Workers Builds managed token usually
has it; if a build fails with `7403`, set `CLOUDFLARE_API_TOKEN` (D1-edit
scoped) as a Workers Builds env var.

### Manual application (and the gotcha that motivated this)

If a schema change ever reaches main without the pipeline applying it — or to
apply ahead of a deploy — run:

```bash
npx wrangler d1 migrations list decipher-ms-db --remote   # see what's pending
npx wrangler d1 migrations apply decipher-ms-db --remote  # apply it
```

History: before the pipeline applied migrations, `0002_engagement_type.sql`
shipped in code but never reached the DB, so every briefing-form submission
failed with `D1_ERROR: table briefing_requests has no column named
engagement_type`. A one-off remote `wrangler d1` call may return a transient
`7403 account not authorized` — just retry; the OAuth token has `d1 (write)`.

## Telemetry

Production telemetry flows into **Azure Application Insights**, not Cloudflare
Web Analytics (the CF beacon also runs in parallel for the existing CF dashboard,
but App Insights is the source of truth).

### Where things live

| Thing | Where |
| --- | --- |
| App Insights resource | `ai-decipherms-wu2-1` in `rg-decipherms-wu2-1`, sub `240ae4d5-0160-4b5d-b078-e8e3074cecc2` |
| Connection string | `APPLICATIONINSIGHTS_CONNECTION_STRING` Worker secret. Worker parses it (`worker/telemetry.ts:parseConnString`) and injects `{iKey, ingestionEndpoint, environment}` into HTML responses as `window.__telemetryConfig` for the client to consume. Set per environment via `npx wrangler secret put APPLICATIONINSIGHTS_CONNECTION_STRING`. |
| App ID for Logs API | `00575dd1-2f5b-47ad-845d-a706d47fbfe4` |
| Dashboard | [Azure portal dashboard](https://portal.azure.com/#@vezza.dev/dashboard/arm/subscriptions/240ae4d5-0160-4b5d-b078-e8e3074cecc2/resourcegroups/rg-decipherms-wu2-1/providers/microsoft.portal/dashboards/00575dd1-2f5b-47ad-845d-a706d47fbfe4-dashboard) — mirrors Cloudflare RUM tiles (page views, visits, web vitals p75 + rating split + top offending elements, browsers, OS, countries, exceptions). 7d window by default. |
| Cloudflare RUM (parallel) | [siteTag c1ccb0d6…](https://dash.cloudflare.com/d1db42c1ac42b3aee886f219b8f56e16/web-analytics/overview?siteTag~in=c1ccb0d6146e49e1a9d2bbf4d4bbccfa&excludeBots=Yes) |

### Tables

- `pageViews` — `trackPageview` from `src/lib/telemetry.ts`. URL, duration (perf.now at fire time), `client_CountryOrRegion`/`client_Browser`/`client_OS` auto-enriched at ingest.
- `customMetrics` — Web Vitals (LCP/INP/CLS/FCP/TTFB) sent as `MetricData` envelopes. `customDimensions` carries `environment`, `rating`, `navigationType`, `path` (page pathname), and attribution: `element` (CSS selector for LCP target / largest CLS shift source / INP interaction target), `elementUrl` (LCP resource), `interactionType` (INP), `loadState`, `largestShiftValue` (CLS).
- `customEvents` — `trackEvent` calls (e.g. briefing form interactions).
- `exceptions` — unhandled errors and rejections from window-level handlers in `initTelemetry()`.

### Source

- Client telemetry: `src/lib/telemetry.ts` — raw envelope POSTs to `https://westus2-2.in.applicationinsights.azure.com/v2.1/track`, no AI SDK. `keepalive: true` fetch, batched on a 1.5s timer, flushed on `visibilitychange=hidden` and `pagehide`. Uses `web-vitals/attribution` for CSS selector attribution.
- Dashboard generator: `scripts/gen-dashboard.py` — KQL queries inline, produces `scripts/dashboard.generated.json`. Regenerate + PUT with:
  ```bash
  python3 scripts/gen-dashboard.py
  DASH_ID=$(az resource show \
    --resource-type Microsoft.Portal/dashboards \
    --name 00575dd1-2f5b-47ad-845d-a706d47fbfe4-dashboard \
    --resource-group rg-decipherms-wu2-1 \
    --query id -o tsv | tr -d '\r')
  az rest --method put \
    --url "https://management.azure.com${DASH_ID}?api-version=2020-09-01-preview" \
    --body @scripts/dashboard.generated.json
  ```

### Querying

```bash
APP=00575dd1-2f5b-47ad-845d-a706d47fbfe4
az monitor app-insights query --app $APP --analytics-query '<kql>' -o json
```

`-o table` swallows queries that return single-column results or zero rows — prefer `-o json | jq` when sanity-checking that data exists.

### Environment tag

Every envelope has `customDimensions.environment` set to one of:
- `production` — `decipher.ms` / `www.decipher.ms`
- `preview:<branch>` — `<branch>-decipher-ms.*.workers.dev`
- `preview` — any other `*.workers.dev`
- `development` — everything else

Filter on it in KQL when you want to exclude preview noise.
