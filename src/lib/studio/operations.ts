export const dashboardViews = [
  {
    id: "timeline",
    label: "Timeline",
    title: "Keep the next deadline in view.",
    description: "Project dates and milestones, together in one place.",
  },
  {
    id: "time",
    label: "Time & hours",
    title: "Know where your hours go.",
    description: "Track production, editing and the work between.",
  },
  {
    id: "expenses",
    label: "Expenses",
    title: "Keep the costs in sight.",
    description: "Log studio spending and connect it to a project.",
  },
  {
    id: "invoices",
    label: "Invoices",
    title: "From invoice to payment.",
    description:
      "Track what you have billed, what has arrived, and what is overdue.",
  },
  {
    id: "income",
    label: "Income goals",
    title: "Give your month a direction.",
    description:
      "Compare recorded payments with your target, and keep costs in view.",
  },
];
export type Kind =
  | "milestones"
  | "time"
  | "expenses"
  | "invoices"
  | "payments"
  | "goals";
export type Entry = {
  id: string;
  kind: Kind;
  projectId: string;
  label: string;
  date: string;
  amount: number;
  minutes: number;
  category: string;
  status: string;
  reference: string;
  notes: string;
  billable: boolean;
  invoiceId: string;
  archived: boolean;
  createdAt: string;
};
export type Timer = {
  projectId: string;
  label: string;
  billable: boolean;
  startedAt: string;
};
export type Operations = {
  version: number;
  entries: Entry[];
  timer: Timer | null;
};
export const kinds: Kind[] = [
  "milestones",
  "time",
  "expenses",
  "invoices",
  "payments",
  "goals",
];
export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
export function validDate(value: string) {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value + "T12:00:00Z").toISOString().slice(0, 10) === value
  );
}
export function cents(value: unknown) {
  if (typeof value !== "string" || !/^\d{1,8}(\.\d{1,2})?$/.test(value))
    throw new Error(
      "Enter a non-negative amount with no more than two decimal places.",
    );
  const [whole, fraction = ""] = value.split(".");
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}
export function money(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(value / 100);
}
export function invoicePaid(invoiceId: string, entries: Entry[]) {
  return entries
    .filter(
      (e) => !e.archived && e.kind === "payments" && e.invoiceId === invoiceId,
    )
    .reduce((sum, e) => sum + e.amount, 0);
}
export function monthSummary(entries: Entry[], month: string) {
  const active = entries.filter((e) => !e.archived);
  const selected = active.filter((e) => e.date.startsWith(month));
  return {
    income: selected
      .filter((e) => e.kind === "payments")
      .reduce((s, e) => s + e.amount, 0),
    expenses: selected
      .filter((e) => e.kind === "expenses")
      .reduce((s, e) => s + e.amount, 0),
    minutes: selected
      .filter((e) => e.kind === "time")
      .reduce((s, e) => s + e.minutes, 0),
    billable: selected
      .filter((e) => e.kind === "time" && e.billable)
      .reduce((s, e) => s + e.minutes, 0),
    target:
      active.find((e) => e.kind === "goals" && e.date === `${month}-01`)
        ?.amount || 0,
  };
}
