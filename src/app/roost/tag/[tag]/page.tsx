import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { allRoostPosts, roostTags } from "@/lib/content/library";

// Keyword-rich copy per topic hub (SEO landing pages). Falls back for any new tag.
const TAG_INFO: Record<string, { title: string; blurb: string }> = {
  engineering: {
    title: "Engineering",
    blurb:
      "How Crowkis is built: the Rust LSM storage engine, the in-process vector index, and the internals behind a sub-millisecond semantic cache.",
  },
  security: {
    title: "Security",
    blurb:
      "Cache poisoning, the five-stage anti-poisoning pipeline, PII handling, tenant isolation, and the trust model behind a safe LLM cache.",
  },
  benchmarks: {
    title: "Benchmarks",
    blurb:
      "Measured latency, throughput, agent-memory recall, and cost, honest numbers from independent harnesses, not marketing.",
  },
  features: {
    title: "Features",
    blurb:
      "Deep dives on every Crowkis capability: agent memory, reasoning reuse, guardrails, evals, RAG, prompt versioning, and the AI gateway.",
  },
  guides: {
    title: "Guides",
    blurb:
      "Copy-paste guides for using Crowkis: Python and Node SDKs, the CLI, LangChain, LangGraph, and MCP.",
  },
  reference: {
    title: "Command reference",
    blurb: "How to use every Crowkis command from the crowkis cli, one focused page at a time.",
  },
  economics: {
    title: "Economics",
    blurb: "The money side of an LLM cache: what repeated traffic costs, and what semantic caching saves.",
  },
  operations: {
    title: "Operations",
    blurb: "Running Crowkis in production: deployment, hardening, observability, budgets, and day-2 work.",
  },
};

function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return roostTags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const info = TAG_INFO[tag];
  const name = info?.title ?? titleCase(tag);
  const description =
    info?.blurb ?? `Crowkis ${name.toLowerCase()} articles from the Roost, the semantic LLM cache and agent-memory engine.`;
  return {
    title: `${name} — The Roost`,
    description,
    keywords: [tag, "Crowkis", "LLM cache", "semantic cache", "agent memory", "agentic AI"],
    alternates: { canonical: `/roost/tag/${tag}` },
    openGraph: { type: "website", title: `${name} — The Roost`, description, url: `/roost/tag/${tag}` },
  };
}

export default async function RoostTagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  if (!roostTags.includes(tag)) notFound();

  const posts = allRoostPosts.filter((p) => p.tag === tag);
  const info = TAG_INFO[tag];
  const name = info?.title ?? titleCase(tag);
  const description =
    info?.blurb ?? `Crowkis ${name.toLowerCase()} articles from the Roost.`;

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `https://crowkis.com/roost/tag/${tag}`,
        name: `${name} — The Roost`,
        description,
        url: `https://crowkis.com/roost/tag/${tag}`,
        hasPart: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `https://crowkis.com/roost/${p.slug}`,
          datePublished: `${p.date}T00:00:00Z`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://crowkis.com" },
          { "@type": "ListItem", position: 2, name: "The Roost", item: "https://crowkis.com/roost" },
          {
            "@type": "ListItem",
            position: 3,
            name,
            item: `https://crowkis.com/roost/tag/${tag}`,
          },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section py-12 md:py-16">
          <Link
            href="/roost"
            className="font-mono text-xs text-ink-faint transition hover:text-crow"
          >
            ← the Roost
          </Link>
          <p className="eyebrow mt-4">Topic · {posts.length} posts</p>
          <h1 className="responsive-title mt-3">{name}</h1>
          <p className="responsive-subtitle mt-4 max-w-2xl">{description}</p>
        </div>
      </section>

      <section className="section py-10 md:py-14">
        {/* other topics — crawlable internal links */}
        <div className="flex flex-wrap gap-2">
          {roostTags.map((t) => (
            <Link
              key={t}
              href={`/roost/tag/${t}`}
              className={`rounded-lg border px-3 py-1.5 font-mono text-xs transition ${
                t === tag
                  ? "border-ink bg-ink text-paper"
                  : "border-ink-line bg-paper-card text-ink-soft hover:border-ink"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
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
      </section>
    </SiteShell>
  );
}
