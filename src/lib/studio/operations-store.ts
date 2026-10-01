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
import {
  kinds,
  cents,
  validDate,
  today,
  invoicePaid,
  type Operations,
  type Entry,
  type Kind,
} from "./operations.ts";
function path() {
  const dir = studioDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  return join(dir, "operations.json");
}
export function readOperations(): Operations {
  const file = path();
  return existsSync(file)
    ? JSON.parse(readFileSync(file, "utf8"))
    : { version: 1, entries: [], timer: null };
}
function text(v: unknown, max = 300) {
  if (typeof v !== "string" || v.length > max)
    throw new Error("Invalid or overly long field.");
  return v.trim();
}
export function changeOperations(body: Record<string, unknown>): Operations {
  const db = readOperations();
  if (body.version !== db.version) throw new Error("CONFLICT");
  const data = (body.data || {}) as Record<string, unknown>;
  const project = (value: unknown) => {
    const id = text(value || "");
    if (id && !readProjects().some((p) => p.id === id))
      throw new Error("Choose an existing project.");
    return id;
  };
  if (body.action === "start") {
    if (db.timer) throw new Error("Stop the current timer first.");
    const label = text(data.label);
    if (!label) throw new Error("Describe the work you are timing.");
    db.timer = {
      projectId: project(data.projectId),
      label,
      billable: data.billable === true,
      startedAt: new Date().toISOString(),
    };
  } else if (body.action === "stop") {
    if (!db.timer) throw new Error("No timer is running.");
    const minutes = Math.max(
      1,
      Math.round((Date.now() - Date.parse(db.timer.startedAt)) / 60000),
    );
    db.entries.push({
      id: randomUUID(),
      kind: "time",
      ...db.timer,
      date: today(),
      minutes,
      amount: 0,
      category: "Timed work",
      status: "",
      reference: "",
      notes:
        "Timer rounded to nearest minute; minimum one minute. Assigned to stop date.",
      invoiceId: "",
      archived: false,
      createdAt: new Date().toISOString(),
    });
    db.timer = null;
  } else if (body.action === "archive" || body.action === "restore") {
    const e = db.entries.find((e) => e.id === body.id);
    if (!e) throw new Error("Entry not found.");
    const archived = body.action === "archive";
    if (e.kind === "invoices" && archived && invoicePaid(e.id, db.entries) > 0)
      throw new Error("Void recorded payments before archiving this invoice.");
    if (e.kind === "payments" && !archived) {
      const inv = db.entries.find((i) => i.id === e.invoiceId && !i.archived);
      if (
        !inv ||
        inv.status !== "Sent" ||
        invoicePaid(
          inv.id,
          db.entries.filter((i) => i.id !== e.id),
        ) +
          e.amount >
          inv.amount
      )
        throw new Error(
          "Cannot restore this payment: check invoice status and remaining balance.",
        );
      e.projectId = inv.projectId;
    }
    if (
      e.kind === "goals" &&
      !archived &&
      db.entries.some(
        (i) =>
          i.id !== e.id &&
          i.kind === "goals" &&
          !i.archived &&
          i.date === e.date,
      )
    )
      throw new Error("This month already has a goal.");
    if (
      e.kind === "invoices" &&
      !archived &&
      db.entries.some(
        (i) =>
          i.id !== e.id &&
          i.kind === "invoices" &&
          !i.archived &&
          i.label.toLowerCase() === e.label.toLowerCase(),
      )
    )
      throw new Error("Another active invoice has this number.");
    e.archived = archived;
  } else if (body.action === "save") {
    const kind = text(body.kind) as Kind;
    if (!kinds.includes(kind)) throw new Error("Invalid record type.");
    const existing = body.id
      ? db.entries.find((e) => e.id === body.id && e.kind === kind)
      : undefined;
    if (body.id && !existing) throw new Error("Entry not found.");
    const label = text(data.label || ""),
      date = text(data.date || "");
    if (!validDate(date)) throw new Error("Choose a valid date.");
    if (kind !== "goals" && !label)
      throw new Error("Add a description or invoice number.");
    const amount = ["expenses", "invoices", "payments", "goals"].includes(kind)
      ? cents(data.amount)
      : 0;
    const minutes = kind === "time" ? Number(data.minutes) : 0;
    if (
      kind === "time" &&
      (!Number.isInteger(minutes) || minutes < 1 || minutes > 1440)
    )
      throw new Error(
        "Enter between 1 and 1,440 minutes. Split longer work across dates.",
      );
    const category = text(data.category || ""),
      status = text(data.status || "");
    if (kind === "milestones" && !["Open", "Done"].includes(status))
      throw new Error("Invalid milestone status.");
    if (kind === "invoices" && !["Draft", "Sent"].includes(status))
      throw new Error("Invalid invoice status.");
    if (
      kind === "invoices" &&
      db.entries.some(
        (e) =>
          e.kind === "invoices" &&
          !e.archived &&
          e.id !== existing?.id &&
          e.label.toLowerCase() === label.toLowerCase(),
      )
    )
      throw new Error("Invoice number already exists.");
    if (
      kind === "invoices" &&
      existing &&
      amount < invoicePaid(existing.id, db.entries)
    )
      throw new Error(
        "Invoice amount cannot be below payments already recorded.",
      );
    let invoiceId = "",
      projectId = project(data.projectId);
    if (
      kind === "invoices" &&
      existing &&
      invoicePaid(existing.id, db.entries) > 0 &&
      (status !== "Sent" || projectId !== existing.projectId)
    )
      throw new Error(
        "An invoice with payments must remain sent and keep its project.",
      );
    if (kind === "payments") {
      invoiceId = text(data.invoiceId || "");
      const invoice = db.entries.find(
        (e) =>
          e.id === invoiceId &&
          e.kind === "invoices" &&
          !e.archived &&
          e.status === "Sent",
      );
      if (!invoice) throw new Error("Choose a sent invoice.");
      const paid = invoicePaid(
        invoiceId,
        db.entries.filter((e) => e.id !== existing?.id),
      );
      if (amount <= 0 || amount + paid > invoice.amount)
        throw new Error(
          "Payment must be positive and no greater than the remaining balance.",
        );
      projectId = invoice.projectId;
    }
    if (
      kind === "goals" &&
      (date.slice(-2) !== "01" ||
        db.entries.some(
          (e) =>
            e.kind === "goals" &&
            !e.archived &&
            e.date === date &&
            e.id !== existing?.id,
        ))
    )
      throw new Error(
        "One goal per month, dated on the first. Edit the existing goal.",
      );
    if (["expenses", "invoices", "goals"].includes(kind) && amount <= 0)
      throw new Error("Enter an amount greater than zero.");
    const entry: Entry = {
      id: existing?.id || randomUUID(),
      kind,
      projectId,
      label: kind === "goals" ? "Monthly income goal" : label,
      date,
      amount,
      minutes,
      category,
      status,
      reference: text(data.reference || "", 1000),
      notes: text(data.notes || "", 4000),
      billable: data.billable === true,
      invoiceId,
      archived: existing?.archived || false,
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    if (existing) db.entries[db.entries.indexOf(existing)] = entry;
    else db.entries.push(entry);
  } else throw new Error("Unknown action.");
  db.version++;
  const file = path(),
    temp = `${file}.${randomUUID()}.tmp`;
  writeFileSync(temp, JSON.stringify(db, null, 2), { flag: "wx", mode: 0o600 });
  renameSync(temp, file);
  return db;
}
