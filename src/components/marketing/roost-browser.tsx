"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { RoostPost } from "@/lib/content/roost";

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function RoostBrowser({ posts }: { posts: RoostPost[] }) {
  const [tag, setTag] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((p) => counts.set(p.tag, (counts.get(p.tag) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter(
      (p) =>
        (tag === "all" || p.tag === tag) &&
        (!q || p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)),
    );
  }, [posts, tag, query]);

  const crowPick = () => {
    const pool = visible.length ? visible : posts;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    setPicked(choice.slug);
    window.location.href = `/roost/${choice.slug}`;
  };

  return (
    <div>
      {/* controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTag("all")}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
              tag === "all"
                ? "border-ink bg-ink text-stone-50"
                : "border-ink-line bg-paper-card text-ink-soft hover:border-ink"
            }`}
          >
            all · {posts.length}
          </button>
          {tags.map(([t, n]) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                tag === t
                  ? "border-ink bg-ink text-stone-50"
                  : "border-ink-line bg-paper-card text-ink-soft hover:border-ink"
              }`}
            >
              {t} · {n}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="search the roost…"
            className="w-44 rounded-lg border-2 border-ink bg-paper-card px-3 py-1.5 font-mono text-xs text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={crowPick}
            className="btn-primary !px-3 !py-1.5 !text-xs"
            title="a crow chooses your next read"
          >
            🐦‍⬛ let the crow pick
          </button>
        </div>
      </div>

      {/* grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/roost/${post.slug}`}
            className={`group block h-full ${picked === post.slug ? "animate-pulse" : ""}`}
          >
            <article className="card-quiet flex h-full flex-col p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-ink group-hover:shadow-block-sm">
              <div className="flex items-center gap-2 font-mono text-[10px] text-ink-faint">
                <span className="rounded border border-ink-line bg-paper-deep px-1.5 py-0.5 uppercase tracking-wider">
                  {post.tag}
                </span>
                <span>{formatDate(post.date)}</span>
                <span>· {post.readMinutes}m</span>
              </div>
              <h2 className="mt-3 flex-1 font-display text-[15px] font-bold leading-snug">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">
                {post.summary}
              </p>
            </article>
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="card-quiet mt-8 p-10 text-center">
          <p className="font-display text-xl font-bold">(nil)</p>
          <p className="mt-2 text-sm text-ink-soft">
            No posts match — even the crow looked. Try another tag or search.
          </p>
        </div>
      ) : null}

      <p className="mt-10 text-center font-mono text-xs text-ink-faint">
        {posts.length} posts in the roost · crows remember faces. we remember production incidents.
      </p>
    </div>
  );
}
