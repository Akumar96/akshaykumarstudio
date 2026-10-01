"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  dashboardViews,
  monthSummary,
  money,
  invoicePaid,
  today,
  type Entry,
  type Kind,
  type Operations,
} from "@/lib/studio/operations";
import type { Project } from "@/lib/studio/workflow";
type Props = { view: string; initial: Operations; projects: Project[] };
const hours = (minutes: number) => `${(minutes / 60).toFixed(1)} h`;
const defaultKinds: Record<string, Kind> = {
  timeline: "milestones",
  time: "time",
  expenses: "expenses",
  invoices: "invoices",
  income: "goals",
};
export default function OperationsDashboard({
  view,
  initial,
  projects,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dashboard = dashboardViews.find((d) => d.id === view)!;
  const [db, setDb] = useState(initial),
    [month, setMonth] = useState(today().slice(0, 7)),
    [projectFilter, setProjectFilter] = useState(""),
    [editor, setEditor] = useState<{ kind: Kind; entry?: Entry } | null>(null),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState(""),
    [failure, setFailure] = useState(false),
    [archived, setArchived] = useState(false),
    [tick, setTick] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.showModal();
    return () => previous?.focus();
  }, [editor]);
  useEffect(() => {
    if (!db.timer) return;
    const timer = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [db.timer]);
  const active = db.entries.filter((e) => !e.archived),
    filtered = active.filter(
      (e) => !projectFilter || e.projectId === projectFilter,
    ),
    selected = filtered.filter((e) => e.date.startsWith(month));
  const summary = monthSummary(projectFilter ? filtered : active, month),
    goal = active.find((e) => e.kind === "goals" && e.date === `${month}-01`);
  const projectName = (id: string) =>
    projects.find((p) => p.id === id)?.name || "Studio / general";
  async function mutate(action: string, extra: Record<string, unknown> = {}) {
    setBusy(true);
    setMessage("");
    setFailure(false);
    try {
      const response = await fetch("/api/studio/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: db.version, action, ...extra }),
      });
      if (response.status === 401)
        throw new Error(
          "Session expired. Sign in to Studio in another tab, then try again.",
        );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save.");
      setDb(data);
      setMessage("Saved to studio records.");
      return true;
    } catch (e) {
      setFailure(true);
      setMessage((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const invoices = filtered.filter((e) => e.kind === "invoices"),
    outstanding = invoices
      .filter((e) => e.status === "Sent")
      .reduce((s, e) => s + e.amount - invoicePaid(e.id, active), 0),
    overdue = invoices.filter(
      (e) =>
        e.status === "Sent" &&
        e.date < today() &&
        invoicePaid(e.id, active) < e.amount,
    );
  const inherited = projects
    .filter((p) => !p.archived && (!projectFilter || p.id === projectFilter))
    .flatMap((p) =>
      [
        {
          date: p.sections.prequalify?.deadline,
          label: "Launch / listing deadline",
          stage: "prequalify",
        },
        {
          date: p.sections.plan?.shootDate,
          label: "Shoot date",
          stage: "plan",
        },
        {
          date: p.sections.present?.reviewDate,
          label: "Presentation",
          stage: "present",
        },
        {
          date: p.sections.pickup?.deliveryDate,
          label: "Delivery date",
          stage: "pickup",
        },
        {
          date: p.sections.pickup?.followUpDate,
          label: "Follow-up",
          stage: "pickup",
        },
      ]
        .filter((d) => typeof d.date === "string" && d.date)
        .map((d) => ({ ...d, date: String(d.date), project: p })),
    );
  const milestones = filtered.filter((e) => e.kind === "milestones"),
    late = milestones.filter((e) => e.status === "Open" && e.date < today());
  const rows = db.entries
    .filter(
      (e) =>
        e.archived === archived &&
        (!projectFilter || e.projectId === projectFilter) &&
        e.kind === defaultKinds[view] &&
        (view === "invoices" ||
          view === "timeline" ||
          e.date.startsWith(month)),
    )
    .sort((a, b) => a.date.localeCompare(b.date));
  const progress = summary.target
    ? Math.min(100, (summary.income / summary.target) * 100)
    : 0;
  const add = () =>
    setEditor({
      kind: defaultKinds[view],
      ...(view === "income" && goal ? { entry: goal } : {}),
    });
  const actions = (entry: Entry) => (
    <div className="ops-row-actions">
      {entry.kind === "invoices" && !entry.archived && (
        <Link href={`/studio/invoices/${entry.id}`}>Documents & email</Link>
      )}
      {!entry.archived && (
        <button onClick={() => setEditor({ kind: entry.kind, entry })}>
          Edit
        </button>
      )}
      <button
        disabled={busy}
        onClick={() =>
          mutate(entry.archived ? "restore" : "archive", { id: entry.id })
        }
      >
        {entry.archived
          ? "Restore"
          : entry.kind === "payments"
            ? "Void"
            : "Archive"}
      </button>
    </div>
  );
  return (
    <>
      <header className="studio-title">
        <div>
          <span className="eyebrow accent">Studio / {dashboard.label}</span>
          <h1>{dashboard.title}</h1>
        </div>
        <p>{dashboard.description}</p>
      </header>
      <div className="ops-toolbar">
        {view !== "timeline" && (
          <label>
            Reporting month
            <input
              aria-label="Reporting month"
              type="month"
              value={month}
              onChange={(e) => e.target.value && setMonth(e.target.value)}
            />
          </label>
        )}
        {view !== "income" && (
          <label>
            Project
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All projects & studio</option>
              {projects.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                  {p.archived ? " (archived)" : ""}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="ops-primary" onClick={add}>
          {view === "income"
            ? goal
              ? "Edit monthly goal"
              : "Set monthly goal"
            : view === "timeline"
              ? "+ Add milestone"
              : view === "time"
                ? "+ Log time"
                : view === "expenses"
                  ? "+ Log expense"
                  : "+ Add invoice"}
        </button>
      </div>
      {message && (
        <p
          className={`ops-message ${failure ? "studio-error" : ""}`}
          role={failure ? "alert" : "status"}
        >
          {message}
        </p>
      )}
      <div className="ops-stats">
        {view === "timeline" && (
          <>
            <Stat
              label="Open milestones"
              value={String(
                milestones.filter((e) => e.status === "Open").length,
              )}
            />
            <Stat label="Overdue milestones" value={String(late.length)} />
            <Stat
              label="Project dates"
              value={String(inherited.length)}
              note="From saved project plans"
            />
          </>
        )}
        {view === "time" && (
          <>
            <Stat label="Logged this month" value={hours(summary.minutes)} />
            <Stat label="Billable hours" value={hours(summary.billable)} />
            <Stat
              label="Non-billable hours"
              value={hours(summary.minutes - summary.billable)}
            />
          </>
        )}
        {view === "expenses" && (
          <>
            <Stat label="Spent this month" value={money(summary.expenses)} />
            <Stat
              label="Expense entries"
              value={String(
                selected.filter((e) => e.kind === "expenses").length,
              )}
            />
            <Stat
              label="Project expenses"
              value={money(
                selected
                  .filter((e) => e.kind === "expenses" && e.projectId)
                  .reduce((s, e) => s + e.amount, 0),
              )}
            />
          </>
        )}
        {view === "invoices" && (
          <>
            <Stat label="Outstanding · all dates" value={money(outstanding)} />
            <Stat label="Overdue invoices" value={String(overdue.length)} />
            <Stat label="Payments this month" value={money(summary.income)} />
          </>
        )}
        {view === "income" && (
          <>
            <Stat label="Collected this month" value={money(summary.income)} />
            <Stat
              label="Monthly target"
              value={goal ? money(summary.target) : "Not set"}
            />
            <Stat
              label="Remaining to target"
              value={
                goal ? money(Math.max(0, summary.target - summary.income)) : "—"
              }
            />
            <Stat
              label="After logged expenses"
              value={money(summary.income - summary.expenses)}
              note="Recorded cash surplus, not accounting profit"
            />
          </>
        )}
      </div>
      {view === "time" && (
        <section className="ops-timer">
          <div>
            <span className="eyebrow accent">Live timer</span>
            <h2>{db.timer ? db.timer.label : "Start with the task."}</h2>
            {db.timer && (
              <p>
                {projectName(db.timer.projectId)} ·{" "}
                {db.timer.billable ? "Billable" : "Non-billable"} ·{" "}
                {tick
                  ? Math.max(
                      0,
                      Math.floor(
                        (tick - Date.parse(db.timer.startedAt)) / 60000,
                      ),
                    )
                  : 0}{" "}
                min elapsed
              </p>
            )}
          </div>
          {db.timer ? (
            <button
              className="ops-primary"
              disabled={busy}
              onClick={() => mutate("stop")}
            >
              Stop & save time
            </button>
          ) : (
            <form
              className="ops-timer-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget,
                  data = Object.fromEntries(new FormData(form));
                if (
                  await mutate("start", {
                    data: { ...data, billable: data.billable === "on" },
                  })
                )
                  form.reset();
              }}
            >
              <label>
                Task
                <input
                  name="label"
                  required
                  maxLength={300}
                  placeholder="Editing, site visit, planning…"
                />
              </label>
              <label>
                Project
                <select name="projectId">
                  <option value="">Studio / general</option>
                  {projects
                    .filter((p) => !p.archived)
                    .map((p) => (
                      <option value={p.id} key={p.id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </label>
              <label className="ops-checkbox">
                <input type="checkbox" name="billable" />
                Billable
              </label>
              <button className="ops-primary" disabled={busy}>
                Start timer
              </button>
            </form>
          )}
          <small>
            One timer at a time. It continues when you leave. Stop to save;
            rounded to the nearest minute on the stop date.
          </small>
        </section>
      )}
      {view === "income" && (
        <section className="ops-income">
          <div>
            <div className="section-heading">
              <h2>Collected against your goal.</h2>
              <span>
                {goal
                  ? `${Math.round((summary.income / Math.max(1, summary.target)) * 100)}%`
                  : "Set a target to begin"}
              </span>
            </div>
            <progress
              max={100}
              value={progress}
              aria-label="Monthly income goal progress"
            />
            <p>
              {goal && summary.income >= summary.target
                ? "Target reached for this month."
                : "Record invoice payments as they arrive to update this dashboard."}
            </p>
            <p className="contact-prompt">
              Payments and expenses are recorded before sales tax, in CAD.
              Unpaid invoices do not count as collected income.
            </p>
          </div>
          <div className="ops-history">
            <h2>Six months at a glance.</h2>
            {Array.from({ length: 6 }, (_, i) => {
              const date = new Date(month + "-01T12:00:00Z");
              date.setUTCMonth(date.getUTCMonth() - 5 + i);
              const m = date.toISOString().slice(0, 7),
                s = monthSummary(active, m);
              return (
                <div key={m}>
                  <span>{m}</span>
                  <strong>{money(s.income)}</strong>
                  <small>
                    {s.target
                      ? `${Math.round((s.income / s.target) * 100)}% of goal`
                      : "No goal set"}
                  </small>
                </div>
              );
            })}
          </div>
        </section>
      )}
      {view === "timeline" && (
        <section className="ops-project-dates">
          <h2>Project timeline</h2>
          <p>
            Dates from your project stages. Past dates are flagged for review,
            not automatically marked complete.
          </p>
          {inherited.length ? (
            <div className="ops-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Project</th>
                    <th>Event</th>
                    <th>Timing</th>
                  </tr>
                </thead>
                <tbody>
                  {inherited
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((d) => (
                      <tr key={`${d.project.id}-${d.stage}-${d.label}`}>
                        <td>{d.date}</td>
                        <td>
                          <Link href={`/studio/${d.project.id}/${d.stage}`}>
                            {d.project.name} ↗
                          </Link>
                        </td>
                        <td>{d.label}</td>
                        <td>
                          {d.date < today()
                            ? "Past date · review"
                            : d.date === today()
                              ? "Today"
                              : "Upcoming"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="ops-empty">
              Add shoot, review and delivery dates inside a project to build its
              timeline.
            </p>
          )}
        </section>
      )}
      {view === "expenses" && selected.some((e) => e.kind === "expenses") && (
        <div className="ops-category-summary">
          {[
            ...new Set(
              selected
                .filter((e) => e.kind === "expenses")
                .map((e) => e.category || "Other"),
            ),
          ].map((c) => (
            <span key={c}>
              {c}{" "}
              <strong>
                {money(
                  selected
                    .filter(
                      (e) =>
                        e.kind === "expenses" && (e.category || "Other") === c,
                    )
                    .reduce((s, e) => s + e.amount, 0),
                )}
              </strong>
            </span>
          ))}
        </div>
      )}
      {view !== "income" && (
        <section className="ops-records">
          <div className="section-heading">
            <h2>
              {view === "timeline"
                ? "Milestones & deadlines"
                : view === "time"
                  ? "Time log"
                  : view === "expenses"
                    ? "Expense log"
                    : "Invoice register"}
            </h2>
            <label className="ops-checkbox">
              <input
                type="checkbox"
                checked={archived}
                onChange={(e) => setArchived(e.target.checked)}
              />
              Show archived
            </label>
          </div>
          <div className="ops-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{view === "invoices" ? "Due date" : "Date"}</th>
                  <th>
                    {view === "invoices" ? "Invoice / client" : "Description"}
                  </th>
                  <th>Project</th>
                  <th>
                    {view === "time"
                      ? "Hours"
                      : view === "timeline"
                        ? "Status"
                        : "Amount"}
                  </th>
                  {view === "invoices" && (
                    <>
                      <th>Paid / balance</th>
                      <th>Status</th>
                    </>
                  )}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>
                      <strong>{e.label}</strong>
                      <small>
                        {view === "invoices"
                          ? e.category
                          : view === "time"
                            ? e.billable
                              ? "Billable"
                              : "Non-billable"
                            : e.category}
                      </small>
                      {e.notes && <small>{e.notes}</small>}
                      {e.reference && <small>Reference: {e.reference}</small>}
                    </td>
                    <td>{projectName(e.projectId)}</td>
                    <td>
                      {view === "time" ? (
                        hours(e.minutes)
                      ) : view === "timeline" ? (
                        <span
                          className={
                            e.status === "Open" && e.date < today()
                              ? "ops-overdue"
                              : ""
                          }
                        >
                          {e.status === "Open" && e.date < today()
                            ? "Overdue"
                            : e.status}
                        </span>
                      ) : (
                        money(e.amount)
                      )}
                    </td>
                    {view === "invoices" && (
                      <>
                        <td>
                          {money(invoicePaid(e.id, active))}
                          <small>
                            {money(e.amount - invoicePaid(e.id, active))}{" "}
                            remaining
                          </small>
                        </td>
                        <td>
                          {e.status === "Draft"
                            ? "Draft"
                            : invoicePaid(e.id, active) >= e.amount
                              ? "Paid"
                              : e.date < today()
                                ? "Overdue"
                                : invoicePaid(e.id, active) > 0
                                  ? "Part paid"
                                  : "Sent"}
                        </td>
                      </>
                    )}
                    <td>
                      {view === "invoices" &&
                        !e.archived &&
                        e.status === "Sent" &&
                        invoicePaid(e.id, active) < e.amount && (
                          <button
                            className="ops-text-button"
                            onClick={() =>
                              setEditor({
                                kind: "payments",
                                entry: {
                                  ...e,
                                  id: "",
                                  kind: "payments",
                                  label: `Payment for ${e.label}`,
                                  date: today(),
                                  invoiceId: e.id,
                                  amount: e.amount - invoicePaid(e.id, active),
                                  notes: "",
                                  reference: "",
                                },
                              })
                            }
                          >
                            Record payment
                          </button>
                        )}
                      {actions(e)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && (
              <p className="ops-empty">
                No {archived ? "archived " : ""}records for this view yet.
              </p>
            )}
          </div>
        </section>
      )}
      {view === "invoices" && (
        <section className="ops-records">
          <h2>Payment history · {month}</h2>
          <div className="ops-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Invoice</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {db.entries
                  .filter(
                    (e) =>
                      e.kind === "payments" &&
                      e.archived === archived &&
                      e.date.startsWith(month) &&
                      (!projectFilter || e.projectId === projectFilter),
                  )
                  .map((e) => (
                    <tr key={e.id}>
                      <td>{e.date}</td>
                      <td>
                        {db.entries.find((i) => i.id === e.invoiceId)?.label}
                      </td>
                      <td>{money(e.amount)}</td>
                      <td>{actions(e)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <p className="contact-prompt">
            Tracking only: recording a payment does not charge a card or send an
            invoice. Amounts are before sales tax, in CAD.
          </p>
        </section>
      )}
      {editor && (
        <dialog
          ref={dialogRef}
          className="ops-editor"
          aria-labelledby="entry-title"
          onCancel={() => setEditor(null)}
        >
          <EntryForm
            key={`${editor.kind}-${editor.entry?.id || "new"}`}
            kind={editor.kind}
            entry={editor.entry}
            month={month}
            projects={projects}
            busy={busy}
            error={failure ? message : ""}
            onClose={() => setEditor(null)}
            onSave={async (data) => {
              if (
                await mutate("save", {
                  kind: editor.kind,
                  ...(editor.entry?.id ? { id: editor.entry.id } : {}),
                  data,
                })
              )
                setEditor(null);
            }}
          />
        </dialog>
      )}
    </>
  );
}
function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="ops-stat">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </div>
  );
}
function EntryForm({
  kind,
  entry,
  month,
  projects,
  busy,
  error,
  onClose,
  onSave,
}: {
  kind: Kind;
  entry?: Entry;
  month: string;
  projects: Project[];
  busy: boolean;
  error: string;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}) {
  return (
    <form
      className="studio-form"
      onSubmit={(e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        onSave({
          ...data,
          date: kind === "goals" ? `${data.date}-01` : data.date,
          billable: data.billable === "on",
          invoiceId: entry?.invoiceId || "",
        });
      }}
    >
      <div className="section-heading">
        <h2 id="entry-title">
          {entry?.id ? "Edit" : "Add"}{" "}
          {kind === "time"
            ? "time entry"
            : kind === "goals"
              ? "income goal"
              : kind === "milestones"
                ? "milestone"
                : kind === "payments"
                  ? "payment"
                  : kind === "invoices"
                    ? "invoice"
                    : "expense"}
        </h2>
        <button className="studio-secondary" type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="studio-fields">
        {kind !== "goals" && (
          <label className="studio-wide">
            {kind === "invoices"
              ? "Invoice number"
              : kind === "expenses"
                ? "Expense / vendor"
                : "Description"}
            <input
              name="label"
              defaultValue={entry?.label}
              required
              maxLength={300}
              autoFocus
            />
          </label>
        )}
        <label>
          {kind === "invoices"
            ? "Due date"
            : kind === "payments"
              ? "Received date"
              : kind === "goals"
                ? "Goal month"
                : "Date"}
          <input
            type={kind === "goals" ? "month" : "date"}
            name="date"
            required
            defaultValue={
              kind === "goals"
                ? entry?.date.slice(0, 7) || month
                : entry?.date || today()
            }
          />
        </label>
        {!["goals", "payments"].includes(kind) && (
          <label>
            Project
            <select name="projectId" defaultValue={entry?.projectId || ""}>
              <option value="">Studio / general</option>
              {projects.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                  {p.archived ? " (archived)" : ""}
                </option>
              ))}
            </select>
          </label>
        )}
        {["expenses", "invoices", "payments", "goals"].includes(kind) && (
          <label>
            Amount (CAD, before sales tax)
            <input
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              required
              defaultValue={entry ? (entry.amount / 100).toFixed(2) : ""}
            />
          </label>
        )}
        {kind === "time" && (
          <>
            <label>
              Duration (minutes)
              <input
                name="minutes"
                type="number"
                min="1"
                max="1440"
                step="1"
                defaultValue={entry?.minutes}
                required
              />
              <small>60 minutes = 1 hour; 90 minutes = 1.5 hours.</small>
            </label>
            <label className="ops-checkbox">
              <input
                name="billable"
                type="checkbox"
                defaultChecked={entry?.billable}
              />
              Billable work
            </label>
          </>
        )}
        {kind === "expenses" && (
          <label>
            Category
            <select
              name="category"
              defaultValue={entry?.category || "Equipment"}
            >
              {[
                "Equipment",
                "Software",
                "Travel",
                "Printing & lab",
                "Contractors",
                "Marketing",
                "Studio overhead",
                "Other",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        )}
        {kind === "invoices" && (
          <label>
            Client / business
            <input
              name="category"
              required
              defaultValue={entry?.category}
              maxLength={300}
            />
          </label>
        )}
        {["invoices", "milestones"].includes(kind) && (
          <label>
            Status
            <select
              name="status"
              defaultValue={
                entry?.status || (kind === "invoices" ? "Draft" : "Open")
              }
            >
              {(kind === "invoices" ? ["Draft", "Sent"] : ["Open", "Done"]).map(
                (s) => (
                  <option key={s}>{s}</option>
                ),
              )}
            </select>
          </label>
        )}
        {["expenses", "invoices", "payments"].includes(kind) && (
          <label className="studio-wide">
            Receipt / document / payment reference
            <input
              name="reference"
              maxLength={1000}
              defaultValue={entry?.reference}
            />
            <small>
              Record a filename, receipt number or document link. No files are
              uploaded here.
            </small>
          </label>
        )}
        <label className="studio-wide">
          Notes
          <textarea
            name="notes"
            rows={3}
            maxLength={4000}
            defaultValue={entry?.notes}
          />
        </label>
      </div>
      {error && (
        <p className="studio-error" role="alert">
          {error}
        </p>
      )}
      <div className="studio-save">
        <button disabled={busy}>{busy ? "Saving…" : "Save record"}</button>
      </div>
    </form>
  );
}
