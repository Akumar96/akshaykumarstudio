import { isOwner, sameOrigin } from "@/lib/studio/auth";
import { updateProject } from "@/lib/studio/store";
export const runtime = "nodejs";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const body = await request.text();
    if (body.length > 150000) return new Response(null, { status: 413 });
    return Response.json(updateProject((await params).id, JSON.parse(body)), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    const message = (e as Error).message;
    return Response.json(
      {
        error:
          message === "CONFLICT"
            ? "This project changed in another tab. Reload before saving; your entries have not been overwritten."
            : message,
      },
      { status: message === "CONFLICT" ? 409 : 400 },
    );
  }
}
