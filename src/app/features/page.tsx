import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/layout/site-shell";
import { TiltCard } from "@/components/ui/tilt-card";
import { FeatureExplorer } from "@/components/marketing/feature-explorer";
import { FeaturesMotion } from "@/components/features/features-motion";
import { SystemsDiagram } from "@/components/features/systems-diagram";
import s from "@/components/features/features.module.css";

export const metadata: Metadata = {
  title: "Features: seven systems, three protocols, one binary",
  description:
    "Every Crowkis feature on one page: the seven intelligence systems in plain words and under the hood, agent memory, guardrails, evals, RAG, AI gateway, the operator control plane, the Rust storage engine, and three protocols (RESP3, gRPC, REST). Self-hosted, zero-egress.",
  keywords: [
    "Crowkis features",
    "semantic cache features",
    "agent memory",
    "LLM cache features",
    "guardrails",
    "RAG",
    "AI gateway",
    "prompt versioning",
    "agentic AI",
    "anti-poisoning",
    "confidence scoring",
    "reasoning reuse",
    "Redis-compatible LLM cache",
  ],
  alternates: { canonical: "/features" },
};

/** stagger index for the reveal / entrance animations in features.module.css */
const at = (i: number) => ({ "--i": i }) as CSSProperties;

type System = { n: string; name: string; short: string; plain: string; tech: string };
type Feature = { name: string; desc: string; href?: string };
type Group = { eyebrow: string; title: string; blurb: string; items: Feature[] };

// GTM features that are hot in the AI market right now (agent memory, RAG,
// guardrails, evals, gateways, reasoning reuse), flagged so buyers spot them fast.
const TRENDING = new Set<string>([
  "Agent memory",
  "Reasoning reuse",
  "Multimodal cache",
  "Input guardrails (CGUARD)",
  "Online evals (CEVAL)",
  "AI Gateway",
  "Self-hosted RAG (CDOC)",
  "Semantic + structural matching",
]);

const SYSTEMS: System[] = [
  {
    n: "01",
    name: "Semantic + structural matching",
    short: "Matching",
    plain:
      "It knows 'how do refunds work?' and 'what's your refund window?' are the same question, but 'cancel' and 'pause' are not.",
    tech: "Every query gets an embedding in the HNSW vector index and a structural template, numbers, dates, and entities abstracted into slots. A hit requires both signals to agree, which kills the false-positive class that similarity-only caches are infamous for.",
  },
  {
    n: "02",
    name: "Anti-poisoning pipeline",
    short: "Anti-poisoning",
    plain:
      "One bad answer in a smart cache spreads to everyone who asks anything similar. Crowkis checks every answer's trustworthiness before storing it.",
    tech: "Five weighted stages, coherence 0.30, content 0.10, source trust 0.30, tenant isolation 0.15, neighbourhood agreement 0.15, with a 0.75 composite floor. Every accept and refuse lands in an append-only trust ledger, so writers with bad history face a higher bar.",
  },
  {
    n: "03",
    name: "Adaptive thresholds",
    short: "Thresholds",
    plain:
      "The cache learns where it can afford to be generous and where it must be strict, by watching its own results.",
    tech: "Per-intent reuse thresholds adjust from live hit/miss feedback within bounded ranges, with complexity adjustment and EMA decay. Twelve intent classes, each with its own bar; any threshold can be pinned via the management API.",
  },
  {
    n: "04",
    name: "Reasoning reuse",
    short: "Reasoning reuse",
    plain:
      "Beyond reusing answers, Crowkis reuses the way an answer was worked out, the expensive part of an LLM call.",
    tech: "Chain-of-thought output is parsed into typed steps, specifics are abstracted into slots, and the step-sequence signature is stored. New inputs that match the signature get the recomposed skeleton, savings response-level caching can't reach.",
  },
  {
    n: "05",
    name: "Smart eviction",
    short: "Smart eviction",
    plain:
      "When space runs low, it doesn't throw out the most valuable answers, it knows what each one cost to make.",
    tech: "Eviction scores recency, frequency, isolation, and compute cost at 0.25 each. A $0.40 chain-of-thought answer and a $0.0004 one-liner are not equally disposable, and the evictor knows it.",
  },
  {
    n: "06",
    name: "Confidence scoring",
    short: "Confidence scoring",
    plain:
      "Every served answer clears a quality bar first. Uncertain matches go to the model instead of guessing.",
    tech: "A geometric mean of five signals, similarity, freshness, trust, hit history, intent threshold, gates every response. Factual content needs 0.88; creative gets 0.70. The geometric mean means one weak signal tanks the score, by design.",
  },
  {
    n: "07",
    name: "Freshness control",
    short: "Freshness",
    plain: "Yesterday's truth doesn't outlive its shelf life. Prices change; the cache keeps up.",
    tech: "Five TTL policies plus version pinning and invalidation webhooks. Freshness also feeds confidence, an aging entry decays toward recompute before it ever serves something stale.",
  },
];

const GROUPS: Group[] = [
  {
    eyebrow: "For agents",
    title: "Memory and reuse for agentic systems",
    blurb: "The features that make agents remember, share work, and stop paying twice.",
    items: [
      {
        name: "Agent memory",
        desc: "Long-term, consolidating, bi-temporal memory scoped to (agent, user), 70.4% recall@10 on LoCoMo.",
        href: "/agent-memory",
      },
      {
        name: "Sessions",
        desc: "Multi-turn conversation buffers with both recent-window reads and semantic search across the whole chat.",
        href: "/docs/commands",
      },
      {
        name: "Tool-result cache",
        desc: "Cache a deterministic tool call keyed by tool + exact args, so a swarm's duplicate lookups become one.",
        href: "/docs/commands",
      },
      {
        name: "Multimodal cache",
        desc: "Cache image-plus-text lookups, so a repeated vision question is a hit instead of an expensive re-run.",
        href: "/docs/commands",
      },
    ],
  },
  {
    eyebrow: "Safety & guardrails",
    title: "The features that say no",
    blurb: "Input and output gates, evals, and human-approved answers, all local, all zero-egress.",
    items: [
      {
        name: "Input guardrails (CGUARD)",
        desc: "Prompt-injection and jailbreak scanning that normalizes leetspeak and zero-width evasion first.",
        href: "/docs/commands",
      },
      {
        name: "Output guardrails (COUTCHECK)",
        desc: "PII-leak, toxicity, and JSON-validity scanning on the response before it ships.",
        href: "/docs/commands",
      },
      {
        name: "Online evals (CEVAL)",
        desc: "Nine deterministic evaluators that grade output without a second model, tracked over time on /metrics.",
        href: "/docs/commands",
      },
      {
        name: "Pinned answers",
        desc: "Serve a human-approved answer verbatim for the questions where 'close enough' is unacceptable.",
        href: "/docs/commands",
      },
      {
        name: "Negative cache",
        desc: "Flag a wrong answer once; every paraphrase of the question that would reproduce it is caught.",
        href: "/docs/commands",
      },
      {
        name: "PII scrub & erasure",
        desc: "Report what personal data is cached and execute right-to-erasure on request.",
        href: "/docs/commands",
      },
    ],
  },
  {
    eyebrow: "Build",
    title: "Everything around the cache",
    blurb: "Gateway, RAG, prompt ops, and local embeddings.",
    items: [
      {
        name: "AI Gateway",
        desc: "An OpenAI-compatible proxy, point your client at Crowkis and get semantic caching, retries, and routing.",
        href: "/docs/commands",
      },
      {
        name: "Self-hosted RAG (CDOC)",
        desc: "Auto-chunking, metadata filtering, and reranking inside the cache, no separate vector database.",
        href: "/docs/commands",
      },
      {
        name: "Prompt versioning & A/B",
        desc: "Named templates with versioning, variable rendering, sticky per-user splits, and rollback.",
        href: "/docs/commands",
      },
      {
        name: "Local embeddings (CEMBED)",
        desc: "Free, cached, no-API-key embeddings from the bundled ONNX model, the foundation everything else stands on.",
        href: "/docs/commands",
      },
    ],
  },
  {
    eyebrow: "Operate",
    title: "The operator control plane",
    blurb: "Every decision leaves evidence. The dashboard and management API expose all of it.",
    items: [
      {
        name: "Live verdict feed",
        desc: "Every hit, miss, and block streamed with its confidence score and the stage that decided it.",
      },
      {
        name: "Cost accounting",
        desc: "Dollars and tokens saved, per tenant and per model, the number your CFO actually asks for.",
      },
      {
        name: "Canary & migration",
        desc: "Upgrade models without torching the warm cache: canary a slice, compare, migrate with leasing.",
      },
      {
        name: "Budgets & rate limits",
        desc: "Per-tenant spend visibility and requests/tokens-per-minute ceilings, enforced before the invoice.",
        href: "/docs/commands",
      },
      {
        name: "Observability",
        desc: "Live dashboard, CINFO, and Prometheus /metrics, hit rate, saved spend, safety blocks, all in the box.",
        href: "/docs/commands",
      },
    ],
  },
];

// [protocol, what it is, what you get]
const PROTOCOLS: [string, string, string][] = [
  ["RESP3", "Redis wire protocol", "redis-py, ioredis, Lettuce connect unmodified. crowkis cli ships in the binary."],
  ["gRPC", "h2c, protobuf", "Get / Set / GetStream / Stats / Invalidate for service meshes that prefer contracts."],
  ["REST", "management API", "Thresholds, tenants, budgets, PII reports, compliance exports, canary control."],
];

const ENGINE_FACTS: [string, string][] = [
  ["< 1ms", "cache hits, in-process"],
  ["347", "integration tests on the suite"],
  ["WAL", "crash-safe, CRC-checked records"],
  ["0 GC", "Rust, no collector pauses"],
];

// every numbered card on this page: systems + capabilities + protocols + the signed image
const TOTAL =
  SYSTEMS.length + GROUPS.reduce((n, g) => n + g.items.length, 0) + PROTOCOLS.length + 1;

const BADGE =
  "inline-flex h-7 items-center justify-center rounded-md border-2 border-ink bg-paper-deep px-2 font-mono text-[11px] font-bold leading-none tabular-nums text-ink transition-colors group-hover:bg-crow group-hover:text-stone-50";

function Trending() {
  return (
    <span className="rounded-md border-2 border-ink bg-crow px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-50">
      ▲ Trending
    </span>
  );
}

function FeatureCard({ f, badge, i, wide }: { f: Feature; badge: string; i: number; wide?: boolean }) {
  return (
    <div data-reveal style={at(i % 2)} className={wide ? "sm:col-span-2" : undefined}>
      <TiltCard className="group relative flex h-full flex-col overflow-hidden p-6">
        {/* crow accent bar that grows on hover */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-crow transition-transform duration-300 group-hover:scale-x-100"
        />
        <div className="flex items-center justify-between">
          <span className={BADGE}>{badge}</span>
          {TRENDING.has(f.name) ? <Trending /> : null}
        </div>
        <h3 className="mt-4 font-display text-base font-bold leading-snug">
          {f.href ? (
            <Link href={f.href} className="after:absolute after:inset-0">
              {f.name}
            </Link>
          ) : (
            f.name
          )}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
        {f.href ? (
          <span
            aria-hidden
            className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-crow"
          >
            Read the deep-dive
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        ) : null}
      </TiltCard>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <SiteShell>
      <div data-features className={s.root}>
        <FeaturesMotion />

        {/* hero */}
        <section className="border-b-2 border-ink bg-paper-deep paper-grid">
          <div className="section grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <span className="eyebrow">Features</span>
              <h1 className="responsive-title mt-4 max-w-3xl">
                Everything Crowkis does,{" "}
                <span className="relative inline-block">
                  on one page.
                  <span aria-hidden className={`absolute inset-x-0 -bottom-1.5 h-1.5 bg-crow ${s.wipe}`} />
                </span>
              </h1>
              <p className="responsive-subtitle mt-6 max-w-2xl">
                A semantic cache that understands meaning, long-term memory for your agents,
                guardrails that say no, and the Rust engine that makes it all sub-millisecond,
                every capability, grouped and linked.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
                The ones marked <Trending /> are what the AI market is buying right now, agent
                memory, RAG, guardrails, evals, and gateways. Crowkis ships them all in one
                self-hosted, zero-egress binary.
              </p>
              <div className={`mt-8 flex flex-wrap gap-3 ${s.rise}`} style={at(1)}>
                <Link href="/agent-memory" className="btn-primary">
                  Explore Agent Memory
                </Link>
                <Link href="/docker" className="btn-secondary">
                  Install Crowkis
                </Link>
                <a href="#systems" className="btn-ghost">
                  The seven systems ↓
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-ink-faint">
                {[
                  [`${TOTAL}+`, "features, one binary"],
                  [String(PROTOCOLS.length), "protocols, RESP · gRPC · REST"],
                  ["0", "external API calls"],
                  ["$0", "to run Community"],
                ].map(([v, l], i) => (
                  <span key={l} className={`flex items-baseline gap-2 ${s.rise}`} style={at(i + 2)}>
                    <span className="font-display text-lg font-bold text-ink">{v}</span> {l}
                  </span>
                ))}
              </div>
            </div>

            {/* the binary: seven systems drop in, then light up in turn */}
            <div aria-hidden className="mx-auto w-full max-w-[380px]">
              <div className={`card-block faded-grid overflow-hidden ${s.rise}`}>
                <div className="flex items-center justify-between border-b-2 border-ink bg-paper-deep px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                  <span className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="" width={22} height={16} />
                    crowkis
                  </span>
                  one binary
                </div>
                <div className="grid grid-cols-4 gap-2 p-4">
                  {SYSTEMS.map((sys, i) => (
                    <div
                      key={sys.n}
                      className={`relative aspect-square overflow-hidden rounded-md border-2 border-ink bg-paper-card ${s.tile}`}
                      style={at(i)}
                    >
                      {["text-ink-soft", `bg-crow text-stone-50 ${s.scan}`].map((tone) => (
                        <span
                          key={tone}
                          className={`absolute inset-0 flex flex-col justify-between p-1.5 font-mono ${tone}`}
                          style={at(i)}
                        >
                          <b className={tone === "text-ink-soft" ? "text-xs text-crow" : "text-xs"}>
                            {sys.n}
                          </b>
                          <span className="text-[9px] leading-tight">{sys.short}</span>
                        </span>
                      ))}
                    </div>
                  ))}
                  <div
                    className={`flex aspect-square items-center justify-center rounded-md border-2 border-ink bg-crow-tint ${s.tile}`}
                    style={at(SYSTEMS.length)}
                  >
                    <Image src="/logo.svg" alt="" width={44} height={31} />
                  </div>
                </div>
                <div className="grid grid-cols-3 border-t-2 border-ink bg-paper-deep font-mono text-[11px] font-bold text-ink">
                  {PROTOCOLS.map(([proto]) => (
                    <span
                      key={proto}
                      className="flex items-center justify-center gap-1.5 border-r-2 border-ink py-2 last:border-r-0"
                    >
                      <i className="h-1.5 w-1.5 animate-pulse bg-crow" />
                      {proto}
                    </span>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                seven systems · three protocols · one binary
              </p>
            </div>
          </div>
        </section>

        {/* trending ticker, decorative: every name on it is a card below */}
        <div aria-hidden className="overflow-hidden border-b-2 border-ink bg-ink py-2.5 text-paper">
          <div className="flex w-max animate-marquee font-mono text-xs font-semibold uppercase tracking-[0.18em]">
            {[0, 1].map((copy) => (
              <span key={copy} className="flex shrink-0">
                {Array.from(TRENDING).map((name) => (
                  <span key={name} className="flex items-center gap-3 pr-8">
                    <i className="h-2 w-2 bg-crow" />
                    {name}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* the seven systems: diagram stays put, write-ups scroll past it */}
        <section id="systems" className="section scroll-mt-24 py-14 md:py-20">
          <div data-reveal>
            <span className="eyebrow">The core</span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              The seven intelligence systems
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              Seven systems decide what is safe to reuse, semantic and structural together, gated
              by confidence, freshness, and trust. All seven ship in every edition, including free
              Community. No other cache ships them together.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
              Each system is explained twice: once in plain words for whoever pays the bill, once
              in specifics for whoever deploys the binary.
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div data-reveal className="lg:sticky lg:top-24 lg:self-start">
              <div className="card-block p-4 sm:p-5">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                  how a verdict gets made · pick a system
                </p>
                <SystemsDiagram systems={SYSTEMS} />
                <p className="mt-3 border-t border-ink-line pt-3 text-xs leading-relaxed text-ink-soft">
                  Five signals gate every response: similarity, freshness, trust, hit history,
                  intent threshold. One weak signal tanks the score, by design.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {SYSTEMS.map((sys) => (
                <div
                  key={sys.n}
                  id={`system-${sys.n}`}
                  data-step={sys.n}
                  data-reveal
                  // a diagram link lands the write-up mid-screen, where it also lights its node
                  className="scroll-mt-[calc(50vh-9rem)]"
                >
                  <TiltCard max={4} className="group relative overflow-hidden p-6 pl-8 sm:p-7 sm:pl-9">
                    {/* crow accent rail */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-0 h-full w-1.5 origin-left bg-crow transition-transform duration-300 group-hover:scale-x-[1.8]"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-lg font-bold text-crow">{sys.n}</span>
                      {TRENDING.has(sys.name) ? <Trending /> : null}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold leading-snug">{sys.name}</h3>
                    <p className="mt-3 rounded-lg border border-ink-line bg-paper-deep p-3 text-sm leading-relaxed text-ink-soft">
                      <span className="font-semibold text-ink">In plain words: </span>
                      {sys.plain}
                    </p>
                    <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
                      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                        under the hood ·{" "}
                      </span>
                      {sys.tech}
                    </p>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* grouped capabilities */}
        {GROUPS.map((g, gi) => (
          <section
            key={g.title}
            id={gi === 0 ? "capabilities" : undefined}
            className={`scroll-mt-24 border-ink ${gi % 2 === 0 ? "border-y-2 bg-paper-deep" : ""}`}
          >
            <div className="section grid gap-8 py-14 md:py-16 lg:grid-cols-[0.8fr_2fr] lg:gap-12">
              <div data-reveal className="lg:sticky lg:top-28 lg:self-start">
                <span className="eyebrow">{g.eyebrow}</span>
                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  {g.title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">{g.blurb}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {g.items.map((f, i) => (
                  <FeatureCard
                    key={f.name}
                    f={f}
                    badge={`${gi + 1}.${String(i + 1).padStart(2, "0")}`}
                    i={i}
                    wide={g.items.length % 2 === 1 && i === 0}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* engine band */}
        <section id="engine" className="scroll-mt-24 border-y-2 border-ink bg-roost py-14 text-stone-200 md:py-18">
          <div className="section grid items-center gap-10 md:grid-cols-2">
            <div data-reveal>
              <p className="eyebrow">The foundation</p>
              <h2 className="responsive-title mt-4 !text-stone-50">
                A storage engine built for this exact job.
              </h2>
              <p className="mt-4 leading-relaxed text-stone-400">
                CrowkisDB is a purpose-built Rust LSM tree, write-ahead log with CRC-checked
                records, 64 MB memtable, LZ4-compressed SSTables with bloom filters, three-level
                compaction, with the HNSW vector index persisting beside it. No RocksDB, no garbage
                collector in the read path, no external dependencies.
              </p>
              <p className="mt-4 rounded-lg border border-roost-line bg-roost-card p-4 text-sm leading-relaxed text-stone-400">
                <span className="font-semibold text-stone-200">In plain words:</span> the part that
                holds your data was built for caching LLM answers specifically, which is why hits
                come back in under a millisecond and a power cut doesn&apos;t cost you your cache.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ENGINE_FACTS.map(([big, small], i) => (
                <div
                  key={big}
                  data-reveal
                  style={at(i)}
                  className="rounded-xl border border-roost-line bg-roost-card p-5"
                >
                  <p className="font-display text-2xl font-bold text-stone-50">
                    {/^\d+$/.test(big) ? (
                      <span data-count={big} className="inline-block min-w-[3ch] tabular-nums">
                        {big}
                      </span>
                    ) : (
                      big
                    )}
                  </p>
                  <p className="mt-1 text-xs text-stone-400">{small}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* protocols feed one engine, shipped as one image */}
        <section id="protocols" className="section scroll-mt-24 py-14 md:py-20">
          <div data-reveal>
            <span className="eyebrow">The platform</span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Three ways in, one cache
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
              RESP, gRPC, and REST front the same engine, reach the cache however your stack
              prefers.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PROTOCOLS.map(([proto, sub, desc], i) => (
              <div key={proto} data-reveal style={at(i)}>
                <TiltCard className="group flex h-full flex-col p-6">
                  <span className={`${BADGE} self-start`}>
                    {GROUPS.length + 1}.{String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-bold">
                    {proto} <span className="ml-1 text-xs font-medium text-crow">{sub}</span>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
                </TiltCard>
              </div>
            ))}
          </div>
          {/* packets dropping from each protocol into the engine */}
          <div aria-hidden className="hidden grid-cols-3 gap-4 md:grid">
            {PROTOCOLS.map(([proto], i) => (
              <div key={proto} className="relative mx-auto h-11 w-0.5 bg-ink">
                <i className={`absolute -left-[3px] top-0 h-2 w-2 bg-crow ${s.fall}`} style={at(i)} />
              </div>
            ))}
          </div>
          <div
            data-reveal
            className="card-block mt-4 grid gap-6 p-6 shadow-block-red md:mt-0 md:grid-cols-[1.4fr_1fr] md:p-8"
          >
            <div>
              <span className="eyebrow">One surface, many features</span>
              <h3 className="mt-3 font-display text-xl font-bold tracking-tight sm:text-2xl">
                Every feature is a cell in the same grid
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
                Cache, memory, guardrails, gateway, they aren&apos;t bolt-ons stitched across
                services. They&apos;re facets of one Redis-compatible engine, sharing the same
                store, the same embedder, the same trust pipeline.
              </p>
            </div>
            <div className="group relative rounded-lg border-2 border-ink bg-paper-deep p-5">
              <span className={BADGE}>
                {GROUPS.length + 1}.{String(PROTOCOLS.length + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-base font-bold leading-snug">
                <Link href="/docker" className="after:absolute after:inset-0">
                  One signed image
                </Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Every feature compiled in; a license file flips Community to Enterprise at boot. No
                supply chain to attack.
              </p>
            </div>
          </div>
        </section>

        {/* full feature field guide */}
        <section id="field-guide" className="scroll-mt-24 border-y-2 border-ink bg-paper-deep py-14 md:py-18">
          <div className="section">
            <FeatureExplorer />
          </div>
        </section>

        {/* close */}
        <section className="section py-16 md:py-20">
          <div
            data-reveal
            className="card-block flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                One signed image. Every feature. Free to run.
              </h2>
              <p className="mt-2 max-w-xl text-ink-soft">
                Community edition ships at full power. A license file flips it to Enterprise at
                boot.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/docker" className="btn-primary">
                Get started
              </Link>
              <Link href="/enterprise" className="btn-secondary">
                Enterprise
              </Link>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
