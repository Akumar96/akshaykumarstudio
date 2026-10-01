import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createProject, updateProject } from "../src/lib/studio/store.ts";
import {
  readOperations,
  changeOperations,
} from "../src/lib/studio/operations-store.ts";
import {
  readDocument,
  saveDocument,
  writeDocument,
  prepareResend,
} from "../src/lib/studio/documents-store.ts";
import {
  invoiceStamp,
  documentIssues,
  documentTotals,
  projectText,
} from "../src/lib/studio/documents.ts";
import { documentPdf } from "../src/lib/studio/document-pdf.ts";
process.env.STUDIO_DATA_DIR = mkdtempSync(
  "/private/tmp/akstudio-documents-test-",
);
let invoice, doc;
test("imports client-facing offer fields and excludes internal qualification notes", () => {
  let p = createProject({
    name: "Harbour House",
    client: "Example Hotel",
    email: "client@example.com",
    type: "Hotel / hospitality",
  });
  p = updateProject(p.id, {
    version: 1,
    stage: "prequalify",
    values: { notes: "PRIVATE INTERNAL NOTE", budget: "PRIVATE BUDGET" },
  });
  p = updateProject(p.id, {
    version: p.version,
    stage: "presell",
    values: {
      fee: "1200",
      offer: "Hotel launch photography",
      recommendation: "Photographs for the hotel website.",
      deliverables: "20 edited photographs; website and full-resolution JPEGs.",
      usage: "Hotel website and owned social channels.",
      paymentTerms: "Payment instructions to be agreed.",
    },
  });
  assert.ok(!JSON.stringify(projectText(p)).includes("PRIVATE"));
  invoice = changeOperations({
    version: readOperations().version,
    action: "save",
    kind: "invoices",
    data: {
      label: "TEST-INVOICE-001",
      projectId: p.id,
      category: p.client,
      date: "2026-10-15",
      amount: "1200",
      status: "Draft",
    },
  }).entries.at(-1);
  doc = readDocument(invoice.id);
  assert.equal(doc.fields.clientEmail, "client@example.com");
  assert.equal(doc.fields.businessName, "Pinch Inc");
  assert.equal(doc.fields.businessAddress, "3190 Mission Hill Dr\nMississauga, ON, L5M0B2");
  assert.equal(doc.fields.businessEmail, "a.kumar.uwo@gmail.com");
  assert.equal(doc.fields.paymentTerms, "Payment instructions to be agreed.\nPayment recipient: a.kumar.uwo@gmail.com.");
  assert.equal(doc.fields.taxMode, "not-set");
  assert.equal(
    doc.fields.deliverables,
    "20 edited photographs; website and full-resolution JPEGs.",
  );
  assert.ok(documentIssues(doc.fields).length > 0);
});
test("validates recipient, taxes, stale saves and calculates cents precisely", () => {
  const fields = {
    ...doc.fields,
    businessAddress: "123 Example Street\nHalifax, NS",
    businessEmail: "studio@example.com",
    clientAddress: "456 Sample Avenue\nHalifax, NS",
    taxMode: "rate",
    taxRate: "13",
    taxId: "TEST REGISTRATION — SAMPLE ONLY",
    schedule: "Shoot: October 10, 2026. Delivery: October 14, 2026.",
    cancellation: "SAMPLE TEXT ONLY — replace with reviewed terms.",
    reviewed: true,
  };
  assert.throws(() =>
    saveDocument(invoice.id, {
      version: 0,
      invoiceStamp: invoiceStamp(invoice),
      fields: { ...fields, clientEmail: "a@example.com,b@example.com" },
    }),
  );
  doc = saveDocument(invoice.id, {
    version: 0,
    invoiceStamp: invoiceStamp(invoice),
    fields,
  });
  assert.deepEqual(documentTotals(doc), {
    subtotal: 120000,
    tax: 15600,
    total: 135600,
  });
  assert.equal(documentIssues(doc.fields).length, 0);
  assert.throws(
    () =>
      saveDocument(invoice.id, {
        version: 0,
        invoiceStamp: invoiceStamp(invoice),
        fields,
      }),
    /CONFLICT/,
  );
});
test("creates readable, paginated invoice and agreement PDFs", async () => {
  for (const kind of ["invoice", "agreement"]) {
    const bytes = await documentPdf(doc, kind);
    assert.ok(bytes.length > 1000);
    writeFileSync(join(process.env.STUDIO_DATA_DIR, `${kind}.pdf`), bytes);
  }
  console.log("PDF validation directory:", process.env.STUDIO_DATA_DIR);
});
test("uncertain sends block editing until explicitly prepared again", () => {
  writeDocument({ ...doc, sendState: "uncertain" });
  assert.throws(
    () =>
      saveDocument(invoice.id, {
        version: doc.version,
        invoiceStamp: invoiceStamp(invoice),
        fields: doc.fields,
      }),
    /previous send/,
  );
  const reset = prepareResend(invoice.id, doc.version);
  assert.equal(reset.sendState, "never");
  assert.equal(reset.fields.reviewed, false);
  assert.equal(reset.version, doc.version + 1);
});
