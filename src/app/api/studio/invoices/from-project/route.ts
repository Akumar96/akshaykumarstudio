import { isOwner, sameOrigin } from "@/lib/studio/auth";
import { readProjects } from "@/lib/studio/store";
import {
  readOperations,
  changeOperations,
} from "@/lib/studio/operations-store";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  try {
    const raw = await request.text();
    if (raw.length > 5000) return new Response(null, { status: 413 });
    const body = JSON.parse(raw),
      project = readProjects().find(
        (p) => p.id === body.projectId && !p.archived,
      );
    if (!project || project.version !== body.projectVersion)
      throw new Error("Project changed. Reload before creating the invoice.");
    const db = changeOperations({
      version: readOperations().version,
      action: "save",
      kind: "invoices",
      data: {
        label: body.number,
        date: body.date,
        amount: String(project.sections.presell?.fee || ""),
        category: project.client,
        projectId: project.id,
        status: "Draft",
        notes:
          "Drafted from the saved project offer. Review scope and billing before sending.",
      },
    });
    return Response.json({ id: db.entries.at(-1)!.id }, { status: 201 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
