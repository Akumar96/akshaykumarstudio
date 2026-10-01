import {
  mkdirSync,
  existsSync,
  readFileSync,
  writeFileSync,
  renameSync,
} from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { studioDir, readProjects } from "./store.ts";
import { readOperations } from "./operations-store.ts";
import { validDate } from "./operations.ts";
import {
  initialFields,
  invoiceStamp,
  type InvoiceDocument,
  type DocumentFields,
} from "./documents.ts";
function file(id: string) {
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new Error("Invalid invoice ID");
  const dir = join(studioDir(), "documents");
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  return join(dir, `${id}.json`);
}
export function invoiceSource(id: string) {
  const invoice = readOperations().entries.find(
    (e) => e.kind === "invoices" && e.id === id && !e.archived,
  );
  if (!invoice) throw new Error("Invoice not found");
  return {
    invoice,
    project: readProjects().find((p) => p.id === invoice.projectId),
  };
}
export function readDocument(id: string): InvoiceDocument {
  const path = file(id);
  if (existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  const { invoice, project } = invoiceSource(id);
  return {
    invoiceId: id,
    version: 0,
    invoiceStamp: invoiceStamp(invoice),
    invoiceNumber: invoice.label,
    subtotal: invoice.amount,
    dueDate: invoice.date,
    projectVersion: project?.version || 0,
    fields: initialFields(invoice, project),
    updatedAt: "",
    sendState: "never",
  };
}
export function writeDocument(doc: InvoiceDocument) {
  const path = file(doc.invoiceId),
    temp = `${path}.${randomUUID()}.tmp`;
  writeFileSync(temp, JSON.stringify(doc, null, 2), {
    flag: "wx",
    mode: 0o600,
  });
  renameSync(temp, path);
}
export function saveDocument(id: string, body: Record<string, unknown>) {
  const current = readDocument(id);
  if (body.version !== current.version) throw new Error("CONFLICT");
  if (current.sendState === "sending" || current.sendState === "uncertain")
    throw new Error("Check the previous send attempt before editing.");
  const { invoice, project } = invoiceSource(id);
  if (body.invoiceStamp !== invoiceStamp(invoice))
    throw new Error(
      "Invoice details changed. Reload and review before saving.",
    );
  const incoming = body.fields as DocumentFields;
  const fields = {} as DocumentFields;
  if (!incoming || typeof incoming !== "object")
    throw new Error("Missing document fields");
  for (const key of Object.keys(
    initialFields(invoice, project),
  ) as (keyof DocumentFields)[]) {
    if (key === "reviewed") {
      fields.reviewed = incoming.reviewed === true;
      continue;
    }
    const value = incoming[key];
    if (
      typeof value !== "string" ||
      value.length > (key === "emailBody" ? 5000 : 6000)
    )
      throw new Error("Invalid or overly long document field");
    fields[key] = value.trim();
  }
  for (const key of ["clientEmail", "businessEmail"] as const)
    if (
      fields[key] &&
      !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(fields[key])
    )
      throw new Error("Enter one valid email address per email field.");
  if (/[\r\n]/.test(fields.emailSubject))
    throw new Error("Email subject must be one line.");
  if (!validDate(fields.issuedDate))
    throw new Error("Choose a valid invoice date.");
  if (!["not-set", "none", "rate"].includes(fields.taxMode))
    throw new Error("Choose a tax treatment.");
  if (
    fields.taxMode === "rate" &&
    (!/^\d{1,2}(\.\d{1,3})?$/.test(fields.taxRate) ||
      Number(fields.taxRate) > 30)
  )
    throw new Error("Enter a tax percentage between 0 and 30.");
  const doc: InvoiceDocument = {
    ...current,
    version: current.version + 1,
    invoiceNumber: invoice.label,
    subtotal: invoice.amount,
    dueDate: invoice.date,
    invoiceStamp: invoiceStamp(invoice),
    projectVersion: project?.version || 0,
    fields,
    updatedAt: new Date().toISOString(),
  };
  writeDocument(doc);
  return doc;
}

export function prepareResend(id: string, version: number) {
  const doc = readDocument(id);
  if (doc.version !== version) throw new Error("CONFLICT");
  if (
    doc.sendState === "sending" &&
    (!doc.sendAttemptAt || Date.now() - Date.parse(doc.sendAttemptAt) < 120000)
  )
    throw new Error(
      "A send is still in progress. Check the email provider before changing this state.",
    );
  const next = {
    ...doc,
    version: doc.version + 1,
    sendState: "never" as const,
    fields: { ...doc.fields, reviewed: false },
    updatedAt: new Date().toISOString(),
  };
  writeDocument(next);
  return next;
}
