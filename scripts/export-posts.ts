// Export all Roost posts to a JSON array of Supabase rows.
// Run: npx tsx scripts/export-posts.ts  ->  scripts/posts-seed.json
import { writeFileSync } from "node:fs";
import { allRoostPosts } from "../src/lib/content/library";

const rows = allRoostPosts.map((p) => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary,
  tag: p.tag,
  body: p.blocks,
  read_minutes: p.readMinutes,
  published_at: p.date,
  status: "published",
}));

writeFileSync("scripts/posts-seed.json", JSON.stringify(rows, null, 2));
console.log(`exported ${rows.length} posts -> scripts/posts-seed.json`);
