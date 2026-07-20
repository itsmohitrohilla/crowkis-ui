// Server-only data access for Roost posts.
// Reads from Supabase Postgres when SUPABASE_DB_URL is set; otherwise (or on any
// error) falls back to the bundled static posts, so the site can never break.
import { allRoostPosts as staticPosts } from "@/lib/content/library";
import type { RoostPost } from "@/lib/content/roost";

let cache: RoostPost[] | null = null;
let inflight: Promise<RoostPost[]> | null = null;

async function fetchFromDb(): Promise<RoostPost[] | null> {
  const raw = process.env.SUPABASE_DB_URL;
  if (!raw) return null;
  const connectionString = raw.split("?")[0]; // drop sslmode so our ssl opts apply
  try {
    const { default: pg } = await import("pg");
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await client.connect();
    const { rows } = await client.query(
      `select slug, title, summary, tag, body, read_minutes,
              to_char(published_at, 'YYYY-MM-DD') as date
         from posts
        where status = 'published'
        order by published_at desc, id desc`,
    );
    await client.end();
    if (!rows.length) return null;
    return rows.map((r) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      tag: r.tag,
      readMinutes: r.read_minutes ?? 3,
      date: r.date,
      blocks: r.body,
    })) as RoostPost[];
  } catch (err) {
    console.error("[posts] DB fetch failed, using static fallback:", err);
    return null;
  }
}

export async function getAllPosts(): Promise<RoostPost[]> {
  if (cache) return cache;
  // Dedupe concurrent callers so a build/worker opens ONE connection, not hundreds.
  if (!inflight) {
    inflight = (async () => {
      const db = await fetchFromDb();
      cache = db ?? staticPosts;
      return cache;
    })();
  }
  return inflight;
}

export async function getPost(slug: string): Promise<RoostPost | undefined> {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

export async function getTags(): Promise<string[]> {
  return Array.from(new Set((await getAllPosts()).map((p) => p.tag)));
}

export type PostsPage = {
  posts: RoostPost[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
};

// Server-side pagination (+ optional tag / search filter) so the list page stays
// light no matter how many posts exist — only `perPage` are ever rendered.
export async function getPostsPage(opts: {
  page?: number;
  perPage?: number;
  tag?: string;
  q?: string;
} = {}): Promise<PostsPage> {
  const perPage = opts.perPage ?? 20;
  const page = Math.max(1, opts.page ?? 1);
  let list = await getAllPosts();
  if (opts.tag) list = list.filter((p) => p.tag === opts.tag);
  if (opts.q) {
    const s = opts.q.toLowerCase().trim();
    list = list.filter(
      (p) => p.title.toLowerCase().includes(s) || p.summary.toLowerCase().includes(s),
    );
  }
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  return { posts: list.slice(start, start + perPage), total, page, perPage, totalPages };
}
