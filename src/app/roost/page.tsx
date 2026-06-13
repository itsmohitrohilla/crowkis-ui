import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/layout/site-shell";
import { RoostBrowser } from "@/components/marketing/roost-browser";
import { allRoostPosts } from "@/lib/content/library";

export const metadata: Metadata = {
  title: "The Roost",
  description:
    "100 engineering notes from the people building Crowkis — comparisons, use cases, economics, internals, security, and operations. No growth-hack content.",
};

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function RoostIndexPage() {
  const [latest] = allRoostPosts;

  return (
    <SiteShell>
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section flex items-end justify-between gap-6 py-12 md:py-16">
          <div>
            <p className="eyebrow">Notes from the nest · {allRoostPosts.length} posts</p>
            <h1 className="responsive-title mt-3">The Roost</h1>
            <p className="responsive-subtitle mt-4 max-w-xl">
              Engineering notes written by the people building Crowkis. Comparisons with everything
              else, use cases, economics, internals, security, operations — and nothing written to
              rank on a search engine.
            </p>
          </div>
          <Image
            src="/logo.png"
            alt=""
            width={110}
            height={110}
            className="hidden shrink-0 md:block"
          />
        </div>
      </section>

      <section className="section py-10 md:py-14">
        {/* featured latest */}
        <Link href={`/roost/${latest.slug}`} className="group block">
          <article className="card-block p-7 transition-transform group-hover:-translate-y-1 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-ink-faint">
              <span className="rounded-md border-2 border-ink bg-crow px-2 py-0.5 font-bold uppercase tracking-wider text-paper-card">
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

        <div className="mt-10">
          <RoostBrowser posts={allRoostPosts} />
        </div>
      </section>
    </SiteShell>
  );
}
