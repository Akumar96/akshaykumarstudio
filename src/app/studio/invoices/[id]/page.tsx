import { redirect, notFound } from "next/navigation";
import { isOwner } from "@/lib/studio/auth";
import { readDocument, invoiceSource } from "@/lib/studio/documents-store";
import { emailConfigured } from "@/lib/studio/document-email";
import StudioFrame from "@/components/studio/StudioFrame";
import InvoiceComposer from "@/components/studio/InvoiceComposer";
export default async function InvoiceEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isOwner())) redirect("/studio/login");
  const { id } = await params;
  let source, initial;
  try {
    source = invoiceSource(id);
    initial = readDocument(id);
  } catch {
    notFound();
  }
  return (
    <StudioFrame>
      <InvoiceComposer
        initial={initial}
        invoice={source.invoice}
        project={source.project}
        emailReady={emailConfigured()}
      />
    </StudioFrame>
  );
}
