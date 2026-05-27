import type { Env } from "./env";
import { sendBriefingEmail } from "./graph";

interface BriefingInput {
  name: string;
  email: string;
  company: string;
  role: string | null;
  topic: string;
  details: string;
}

function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

function isNonEmptyString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

function parseInput(raw: unknown): BriefingInput | string {
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
  };
}

export async function handleBriefing(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
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

  if (!insert) {
    return Response.json(
      { error: "Could not save" },
      { status: 500 },
    );
  }

  ctx.waitUntil(
    sendBriefingEmail(env, parsed)
      .then(() =>
        env.DB.prepare(
          "UPDATE briefing_requests SET email_sent = 1 WHERE id = ?",
        )
          .bind(insert.id)
          .run(),
      )
      .catch((err) => {
        console.error("Email send failed", err);
      }),
  );

  return Response.json({ ok: true, id: insert.id });
}
