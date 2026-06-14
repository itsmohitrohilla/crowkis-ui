import { Metadata } from "next";
import Link from "next/link";
import { CommandCard } from "@/components/ui/code-tabs";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Crowkis documentation — quickstart, the command reference, configuration, security, the SDKs, and MCP. Everything you need to run and build on the cache.",
};

const PATHS = [
  {
    badge: "5 min",
    title: "I just want it running",
    body: "Pull the image, fire your first commands, watch a cache hit in the dashboard.",
    href: "/docs/quickstart",
    cta: "Start the quickstart",
  },
  {
    badge: "ship it",
    title: "I'm deploying to production",
    body: "The hardened Docker setup, health checks, the auth boundary, and day-2 ops.",
    href: "/docs/docker",
    cta: "Docker deployment",
  },
  {
    badge: "build",
    title: "I'm wiring it into my app",
    body: "Drop-in SDKs for Python and Node, or let an AI agent use the cache over MCP.",
    href: "/docs/sdk-python",
    cta: "Browse the SDKs",
  },
];

const SECTIONS = [
  {
    group: "Getting started",
    blurb: "From zero to a cache hit.",
    items: [
      ["Quickstart", "Pull, run, first hit — about five minutes.", "/docs/quickstart"],
      ["Docker deployment", "The hardened, production-shaped way to run it.", "/docs/docker"],
    ],
  },
  {
    group: "Reference",
    blurb: "Every command, knob, and gate.",
    items: [
      ["Commands", "The C* semantic family plus the Redis commands it speaks.", "/docs/commands"],
      ["Configuration", "Every environment variable, explained, with defaults.", "/docs/configuration"],
      ["Security model", "Auth per surface, tenant isolation, the trust pipeline.", "/docs/security"],
    ],
  },
  {
    group: "SDKs & integrations",
    blurb: "Talk to Crowkis from your stack.",
    items: [
      ["Python SDK", "Sync + async, get_or_compute, streaming, multimodal.", "/docs/sdk-python"],
      ["Node.js / TypeScript", "Typed client, retry/backoff, CachedOpenAI wrapper.", "/docs/sdk-node"],
      ["MCP for AI apps", "Let Claude Code and agents use the cache as a tool.", "/docs/mcp"],
    ],
  },
];

export default function DocsHome() {
  return (
    <div className="max-w-3xl">
      {/* hero */}
      <header className="border-b-2 border-ink pb-8">
        <p className="eyebrow">Documentation</p>
        <h1 className="responsive-title mt-3">Run Crowkis. Build on it. In that order.</h1>
        <p className="responsive-subtitle mt-4">
          Everything is here — but you only need a little of it to start. Pick the path that matches
          what you&apos;re doing, or jump straight to the section you need from the sidebar.
        </p>
        <div className="mt-6 max-w-xl">
          <CommandCard
            command="docker pull crowkis/crowkis:latest"
            note="then the quickstart — first cache hit in about five minutes"
          />
        </div>
      </header>

      {/* pick a path */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-bold">Start where you are</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {PATHS.map((p) => (
            <Link key={p.href} href={p.href} className="group block h-full">
              <article className="card-block flex h-full flex-col p-5 transition-transform group-hover:-translate-y-1">
                <span className="self-start rounded-md border-2 border-ink bg-crow px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-50">
                  {p.badge}
                </span>
                <h3 className="mt-3 font-display text-[15px] font-bold leading-snug">{p.title}</h3>
                <p className="mt-2 flex-1 text-[13px] leading-relaxed text-ink-soft">{p.body}</p>
                <p className="mt-3 font-mono text-xs font-semibold text-crow">
                  {p.cta} <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </p>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* all sections */}
      <section className="mt-12 space-y-8">
        {SECTIONS.map((s) => (
          <div key={s.group}>
            <div className="flex items-baseline gap-3 border-b border-ink-line pb-2">
              <h2 className="font-display text-xl font-bold">{s.group}</h2>
              <span className="font-mono text-xs text-ink-faint">{s.blurb}</span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {s.items.map(([title, desc, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="group rounded-xl border border-ink-line bg-paper-card p-4 transition-colors hover:border-ink"
                >
                  <p className="font-display font-bold">
                    {title}{" "}
                    <span className="text-crow transition-transform group-hover:translate-x-0.5">→</span>
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{desc}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* help footer */}
      <section className="mt-12 rounded-xl border-2 border-ink bg-paper-deep p-6">
        <p className="font-display text-lg font-bold">Stuck, or something missing?</p>
        <p className="mt-1 text-sm text-ink-soft">
          The FAQ covers the common questions, and the inbox is open for the rest.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/faq" className="btn-secondary !py-2 text-sm">
            Read the FAQ
          </Link>
          <a
            href="mailto:info.crowkis@gmail.com?subject=Crowkis%20docs%20question"
            className="btn-ghost !py-2 text-sm"
          >
            Email us →
          </a>
        </div>
      </section>
    </div>
  );
}
