import { isOwner, sameOrigin } from "@/lib/studio/auth";
import {
  readDocument,
  writeDocument,
  invoiceSource,
} from "@/lib/studio/documents-store";
import { documentIssues, invoiceStamp } from "@/lib/studio/documents";
import { documentPdf } from "@/lib/studio/document-pdf";
import { emailConfigured, emailTransport } from "@/lib/studio/document-email";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  readOperations,
  changeOperations,
} from "@/lib/studio/operations-store";
import { studioDir } from "@/lib/studio/store";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isOwner())) return new Response(null, { status: 401 });
  if (!sameOrigin(request)) return new Response(null, { status: 403 });
  if (!emailConfigured())
    return Response.json(
      {
        error:
          "Email sending is not configured. Download the PDFs and open your email draft instead.",
      },
      { status: 503 },
    );
  const id = (await params).id;
  let claimed = false;
  try {
    const body = await request.json();
    let doc = readDocument(id);
    if (body.confirm !== true || body.version !== doc.version || !doc.version)
      throw new Error("Review and confirm the saved revision.");
    if (doc.sendState !== "never")
      throw new Error(
        "This document already has a send attempt. Check your email account before sending another copy.",
      );
    if (doc.invoiceStamp !== invoiceStamp(invoiceSource(id).invoice))
      throw new Error(
        "Invoice details changed. Save and review the updated document first.",
      );
    const issues = documentIssues(doc.fields);
    if (issues.length) throw new Error(issues.join(" "));
    const invoice = await documentPdf(doc, "invoice"),
      agreement = await documentPdf(doc, "agreement");
    // Claim synchronously after PDF creation so simultaneous requests cannot both send.
    const current = readDocument(id);
    if (current.version !== doc.version || current.sendState !== "never")
      throw new Error("The draft changed or a send is already in progress.");
    const archive = join(
      studioDir(),
      "documents",
      "outbox",
      `${id}-${doc.version}`,
    );
    mkdirSync(archive, { recursive: true, mode: 0o700 });
    writeFileSync(join(archive, "invoice.pdf"), invoice, { mode: 0o600 });
    writeFileSync(join(archive, "agreement.pdf"), agreement, { mode: 0o600 });
    writeFileSync(
      join(archive, "snapshot.json"),
      JSON.stringify(doc, null, 2),
      { mode: 0o600 },
    );
    doc = {
      ...doc,
      sendState: "sending",
      sendAttemptAt: new Date().toISOString(),
    };
    writeDocument(doc);
    claimed = true;
    const result = await emailTransport().sendMail({
      from: process.env.STUDIO_MAIL_FROM,
      to: doc.fields.clientEmail,
      replyTo: doc.fields.businessEmail,
      subject: doc.fields.emailSubject,
      text: doc.fields.emailBody,
      attachments: [
        {
          filename: `invoice-${doc.invoiceNumber.replace(/[^a-zA-Z0-9_-]/g, "-")}.pdf`,
          content: Buffer.from(invoice),
          contentType: "application/pdf",
        },
        {
          filename: "project-agreement.pdf",
          content: Buffer.from(agreement),
          contentType: "application/pdf",
        },
      ],
    });
    if (!result.accepted?.length) throw new Error("No recipient accepted");
    writeDocument({
      ...doc,
      sendState: "accepted",
      sentAt: new Date().toISOString(),
      sentRevision: doc.version,
      messageId: result.messageId,
    });
    try {
      const operations = readOperations();
      const currentInvoice = operations.entries.find((e) => e.id === id);
      if (
        currentInvoice &&
        invoiceStamp(currentInvoice) === doc.invoiceStamp &&
        currentInvoice.status === "Draft"
      )
        changeOperations({
          version: operations.version,
          action: "save",
          kind: "invoices",
          id,
          data: {
            ...currentInvoice,
            amount: (currentInvoice.amount / 100).toFixed(2),
            status: "Sent",
          },
        });
    } catch {
      console.error(
        "Email accepted; invoice register needs manual status update:",
        id,
      );
    }
    return Response.json({
      ok: true,
      message:
        "Your email server accepted the message with both PDFs attached. This is not delivery or signature confirmation.",
    });
  } catch (e) {
    if (claimed) {
      const doc = readDocument(id);
      writeDocument({ ...doc, sendState: "uncertain" });
      return Response.json(
        {
          error:
            "The send result is uncertain. Check your Sent folder or email provider before retrying. Automatic retries are blocked to prevent duplicates.",
        },
        { status: 502 },
      );
    }
    return Response.json({ error: (e as Error).message }, { status: 409 });
  }
}
