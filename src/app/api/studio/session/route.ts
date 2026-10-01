import { cookies } from "next/headers";
import {
  issueSession,
  ownerKey,
  sameSecret,
  sameOrigin,
} from "@/lib/studio/auth";
export const runtime = "nodejs";
const failures = new Map<string, { count: number; until: number }>();
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return Response.json({ error: "Invalid origin" }, { status: 403 });
  // One owner: a global cooldown avoids trusting spoofable forwarding headers.
  const key = "owner",
    attempt = failures.get(key);
  if (attempt && attempt.until > Date.now() && attempt.count >= 10)
    return Response.json(
      { error: "Too many attempts. Try again in 15 minutes." },
      { status: 429 },
    );
  const body = await request.text();
  if (body.length > 2048) return new Response(null, { status: 413 });
  let password = "";
  try {
    password = JSON.parse(body).password || "";
  } catch {
    return new Response(null, { status: 400 });
  }
  if (typeof password !== "string" || !sameSecret(password, ownerKey())) {
    const previous = attempt && attempt.until > Date.now() ? attempt.count : 0;
    failures.set(key, { count: previous + 1, until: Date.now() + 900000 });
    return Response.json(
      { error: "That access key is not correct." },
      { status: 401 },
    );
  }
  failures.delete(key);
  (await cookies()).set("studio_owner", issueSession(), {
    httpOnly: true,
    sameSite: "strict",
    secure: new URL(request.headers.get("origin")!).protocol === "https:",
    path: "/",
    maxAge: 43200,
  });
  return Response.json(
    { ok: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  (await cookies()).delete("studio_owner");
  return Response.json({ ok: true });
}
