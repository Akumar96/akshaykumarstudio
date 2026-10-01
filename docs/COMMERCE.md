# Print sales and digital delivery

## What is implemented

- `/prints`: curated archive preview and conditional product order forms.
- `/clients`: delivery entry, format guidance and help. `CLIENT_DELIVERY_URL` connects it to the private Cloudflare Worker.
- `/info`: Prequalify → Presell → Plan → Present → Pick up.
- Stripe hosted card checkout → signed server webhook → Prodigi order submission. One print per checkout, CAD, Canadian addresses, standard shipping. Server-side prices; the customer cannot supply a price, lab SKU or master URL. Stripe Automatic Tax is enabled and requires your account configuration.
- Catalog details are snapshotted in Stripe metadata so pending orders survive catalog edits. Prodigi's permanent idempotency key is the Checkout Session ID. Duplicate or concurrent webhooks cannot create additional lab orders. Lab order ID and initial outcome are recorded on the Stripe Session.
- Separate Cloudflare Worker streams private R2 files after access-code authentication. Codes have 256 bits of randomness; R2 stores a hash-derived manifest name. HTTP-only Secure SameSite=Strict cookies, no-store responses, expiring manifests, project-scoped file keys, and escaped gallery text.
- Local file preparation script for the secondary PC. It preserves originals, does not enlarge images, creates sRGB JPEGs and removes EXIF/GPS metadata.

Nothing is deployed or taking money yet. No accounts, keys, products, real prices, tax configuration or print terms were supplied. The public preview accurately says ordering is being prepared. Do not switch on live checkout until the sandbox purchase and a physical proof succeed.

## Subscription-light architecture

The existing Next.js server handles the website and Stripe/Prodigi endpoints. It can run on a supported Node host or your secondary PC behind an HTTPS tunnel. The Cloudflare Worker + private R2 bucket handles downloads independently, so files remain available when the PC is off. Hosting the **whole Next.js app on Cloudflare** would additionally require a supported Next.js adapter and deployment validation; that migration is not included here. Do not deploy this app as a static export: checkout needs a server.

R2 Standard includes 10 GB-month of storage, 1M write-class operations and 10M read-class operations monthly, with free direct egress. Cloudflare Workers Free has request/CPU limits. This is not unlimited free storage. Keep the raw archive on your backed-up PC and publish only final delivery bundles. Print production, shipping, card-processing fees and any tax service charges are separate.

Sources checked September 29, 2026:
- https://developers.cloudflare.com/r2/pricing/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://support.prodigi.com/hc/en-us/articles/18855178810780-Are-there-any-set-up-fees
- https://www.prodigi.com/print-api/docs/reference/

## Connect private delivery

1. Create a Cloudflare R2 **private** bucket named `akstudios-private-delivery`. Keep public r2.dev access and custom public bucket domains disabled.
2. Deploy `cloudflare/delivery/worker.mjs` with its `wrangler.jsonc` using a locally installed/current Wrangler CLI (`wrangler deploy --config cloudflare/delivery/wrangler.jsonc`). Configure account credentials locally, never in Git. Prefer your own delivery subdomain.
3. Set `CLIENT_DELIVERY_URL=https://your-worker-or-delivery-domain` in `.env.local` / deployment environment. Rebuild the Next.js site.
4. Prepare final edited photographs, outside `public/`:
   `npm run delivery:prepare -- /private/path/final-images /private/path/new-delivery`
   Optionally set `LISTING_LONG_EDGE` to the actual listing platform requirement. Default 3200 is a starting export preset, not a claim of MLS compatibility. Website is 2400px; marketing is source dimensions at JPEG quality 95. Review them. ZIP each folder with the OS archive tool; add agreed usage/readme information.
5. Upload bundles to `projects/your-project-slug/listings.zip`, `website.zip`, `marketing.zip` in R2. Do not put client names or email addresses in object keys.
6. Copy `manifest.example.json` to a PRIVATE location. Edit project, actual object keys, filenames, instructions and expiry date. Run:
   `node scripts/create-delivery.mjs /private/path/manifest.json /private/path/access-output`
7. Upload only the generated `<hash>.json` to `access/<hash>.json`. Never upload the `-access.txt` file. Give the client the delivery URL plus the access code privately. This tool does not send email.
8. Open the link, enter the code and test each ZIP before sending the handoff. Remove the manifest object to revoke access immediately, including existing cookie sessions. Replace its expiry to extend access.

An access code is a bearer credential: anyone the client shares it with can download that delivery. It is not an identity-verified client account. No client directory or publicly searchable gallery is exposed. A delivery expires even if its cookie remains. No public demo includes client data. There is no automated email, preview proofing, favorites, or CRM in this first implementation.

## Connect automatic print sales

1. Create Stripe and Prodigi accounts. Begin with Stripe test keys and Prodigi sandbox keys. Configure a Prodigi payment method before eventual live fulfillment; you pay the lab separately from the customer's Stripe payment.
2. Choose a small set of lab products, request quotes for Canadian shipping, set retail margins, and order physical proofs from full-resolution final masters. Confirm actual SKUs, paper/finish and allowed attributes using the lab product API. Do not upload the website's 2400px WebP previews as print masters.
3. Host each final master privately in R2 under a project prefix. Generate a separate manifest with `kind: "lab"`, one image file, and an expiry long enough for checkout + retries + lab retrieval. The generated `/lab/<code>/<file-id>` URL gives the lab only that scoped file. Do not put this URL in public page props, source control, logs or customer emails. Keep it available until the lab has downloaded/approved the asset. Monitor expiries before taking new orders.
4. Configure `.env.local` from `.env.example`. Add `PRINT_PRODUCTS_JSON`, a JSON array whose entries have:
   - `id`: unique stable slug
   - `name`, `description`, `size`: the actual artwork and confirmed product/finish
   - `unitAmount`, `shippingAmount`: integer CAD cents, actual retail prices
   - `sku`: validated Prodigi SKU
   - `assetUrl`: the HTTPS lab-only master URL
   - `attributes`: optional SKU-specific string attributes
   Snapshot (SKU + URL + attributes) must fit Stripe's 500-character metadata limit. Invalid configuration disables checkout. No fictional retail prices are supplied.
5. Set the public `SITE_URL` HTTPS origin and `PRINT_TERMS_URL` to your published shipping/returns/order policy. Configure Stripe receipts, Automatic Tax, business details and tax behavior. Configure your lab's available branded dispatch notifications. Verify current lab charges before setting the fixed customer shipping rate.
6. Add Stripe webhook `/api/prints/webhook` for `checkout.session.completed` and `checkout.session.async_payment_succeeded`. Set its signing secret. Use the matching Stripe API version from the installed SDK, including `collected_information.shipping_details`.
7. Set `PRINT_MODE=sandbox` and `PRINT_CHECKOUT_ENABLED=true`, rebuild. The store labels checkout as a test. Test approved/declined cards, cancellation, bad signatures, replayed events, duplicate events, shipping data, tax calculation, lab outage and retry. Confirm the Stripe session has the lab ID, and the lab sandbox has exactly one order.
8. Complete a real physical proof, pricing/policy review and shipping test. Then change both providers to their live credentials and set `PRINT_MODE=live`, rebuild and monitor the first orders.

Operations: Stripe retries webhook failures; watch failed webhooks and the Prodigi dashboard. `createdWithIssues` is recorded and logged for review. A successfully created lab order can still later fail artwork or production checks. There is no status-sync callback, cancellation/refund automation, shipment-tracking dashboard or owner alert email in this version. Use provider dashboards for those operations. Configure operational alerts before launch. A Stripe refund does not cancel a print job. Product dimensions/fit are fixed; `fitPrintArea` preserves the image without cropping and can create borders. No interactive crop editor. Orders are one item each; no shopping cart or downloadable-art sales checkout yet. Commercial delivery is included/project-controlled, not an extra file purchase.

## Five-step studio service

1. **Prequalify:** property, decision maker, intended use, date, budget and deadline. Identify listing-platform constraints and print needs.
2. **Presell:** a clear proposal with deliverables, usage, exclusions, review rounds, payment schedule and delivery date. Avoid forcing a business client to buy every agreed file individually.
3. **Plan:** shot list, staging, room access, light, housekeeping/occupancy and production schedule.
4. **Present:** a short guided review; recommend lead images and purposeful crops. For wall art, suggest a small coherent selection and show a physical sample.
5. **Pick up:** one delivery email, three clearly named bundles, agreed usage notes and expiry, plus print tracking where applicable. Follow up on actual use.

The next business milestone is one end-to-end pilot commercial project, alongside one approved print product. Prove the handoff and physical quality before adding a large catalog.
