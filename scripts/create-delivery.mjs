import { randomBytes, createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
const [input, output] = process.argv.slice(2);
if (!input || !output)
  throw new Error(
    "Usage: node scripts/create-delivery.mjs manifest.json PRIVATE_OUTPUT_DIRECTORY",
  );
const out = path.resolve(output);
if (
  out === path.resolve("public") ||
  out.startsWith(path.resolve("public") + path.sep)
)
  throw new Error("Access codes must stay outside public/.");
const manifest = JSON.parse(await readFile(input, "utf8"));
if (
  !["client", "lab"].includes(manifest.kind) ||
  !/^[a-z0-9-]{1,80}$/.test(manifest.project) ||
  !(Date.parse(manifest.expiresAt) > Date.now()) ||
  !manifest.files?.length
)
  throw new Error("Manifest needs kind, project, future expiresAt, and files.");
const ids = new Set();
for (const f of manifest.files) {
  if (
    !/^[a-z0-9-]{1,80}$/.test(f.id) ||
    ids.has(f.id) ||
    !f.key?.startsWith(`projects/${manifest.project}/`) ||
    f.key.split("/").includes("..") ||
    !f.name
  )
    throw new Error("File must have unique id, name and a project-scoped key.");
  ids.add(f.id);
}
const token = randomBytes(32).toString("hex");
const hash = createHash("sha256").update(token).digest("hex");
await mkdir(out, { recursive: true, mode: 0o700 });
await writeFile(
  path.join(out, `${hash}.json`),
  JSON.stringify(manifest, null, 2),
  { flag: "wx", mode: 0o600 },
);
await writeFile(
  path.join(out, `${hash}-access.txt`),
  `Access code: ${token}\nR2 manifest key: access/${hash}.json\n${manifest.kind === "lab" ? `Lab URL path: /lab/${token}/${manifest.files[0].id}\n` : ""}`,
  { flag: "wx", mode: 0o600 },
);
console.log(
  "Created private manifest and access instructions in the output directory. Upload the JSON only to its access/ R2 key. Never upload the access.txt file.",
);
