import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

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
  const blob = new Blob([payload], { type: "application/x-json-stream" });
  if (navigator.sendBeacon && navigator.sendBeacon(url, blob)) return;
  fetch(url, { method: "POST", body: blob, keepalive: true }).catch(() => {});
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

export function trackPageview(path: string, name: string): void {
  pageviewId = randomHex(8);
  enqueue(
    makeEnvelope("PageviewData", {
      id: pageviewId,
      name,
      url: window.location.origin + path,
      duration: formatDuration(performance.now()),
      properties: { environment: ENVIRONMENT, referrer: document.referrer },
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

function trackVital(metric: Metric): void {
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
