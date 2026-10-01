// Private R2 delivery. No public bucket, directory listing, or client file names in source.
const escape = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const headers = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
};
function page(title, body, status = 200, extra = {}) {
  return new Response(
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)} — Akshay Kumar Studios</title><style>body{background:#f6f5f1;color:#242421;font:16px/1.7 Arial;margin:0}main{max-width:760px;margin:auto;padding:60px 24px}h1{font:48px/1.1 Georgia}h2{font:28px Georgia}a{color:inherit}article{border-top:1px solid #d9d8d0;padding:24px 0}small{color:#66665e}label{display:block}input{font:inherit;padding:12px;width:90%;margin:12px 0}button{font:inherit;background:#242421;color:#f6f5f1;padding:12px 24px;border:0;cursor:pointer}a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid #a33225;outline-offset:4px}</style></head><body><main><small>AKSHAY KUMAR STUDIOS / CLIENT DELIVERY</small><h1>${escape(title)}</h1>${body}</main></body></html>`,
    {
      status,
      headers: {
        ...headers,
        "Content-Type": "text/html; charset=utf-8",
        ...extra,
      },
    },
  );
}
export async function tokenHash(token) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token)),
    ),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}
async function manifestFor(token, env, kind = "client") {
  if (!/^[a-f0-9]{64}$/.test(token || "")) return null;
  const obj = await env.DELIVERIES.get(`access/${await tokenHash(token)}.json`);
  if (!obj) return null;
  const m = await obj.json();
  if (
    m.kind !== kind ||
    !Number.isFinite(Date.parse(m.expiresAt)) ||
    Date.parse(m.expiresAt) <= Date.now() ||
    !/^[a-z0-9-]{1,80}$/.test(m.project) ||
    !Array.isArray(m.files)
  )
    return null;
  if (
    !m.files.every(
      (f) =>
        /^[a-z0-9-]{1,80}$/.test(f.id) &&
        typeof f.key === "string" &&
        f.key.startsWith(`projects/${m.project}/`) &&
        !f.key.split("/").includes("..") &&
        typeof f.name === "string",
    )
  )
    return null;
  return m;
}
function redirect(location, cookie) {
  return new Response(null, {
    status: 303,
    headers: {
      ...headers,
      Location: location,
      ...(cookie ? { "Set-Cookie": cookie } : {}),
    },
  });
}
function accessPage(error = false) {
  return page(
    error ? "Check your access code." : "Your photographs, ready.",
    `${error ? "<p>That code is unavailable or has expired. Please check your delivery email or contact the studio.</p>" : "<p>Enter the access code from your delivery email.</p>"}<form method="post" action="/access"><label for="code">Access code</label><input id="code" name="code" type="password" required minlength="64" maxlength="64" autocomplete="off" spellcheck="false"><br><button>Open my delivery</button></form><p><a href="mailto:a.kumar.uwo@gmail.com?subject=Delivery%20access">Ask for help</a></p>`,
    error ? 401 : 200,
  );
}
const deliveryWorker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (request.method === "POST" && url.pathname === "/access") {
        if (request.headers.get("origin") !== url.origin)
          return new Response("Invalid origin", { status: 403, headers });
        if (Number(request.headers.get("content-length")) > 1024)
          return new Response("Too large", { status: 413, headers });
        const raw = await request.text();
        if (raw.length > 1024)
          return new Response("Too large", { status: 413, headers });
        const token = new URLSearchParams(raw).get("code")?.trim();
        if (!(await manifestFor(token, env))) return accessPage(true);
        return redirect(
          "/gallery",
          `studio_delivery=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=43200`,
        );
      }
      if (request.method === "POST" && url.pathname === "/logout") {
        if (request.headers.get("origin") !== url.origin)
          return new Response("Invalid origin", { status: 403, headers });
        return redirect(
          "/",
          "studio_delivery=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0",
        );
      }
      if (!["GET", "HEAD"].includes(request.method))
        return new Response("Method not allowed", {
          status: 405,
          headers: { ...headers, Allow: "GET, HEAD, POST" },
        });
      if (url.pathname === "/") return accessPage();
      // Lab-only asset links use a separate scoped, expiring capability; never shown in the public gallery.
      const lab = url.pathname.match(/^\/lab\/([a-f0-9]{64})\/([a-z0-9-]+)$/);
      const token =
        lab?.[1] ||
        (request.headers.get("cookie") || "")
          .split(";")
          .map((s) => s.trim())
          .find((s) => s.startsWith("studio_delivery="))
          ?.slice(16);
      const m = await manifestFor(token, env, lab ? "lab" : "client");
      if (!m) return accessPage(true);
      if (url.pathname === "/gallery")
        return page(
          m.title || "Your delivery",
          `<p>${escape(m.note || "Choose the files for your project below.")}</p><p><small>Available until ${escape(m.expiresAt.slice(0, 10))}. Save a copy for your records.</small></p>${m.files.map((f) => `<article><h2>${escape(f.label || f.name)}</h2><p>${escape(f.description || "")}</p><a href="/download/${encodeURIComponent(f.id)}">Download ${escape(f.name)}</a></article>`).join("")}<form method="post" action="/logout"><button>Close delivery</button></form>`,
        );
      const id =
        lab?.[2] || url.pathname.match(/^\/download\/([a-z0-9-]+)$/)?.[1];
      const file = m.files.find((f) => f.id === id);
      if (!file)
        return page(
          "File not found.",
          "<p>Return to your delivery to choose a file.</p>",
          404,
        );
      const object = await env.DELIVERIES.get(file.key);
      if (!object)
        return page(
          "File unavailable.",
          "<p>Please contact the studio for help with this file.</p>",
          404,
        );
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      return new Response(request.method === "HEAD" ? null : object.body, {
        headers: {
          ...headers,
          "Content-Type": lab
            ? object.httpMetadata?.contentType || "application/octet-stream"
            : "application/octet-stream",
          "Content-Disposition": `attachment; filename="${safeName}"`,
          "Content-Length": String(object.size),
        },
      });
    } catch {
      return page(
        "Please try again.",
        "<p>Delivery is temporarily unavailable. Please contact the studio if this continues.</p>",
        503,
      );
    }
  },
};

export default deliveryWorker;
