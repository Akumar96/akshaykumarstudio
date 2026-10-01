import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import sharp from "sharp";
import path from "node:path";
const manifest = JSON.parse(
  await readFile("src/data/photo-manifest.json", "utf8"),
);
let total = 0;
for (const [src, entry] of Object.entries(manifest)) {
  const file = path.join("public", src);
  const meta = await sharp(file).metadata();
  assert.equal(meta.format, "webp", src);
  assert.equal(meta.width, entry.width, src);
  assert.equal(meta.height, entry.height, src);
  assert(Math.max(meta.width, meta.height) <= 2400, src);
  assert(!meta.exif, `EXIF metadata should be stripped: ${src}`);
  assert(entry.alt?.length > 5, `Missing alt text: ${src}`);
  total += (await stat(file)).size;
}
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? walk(path.join(dir, entry.name))
          : path.join(dir, entry.name),
      ),
    )
  ).flat();
}
for (const file of await walk("public/photos"))
  assert(file.endsWith(".webp"), `Uncompressed file in public: ${file}`);
for (const file of (await walk("src")).filter((file) =>
  /\.(tsx?|json)$/.test(file),
)) {
  const text = await readFile(file, "utf8");
  for (const match of text.matchAll(/["'](\/photos\/[^"']+)["']/g))
    assert(manifest[match[1]], `Unknown image in ${file}: ${match[1]}`);
}
console.log(
  `Verified ${Object.keys(manifest).length} WebP photos, dimensions, metadata, alt text and all source references. ${(total / 1e6).toFixed(2)} MB total.`,
);
