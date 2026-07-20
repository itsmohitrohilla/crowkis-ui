import type { RoostPost } from "@/lib/content/roost";

// Blog posts now live in Supabase and are read via `src/lib/posts.ts`.
// These stay as an EMPTY fallback so the app still compiles/serves if the DB is
// briefly unreachable (it just shows no posts rather than crashing).
export const allRoostPosts: RoostPost[] = [];
export const roostTags: string[] = [];
