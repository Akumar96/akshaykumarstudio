import { isOwner } from "@/lib/studio/auth";
import { readDocument, invoiceSource } from "@/lib/studio/documents-store";
import { documentPdf } from "@/lib/studio/document-pdf";
export const runtime = "nodejs";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  try {
    const id = (await params).id;
    invoiceSource(id);
    const doc = readDocument(id);
    if (!doc.version)
      return new Response("Save the draft first.", { status: 409 });
    const kind =
      new URL(request.url).searchParams.get("kind") === "agreement"
        ? "agreement"
        : "invoice";
    const bytes = await documentPdf(doc, kind);
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${doc.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-")}-${kind}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return Response.json(
      {
        error:
          "Could not create the PDF. Check the saved draft and any unsupported characters.",
      },
      { status: 400 },
    );
  }
}
