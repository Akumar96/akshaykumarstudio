# Akshay Kumar Studios

A photography portfolio built with Next.js App Router, React, TypeScript and Tailwind CSS. All pages are statically rendered; interactivity is limited to navigation, portfolio filtering and the gallery viewer.

## Local development

```sh
npm ci
npm run dev
```

Visit http://localhost:3000. Run `npm run build` for the production build, `npm start` to serve it, and `npm run lint` for static checks.

## Photography

57 photographs live in `public/photos/`. The original 1,195,662,769 bytes became **14,866,722 bytes (98.76% smaller)**. Images use WebP quality 82, with a maximum 2,400px long edge, automatic EXIF orientation, sRGB colour, and stripped metadata. Images are never enlarged. Next.js produces smaller responsive versions at delivery time.

- `src/data/photoSets.ts`: collection order, titles, covers and photographs.
- `src/data/photo-manifest.json`: image dimensions, blur placeholders and descriptive alt text.
- `scripts/photo-compression-report.json`: individual before/after sizes.
- `npm run photos:verify`: verify image files, dimensions, metadata, descriptions and source references.

### Originals and recovery

Originals were copied to `/private/tmp/akstudio-photo-originals-20260923` before replacement. That is a temporary local backup, not permanent archival storage. The originals also remain in the pre-refresh Git history. Git history was **not** rewritten, so `.git` still occupies roughly 1.1 GB even though the served photo library is now about 15 MB.

For a long-term original archive, copy that temporary folder to your normal photo storage. To recover originals from the pre-refresh revision, use `git archive 1f32fa4dcc734bfbd33bcdb32168b6b260e1f020 public/photos` and extract the archive outside this working tree.

### Adding photographs

Place the JPEGs in a collection folder under `public/photos`, then supply an archive directory outside `public`:

```sh
npm run photos:optimize -- public/photos /path/to/original-photo-archive
```

The script archives originals, converts images, generates blur placeholders and records compression results. Add descriptive `alt` text to new manifest entries, add the new paths to `photoSets.ts`, then run `npm run photos:verify`. Keep your original photography archive separate from this repository.

## Site structure

- `/`: selected work and studio introduction.
- `/portfolio`: eight filterable collections.
- `/portfolio/[slug]`: complete collection with keyboard/swipe-enabled viewer.
- `/about`: photographer introduction and approach.
- `/info`: existing wedding packages and practical FAQs.
- `/booking`: existing email address and Calendly booking link.
- `/topics`: studio notes; original article URLs are preserved.

Copy and collection data live in the page files and `src/data`. Shared layout, responsive styling, colours and typography live in `src/app/globals.css`. The site uses system fonts, avoiding remote font requests. Contact uses email and the existing external calendar; no form submission service or payment integration is configured.

## Featured film and commercial focus

The homepage, services and enquiry copy focus on commercial spaces, real estate and hotels. Existing personal collections remain available in the archive; city and landscape work lead the list. The Peru film is labelled as travel work, rather than a property or hotel commission.

The original video remains untouched at `/Users/akshaykumar/Downloads/Peru Edit.mp4`. The site serves `/films/peru.mp4` with a 1920×1080 WebP poster. The player requests the video only after a visitor presses Play, then provides native playback, volume and fullscreen controls. The full film also has its own route at `/films/peru`.

Web export: H.264, 1920×1080, original 30 fps, two-pass 4 Mbps video, original AAC audio copied without re-encoding, MP4 fast-start metadata. This is high-quality lossy compression, not a lossless archive. The original in Downloads remains the master.

Final video size: **93,280,841 bytes**, reduced from **255,216,940 bytes** (63.45% smaller). See `scripts/video-compression-report.json`.

## Prints & private delivery

The site now includes `/prints`, `/clients`, and the five-step client experience on `/info`.
Custom Stripe → Prodigi checkout and Cloudflare R2 private delivery are prepared but are not connected to live accounts.
See [the setup and launch guide](docs/COMMERCE.md) for configuration, private file preparation, testing, and current operational limits.
`npm run test:commerce` checks order validation and private delivery access. `npm run delivery:prepare -- SOURCE PRIVATE_OUTPUT` prepares final edited files on your own PC.

## Private studio workspace

Open `/studio` to manage projects through Prequalify, Presell, Plan, Present and Pick up. Owner-only access, persistent local records and editable stage checklists are included. See [studio setup and storage notes](docs/STUDIO.md). This backend runs on a single persistent Node server, including your secondary PC.

Invoice records now include **Documents & email**. The Presell stage can create an invoice from its saved offer. Edit the agreement, download both PDFs, or configure SMTP for owner-confirmed sending. See docs/STUDIO.md for setup and limitations. No AI service is required.
