import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import {
  readOperations,
  changeOperations,
} from "../src/lib/studio/operations-store.ts";
import {
  monthSummary,
  invoicePaid,
  cents,
} from "../src/lib/studio/operations.ts";
process.env.STUDIO_DATA_DIR = mkdtempSync(
  "/private/tmp/akstudio-operations-test-",
);
const save = (kind, data, id) =>
  changeOperations({
    version: readOperations().version,
    action: "save",
    kind,
    data,
    id,
  });
const act = (action, extra = {}) =>
  changeOperations({ version: readOperations().version, action, ...extra });
test("invoice partial payments feed monthly goals and cannot overpay", () => {
  const invoice = save("invoices", {
    label: "TEST-1001",
    date: "2026-10-15",
    amount: "1000.00",
    category: "Test client",
    status: "Sent",
  }).entries.at(-1);
  save("goals", { date: "2026-10-01", amount: "2000" });
  save("payments", {
    label: "Retainer",
    invoiceId: invoice.id,
    date: "2026-09-30",
    amount: "250",
  });
  save("payments", {
    label: "Balance part",
    invoiceId: invoice.id,
    date: "2026-10-03",
    amount: "500",
  });
  save("expenses", {
    label: "Lab",
    date: "2026-10-04",
    amount: "50.25",
    category: "Printing & lab",
  });
  const db = readOperations();
  assert.equal(invoicePaid(invoice.id, db.entries), 75000);
  assert.equal(monthSummary(db.entries, "2026-09").income, 25000);
  assert.deepEqual(monthSummary(db.entries, "2026-10"), {
    income: 50000,
    expenses: 5025,
    target: 200000,
    minutes: 0,
    billable: 0,
  });
  assert.throws(
    () =>
      save("payments", {
        label: "Too much",
        invoiceId: invoice.id,
        date: "2026-10-05",
        amount: "251",
      }),
    /remaining balance/,
  );
  assert.throws(
    () => act("archive", { id: invoice.id }),
    /Void recorded payments/,
  );
  assert.throws(
    () =>
      save(
        "invoices",
        {
          label: "TEST-1001",
          date: "2026-10-15",
          amount: "700",
          category: "Test client",
          status: "Sent",
        },
        invoice.id,
      ),
    /below payments/,
  );
});
test("one running timer persists and stop creates one entry", () => {
  act("start", { data: { label: "Editing", billable: true } });
  assert.equal(readOperations().timer.label, "Editing");
  assert.throws(
    () => act("start", { data: { label: "Another" } }),
    /Stop the current/,
  );
  const db = act("stop");
  assert.equal(db.timer, null);
  assert.equal(db.entries.at(-1).kind, "time");
  assert.equal(db.entries.at(-1).minutes, 1);
  assert.throws(() => act("stop"), /No timer/);
});
test("validation, conflict protection and reversible voids", () => {
  assert.equal(cents("12.34"), 1234);
  assert.throws(() => cents("1.234"));
  assert.throws(() =>
    save("time", { label: "Invalid", date: "2026-02-30", minutes: 45 }),
  );
  assert.throws(
    () => save("goals", { date: "2026-10-01", amount: "4" }),
    /One goal/,
  );
  assert.throws(
    () => changeOperations({ version: 0, action: "stop" }),
    /CONFLICT/,
  );
  const payment = readOperations().entries.find((e) => e.kind === "payments");
  act("archive", { id: payment.id });
  assert.equal(invoicePaid(payment.invoiceId, readOperations().entries), 50000);
  act("restore", { id: payment.id });
  assert.equal(invoicePaid(payment.invoiceId, readOperations().entries), 75000);
});
