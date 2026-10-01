import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  createProject,
  readProjects,
  updateProject,
} from "../src/lib/studio/store.ts";
process.env.STUDIO_DATA_DIR = mkdtempSync("/private/tmp/akstudio-store-test-");
test("create, persist stages, advance, reject stale writes, archive and restore", () => {
  const p = createProject({
    name: "Test hotel",
    client: "Test client",
    email: "test@example.com",
    type: "Hotel / hospitality",
  });
  assert.equal(readProjects()[0].id, p.id);
  const saved = updateProject(p.id, {
    version: 1,
    stage: "prequalify",
    values: { goal: "New room launch", goalConfirmed: true },
    advance: true,
  });
  assert.equal(saved.stage, "presell");
  assert.equal(saved.sections.prequalify.goal, "New room launch");
  assert.equal(saved.version, 2);
  assert.throws(
    () =>
      updateProject(p.id, {
        version: 1,
        stage: "prequalify",
        values: { goal: "Stale write" },
      }),
    /CONFLICT/,
  );
  assert.equal(readProjects()[0].sections.prequalify.goal, "New room launch");
  const archived = updateProject(p.id, { version: 2, archived: true });
  assert.equal(archived.archived, true);
  assert.equal(
    updateProject(p.id, { version: 3, archived: false }).archived,
    false,
  );
  assert.equal(
    JSON.parse(
      readFileSync(join(process.env.STUDIO_DATA_DIR, "projects.json")),
    )[0].name,
    "Test hotel",
  );
});
test("reject invalid fields, unsafe links, amounts and project type", () => {
  assert.throws(() =>
    createProject({ name: "Test", client: "Client", type: "Unknown" }),
  );
  const p = readProjects()[0];
  assert.throws(() =>
    updateProject(p.id, {
      version: p.version,
      stage: "presell",
      values: { proposalUrl: "javascript:alert(1)" },
    }),
  );
  assert.throws(() =>
    updateProject(p.id, {
      version: p.version,
      stage: "presell",
      values: { fee: "-40" },
    }),
  );
  assert.throws(() =>
    updateProject(p.id, {
      version: p.version,
      stage: "not-a-stage",
      values: {},
    }),
  );
  assert.throws(() =>
    updateProject(p.id, {
      version: p.version,
      stage: "prequalify",
      values: { fit: "invented" },
    }),
  );
});
