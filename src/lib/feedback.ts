"use server";

import { headers } from "next/headers";

// Simple in-memory per-IP rate limit (per server instance). Enough to stop
// casual spam; resets on redeploy. Bump to a durable store if abuse appears.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX = 5; // max submissions per window per IP

async function rateLimited(): Promise<boolean> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= MAX) return true;
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

async function insert(text: string, values: unknown[]): Promise<void> {
  const raw = process.env.SUPABASE_DB_URL;
  if (!raw) throw new Error("database not configured");
  const { default: pg } = await import("pg");
  const client = new pg.Client({
    connectionString: raw.split("?")[0],
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query(text, values);
  } finally {
    await client.end();
  }
}

export type ActionResult = { ok: boolean; error?: string };

export async function submitFeedback(input: {
  name?: string;
  email?: string;
  message: string;
}): Promise<ActionResult> {
  const message = (input.message ?? "").trim();
  if (message.length < 3) return { ok: false, error: "Please write a little more." };
  if (message.length > 4000) return { ok: false, error: "That's too long." };
  const name = (input.name ?? "").trim().slice(0, 120) || null;
  const email = (input.email ?? "").trim().slice(0, 200) || null;
  if (await rateLimited()) return { ok: false, error: "Too many submissions, try again later." };
  try {
    await insert("insert into feedback (name, email, message) values ($1, $2, $3)", [
      name,
      email,
      message,
    ]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong, please try again." };
  }
}

export async function submitRating(input: {
  stars: number;
  comment?: string;
}): Promise<ActionResult> {
  const stars = Math.round(Number(input.stars));
  if (!(stars >= 1 && stars <= 5)) return { ok: false, error: "Pick 1 to 5 stars." };
  const comment = (input.comment ?? "").trim().slice(0, 2000) || null;
  if (await rateLimited()) return { ok: false, error: "Too many submissions, try again later." };
  try {
    await insert("insert into ratings (stars, comment) values ($1, $2)", [stars, comment]);
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong, please try again." };
  }
}
