import { Metadata } from "next";
import Link from "next/link";
import { HeroArt } from "@/components/marketing/hero-art";
import { SiteShell } from "@/components/layout/site-shell";
import { getPostsPage, getTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "The Roost",
  description:
    "Engineering notes from the people building Crowkis: semantic caching, agent memory, comparisons, use cases, economics, internals, security, and operations.",
  alternates: { canonical: "/roost" },
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

const PER_PAGE = 20;

export default async function RoostIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const q = (sp.q ?? "").trim() || undefined;

  const { posts, total, totalPages } = await getPostsPage({ page, perPage: PER_PAGE, q });
  const roostTags = await getTags();

  const isFirstUnfiltered = page === 1 && !q;
  const latest = isFirstUnfiltered ? posts[0] : undefined;
  const listPosts = isFirstUnfiltered ? posts.slice(1) : posts;

  const pageHref = (n: number) =>
    `/roost?${new URLSearchParams({ ...(q ? { q } : {}), ...(n > 1 ? { page: String(n) } : {}) }).toString()}`.replace(
      /\?$/,
      "",
    );

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://crowkis.com/roost",
    name: "The Roost",
    description: "Engineering notes from the people building Crowkis.",
    url: "https://crowkis.com/roost",
    publisher: { "@id": "https://crowkis.com/#org" },
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />

      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section flex items-end justify-between gap-6 py-12 md:py-16">
          <div>
            <p className="eyebrow">Notes from the nest · {total} posts</p>
            <h1 className="responsive-title mt-3">The Roost</h1>
            <p className="responsive-subtitle mt-4 max-w-xl">
              Engineering notes written by the people building Crowkis. Comparisons, use cases,
              economics, internals, security, operations, and nothing written just to rank.
            </p>
          </div>
          <div className="hidden shrink-0 md:block">
            <HeroArt variant={2} />
          </div>
        </div>
      </section>

      <section className="section py-10 md:py-14">
        {/* search + topics */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <form action="/roost" method="get" className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="search the roost…"
              className="w-56 rounded-lg border-2 border-ink bg-paper-card px-3 py-1.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-crow"
            />
            <button type="submit" className="btn-secondary !px-3 !py-1.5 !text-xs">
              Search
            </button>
          </form>
          <div className="flex flex-wrap gap-2">
            {roostTags.map((t) => (
              <Link
                key={t}
                href={`/roost/tag/${t}`}
                className="rounded-lg border border-ink-line bg-paper-card px-2.5 py-1 font-mono text-[11px] text-ink-soft transition hover:border-ink hover:text-ink"
              >
                {t}
              </Link>
            ))}
          </div>
        </div>

        {q ? (
          <p className="mt-6 font-mono text-xs text-ink-faint">
            {total} result{total === 1 ? "" : "s"} for &ldquo;{q}&rdquo; ·{" "}
            <Link href="/roost" className="text-crow hover:underline">
              clear
            </Link>
          </p>
        ) : null}

        {/* featured latest — only on the unfiltered first page */}
        {latest ? (
          <Link href={`/roost/${latest.slug}`} className="group mt-8 block">
            <article className="card-block p-7 transition-transform group-hover:-translate-y-1 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-faint">
                <span className="rounded-md border-2 border-ink bg-crow px-2 py-0.5 font-bold uppercase tracking-wider text-stone-50">
                  latest
                </span>
                <span>{formatDate(latest.date)}</span>
                <span>· {latest.readMinutes} min</span>
                <span>· {latest.tag}</span>
              </div>
              <h2 className="mt-4 max-w-3xl font-display text-2xl font-bold leading-tight sm:text-3xl">
                {latest.title}
              </h2>
              <p className="mt-3 max-w-2xl text-ink-soft">{latest.summary}</p>
              <p className="mt-5 font-semibold text-crow">
                Read it{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </p>
            </article>
          </Link>
        ) : null}

        {/* grid */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listPosts.map((post) => (
            <Link key={post.slug} href={`/roost/${post.slug}`} className="group block h-full">
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

        {total === 0 ? (
          <div className="card-quiet mt-8 p-10 text-center">
            <p className="font-display text-xl font-bold">(nil)</p>
            <p className="mt-2 text-sm text-ink-soft">No posts match. Try another search.</p>
          </div>
        ) : null}

        {/* pagination */}
        {totalPages > 1 ? (
          <nav className="mt-10 flex items-center justify-center gap-3 font-mono text-xs">
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className="btn-secondary !px-3 !py-1.5 !text-xs">
                ← Prev
              </Link>
            ) : (
              <span className="btn-secondary pointer-events-none !px-3 !py-1.5 !text-xs opacity-40">
                ← Prev
              </span>
            )}
            <span className="text-ink-soft">
              Page {page} of {totalPages}
            </span>
            {page < totalPages ? (
              <Link href={pageHref(page + 1)} className="btn-secondary !px-3 !py-1.5 !text-xs">
                Next →
              </Link>
            ) : (
              <span className="btn-secondary pointer-events-none !px-3 !py-1.5 !text-xs opacity-40">
                Next →
              </span>
            )}
          </nav>
        ) : null}
      </section>
    </SiteShell>
  );
}
