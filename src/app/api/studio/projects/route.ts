import { isOwner, sameOrigin } from "@/lib/studio/auth";
import { createProject, readProjects } from "@/lib/studio/store";
export const runtime = "nodejs";
export async function GET() {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  return Response.json(readProjects(), {
    headers: { "Cache-Control": "private, no-store" },
  });
}
export async function POST(request: Request) {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const body = await request.text();
    if (body.length > 10000) return new Response(null, { status: 413 });
    return Response.json(createProject(JSON.parse(body)), { status: 201 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
