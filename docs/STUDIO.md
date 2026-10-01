# Private studio workspace

Open `/studio`. The five pages share one project record:

- Prequalify: goals, scope, audience, budget, decision maker, deadline and fit.
- Presell: recommended offer, deliverables, fee/retainer, usage, proposal link, objections and approval checklist.
- Plan: shoot date, access, schedule, shot list, staging, light and platform requirements.
- Present: review gallery link, image filenames, client selections, refinements, print choices and approval.
- Pick up: delivery bundles, usage notes, expiry, tracking, handoff message draft and follow-up.

Use **New project** on the board. **Save this stage** persists changes; **Save & move** updates the project’s current stage. Stage links let you revisit earlier decisions. Checklists are guidance, not enforced business approvals. Archive/restore retains the record. No fake sample clients are added.

## Owner access

The first login-page visit creates `.studio/owner-key.txt`, a random private owner access key. Open that file locally and paste its contents into the login page. Never send it to clients. Alternatively set `STUDIO_PASSWORD` to a random secret of at least 24 characters in the server environment. The generated key is used if that variable is absent/too short.

Sessions last 12 hours, use HTTP-only SameSite=Strict cookies, and are signed using the owner key. HTTPS enables Secure cookies. Changing the key invalidates all existing sessions. Sign-out clears this browser’s cookie. Ten failed logins trigger a 15-minute process-local cooldown. Public hosting should add edge rate limiting; do not depend on process-local counters across multiple servers.

Every studio page and record API checks authentication. Mutations also check the browser Origin. The workspace is excluded from search indexing; it is not linked from the public navigation. Unknown/unconfigured users cannot access project records.

## Storage and hosting

Records live in `.studio/projects.json` by default, outside the public directory and ignored by Git. Directories use 0700 and files use 0600. Set `STUDIO_DATA_DIR` to another private persistent directory if needed. Use an encrypted, backed-up disk for client records. This is **a single Node server implementation** intended for the secondary-PC setup; do not run multiple writer processes or deploy it onto an ephemeral/serverless filesystem. A hosted multi-instance deployment needs a transactional database migration.

Writes use a temporary file and atomic rename. Version checks reject a stale browser save instead of overwriting another save. Keep a backup of the entire data directory, including the owner key, with access restricted to you. Do not put the directory under `public/` or synchronize it to a public repository.

This workspace records decisions; it does not send emails, generate/sign legal agreements, collect retainers, mark Stripe payments automatically, upload photographs, run live slideshow proofing, or create R2 delivery manifests automatically. Existing private delivery and print checkout setup remains in COMMERCE.md. Presentation records selections by filename and links to a review gallery. Pickup tracks the handoff and links to delivery; it does not claim a shipment has occurred automatically.

Validation: `node --experimental-strip-types --test tests/studio.test.mjs` covers persistence, stage progression, stale-write protection, archive/restore and field validation. Build, lint, protected endpoint and browser checks should be completed before deployment.

## Five operating dashboards

Available under `/studio/dashboards/`:
- `timeline`: saved project-stage dates plus editable open/done milestones; overdue milestones are flagged. Project dates remain editable in their original stage and past dates are labelled for review, not automatically completed.
- `time`: one persistent running timer plus manual duration entries, project filters, monthly totals and billable/non-billable hours. Timer entries round to the nearest minute (minimum one) and are assigned to the stop date. A timer continues while the browser is closed; stop it when work ends and edit mistakes.
- `expenses`: project or general expenses, category totals, dated entries and receipt/document references. No receipt uploads.
- `invoices`: draft/sent records, due dates, partial-payment history, outstanding and overdue balances. Payments are separate dated entries and cannot exceed the remaining balance. Paid status is calculated; recording a payment does not process money. Invoice documents and emails are not generated or sent.
- `income`: monthly collection target, recorded invoice payments, remaining target, expense-adjusted cash surplus and six-month history. Unpaid invoices are excluded. All amounts are CAD **before sales tax**; this is a management tracker, not accounting/tax software. Record payments before sales tax as well.

Data is stored in private `operations.json` alongside project records and uses the same owner authentication, atomic writes and version conflict checks. Records can be edited and archived/restored; payment archiving acts as a reversible void. Invoices with payments must have those payments voided before archiving. Archived projects remain available for historical attribution. Goals are one per calendar month. Totals are driven solely by your manually recorded entries, with no banking or Stripe synchronization.

Run `node --experimental-strip-types --test tests/operations.test.mjs` to check partial payments, month allocation, overpayment prevention, timers, archive/restore and stale-write protection.

## Invoice documents, agreement drafts and email

Open an invoice's **Documents & email** link, or use **Prepare invoice & agreement from this offer** on a project's Presell page. The project shortcut uses the saved proposed fee; save the offer before creating the invoice. It creates a Draft invoice and sends nothing.

The editor imports only client name/email, offer title/recommendation, deliverables, usage, payment terms, revisions, exclusions and shoot/delivery dates. Qualification notes, budget assessments, objections, access instructions and other internal notes are not imported. **Fill empty fields from project** preserves existing wording. **Tidy formatting** normalizes whitespace; neither function uses an AI service or sends notes outside this server.

Each invoice keeps its own editable billing details and contract terms. Tax treatment is explicitly chosen, not inferred. The agreement is a working draft made from the scope and terms you supply; no jurisdiction-specific cancellation, liability or licensing rules are invented. It has blank signature lines and does not provide e-signatures or assert that a client agreed.

Save a draft, download both PDFs, and review them. Missing required details produce a DRAFT label and block email preparation/direct sending. PDF exports use standard Latin fonts; unsupported characters cause a generation error rather than silent replacement. Invoice PDFs show the invoiced total, not a running balance after payments. The operations tracker continues to store payments before sales tax.

**Email app:** once required fields are complete and reviewed, Open prepared email starts a mailto draft. Download and attach the invoice and agreement PDFs yourself before sending. Mailto cannot attach files, and this path does not automatically change invoice status. Mark it Sent in the register after sending. Long messages may exceed an email app's mailto limits; copy the message from the editor in that case.

**Dashboard sending:** configure `STUDIO_SMTP_HOST`, `STUDIO_SMTP_PORT` (465 for implicit TLS or 587 with required STARTTLS), `STUDIO_SMTP_USER`, `STUDIO_SMTP_PASSWORD`, and `STUDIO_MAIL_FROM` in the server environment, then restart. Use a provider-issued SMTP/app credential, never commit it. Provider account configuration and credentials are not included. No credentials were supplied and no real emails were sent during implementation.

The owner must review the saved draft and explicitly confirm recipient + attachments. The server checks the revision and current invoice details, generates both PDFs, stores an immutable attempted-send snapshot under `.studio/documents/outbox/`, and claims the send before contacting SMTP. Successful provider acceptance is recorded and the matching Draft invoice is marked Sent. Acceptance is not delivery confirmation, read tracking, agreement acceptance, or a signature. No reminders or automatic follow-ups are sent.

An uncertain send is blocked from automatic retry. Check your email provider before using **Prepare another send**. This creates a new revision requiring review. Interrupted "sending" states may be reset this way after two minutes. Editing a previously sent draft does not email changes automatically. Preserve the outbox snapshots with your private backups.

Document storage and email logs remain on the same persistent single-Node-server filesystem as the studio. Review the invoice/tax fields against your registration and current requirements: https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/8-4/documentary-requirements-claiming-input-tax-credits.html

New invoice drafts default to Pinch Inc, 3190 Mission Hill Dr, Mississauga, ON, L5M0B2. The billing email and payment recipient are a.kumar.uwo@gmail.com. These fields remain editable; existing saved drafts are preserved. Project payment terms are retained alongside the payment recipient. Tax registration, tax treatment and cancellation terms still require owner input. This email default does not configure the SMTP sending account.
