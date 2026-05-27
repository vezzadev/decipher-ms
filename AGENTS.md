# AGENTS.md

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
