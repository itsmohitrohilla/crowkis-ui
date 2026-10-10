import { withDb } from "@/lib/db";
import { rateLimited } from "@/lib/rate-limit";

// "click" carries the words on the link or button; "time" the seconds a page stayed open.
const EVENTS = new Set(["page_view", "arcade_play", "code_copy", "demo_click", "click", "time"]);

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 2000) return new Response(null, { status: 400 });
  let body: { name?: unknown; path?: unknown; meta?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const name = String(body?.name ?? "");
  if (!EVENTS.has(name)) return new Response(null, { status: 400 });
  // Best-effort analytics: a dropped event must never surface as an error in the visitor's console.
  if (await rateLimited("event", 120)) return new Response(null, { status: 204 });
  const path = String(body.path ?? "").slice(0, 200) || null;
  const meta = typeof body.meta === "string" ? body.meta.trim().slice(0, 200) || null : null;
  if (name === "time" && !(meta && /^\d{1,4}$/.test(meta) && Number(meta) >= 1 && Number(meta) <= 1800))
    return new Response(null, { status: 400 });
  if (name === "click" && !meta) return new Response(null, { status: 400 });
  try {
    await withDb((q) => q("insert into events (name, path, meta) values ($1, $2, $3)", [name, path, meta]));
  } catch (err) {
    console.error("track: insert failed:", err instanceof Error ? err.message : err);
  }
  return new Response(null, { status: 204 });
}
