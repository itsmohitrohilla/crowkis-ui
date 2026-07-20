import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { CopyButton } from "@/components/ui/code-tabs";
import { Venn } from "@/components/ui/mermaid";
import { FlowDiagram } from "@/components/ui/flow-diagram";
import { RoostBlock } from "@/lib/content/roost";
import { getAllPosts, getPost } from "@/lib/posts";

// Fetch from Supabase (with static fallback); regenerate hourly; render new
// posts on demand so DB additions appear without a rebuild.
export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  // Pre-build only the most recent posts; the rest render on-demand (dynamicParams)
  // and cache — keeps builds fast as the catalog grows to thousands.
  const posts = await getAllPosts();
  return posts.slice(0, 200).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "The Roost" };
  const url = `/roost/${post.slug}`;
  // Derive keywords from the title (minus stopwords) for real per-post relevance.
  const stop = new Set([
    "the","a","an","and","or","of","to","in","on","for","with","without","we","our","your",
    "is","are","it","its","that","this","how","why","when","what","not","as","at","by","from",
    "into","than","then","just","only","one","two","every","all","you","i","vs",
  ]);
  const titleWords = Array.from(
    new Set(
      post.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3 && !stop.has(w)),
    ),
  ).slice(0, 8);
  return {
    title: post.title,
    description: post.summary,
    keywords: [
      ...titleWords,
      post.tag,
      "Crowkis",
      "LLM cache",
      "semantic cache",
      "agent memory",
    ],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url,
      publishedTime: `${post.date}T00:00:00Z`,
      tags: [post.tag],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function Block({ block }: { block: RoostBlock }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mt-10 font-display text-2xl font-bold tracking-tight">{block.text}</h2>
      );
    case "p":
      return <p className="mt-5 leading-relaxed text-ink-soft">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="card-block mt-7 border-l-8 !border-l-crow p-6 font-display text-xl font-bold leading-snug">
          {block.text}
        </blockquote>
      );
    case "code":
      return (
        <div className="code-panel mt-6">
          <div className="code-chrome justify-between">
            <span>{block.title ?? "code"}</span>
            <CopyButton text={block.code} />
          </div>
          <pre>{block.code}</pre>
        </div>
      );
    case "plain":
      return (
        <div className="card-quiet mt-6 border-l-4 !border-l-crow p-4 text-sm leading-relaxed text-ink-soft">
          <span className="font-semibold text-ink">In plain words: </span>
          {block.text}
        </div>
      );
    case "art":
      return (
        <figure className="card-block mt-7 overflow-hidden !p-0">
          {block.title ? (
            <figcaption className="border-b-2 border-ink bg-paper-deep px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              {block.title}
            </figcaption>
          ) : null}
          <div
            className="bg-paper-card p-4 [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: block.svg }}
          />
          {block.caption ? (
            <p className="border-t border-ink-line px-4 py-2.5 text-xs italic text-ink-faint">
              {block.caption}
            </p>
          ) : null}
        </figure>
      );
    case "diagram":
      return (
        <figure className="card-block mt-7 overflow-hidden !p-0">
          <figcaption className="border-b-2 border-ink bg-paper-deep px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {block.title}
          </figcaption>
          <FlowDiagram chart={block.chart} />
          {block.caption ? (
            <p className="border-t border-ink-line px-4 py-2.5 text-xs italic text-ink-faint">
              {block.caption}
            </p>
          ) : null}
        </figure>
      );
    case "bars": {
      const max = Math.max(...block.series.map((s) => s.value), 1);
      return (
        <figure className="card-block mt-7 overflow-hidden !p-0">
          <figcaption className="flex items-baseline justify-between border-b-2 border-ink bg-paper-deep px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            <span>{block.title}</span>
            {block.unit ? <span className="text-ink-faint">{block.unit}</span> : null}
          </figcaption>
          <div className="space-y-3 p-5">
            {block.series.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-ink">{s.label}</span>
                  <span className="font-mono text-xs text-ink-soft">
                    {s.value}
                    {block.unit && /%/.test(block.unit) ? "%" : ""}
                    {s.sub ? <span className="text-ink-faint"> · {s.sub}</span> : null}
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-paper-deep">
                  <div
                    className={`h-2.5 rounded-full ${s.accent ? "bg-crow" : "bg-ink"}`}
                    style={{ width: `${(s.value / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {block.caption ? (
            <p className="border-t border-ink-line px-4 py-2.5 text-xs italic text-ink-faint">
              {block.caption}
            </p>
          ) : null}
        </figure>
      );
    }
    case "venn":
      return (
        <figure className="card-block mt-7 overflow-hidden !p-0">
          <figcaption className="border-b-2 border-ink bg-paper-deep px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {block.title}
          </figcaption>
          <Venn
            left={block.left}
            right={block.right}
            overlap={block.overlap}
            leftItems={block.leftItems}
            rightItems={block.rightItems}
          />
          {block.caption ? (
            <p className="border-t border-ink-line px-4 py-2.5 text-xs italic text-ink-faint">
              {block.caption}
            </p>
          ) : null}
        </figure>
      );
  }
}

export default async function RoostPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  // Prefer same-tag posts for "keep reading" — relevance + tighter internal linking.
  const all = await getAllPosts();
  const sameTag = all.filter((p) => p.slug !== post.slug && p.tag === post.tag);
  const rest = all.filter((p) => p.slug !== post.slug && p.tag !== post.tag);
  const others = [...sameTag, ...rest].slice(0, 2);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://crowkis.com" },
      { "@type": "ListItem", position: 2, name: "The Roost", item: "https://crowkis.com/roost" },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://crowkis.com/roost/${post.slug}`,
      },
    ],
  };

  // Article structured data — rich results in Google + citability for AI search.
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: `${post.date}T00:00:00Z`,
    dateModified: `${post.date}T00:00:00Z`,
    author: { "@type": "Organization", name: "Crowkis", url: "https://crowkis.com" },
    publisher: {
      "@type": "Organization",
      name: "Crowkis",
      logo: { "@type": "ImageObject", url: "https://crowkis.com/logo.png" },
    },
    mainEntityOfPage: `https://crowkis.com/roost/${post.slug}`,
    keywords: post.tag,
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <article className="section max-w-3xl py-12 md:py-16">
        <Link href="/roost" className="font-mono text-xs text-ink-faint transition hover:text-crow">
          ← back to the Roost
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-faint">
          <span className="rounded-md border border-ink-line bg-paper-card px-2 py-0.5 uppercase tracking-wider text-ink-soft">
            {post.tag}
          </span>
          <span>{formatDate(post.date)}</span>
          <span>· {post.readMinutes} min read</span>
        </div>
        <h1 className="mt-5 font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-5 border-l-4 border-crow pl-4 text-lg leading-relaxed text-ink-soft">
          {post.summary}
        </p>
        <div className="mt-4 border-t-2 border-ink pt-2">
          {post.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        <footer className="mt-14 border-t-2 border-ink pt-8">
          <p className="eyebrow">Keep reading</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {others.map((other) => (
              <Link key={other.slug} href={`/roost/${other.slug}`} className="group block h-full">
                <div className="card-quiet h-full p-5 transition-colors group-hover:border-ink">
                  <p className="font-mono text-xs text-ink-faint">
                    {formatDate(other.date)} · {other.readMinutes} min
                  </p>
                  <p className="mt-2 font-display font-bold leading-snug">{other.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </footer>
      </article>
    </SiteShell>
  );
}
