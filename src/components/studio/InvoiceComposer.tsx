"use client";
import { useState } from "react";
import Link from "next/link";
import {
  fieldLabels,
  documentIssues,
  documentTotals,
  projectText,
  invoiceStamp,
  type InvoiceDocument,
  type DocumentFields,
} from "@/lib/studio/documents";
import { money, type Entry } from "@/lib/studio/operations";
import type { Project } from "@/lib/studio/workflow";
export default function InvoiceComposer({
  initial,
  invoice,
  project,
  emailReady,
}: {
  initial: InvoiceDocument;
  invoice: Entry;
  project?: Project;
  emailReady: boolean;
}) {
  const [doc, setDoc] = useState(initial),
    [fields, setFields] = useState(initial.fields),
    [dirty, setDirty] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [error, setError] = useState(false),
    [confirmSend, setConfirmSend] = useState(false);
  const issues = documentIssues(fields),
    totals = documentTotals({ ...doc, subtotal: invoice.amount, fields });
  const update = (key: keyof DocumentFields, value: string | boolean) => {
    setFields((previous) => ({
      ...previous,
      [key]: value,
      ...(key !== "reviewed" ? { reviewed: false } : {}),
    }));
    setDirty(true);
    setConfirmSend(false);
  };
  async function save() {
    setBusy(true);
    setError(false);
    try {
      const response = await fetch(`/api/studio/invoices/${invoice.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: doc.version,
          invoiceStamp: invoiceStamp(invoice),
          fields,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Save failed");
      setDoc(data);
      setFields(data.fields);
      setDirty(false);
      setMessage("Draft saved. PDF downloads now use this revision.");
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function send() {
    setBusy(true);
    setError(false);
    try {
      const response = await fetch(`/api/studio/invoices/${invoice.id}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: doc.version, confirm: confirmSend }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 502)
          setDoc((previous) => ({ ...previous, sendState: "uncertain" }));
        throw new Error(data.error || "Send failed");
      }
      setDoc((previous) => ({
        ...previous,
        sendState: "accepted",
        sentRevision: previous.version,
      }));
      setMessage(data.message);
      setConfirmSend(false);
    } catch (e) {
      setError(true);
      setMessage((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const field = (key: keyof DocumentFields, multiline = false) =>
    key === "reviewed" ? null : (
      <label key={key} className={multiline ? "studio-wide" : ""}>
        {fieldLabels[key]}
        {key === "taxMode" ? (
          <select
            value={fields.taxMode}
            onChange={(e) => update(key, e.target.value)}
          >
            <option value="not-set">Choose tax treatment</option>
            <option value="none">No tax charged</option>
            <option value="rate">Charge the rate entered below</option>
          </select>
        ) : multiline ? (
          <textarea
            rows={key === "emailBody" ? 8 : 4}
            maxLength={key === "emailBody" ? 5000 : 6000}
            value={String(fields[key])}
            onChange={(e) => update(key, e.target.value)}
          />
        ) : (
          <input
            type={
              key === "issuedDate"
                ? "date"
                : key.includes("Email")
                  ? "email"
                  : key === "taxRate"
                    ? "number"
                    : "text"
            }
            min={key === "taxRate" ? 0 : undefined}
            max={key === "taxRate" ? 30 : undefined}
            step={key === "taxRate" ? "0.001" : undefined}
            maxLength={6000}
            value={String(fields[key])}
            onChange={(e) => update(key, e.target.value)}
          />
        )}
      </label>
    );
  return (
    <>
      <header className="studio-title">
        <div>
          <span className="eyebrow accent">
            Invoice {invoice.label} / Document editor
          </span>
          <h1>
            Clear terms.
            <br />
            <i>A considered handoff.</i>
          </h1>
        </div>
        <p>
          Prepare an invoice, project agreement and email from your saved
          project details. Review every field before sending.
        </p>
      </header>
      <div className="ops-toolbar">
        <Link className="text-link" href="/studio/dashboards/invoices">
          ← Invoice register
        </Link>
        {project && (
          <Link className="text-link" href={`/studio/${project.id}/presell`}>
            Project offer ↗
          </Link>
        )}
        <span className="contact-prompt">
          {doc.version ? `Saved revision ${doc.version}` : "New draft"} ·{" "}
          {dirty ? "Unsaved changes" : "No unsaved changes"}
        </span>
      </div>
      <div className="ops-stats">
        <div className="ops-stat">
          <span className="eyebrow">Invoice subtotal · CAD</span>
          <strong>{money(invoice.amount)}</strong>
          <small>Change the amount in the invoice register.</small>
        </div>
        <div className="ops-stat">
          <span className="eyebrow">Tax</span>
          <strong>
            {fields.taxMode === "not-set" ? "Not set" : money(totals.tax)}
          </strong>
        </div>
        <div className="ops-stat">
          <span className="eyebrow">Total · CAD</span>
          <strong>
            {fields.taxMode === "not-set" ? "Review tax" : money(totals.total)}
          </strong>
          <small>
            Due {invoice.date}. This is the invoice total, before any recorded
            payments.
          </small>
        </div>
      </div>
      {message && (
        <p
          role={error ? "alert" : "status"}
          className={`ops-message ${error ? "studio-error" : ""}`}
        >
          {message}
        </p>
      )}
      <div className="composer-layout">
        <form
          className="studio-form"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <section className="composer-section">
            <h2>Business & billing</h2>
            <div className="studio-fields">
              {field("businessName")}
              {field("businessEmail")}
              {field("businessAddress", true)}
              {field("clientName")}
              {field("clientEmail")}
              {field("clientAddress", true)}
              {field("issuedDate")}
              {field("taxMode")}
              {field("taxRate")}
              {field("taxId")}
            </div>
            <p className="contact-prompt">
              Tax is not inferred from your address. Choose the treatment that
              applies to your business and this invoice.
            </p>
          </section>
          <section className="composer-section">
            <h2>Project agreement</h2>
            <p className="contact-prompt">
              Editable working draft, not a pre-approved legal template. Add
              your reviewed cancellation and other contract terms. This does not
              provide electronic signing.
            </p>
            <div className="composer-tools">
              <button
                type="button"
                className="studio-secondary"
                onClick={() => {
                  const imported = projectText(project);
                  setFields((previous) => {
                    const next = { ...previous, reviewed: false };
                    for (const [key, value] of Object.entries(imported))
                      if (
                        !String(previous[key as keyof DocumentFields]).trim() &&
                        value
                      )
                        Object.assign(next, { [key]: value });
                    return next;
                  });
                  setDirty(true);
                  setMessage(
                    "Filled empty fields from the linked project; existing wording was kept.",
                  );
                }}
              >
                Fill empty fields from project
              </button>
              <button
                className="studio-secondary"
                type="button"
                onClick={() => {
                  setFields(
                    (previous) =>
                      Object.fromEntries(
                        Object.entries(previous).map(([key, value]) => [
                          key,
                          key === "reviewed"
                            ? false
                            : typeof value === "string"
                              ? value
                                  .split("\n")
                                  .map((line) =>
                                    line.replace(/[ \t]+/g, " ").trim(),
                                  )
                                  .join("\n")
                                  .replace(/\n{3,}/g, "\n\n")
                              : value,
                        ]),
                      ) as DocumentFields,
                  );
                  setDirty(true);
                  setMessage(
                    "Spacing tidied. Wording and amounts were not rewritten.",
                  );
                }}
              >
                Tidy formatting
              </button>
            </div>
            {project &&
              project.version !== doc.projectVersion &&
              doc.version > 0 && (
                <p className="ops-message">
                  Project notes have changed since this draft was saved. Review
                  the scope and dates against the project before sending.
                </p>
              )}
            <div className="studio-fields">
              {field("title", true)}
              {(
                [
                  "scope",
                  "deliverables",
                  "usage",
                  "schedule",
                  "paymentTerms",
                  "revisions",
                  "exclusions",
                  "cancellation",
                  "additionalTerms",
                ] as const
              ).map((key) => field(key, true))}
            </div>
          </section>
          <section className="composer-section">
            <h2>Email draft</h2>
            <div className="studio-fields">
              {field("emailSubject", true)}
              {field("emailBody", true)}
            </div>
          </section>
          <label className="ops-checkbox">
            <input
              type="checkbox"
              checked={fields.reviewed}
              onChange={(e) => update("reviewed", e.target.checked)}
            />
            {fieldLabels.reviewed}
          </label>
          <div className="studio-save">
            <button
              disabled={
                busy ||
                doc.sendState === "sending" ||
                doc.sendState === "uncertain"
              }
            >
              {busy ? "Working…" : "Save draft"}
            </button>
          </div>
        </form>
        <aside className="composer-aside">
          <h2>Review & send</h2>
          <p>
            Private project notes, budget assessments and internal objections
            are never imported.
          </p>
          {issues.length ? (
            <details open>
              <summary>{issues.length} items to review</summary>
              <ul>
                {issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </details>
          ) : (
            <p className="ops-message">
              Required fields are complete. Review the exported PDFs before
              sending.
            </p>
          )}
          {doc.version > 0 && !dirty ? (
            <div className="composer-downloads">
              <a
                className="button-link"
                href={`/api/studio/invoices/${invoice.id}/pdf?kind=invoice`}
              >
                Download invoice PDF ↓
              </a>
              <a
                className="button-link"
                href={`/api/studio/invoices/${invoice.id}/pdf?kind=agreement`}
              >
                Download agreement PDF ↓
              </a>
            </div>
          ) : (
            <p className="contact-prompt">
              Save your changes to enable PDF downloads.
            </p>
          )}
          <h3>Use your email app</h3>
          <p>
            Download both PDFs first, then attach them to the email draft.
            Opening your email app does not attach files or mark this invoice as
            sent.
          </p>
          {!dirty && doc.version > 0 && issues.length === 0 ? (
            <a
              className="text-link"
              href={`mailto:${encodeURIComponent(fields.clientEmail)}?subject=${encodeURIComponent(fields.emailSubject)}&body=${encodeURIComponent(fields.emailBody)}`}
            >
              Open prepared email ↗
            </a>
          ) : (
            <p className="contact-prompt">
              Complete the review and save to prepare your email.
            </p>
          )}
          <h3>Send from the dashboard</h3>
          <p>
            {emailReady
              ? "Both saved PDFs will be attached. The sender is the email account configured on your server."
              : "Connect an SMTP email account on your server to enable sending with both PDFs attached."}
          </p>
          <p className="contact-prompt">
            Send status:{" "}
            {doc.sendState === "never"
              ? "Not sent from dashboard"
              : doc.sendState === "accepted"
                ? `Revision ${doc.sentRevision || doc.version} accepted by email server; delivery not confirmed`
                : doc.sendState === "uncertain"
                  ? "Uncertain — check your email provider"
                  : "Sending / awaiting result"}
          </p>
          {["accepted", "uncertain", "sending"].includes(doc.sendState) && (
            <button
              type="button"
              className="ops-text-button"
              onClick={async () => {
                if (
                  !window.confirm(
                    "Check your email provider first. If an earlier message arrived, another send will create a duplicate. Prepare a new revision for review?",
                  )
                )
                  return;
                const response = await fetch(
                  `/api/studio/invoices/${invoice.id}`,
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      action: "prepare-resend",
                      confirm: true,
                      version: doc.version,
                    }),
                  },
                );
                const data = await response.json();
                if (!response.ok) {
                  setError(true);
                  setMessage(
                    data.error || "Could not prepare another revision",
                  );
                  return;
                }
                setDoc(data);
                setFields(data.fields);
                setDirty(false);
                setConfirmSend(false);
                setMessage(
                  "New revision prepared. Review and save before sending.",
                );
              }}
            >
              Prepare another send after checking the previous attempt
            </button>
          )}
          {emailReady && doc.sendState === "never" && (
            <>
              <label className="ops-checkbox">
                <input
                  type="checkbox"
                  checked={confirmSend}
                  onChange={(e) => setConfirmSend(e.target.checked)}
                />
                Send this saved revision and both PDFs to{" "}
                {fields.clientEmail || "the recipient above"}.
              </label>
              <button
                className="ops-primary"
                disabled={
                  busy ||
                  dirty ||
                  !doc.version ||
                  issues.length > 0 ||
                  !confirmSend
                }
                onClick={send}
              >
                Send invoice & agreement
              </button>
            </>
          )}
        </aside>
      </div>
    </>
  );
}
