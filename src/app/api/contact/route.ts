import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { confirmationEmail, notificationEmail } from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16_000;
const MIN_FILL_MS = 2_500; // faster than this is almost certainly a bot

const json = (status: number, body: Record<string, unknown>, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers });

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; other checks still apply
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, CONTACT_SEND_CONFIRMATION } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL in environment.");
    return json(500, { ok: false, error: "The contact form isn't configured yet. Please email me directly." });
  }

  if (!sameOrigin(req)) return json(403, { ok: false, error: "Forbidden." });
  if (!req.headers.get("content-type")?.includes("application/json")) return json(415, { ok: false, error: "Unsupported content type." });
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return json(413, { ok: false, error: "Message is too large." });

  const ip = clientIp(req);
  const limit = rateLimit(`contact:${ip}`);
  if (!limit.ok) {
    return json(429, { ok: false, error: "Too many messages. Please try again in a few minutes." }, { "Retry-After": String(limit.retryAfter) });
  }

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY_BYTES) return json(413, { ok: false, error: "Message is too large." });
    raw = JSON.parse(text);
  } catch {
    return json(400, { ok: false, error: "Invalid request." });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (key === "company" || key === "startedAt") continue;
      fieldErrors[key] ??= issue.message;
    }
    // Honeypot / timing failures: pretend success so bots learn nothing.
    if (Object.keys(fieldErrors).length === 0) return json(200, { ok: true });
    return json(422, { ok: false, error: "Please check the highlighted fields.", fieldErrors });
  }

  const data = parsed.data;
  if (Date.now() - data.startedAt < MIN_FILL_MS) return json(200, { ok: true });

  const resend = new Resend(RESEND_API_KEY);
  const mail = notificationEmail({ ...data, ip });

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL.split(",").map((s) => s.trim()).filter(Boolean),
      replyTo: data.email,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) {
      console.error("[contact] Resend error:", error);
      return json(502, { ok: false, error: "Couldn't send right now. Please try again shortly." });
    }

    if (CONTACT_SEND_CONFIRMATION === "true") {
      const c = confirmationEmail(data);
      // Best effort: failure here should not fail the request.
      resend.emails.send({ from: CONTACT_FROM_EMAIL, to: data.email, subject: c.subject, html: c.html, text: c.text })
        .then(({ error: e }) => e && console.warn("[contact] Confirmation not sent:", e))
        .catch((e) => console.warn("[contact] Confirmation not sent:", e));
    }

    return json(200, { ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return json(500, { ok: false, error: "Something went wrong. Please try again." });
  }
}

export function GET() {
  return json(405, { ok: false, error: "Method not allowed." }, { Allow: "POST" });
}
