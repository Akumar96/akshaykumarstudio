import {
  mkdirSync,
  readFileSync,
  writeFileSync,
  renameSync,
  existsSync,
  chmodSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import { workflow, projectTypes, type Project } from "./workflow.ts";
export function studioDir() {
  const dir = resolve(/* turbopackIgnore: true */ process.env.STUDIO_DATA_DIR || ".studio");
  const publicDir = resolve("public");
  if (dir === publicDir || dir.startsWith(publicDir + "/")) throw new Error("Studio records must be outside public/.");
  return dir;
}
function directory() {
  const dir = studioDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  return dir;
}
function dbPath() {
  return join(directory(), "projects.json");
}
export function readProjects(): Project[] {
  const file = dbPath();
  if (!existsSync(file)) return [];
  return JSON.parse(readFileSync(file, "utf8"));
}
function writeProjects(projects: Project[]) {
  const file = dbPath(),
    temp = `${file}.${randomUUID()}.tmp`;
  writeFileSync(temp, JSON.stringify(projects, null, 2), {
    mode: 0o600,
    flag: "wx",
  });
  renameSync(temp, file);
  chmodSync(file, 0o600);
}
export function createProject(data: Record<string, unknown>) {
  const name = String(data.name || "").trim(),
    client = String(data.client || "").trim(),
    email = String(data.email || "").trim(),
    type = String(data.type || "");
  if (
    !name ||
    !client ||
    name.length > 160 ||
    client.length > 160 ||
    email.length > 254 ||
    (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
    !projectTypes.includes(type)
  )
    throw new Error("Enter a project name, client and valid contact details.");
  const now = new Date().toISOString();
  const project: Project = {
    id: randomUUID(),
    name,
    client,
    email,
    type,
    stage: "prequalify",
    archived: false,
    version: 1,
    createdAt: now,
    updatedAt: now,
    sections: {},
  };
  const projects = readProjects();
  projects.unshift(project);
  writeProjects(projects);
  return project;
}
export function updateProject(id: string, data: Record<string, unknown>) {
  const projects = readProjects(),
    index = projects.findIndex((p) => p.id === id);
  if (index < 0) throw new Error("Project not found");
  const project = projects[index];
  if (data.version !== project.version) throw new Error("CONFLICT");
  if (typeof data.archived === "boolean") project.archived = data.archived;
  else {
    const stage = workflow.find((s) => s.id === data.stage);
    if (
      !stage ||
      typeof data.values !== "object" ||
      !data.values ||
      Array.isArray(data.values)
    )
      throw new Error("Invalid workflow stage");
    const values: Record<string, string | boolean> = {};
    for (const field of stage.fields) {
      const value = (data.values as Record<string, unknown>)[field.key];
      if (field.type === "checkbox") {
        values[field.key] = value === true;
        continue;
      }
      if (value !== undefined && typeof value !== "string")
        throw new Error("Invalid field value");
      const text = String(value || "").trim();
      if (text.length > 6000)
        throw new Error("Keep each field under 6,000 characters.");
      if (text && field.type === "select" && !field.options?.includes(text))
        throw new Error("Invalid selection");
      if (
        text &&
        field.type === "number" &&
        (!Number.isFinite(Number(text)) || Number(text) < 0)
      )
        throw new Error("Amounts must be positive numbers.");
      if (
        text &&
        field.type === "date" &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(text) ||
          !Number.isFinite(Date.parse(text)))
      )
        throw new Error("Invalid date");
      if (text && field.type === "url") {
        try {
          if (!["https:", "http:"].includes(new URL(text).protocol))
            throw new Error();
        } catch {
          throw new Error("Use a complete http or https link.");
        }
      }
      values[field.key] = text;
    }
    project.sections[stage.id] = values;
    if (data.advance === true) {
      const next = workflow[workflow.indexOf(stage) + 1];
      if (next) project.stage = next.id;
    } else if (data.setCurrent === true) project.stage = stage.id;
  }
  project.version++;
  project.updatedAt = new Date().toISOString();
  writeProjects(projects);
  return project;
}
