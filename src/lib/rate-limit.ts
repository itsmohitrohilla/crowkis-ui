import { headers } from "next/headers";

// Simple in-memory per-IP rate limit (per server instance). Enough to stop
// casual spam; resets on redeploy. Bump to a durable store if abuse appears.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000; // 10 min

export async function rateLimited(bucket: string, max: number): Promise<boolean> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "local").split(",")[0].trim();
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (arr.length >= max) return true;
  arr.push(now);
  hits.set(key, arr);
  return false;
}
