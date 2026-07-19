// Upsert all Roost posts into Supabase. Idempotent (on conflict by slug).
// Run: set -a; . ./.env.local; set +a; node scripts/seed-supabase.mjs
import pg from "pg";
import { readFileSync } from "node:fs";

const url = process.env.SUPABASE_DB_URL;
if (!url) {
  console.error("SUPABASE_DB_URL is not set (source .env.local first).");
  process.exit(1);
}

const rows = JSON.parse(readFileSync(new URL("./posts-seed.json", import.meta.url)));
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
await client.connect();

const q = `
insert into posts (slug, title, summary, tag, body, keywords, read_minutes, status, published_at)
values ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9)
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  tag = excluded.tag,
  body = excluded.body,
  keywords = excluded.keywords,
  read_minutes = excluded.read_minutes,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now()`;

let n = 0;
for (const r of rows) {
  await client.query(q, [
    r.slug,
    r.title,
    r.summary,
    r.tag,
    JSON.stringify(r.body),
    r.keywords ?? [],
    r.read_minutes ?? 3,
    r.status ?? "published",
    r.published_at,
  ]);
  n++;
}
console.log(`upserted ${n} posts`);
await client.end();
