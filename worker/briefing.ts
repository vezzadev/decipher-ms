import type { Env } from "./env";
import { sendBriefingEmail } from "./graph";
import type { Telemetry } from "./telemetry";
import { timed } from "./telemetry";

interface BriefingInput {
  name: string;
  email: string;
  company: string;
  role: string | null;
  topic: string;
  details: string;
}

interface BriefingPayload extends BriefingInput {
  turnstileToken: string;
}

function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

function parseInput(raw: unknown): BriefingPayload | string {
  if (!raw || typeof raw !== "object") return "Body must be JSON object";
  const r = raw as Record<string, unknown>;
  if (!isNonEmptyString(r.name, 120)) return "name required (<=120 chars)";
  if (!isNonEmptyString(r.email, 255)) return "email required (<=255 chars)";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email))
    return "email invalid";
  if (!isNonEmptyString(r.company, 200)) return "company required (<=200)";
  if (!isNonEmptyString(r.topic, 200)) return "topic required (<=200)";
  if (!isNonEmptyString(r.details, 4000) || r.details.trim().length < 10)
    return "details required (10-4000 chars)";
  if (!isNonEmptyString(r.turnstileToken, 2048))
    return "turnstile challenge required";
  const role =
    typeof r.role === "string" && r.role.trim().length > 0
      ? r.role.trim().slice(0, 120)
      : null;
  return {
    name: r.name.trim(),
    email: r.email.trim(),
    company: r.company.trim(),
    role,
    topic: r.topic.trim(),
    details: r.details.trim(),
    turnstileToken: r.turnstileToken,
  };
}

interface TurnstileResult {
  success: boolean;
  httpStatus: number;
  errorCodes: string[];
  challengeTs?: string;
  hostname?: string;
  action?: string;
}

async function verifyTurnstile(
  env: Env,
  token: string,
  remoteIp: string | null,
): Promise<TurnstileResult> {
  const body = new FormData();
  body.append("secret", env.TURNSTILE_SECRET_KEY);
  body.append("response", token);
  if (remoteIp) body.append("remoteip", remoteIp);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );
  if (!res.ok) {
    return {
      success: false,
      httpStatus: res.status,
      errorCodes: [`http-${res.status}`],
    };
  }
  const json = (await res.json()) as {
    success: boolean;
    "error-codes"?: string[];
    challenge_ts?: string;
    hostname?: string;
    action?: string;
  };
  return {
    success: json.success === true,
    httpStatus: res.status,
    errorCodes: json["error-codes"] ?? [],
    challengeTs: json.challenge_ts,
    hostname: json.hostname,
    action: json.action,
  };
}

export async function handleBriefing(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  tel: Telemetry,
  parentId: string,
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return badRequest("Invalid JSON");
  }
  const parsed = parseInput(raw);
  if (typeof parsed === "string") return badRequest(parsed);

  const remoteIp = request.headers.get("cf-connecting-ip");
  const tsSpanId = tel.newSpanId();
  const ts = await timed(() => verifyTurnstile(env, parsed.turnstileToken, remoteIp));
  const depProps: Record<string, string> = {};
  if (remoteIp) depProps.remoteIp = remoteIp;
  if (ts.ok) {
    depProps.errorCodes = ts.value.errorCodes.join(",") || "(none)";
    if (ts.value.hostname) depProps.hostname = ts.value.hostname;
    if (ts.value.challengeTs) depProps.challengeTs = ts.value.challengeTs;
    if (ts.value.action) depProps.action = ts.value.action;
  } else {
    depProps.errorCodes = "network-error";
  }
  tel.trackDependency({
    id: tsSpanId,
    parentId,
    name: "turnstile siteverify",
    type: "HTTP",
    target: "challenges.cloudflare.com",
    data: "POST /turnstile/v0/siteverify",
    durationMs: ts.durationMs,
    resultCode: ts.ok ? String(ts.value.httpStatus) : "error",
    success: ts.ok && ts.value.success,
    properties: depProps,
  });
  if (!ts.ok) {
    tel.trackException(parentId, ts.error, { stage: "turnstile" });
    tel.addRequestProperty("failureReason", "turnstile_network_error");
    return badRequest("turnstile verification failed");
  }
  if (!ts.value.success) {
    const codes = ts.value.errorCodes.join(",") || "(none)";
    tel.trackEvent(parentId, "turnstile_rejected", {
      errorCodes: codes,
      httpStatus: String(ts.value.httpStatus),
      hostname: ts.value.hostname ?? "",
      action: ts.value.action ?? "",
    });
    tel.addRequestProperty("failureReason", "turnstile_rejected");
    tel.addRequestProperty("turnstileErrorCodes", codes);
    return badRequest("turnstile verification failed");
  }

  const dbSpanId = tel.newSpanId();
  const dbStart = Date.now();
  const insert = await env.DB.prepare(
    "INSERT INTO briefing_requests (name, email, company, role, topic, details) VALUES (?, ?, ?, ?, ?, ?) RETURNING id",
  )
    .bind(
      parsed.name,
      parsed.email,
      parsed.company,
      parsed.role,
      parsed.topic,
      parsed.details,
    )
    .first<{ id: number }>();
  tel.trackDependency({
    id: dbSpanId,
    parentId,
    name: "D1 insert briefing_requests",
    type: "SQL",
    target: "decipher-ms-db",
    data: "INSERT INTO briefing_requests ... RETURNING id",
    durationMs: Date.now() - dbStart,
    resultCode: insert ? "200" : "500",
    success: !!insert,
  });

  if (!insert) {
    return Response.json(
      { error: "Could not save" },
      { status: 500 },
    );
  }

  tel.trackEvent(parentId, "briefing_received", {
    requestId: String(insert.id),
    topic: parsed.topic,
  });

  ctx.waitUntil(
    (async () => {
      try {
        await sendBriefingEmail(env, parsed, tel, parentId);
        tel.trackEvent(parentId, "briefing_email_sent", {
          requestId: String(insert.id),
        });
        await env.DB.prepare(
          "UPDATE briefing_requests SET email_sent = 1 WHERE id = ?",
        )
          .bind(insert.id)
          .run();
      } catch (err) {
        console.error("Email send failed", err);
        tel.trackException(parentId, err, {
          stage: "sendBriefingEmail",
          requestId: String(insert.id),
        });
      }
      await tel.flushNow();
    })(),
  );

  return Response.json({ ok: true, id: insert.id });
}
