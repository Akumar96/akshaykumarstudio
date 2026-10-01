import type { Entry } from "./operations.ts";
import type { Project } from "./workflow.ts";
import { today } from "./operations.ts";
export type DocumentFields = {
  businessName: string;
  businessAddress: string;
  businessEmail: string;
  taxId: string;
  taxMode: string;
  taxRate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  issuedDate: string;
  title: string;
  scope: string;
  deliverables: string;
  usage: string;
  schedule: string;
  paymentTerms: string;
  revisions: string;
  exclusions: string;
  cancellation: string;
  additionalTerms: string;
  emailSubject: string;
  emailBody: string;
  reviewed: boolean;
};
export type InvoiceDocument = {
  invoiceId: string;
  version: number;
  invoiceStamp: string;
  invoiceNumber: string;
  subtotal: number;
  dueDate: string;
  projectVersion: number;
  fields: DocumentFields;
  updatedAt: string;
  sendState: "never" | "sending" | "accepted" | "uncertain";
  sentAt?: string;
  sentRevision?: number;
  sendAttemptAt?: string;
  messageId?: string;
};
export const fieldLabels: Record<keyof DocumentFields, string> = {
  businessName: "Business / trading name",
  businessAddress: "Business billing address",
  businessEmail: "Business contact email",
  taxId: "Tax registration number (if applicable)",
  taxMode: "Tax treatment",
  taxRate: "Tax rate (%)",
  clientName: "Client / business",
  clientEmail: "Recipient email",
  clientAddress: "Client billing address",
  issuedDate: "Invoice date",
  title: "Project / agreement title",
  scope: "Project scope",
  deliverables: "Included deliverables",
  usage: "Usage and permitted recipients",
  schedule: "Shoot and delivery schedule",
  paymentTerms: "Payment instructions and schedule",
  revisions: "Review rounds and revisions",
  exclusions: "Exclusions / optional additions",
  cancellation: "Cancellation and rescheduling terms",
  additionalTerms: "Additional agreement terms",
  emailSubject: "Email subject",
  emailBody: "Email message",
  reviewed: "I reviewed the invoice, agreement terms, recipient and totals",
};
export function invoiceStamp(invoice: Entry) {
  return JSON.stringify([
    invoice.id,
    invoice.label,
    invoice.amount,
    invoice.date,
    invoice.projectId,
    invoice.archived,
  ]);
}
export function projectText(project?: Project): Partial<DocumentFields> {
  if (!project) return {};
  const s = project.sections;
  const value = (stage: string, key: string) => String(s[stage]?.[key] || "");
  return {
    clientName: project.client,
    clientEmail: project.email,
    title: value("presell", "offer") || project.name,
    scope: value("presell", "recommendation"),
    deliverables: value("presell", "deliverables"),
    usage: value("presell", "usage"),
    paymentTerms: value("presell", "paymentTerms"),
    revisions: value("presell", "revisions"),
    exclusions: value("presell", "exclusions"),
    schedule: [
      value("plan", "shootDate") && `Shoot date: ${value("plan", "shootDate")}`,
      value("pickup", "deliveryDate") &&
        `Delivery date: ${value("pickup", "deliveryDate")}`,
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
export function initialFields(
  invoice: Entry,
  project?: Project,
): DocumentFields {
  const projectFields = projectText(project);
  return {
    businessName: "Pinch Inc",
    businessAddress: "3190 Mission Hill Dr\nMississauga, ON, L5M0B2",
    businessEmail: "a.kumar.uwo@gmail.com",
    taxId: "",
    taxMode: "not-set",
    taxRate: "",
    clientName: invoice.category,
    clientEmail: "",
    clientAddress: "",
    issuedDate: today(),
    title: invoice.label,
    scope: "",
    deliverables: "",
    usage: "",
    schedule: "",
    revisions: "",
    exclusions: "",
    cancellation: "",
    additionalTerms: "",
    ...projectFields,
    paymentTerms: [projectFields.paymentTerms, "Payment recipient: a.kumar.uwo@gmail.com."]
      .filter(Boolean)
      .join("\n"),
    emailSubject: `Invoice ${invoice.label} and project agreement`,
    emailBody: `Hi ${project?.client || invoice.category || "there"},\n\nPlease find attached the invoice and project agreement for ${project?.name || "your photography project"}. Please review the scope, usage and payment schedule, and let me know if anything needs adjusting.\n\nThank you,\nAkshay\nPinch Inc`,
    reviewed: false,
  };
}
export function documentIssues(fields: DocumentFields) {
  const issues: string[] = [];
  for (const key of [
    "businessName",
    "businessAddress",
    "businessEmail",
    "clientName",
    "clientEmail",
    "clientAddress",
    "scope",
    "deliverables",
    "usage",
    "schedule",
    "paymentTerms",
    "cancellation",
    "emailSubject",
    "emailBody",
  ] as const)
    if (!fields[key].trim()) issues.push(`${fieldLabels[key]} is missing.`);
  if (fields.taxMode === "not-set") issues.push("Choose the tax treatment.");
  if (fields.taxMode === "rate" && !fields.taxId.trim())
    issues.push("Enter your tax registration number.");
  if (!fields.reviewed)
    issues.push("Review and approve the documents before sending.");
  return issues;
}
export function documentTotals(document: InvoiceDocument) {
  const rate =
    document.fields.taxMode === "rate" ? Number(document.fields.taxRate) : 0;
  const tax = Math.round((document.subtotal * rate) / 100);
  return { subtotal: document.subtotal, tax, total: document.subtotal + tax };
}
