import sharp from "sharp";
import {
  readdir,
  mkdir,
  stat,
  copyFile,
  unlink,
  writeFile,
  readFile,
} from "node:fs/promises";
import path from "node:path";
import { constants } from "node:fs";
import { createHash } from "node:crypto";

// Originals are archived before replacement. Pass a folder outside public/.
const source = path.resolve(process.argv[2] || "public/photos");
const archive = process.argv[3] && path.resolve(process.argv[3]);
if (!archive || archive.startsWith(path.resolve("public") + path.sep)) {
  throw new Error(
    "Usage: node scripts/optimize-photos.mjs public/photos /path/outside/public/originals",
  );
}
const manifest = {};
const report = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const input = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(input);
      continue;
    }
    if (!/\.(jpe?g|png)$/i.test(entry.name)) continue;
    const relative = path.relative(source, input);
    const output = input.replace(/\.(jpe?g|png)$/i, ".webp");
    const backup = path.join(archive, relative);
    await mkdir(path.dirname(backup), { recursive: true });
    try {
      await copyFile(input, backup, constants.COPYFILE_EXCL);
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      const digest = (buffer) =>
        createHash("sha256").update(buffer).digest("hex");
      if (digest(await readFile(input)) !== digest(await readFile(backup))) {
        throw new Error(
          `Archive already contains a different original: ${backup}. Choose a new archive folder.`,
        );
      }
    }
    const originalBytes = (await stat(input)).size;
    if ((await stat(backup)).size !== originalBytes)
      throw new Error(`Backup failed: ${relative}`);
    await sharp(input)
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toColourspace("srgb")
      .webp({ quality: 82, effort: 6 })
      .toFile(output);
    const meta = await sharp(output).metadata();
    if (!meta.width || !meta.height)
      throw new Error(`Invalid image: ${output}`);
    const blur = await sharp(output)
      .resize(16)
      .webp({ quality: 30 })
      .toBuffer();
    const src =
      "/photos/" + path.relative(source, output).split(path.sep).join("/");
    manifest[src] = {
      width: meta.width,
      height: meta.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    };
    report.push({
      original: "/photos/" + relative.split(path.sep).join("/"),
      src,
      originalBytes,
      webBytes: (await stat(output)).size,
      width: meta.width,
      height: meta.height,
    });
    await unlink(input);
    console.log(
      `${relative}: ${(originalBytes / 1e6).toFixed(1)} MB → ${((await stat(output)).size / 1e3).toFixed(0)} KB`,
    );
  }
}
await walk(source);
if (!report.length) {
  console.log("No originals to convert. Existing WebP files left unchanged.");
  process.exit(0);
}
const manifestPath = "src/data/photo-manifest.json";
let existing = {};
try {
  existing = JSON.parse(await readFile(manifestPath, "utf8"));
} catch {}
await writeFile(
  manifestPath,
  JSON.stringify({ ...existing, ...manifest }, null, 2) + "\n",
);
let previousReport = [];
try {
  previousReport = JSON.parse(
    await readFile("scripts/photo-compression-report.json", "utf8"),
  );
} catch {}
const combinedReport = [
  ...previousReport.filter(
    (row) => !report.some((current) => current.src === row.src),
  ),
  ...report,
];
await writeFile(
  "scripts/photo-compression-report.json",
  JSON.stringify(combinedReport, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    {
      count: report.length,
      originalBytes: report.reduce((s, r) => s + r.originalBytes, 0),
      webBytes: report.reduce((s, r) => s + r.webBytes, 0),
      archive,
    },
    null,
    2,
  ),
);
