import { isOwner, sameOrigin } from "@/lib/studio/auth";
import { saveDocument, prepareResend } from "@/lib/studio/documents-store";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const text = await request.text();
    if (text.length > 150000) return new Response(null, { status: 413 });
    const body = JSON.parse(text);
    const id = (await params).id;
    if (body.action === "prepare-resend" && body.confirm === true)
      return Response.json(prepareResend(id, body.version), {
        headers: { "Cache-Control": "no-store" },
      });
    return Response.json(saveDocument(id, body), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 409 });
  }
}
