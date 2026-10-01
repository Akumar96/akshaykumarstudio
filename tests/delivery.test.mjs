import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { tokenHash } from "../cloudflare/delivery/worker.mjs";
const token = "a".repeat(64),
  base = "https://delivery.example.com";
const manifest = {
  kind: "client",
  project: "project-one",
  title: "<script>bad</script>",
  expiresAt: "2099-01-01T00:00:00Z",
  files: [
    { id: "website", name: "web.zip", key: "projects/project-one/web.zip" },
  ],
};
function env(m = manifest) {
  return {
    DELIVERIES: {
      async get(key) {
        if (key === `access/${await tokenHash(token)}.json`)
          return { json: async () => m };
        if (key === "projects/project-one/web.zip")
          return { body: "PRIVATE FILE", size: 12 };
        return null;
      },
    },
  };
}
const req = (path, options = {}) => new Request(base + path, options);
const cookie = { cookie: `studio_delivery=${token}` };
test("no files without an access code, invalid or expired code", async () => {
  for (const headers of [{}, { cookie: "studio_delivery=wrong" }])
    assert.equal(
      (await worker.fetch(req("/download/website", { headers }), env())).status,
      401,
    );
  assert.equal(
    (
      await worker.fetch(
        req("/gallery", { headers: cookie }),
        env({ ...manifest, expiresAt: "2000-01-01" }),
      )
    ).status,
    401,
  );
});
test("access exchange is same-origin and sets secure HttpOnly cookie", async () => {
  assert.equal(
    (
      await worker.fetch(
        req("/access", {
          method: "POST",
          body: `code=${token}`,
          headers: { origin: "https://evil.example" },
        }),
        env(),
      )
    ).status,
    403,
  );
  const r = await worker.fetch(
    req("/access", {
      method: "POST",
      body: `code=${token}`,
      headers: { origin: base },
    }),
    env(),
  );
  assert.equal(r.status, 303);
  assert.match(
    r.headers.get("set-cookie"),
    /HttpOnly; Secure; SameSite=Strict/,
  );
  assert.equal(r.headers.get("location"), "/gallery");
});
test("gallery escapes content; downloads are private and project scoped", async () => {
  const r = await worker.fetch(req("/gallery", { headers: cookie }), env());
  assert.equal(r.status, 200);
  assert.match(await r.text(), /&lt;script&gt;/);
  const file = await worker.fetch(
    req("/download/website", { headers: cookie }),
    env(),
  );
  assert.equal(await file.text(), "PRIVATE FILE");
  assert.match(file.headers.get("cache-control"), /no-store/);
  assert.equal(
    (await worker.fetch(req("/download/other", { headers: cookie }), env()))
      .status,
    404,
  );
  assert.equal(
    (
      await worker.fetch(
        req("/download/website", { headers: cookie }),
        env({
          ...manifest,
          files: [{ ...manifest.files[0], key: "projects/other/web.zip" }],
        }),
      )
    ).status,
    401,
  );
});
test("lab links cannot use a client delivery token", async () => {
  assert.equal(
    (await worker.fetch(req(`/lab/${token}/website`), env())).status,
    401,
  );
  assert.equal(
    (
      await worker.fetch(
        req(`/lab/${token}/website`),
        env({ ...manifest, kind: "lab" }),
      )
    ).status,
    200,
  );
});

test("lab master availability can be checked without downloading the file", async () => {
  const response = await worker.fetch(
    req(`/lab/${token}/website`, { method: "HEAD" }),
    env({ ...manifest, kind: "lab" }),
  );
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "");
  assert.equal(response.headers.get("content-length"), "12");
});
