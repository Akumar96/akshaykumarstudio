import sharp from "sharp";
import { readdir, mkdir, writeFile, stat, realpath } from "node:fs/promises";
import path from "node:path";
const [source, destination] = process.argv.slice(2);
if (!source || !destination)
  throw new Error(
    "Usage: npm run delivery:prepare -- ORIGINALS_DIRECTORY PRIVATE_NEW_OUTPUT_DIRECTORY",
  );
const input = await realpath(source),
  output = path.resolve(destination),
  publicDir = await realpath("public");
if (input === publicDir || input.startsWith(publicDir + path.sep))
  throw new Error("Use original final JPEGs, not compressed public previews.");
if (
  output === publicDir ||
  output.startsWith(publicDir + path.sep) ||
  output === input ||
  output.startsWith(input + path.sep)
)
  throw new Error(
    "Output must be a separate private directory outside public/ and the source.",
  );
try {
  await stat(output);
  throw new Error(
    "Output already exists. Choose a new directory to preserve existing deliveries.",
  );
} catch (e) {
  if (e.code !== "ENOENT") throw e;
}
const files = (await readdir(input))
  .filter((f) => /\.(jpe?g|png|tiff?)$/i.test(f))
  .sort();
if (!files.length)
  throw new Error(
    "No supported final JPEG/PNG/TIFF files found. RAW files must be edited first.",
  );
const listingSize = Number(process.env.LISTING_LONG_EDGE || 3200);
if (!Number.isInteger(listingSize) || listingSize < 1000 || listingSize > 10000)
  throw new Error("LISTING_LONG_EDGE must be between 1000 and 10000.");
const presets = [
  { name: "listings", size: listingSize, quality: 90 },
  { name: "website", size: 2400, quality: 85 },
  { name: "marketing", size: null, quality: 95 },
];
await mkdir(output, { recursive: true, mode: 0o700 });
const report = [];
for (const preset of presets) {
  const dir = path.join(output, preset.name);
  await mkdir(dir, { mode: 0o700 });
  for (const [index, file] of files.entries()) {
    const outputFile = `${String(index + 1).padStart(3, "0")}-${path.parse(file).name.replace(/[^a-zA-Z0-9-]/g, "-")}.jpg`;
    let pipeline = sharp(path.join(input, file)).rotate().toColourspace("srgb");
    if (preset.size)
      pipeline = pipeline.resize({
        width: preset.size,
        height: preset.size,
        fit: "inside",
        withoutEnlargement: true,
      });
    const result = await pipeline
      .jpeg({ quality: preset.quality, mozjpeg: true })
      .toFile(path.join(dir, outputFile));
    report.push({
      set: preset.name,
      file: outputFile,
      width: result.width,
      height: result.height,
      bytes: result.size,
    });
  }
}
await writeFile(
  path.join(output, "export-report.json"),
  JSON.stringify(report, null, 2),
);
await writeFile(
  path.join(output, "READ-ME.txt"),
  `Prepared delivery exports.\nListings: ${listingSize}px long edge maximum; check the actual listing platform requirements.\nWebsite: 2400px long edge maximum.\nMarketing: full source dimensions, JPEG quality 95; not an untouched original.\nAll exports: sRGB, orientation corrected, no upscaling, GPS/EXIF removed.\nReview crops and quality, include the agreed usage notes, then ZIP each folder and upload privately.\nUse the original final masters (not these exports or website previews) for lab proofing.\n`,
);
console.log(
  `Prepared ${report.length} exports from ${files.length} originals. Originals unchanged. Review export-report.json in the private output directory.`,
);
