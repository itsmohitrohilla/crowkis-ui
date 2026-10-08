import "server-only"; // build fails if this file is ever imported into browser code
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Admin access = the secret path segment (ADMIN_KEY) plus a signed-in session
// (ADMIN_USER / ADMIN_PASSWORD). All three live in env vars only, never in the repo.

const COOKIE = "crowkis_admin";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const digest = (s: string) => createHash("sha256").update(s).digest();
// Hash both sides so the buffers are always equal length and the length is not leaked.
const same = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

export function adminKeyOk(key: string) {
  const secret = process.env.ADMIN_KEY ?? "";
  return secret.length >= 16 && same(key, secret);
}

export function credentialsOk(user: string, password: string) {
  const u = process.env.ADMIN_USER ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  if (!u || p.length < 16) return false;
  const userOk = same(user, u);
  const passOk = same(password, p); // always compare both, no early exit
  return userOk && passOk;
}

// Signed with a key derived from the password, so changing the password signs everyone out.
function sign(payload: string) {
  const key = digest(`${process.env.ADMIN_PASSWORD}:${process.env.ADMIN_KEY}`);
  return createHmac("sha256", key).update(payload).digest("hex");
}

function setCookie(value: string, maxAge: number) {
  return cookies().then((c) =>
    c.set(COOKIE, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge,
    }),
  );
}

export async function startSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  await setCookie(`${exp}.${sign(exp)}`, MAX_AGE);
}

export async function endSession() {
  await setCookie("", 0);
}

export async function hasSession() {
  if ((process.env.ADMIN_PASSWORD ?? "").length < 16) return false;
  const [exp, mac] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  return Boolean(exp && mac) && Number(exp) > Date.now() && same(mac, sign(exp));
}
