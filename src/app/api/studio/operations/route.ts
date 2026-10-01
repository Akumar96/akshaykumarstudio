import { isOwner, sameOrigin } from "@/lib/studio/auth";
import {
  readOperations,
  changeOperations,
} from "@/lib/studio/operations-store";
export const runtime = "nodejs";
export async function GET() {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  return Response.json(readOperations(), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
export async function POST(request: Request) {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 20000) return new Response(null, { status: 413 });
    return Response.json(changeOperations(JSON.parse(raw)), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    const message = (e as Error).message;
    return Response.json(
      {
        error:
          message === "CONFLICT"
            ? "Records changed in another tab. Reload this page before saving."
            : message,
      },
      { status: message === "CONFLICT" ? 409 : 400 },
    );
  }
}
