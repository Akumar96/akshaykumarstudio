import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cookies } from "next/headers";
import { studioDir } from "./store";
export function ownerKey() {
  if (process.env.STUDIO_PASSWORD && process.env.STUDIO_PASSWORD.length >= 24)
    return process.env.STUDIO_PASSWORD;
  const dir = studioDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const file = join(dir, "owner-key.txt");
  if (!existsSync(file)) {
    try {
      writeFileSync(file, randomBytes(32).toString("base64url"), {
        mode: 0o600,
        flag: "wx",
      });
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "EEXIST") throw e;
    }
  }
  return readFileSync(file, "utf8").trim();
}
export function sameSecret(a: string, b: string) {
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function issueSession() {
  const body = `${Date.now() + 12 * 60 * 60 * 1000}.${randomBytes(16).toString("hex")}`;
  return `${body}.${createHmac("sha256", ownerKey()).update(body).digest("hex")}`;
}
export function validSession(token: string) {
  const [expires, nonce, signature, ...rest] = token.split(".");
  if (
    rest.length ||
    !expires ||
    !nonce ||
    !signature ||
    Number(expires) <= Date.now() ||
    Number(expires) > Date.now() + 12 * 60 * 60 * 1000
  )
    return false;
  return sameSecret(
    signature,
    createHmac("sha256", ownerKey())
      .update(`${expires}.${nonce}`)
      .digest("hex"),
  );
}
export async function isOwner() {
  return validSession((await cookies()).get("studio_owner")?.value || "");
}
export function sameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get("origin") || "");
    return ["http:", "https:"].includes(origin.protocol) && origin.host === request.headers.get("host");
  } catch { return false; }
}
