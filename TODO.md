# Portfolio refresh

- [x] Audit the photo library and view contact sheets to choose a coherent edit.
- [x] Convert all 57 originals to web-sized WebP images; preserve a recoverable original archive outside the served site.
- [x] Replace remote and original-file references; document the compression results and repeatable workflow.
- [x] Build a restrained photographic art direction: clear typography, strong image composition, simple navigation.
- [x] Redesign home, portfolio, about, information, contact, and journal pages consistently.
- [x] Include every photography collection and improve gallery keyboard/mobile accessibility.
- [x] Check production build, lint, local routes, image delivery, desktop and mobile layouts.
- [x] Iterate on visual and functional issues, then leave a concise handoff.

## Direction

A personal photography studio, presented like an independent photo journal: warm white paper, near-black ink, an understated red accent, large photographs, purposeful whitespace, concise copy. No invented testimonials, statistics, clients, or awards.

## Completed checks

- Photo library: 57 WebP files, 1.196 GB → 14.867 MB (98.76% reduction).
- All original backups verified byte-for-byte against the Git index.
- Eight collections, including previously omitted portraits and the third wedding.
- Original journal URLs preserved; copy rewritten as concise practical studio notes.
- Build, TypeScript, ESLint, image integrity and source reference checks pass.
- Production checks: all 26 routes return 200; missing collection returns 404.
- Desktop and mobile browser checks: no JavaScript errors, broken images or horizontal overflow.
- Mobile menu, filters, native-dialog focus handling, gallery arrows and wrapping, Escape, focus restoration, and FAQs checked.
- Responsive layouts checked at 320, 375, 390, 768, 1024, 1440 and 1920 pixels.
- Next.js updated to 16.3.6; image library updated; npm audit reports zero vulnerabilities.
- Production preview: http://127.0.0.1:4317

## Handoff

See README.md for the photo workflow and original recovery instructions. The temporary original backup is `/private/tmp/akstudio-photo-originals-20260923`. Original images remain in Git history, so the local `.git` directory is still large. The production photo payload is about 15 MB. This refresh has not been deployed or committed.

## Commercial focus and Peru film

- [x] Compress the full Peru film to 1080p H.264 with original audio and fast-start playback.
- [x] Add a lightweight click-to-play homepage feature and `/films/peru`.
- [x] Refocus homepage, services, studio, metadata, footer and enquiry copy on commercial spaces, real estate and hotels.
- [x] Keep existing collections in the archive and label Peru as travel work.
- [x] Verify build, lint, image integrity and browser video playback at 1920×1080.

## Prints and client delivery

- [x] Add prints and client delivery pages; link from navigation/footer.
- [x] Add five-step client journey to Information.
- [x] Build Stripe → Prodigi checkout/submission with signature verification and lab idempotency.
- [x] Build private Cloudflare R2 delivery Worker and access manifest generator.
- [x] Add local PC export workflow for listing, website and marketing files.
- [ ] Connect owner accounts, real product SKUs/prices, policies and master assets.
- [ ] Deploy delivery Worker and test actual client download links.
- [ ] Verify sandbox payment/webhook/lab flow and physical print proof before live launch.

Setup and operational limits: `docs/COMMERCE.md`. Checkout stays unavailable until explicitly configured. No subscription gallery service is required.

Validation: production build and lint pass; private delivery/order tests pass; export presets verified; new pages checked at desktop, mobile and tablet widths. Provider sandbox/live transactions remain untested until account configuration.

## Owner workflow workspace

- [x] Private `/studio` board and five project stage pages.
- [x] Owner login, server-side persistence, optimistic version checks and archive/restore.
- [x] Qualification prompts, offer records, planning, presentation selections and delivery checklist.
- [x] Build/lint, persistence tests, unauthorized access, cross-origin rejection and browser save/advance verified.
- [x] Removed disposable QA project; live workspace starts empty.

## Five operating dashboards

- [x] Project dates and milestone deadlines.
- [x] Persistent timer, manual hours and billable totals.
- [x] Expense logs and category summaries.
- [x] Invoice balances, partial-payment history and overdue tracking.
- [x] Monthly income goals, collection progress and six-month history.
- [x] Tests for payment allocation, overpayment, timers and archive/restore; mobile and browser checks.

## Project-based invoices and agreements

- [x] Create invoice drafts from saved Presell offers.
- [x] Editable billing details, client-facing project terms and email message.
- [x] Separate invoice/agreement PDF exports, visually checked.
- [x] Owner-reviewed SMTP send with two attachments, duplicate protection and private outbox snapshot.
- [x] Email-app fallback with manual PDF attachments.
- [x] Field/privacy tests, build/lint, private-download checks and mobile editor checks.
- [ ] Configure the owner email account and verify real SMTP delivery.
- [x] Apply Pinch Inc billing address and payment recipient to new editable drafts.
- [ ] Owner to review tax settings and agreement terms.
