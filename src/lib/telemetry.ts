import {
  onCLS,
  onINP,
  onLCP,
  onFCP,
  onTTFB,
  type CLSMetricWithAttribution,
  type FCPMetricWithAttribution,
  type INPMetricWithAttribution,
  type LCPMetricWithAttribution,
  type TTFBMetricWithAttribution,
} from "web-vitals/attribution";
import { AI_IKEY, AI_INGESTION_ENDPOINT, resolveEnvironment } from "./telemetry-config";

type VitalMetric =
  | CLSMetricWithAttribution
  | FCPMetricWithAttribution
  | INPMetricWithAttribution
  | LCPMetricWithAttribution
  | TTFBMetricWithAttribution;

const SDK_VERSION = "decipher-ms-client:1.0";

interface TelemetryConfig {
  iKey: string;
  ingestionEndpoint: string;
  environment: string;
}

interface Envelope {
  name: string;
  time: string;
  iKey: string;
  tags: Record<string, string>;
  data: { baseType: string; baseData: Record<string, unknown> };
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

let config: TelemetryConfig | null = null;
const operationId = randomHex(16);
let pageviewId = randomHex(8);
let queue: Envelope[] = [];
let flushTimer: number | null = null;

function makeEnvelope(
  baseType: string,
  baseData: Record<string, unknown>,
  extraTags: Record<string, string> = {},
): Envelope | null {
  if (!config) return null;
  return {
    name: `Microsoft.ApplicationInsights.${baseType.replace(/Data$/, "")}`,
    time: new Date().toISOString(),
    iKey: config.iKey,
    tags: {
      "ai.operation.id": operationId,
      "ai.cloud.role": `decipher-ms-client-${config.environment}`,
      "ai.internal.sdkVersion": SDK_VERSION,
      ...extraTags,
    },
    data: { baseType, baseData: { ver: 2, ...baseData } },
  };
}

function send(envelopes: Envelope[]): void {
  if (!config || envelopes.length === 0) return;
  const url = `${config.ingestionEndpoint}/v2.1/track`;
  const payload = envelopes.map((e) => JSON.stringify(e)).join("\n");
  // sendBeacon is a background-priority transport, so the ingestion POST stays
  // off the page's critical request chain. A plain fetch defaults to High
  // priority, which Lighthouse counts as critical (this slow westus2 round-trip
  // was dominating the chain). Beacon also reliably survives page unload, which
  // is exactly what the visibilitychange/pagehide flush relies on.
  if (typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "text/plain" });
    if (navigator.sendBeacon(url, blob)) return;
  }
  // Fallback for the rare browser without sendBeacon: an explicitly
  // low-priority keepalive fetch so the request still stays off the chain.
  fetch(url, {
    method: "POST",
    body: payload,
    headers: { "content-type": "text/plain" },
    keepalive: true,
    credentials: "omit",
    priority: "low",
  }).catch(() => {});
}

function enqueue(envelope: Envelope | null): void {
  if (!envelope) return;
  queue.push(envelope);
  if (flushTimer !== null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    const toSend = queue;
    queue = [];
    send(toSend);
  }, 1500);
}

function flushNow(): void {
  if (flushTimer !== null) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  const toSend = queue;
  queue = [];
  send(toSend);
}

function formatDuration(ms: number): string {
  const total = Math.max(0, ms);
  const d = Math.floor(total / 86400000);
  const h = Math.floor((total % 86400000) / 3600000);
  const m = Math.floor((total % 3600000) / 60000);
  const s = Math.floor((total % 60000) / 1000);
  const frac = Math.floor((total % 1000) * 10000).toString().padStart(7, "0");
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d}.${pad(h)}:${pad(m)}:${pad(s)}.${frac}`;
}

function referrerOrigin(): string {
  if (!document.referrer) return "";
  try {
    return new URL(document.referrer).origin;
  } catch {
    return "";
  }
}

export function trackPageview(path: string, name: string): void {
  if (!config) return;
  pageviewId = randomHex(8);
  enqueue(
    makeEnvelope("PageviewData", {
      id: pageviewId,
      name,
      url: window.location.origin + path,
      duration: formatDuration(performance.now()),
      properties: { environment: config.environment, referrer: referrerOrigin() },
    }),
  );
}

export function trackEvent(name: string, properties?: Record<string, string>): void {
  if (!config) return;
  enqueue(
    makeEnvelope(
      "EventData",
      { name, properties: { environment: config.environment, ...(properties ?? {}) } },
      { "ai.operation.parentId": pageviewId },
    ),
  );
}

function attributionProps(metric: VitalMetric): Record<string, string> {
  if (metric.name === "LCP") {
    const a = metric.attribution;
    const out: Record<string, string> = {};
    if (a.target) out.element = a.target;
    if (a.url) out.elementUrl = a.url;
    return out;
  }
  if (metric.name === "CLS") {
    const a = metric.attribution;
    const out: Record<string, string> = {};
    if (a.largestShiftTarget) out.element = a.largestShiftTarget;
    if (a.largestShiftValue !== undefined) {
      out.largestShiftValue = a.largestShiftValue.toFixed(4);
    }
    if (a.loadState) out.loadState = a.loadState;
    return out;
  }
  if (metric.name === "INP") {
    const a = metric.attribution;
    const out: Record<string, string> = {};
    if (a.interactionTarget) out.element = a.interactionTarget;
    if (a.interactionType) out.interactionType = a.interactionType;
    return out;
  }
  if (metric.name === "FCP") {
    const out: Record<string, string> = {};
    if (metric.attribution.loadState) {
      out.loadState = metric.attribution.loadState;
    }
    return out;
  }
  return {};
}

function trackVital(metric: VitalMetric): void {
  if (!config) return;
  enqueue(
    makeEnvelope(
      "MetricData",
      {
        metrics: [
          {
            name: metric.name,
            kind: 0,
            value: metric.value,
            count: 1,
          },
        ],
        properties: {
          environment: config.environment,
          rating: metric.rating,
          navigationType: metric.navigationType,
          path: window.location.pathname,
          ...attributionProps(metric),
        },
      },
      { "ai.operation.parentId": pageviewId },
    ),
  );
}

function trackException(error: unknown, properties?: Record<string, string>): void {
  if (!config) return;
  const e = error instanceof Error ? error : new Error(String(error));
  enqueue(
    makeEnvelope(
      "ExceptionData",
      {
        exceptions: [
          {
            typeName: e.name || "Error",
            message: e.message,
            hasFullStack: !!e.stack,
            stack: e.stack ?? "",
            parsedStack: [],
          },
        ],
        severityLevel: 3,
        properties: { environment: config.environment, ...(properties ?? {}) },
      },
      { "ai.operation.parentId": pageviewId },
    ),
  );
}

let initialized = false;

export function initTelemetry(): void {
  if (initialized) return;
  initialized = true;
  // Identifiers are public constants; the environment is derived client-side so
  // prerendered static pages need no per-request server-injected config.
  const environment = resolveEnvironment(location.hostname);
  // Stay silent on localhost: historically dev had no injected config and so
  // never emitted; sending here would pollute the shared App Insights resource
  // (and fire surprising cross-origin beacons during local work).
  if (environment === "development") return;
  config = {
    iKey: AI_IKEY,
    ingestionEndpoint: AI_INGESTION_ENDPOINT,
    environment,
  };

  onCLS(trackVital);
  onINP(trackVital);
  onLCP(trackVital);
  onFCP(trackVital);
  onTTFB(trackVital);

  window.addEventListener("error", (event) => {
    trackException(event.error ?? event.message, {
      source: event.filename ?? "",
      line: String(event.lineno ?? ""),
    });
  });
  window.addEventListener("unhandledrejection", (event) => {
    trackException(event.reason, { kind: "unhandledrejection" });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNow();
  });
  window.addEventListener("pagehide", flushNow);
}
