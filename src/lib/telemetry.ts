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

type VitalMetric =
  | CLSMetricWithAttribution
  | FCPMetricWithAttribution
  | INPMetricWithAttribution
  | LCPMetricWithAttribution
  | TTFBMetricWithAttribution;

const IKEY = "b122de9d-24eb-4bdc-adc7-4d0a68490740";
const INGESTION_ENDPOINT = "https://westus2-2.in.applicationinsights.azure.com";
const SDK_VERSION = "decipher-ms-client:1.0";

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

function resolveEnvironment(): string {
  const h = window.location.hostname;
  if (h === "decipher.ms" || h === "www.decipher.ms") return "production";
  const preview = h.match(/^([a-z0-9-]+)-decipher-ms\.[^.]+\.workers\.dev$/i);
  if (preview) return `preview:${preview[1]}`;
  if (h.endsWith(".workers.dev")) return "preview";
  return "development";
}

const ENVIRONMENT = resolveEnvironment();
const CLOUD_ROLE = `decipher-ms-client-${ENVIRONMENT}`;

const operationId = randomHex(16);
let pageviewId = randomHex(8);
let queue: Envelope[] = [];
let flushTimer: number | null = null;

function makeEnvelope(
  baseType: string,
  baseData: Record<string, unknown>,
  extraTags: Record<string, string> = {},
): Envelope {
  return {
    name: `Microsoft.ApplicationInsights.${baseType.replace(/Data$/, "")}`,
    time: new Date().toISOString(),
    iKey: IKEY,
    tags: {
      "ai.operation.id": operationId,
      "ai.cloud.role": CLOUD_ROLE,
      "ai.internal.sdkVersion": SDK_VERSION,
      ...extraTags,
    },
    data: { baseType, baseData: { ver: 2, ...baseData } },
  };
}

function send(envelopes: Envelope[]): void {
  if (envelopes.length === 0) return;
  const url = `${INGESTION_ENDPOINT}/v2.1/track`;
  const payload = envelopes.map((e) => JSON.stringify(e)).join("\n");
  fetch(url, {
    method: "POST",
    body: payload,
    headers: { "content-type": "text/plain" },
    keepalive: true,
    credentials: "omit",
  }).catch(() => {});
}

function enqueue(envelope: Envelope): void {
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
  pageviewId = randomHex(8);
  enqueue(
    makeEnvelope("PageviewData", {
      id: pageviewId,
      name,
      url: window.location.origin + path,
      duration: formatDuration(performance.now()),
      properties: { environment: ENVIRONMENT, referrer: referrerOrigin() },
    }),
  );
}

export function trackEvent(name: string, properties?: Record<string, string>): void {
  enqueue(
    makeEnvelope(
      "EventData",
      { name, properties: { environment: ENVIRONMENT, ...(properties ?? {}) } },
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
    return { loadState: metric.attribution.loadState };
  }
  return {};
}

function trackVital(metric: VitalMetric): void {
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
          environment: ENVIRONMENT,
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
        properties: { environment: ENVIRONMENT, ...(properties ?? {}) },
      },
      { "ai.operation.parentId": pageviewId },
    ),
  );
}

let initialized = false;

export function initTelemetry(): void {
  if (initialized) return;
  initialized = true;

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
