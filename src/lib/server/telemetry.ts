import type { ExecutionContext } from "@cloudflare/workers-types";
import { AI_IKEY, AI_INGESTION_ENDPOINT, resolveEnvironment } from "../telemetry-config";

interface Envelope {
  name: string;
  time: string;
  iKey: string;
  tags: Record<string, string>;
  data: { baseType: string; baseData: Record<string, unknown> };
}

const SDK_VERSION = "decipher-ms:1.0";

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

function formatDuration(ms: number): string {
  const totalMs = Math.max(0, ms);
  const days = Math.floor(totalMs / 86400000);
  const hours = Math.floor((totalMs % 86400000) / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const fractional = Math.floor((totalMs % 1000) * 10000)
    .toString()
    .padStart(7, "0");
  const pad = (n: number, w = 2) => n.toString().padStart(w, "0");
  return `${days}.${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${fractional}`;
}

export class Telemetry {
  private envelopes: Envelope[] = [];
  private readonly requestProperties: Record<string, string> = {};
  readonly operationId = randomHex(16);

  addRequestProperty(key: string, value: string): void {
    this.requestProperties[key] = value;
  }

  drainRequestProperties(): Record<string, string> {
    const copy = { ...this.requestProperties };
    for (const k of Object.keys(this.requestProperties)) {
      delete this.requestProperties[k];
    }
    return copy;
  }

  readonly environment: string;
  private readonly cloudRole: string;

  constructor(
    private readonly ctx: ExecutionContext,
    hostname: string,
  ) {
    this.environment = resolveEnvironment(hostname);
    this.cloudRole = `decipher-ms-${this.environment}`;
  }

  newSpanId(): string {
    return randomHex(8);
  }

  private push(baseType: string, baseData: Record<string, unknown>, parentId?: string): void {
    const tags: Record<string, string> = {
      "ai.operation.id": this.operationId,
      "ai.cloud.role": this.cloudRole,
      "ai.internal.sdkVersion": SDK_VERSION,
    };
    if (parentId) tags["ai.operation.parentId"] = parentId;
    this.envelopes.push({
      name: `Microsoft.ApplicationInsights.${baseType.replace(/Data$/, "")}`,
      time: new Date().toISOString(),
      iKey: AI_IKEY,
      tags,
      data: { baseType, baseData: { ver: 2, ...baseData } },
    });
  }

  trackRequest(args: {
    id: string;
    name: string;
    url: string;
    durationMs: number;
    responseCode: string;
    success: boolean;
    properties?: Record<string, string>;
  }): void {
    this.push("RequestData", {
      id: args.id,
      name: args.name,
      url: args.url,
      duration: formatDuration(args.durationMs),
      responseCode: args.responseCode,
      success: args.success,
      properties: args.properties ?? {},
    });
  }

  trackDependency(args: {
    id: string;
    parentId: string;
    name: string;
    type: string;
    target: string;
    data: string;
    durationMs: number;
    resultCode: string;
    success: boolean;
    properties?: Record<string, string>;
  }): void {
    this.push(
      "RemoteDependencyData",
      {
        id: args.id,
        name: args.name,
        type: args.type,
        target: args.target,
        data: args.data,
        duration: formatDuration(args.durationMs),
        resultCode: args.resultCode,
        success: args.success,
        properties: args.properties ?? {},
      },
      args.parentId,
    );
  }

  trackEvent(parentId: string, name: string, properties?: Record<string, string>): void {
    this.push("EventData", { name, properties: properties ?? {} }, parentId);
  }

  trackException(parentId: string, err: unknown, properties?: Record<string, string>): void {
    const e = err instanceof Error ? err : new Error(String(err));
    this.push(
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
        properties: properties ?? {},
      },
      parentId,
    );
  }

  flush(): void {
    const p = this.flushNow();
    if (p) this.ctx.waitUntil(p);
  }

  async flushNow(): Promise<void> {
    if (this.envelopes.length === 0) return;
    const payload = this.envelopes.map((e) => JSON.stringify(e)).join("\n");
    this.envelopes = [];
    const url = `${AI_INGESTION_ENDPOINT}/v2.1/track`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/x-json-stream" },
        body: payload,
      });
      if (!res.ok) {
        console.error("AI ingestion failed:", res.status, await res.text());
      }
    } catch (err) {
      console.error("AI ingestion error:", err);
    }
  }
}

type Timed<T> =
  | { ok: true; value: T; durationMs: number }
  | { ok: false; error: unknown; durationMs: number };

export async function timed<T>(fn: () => Promise<T>): Promise<Timed<T>> {
  const start = Date.now();
  try {
    const value = await fn();
    return { ok: true, value, durationMs: Date.now() - start };
  } catch (error) {
    return { ok: false, error, durationMs: Date.now() - start };
  }
}
