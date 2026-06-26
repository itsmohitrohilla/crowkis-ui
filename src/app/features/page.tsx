import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import Cubes from "@/components/ui/cubes";

/* The Crowkis pixel crow — same house mark used on the About page. */
const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";
const CROW_PX: [number, number, number, number, string?][] = [
  [10, 0, 1, 1, EYE], // crest
  [12, 0, 1, 1, INK],
  [9, 1, 4, 4], // head
  [10, 2, 1, 1, "eye"],
  [13, 2, 3, 1], // beak
  [13, 3, 2, 1],
  [8, 3, 2, 1], // neck
  [3, 4, 9, 5], // body
  [0, 4, 3, 2], // tail
  [0, 6, 2, 1],
  [5, 5, 5, 3, WING], // wing
  [6, 9, 1, 2], // legs
  [9, 9, 1, 2],
  [5, 11, 2, 1], // feet
  [9, 11, 2, 1],
];

function PixelCrow() {
  return (
    <svg
      viewBox="0 0 16 12"
      className="h-auto w-full max-w-[260px]"
      shapeRendering="crispEdges"
      role="img"
      aria-label="Crowkis pixel crow"
    >
      {CROW_PX.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill === "eye" ? EYE : (fill ?? INK)} />
      ))}
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Features — everything Crowkis does",
  description:
    "Every Crowkis feature in one place: semantic + structural caching, long-term agent memory, reasoning reuse, guardrails, evals, RAG, AI gateway, prompt versioning, and the Rust engine underneath. Self-hosted, zero-egress.",
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
  ],
  alternates: { canonical: "/features" },
};

type Feature = { name: string; desc: string; href: string };
type Group = { eyebrow: string; title: string; blurb: string; items: Feature[] };

// GTM features that are hot in the AI market right now (agent memory, MCP, RAG,
// guardrails, evals, gateways, reasoning reuse) — flagged so buyers spot them fast.
const TRENDING = new Set<string>([
  "Agent memory",
  "Reasoning reuse",
  "MCP for AI apps",
  "Multimodal cache",
  "Input guardrails (CGUARD)",
  "Online evals (CEVAL)",
  "AI Gateway",
  "Self-hosted RAG (CDOC)",
  "Semantic + structural matching",
]);

const GROUPS: Group[] = [
  {
    eyebrow: "The core",
    title: "A cache that understands meaning",
    blurb:
      "Seven systems decide what is safe to reuse — semantic and structural together, gated by confidence, freshness, and trust.",
    items: [
      {
        name: "Semantic + structural matching",
        desc: "Vector similarity and intent/template matching together — paraphrases hit, but a wrong number or entity never does.",
        href: "/roost/template-matching-deep-dive",
      },
      {
        name: "Confidence scoring",
        desc: "Every hit returns a 5-signal geometric-mean score so you gate reuse on a number, not faith.",
        href: "/roost/confidence-scoring-per-hit",
      },
      {
        name: "Adaptive thresholds",
        desc: "Per-intent base bars + complexity adjustment + an EMA feedback loop that learns and persists.",
        href: "/roost/adaptive-thresholds-that-learn",
      },
      {
        name: "Anti-poisoning pipeline",
        desc: "Five stages score every write before it can be served — coherence, content, trust, isolation, neighbourhood.",
        href: "/roost/cache-poisoning-is-the-whole-problem",
      },
      {
        name: "Smart eviction",
        desc: "Composite retention by recency, frequency, isolation, and compute cost — keeps the answers that are expensive to rebuild.",
        href: "/roost/smart-eviction-design",
      },
      {
        name: "Freshness control",
        desc: "Per-intent TTL policies, version pinning, and webhook invalidation, with freshness decay inside confidence.",
        href: "/roost/freshness-policies",
      },
    ],
  },
  {
    eyebrow: "For agents",
    title: "Memory and reuse for agentic systems",
    blurb: "The features that make agents remember, share work, and stop paying twice.",
    items: [
      {
        name: "Agent memory",
        desc: "Long-term, consolidating, bi-temporal memory scoped to (agent, user) — 70.4% recall@10 on LoCoMo.",
        href: "/agent-memory",
      },
      {
        name: "Reasoning reuse",
        desc: "Cache the chain-of-thought as a step graph and replay it for the next query at ~15% of the token cost.",
        href: "/roost/cthink-creuse-reasoning-store",
      },
      {
        name: "Sessions",
        desc: "Multi-turn conversation buffers with both recent-window reads and semantic search across the whole chat.",
        href: "/roost/how-to-use-csession",
      },
      {
        name: "Tool-result cache",
        desc: "Cache a deterministic tool call keyed by tool + exact args, so a swarm's duplicate lookups become one.",
        href: "/roost/how-to-use-ctoolset-ctoolget",
      },
      {
        name: "MCP for AI apps",
        desc: "Let Claude Code and agents use the cache as a tool over MCP — one config block, same trust pipeline.",
        href: "/mcp",
      },
      {
        name: "Multimodal cache",
        desc: "Cache image-plus-text lookups, so a repeated vision question is a hit instead of an expensive re-run.",
        href: "/roost/multimodal-image-text-cache",
      },
    ],
  },
  {
    eyebrow: "Safety & guardrails",
    title: "The features that say no",
    blurb: "Input and output gates, evals, and human-approved answers — all local, all zero-egress.",
    items: [
      {
        name: "Input guardrails (CGUARD)",
        desc: "Prompt-injection and jailbreak scanning that normalizes leetspeak and zero-width evasion first.",
        href: "/roost/how-to-use-cguard",
      },
      {
        name: "Output guardrails (COUTCHECK)",
        desc: "PII-leak, toxicity, and JSON-validity scanning on the response before it ships.",
        href: "/roost/how-to-use-coutcheck",
      },
      {
        name: "Online evals (CEVAL)",
        desc: "Nine deterministic evaluators that grade output without a second model — tracked over time on /metrics.",
        href: "/roost/how-to-use-ceval",
      },
      {
        name: "Pinned answers",
        desc: "Serve a human-approved answer verbatim for the questions where 'close enough' is unacceptable.",
        href: "/roost/how-to-use-cpin",
      },
      {
        name: "Negative cache",
        desc: "Flag a wrong answer once; every paraphrase of the question that would reproduce it is caught.",
        href: "/roost/how-to-use-cflag-ccheckbad",
      },
      {
        name: "PII scrub & erasure",
        desc: "Report what personal data is cached and execute right-to-erasure on request.",
        href: "/roost/cpii-scrub-and-erase",
      },
    ],
  },
  {
    eyebrow: "Build & operate",
    title: "Everything around the cache",
    blurb: "Gateway, RAG, prompt ops, budgets, and the observability to run it all.",
    items: [
      {
        name: "AI Gateway",
        desc: "An OpenAI-compatible proxy — point your client at Crowkis and get semantic caching, retries, and routing.",
        href: "/roost/ai-gateway-openai-compatible",
      },
      {
        name: "Self-hosted RAG (CDOC)",
        desc: "Auto-chunking, metadata filtering, and reranking inside the cache — no separate vector database.",
        href: "/roost/how-to-use-cdoc",
      },
      {
        name: "Prompt versioning & A/B",
        desc: "Named templates with versioning, variable rendering, sticky per-user splits, and rollback.",
        href: "/roost/how-to-use-cprompt",
      },
      {
        name: "Budgets & rate limits",
        desc: "Per-tenant spend visibility and requests/tokens-per-minute ceilings, enforced before the invoice.",
        href: "/roost/how-to-use-cbudget",
      },
      {
        name: "Local embeddings (CEMBED)",
        desc: "Free, cached, no-API-key embeddings from the bundled ONNX model — the foundation everything else stands on.",
        href: "/roost/cembed-free-local-embeddings",
      },
      {
        name: "Observability",
        desc: "Live dashboard, CINFO, and Prometheus /metrics — hit rate, saved spend, safety blocks, all in the box.",
        href: "/roost/how-to-use-cinfo",
      },
    ],
  },
  {
    eyebrow: "The platform",
    title: "What it's all built on",
    blurb: "Drop-in adoption, a hand-built Rust engine, and one signed image.",
    items: [
      {
        name: "Redis-compatible (RESP3)",
        desc: "Existing Redis clients connect unmodified — adoption is a port change, not a rewrite.",
        href: "/roost/resp3-protocol-choice",
      },
      {
        name: "Built in Rust",
        desc: "A custom LSM engine and in-process vector index, no GC in the read path — sub-millisecond hits by design.",
        href: "/roost/why-rust",
      },
      {
        name: "One signed image",
        desc: "Every feature compiled in; a license file flips Community to Enterprise at boot. No supply chain to attack.",
        href: "/docker",
      },
      {
        name: "Four protocols",
        desc: "RESP, gRPC, REST, and MCP front the same engine — reach the cache however your stack prefers.",
        href: "/docs/commands",
      },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
          <span className="eyebrow">Features</span>
          <h1 className="responsive-title mt-4 max-w-3xl">Everything Crowkis does, on one page.</h1>
          <p className="responsive-subtitle mt-5 max-w-2xl">
            A semantic cache that understands meaning, long-term memory for your agents, guardrails
            that say no, and the Rust engine that makes it all sub-millisecond — every capability,
            grouped and linked.
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
            The ones marked{" "}
            <span className="rounded-md border-2 border-ink bg-crow px-1.5 py-0.5 align-middle font-mono text-[10px] font-bold uppercase tracking-wider text-stone-50">
              ▲ Trending
            </span>{" "}
            are what the AI market is buying right now — agent memory, MCP, RAG, guardrails, evals,
            and gateways. Crowkis ships them all in one self-hosted, zero-egress binary.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/agent-memory" className="btn-primary">
              Explore Agent Memory
            </Link>
            <Link href="/docker" className="btn-secondary">
              Install Crowkis
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs text-ink-faint">
            {[
              ["28+", "features, one binary"],
              ["4", "protocols — RESP · gRPC · REST · MCP"],
              ["0", "external API calls"],
              ["$0", "to run Community"],
            ].map(([v, l]) => (
              <span key={l} className="flex items-baseline gap-2">
                <span className="font-display text-lg font-bold text-ink">{v}</span> {l}
              </span>
            ))}
          </div>
          </div>

          {/* the pixel crow */}
          <div className="mx-auto w-full max-w-[340px]">
            <div className="card-block faded-grid relative overflow-hidden p-8">
              <div className="chip-float-a flex justify-center">
                <PixelCrow />
              </div>
              <p className="mt-5 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                one engine · every feature
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* grouped features */}
      {GROUPS.map((g, gi) => (
        <section
          key={g.title}
          className={gi % 2 === 1 ? "border-y-2 border-ink bg-paper-deep" : ""}
        >
          <div className="section py-14 md:py-16">
            <span className="eyebrow">{g.eyebrow}</span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {g.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">{g.blurb}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((f, i) => (
                <Link
                  key={f.name}
                  href={f.href}
                  className="group card-block relative flex flex-col overflow-hidden p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ink hover:shadow-block"
                >
                  {/* crow accent bar that grows on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-crow transition-transform duration-300 group-hover:scale-x-100"
                  />
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-7 items-center justify-center rounded-md border-2 border-ink bg-paper-deep px-2 font-mono text-[11px] font-bold leading-none tabular-nums text-ink transition-colors group-hover:bg-crow group-hover:text-stone-50">
                      {gi + 1}.{String(i + 1).padStart(2, "0")}
                    </span>
                    {TRENDING.has(f.name) ? (
                      <span className="rounded-md border-2 border-ink bg-crow px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-50">
                        ▲ Trending
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug">{f.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{f.desc}</p>
                  <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-crow">
                    Read the deep-dive
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* 3D interactive accent */}
      <section className="border-y-2 border-ink bg-paper-deep">
        <div className="section grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="mx-auto w-full max-w-[320px]">
            <div className="card-block overflow-hidden p-6">
              <div className="aspect-square">
                <Cubes
                  gridSize={6}
                  maxAngle={50}
                  radius={3}
                  borderStyle="1.5px solid #16130e"
                  faceColor="#fffdf9"
                  rippleColor="#d62221"
                  rippleSpeed={1.6}
                  autoAnimate
                  rippleOnClick
                />
              </div>
              <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                hover · click to ripple
              </p>
            </div>
          </div>
          <div>
            <span className="eyebrow">One surface, many features</span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Every feature is a cell in the same grid
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-soft">
              Cache, memory, guardrails, gateway — they aren&apos;t bolt-ons stitched across
              services. They&apos;re facets of one Redis-compatible engine, sharing the same store,
              the same embedder, the same trust pipeline. Touch one and the whole thing responds.
            </p>
          </div>
        </div>
      </section>

      {/* close */}
      <section className="section py-16 md:py-20">
        <div className="card-block flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight">
              One signed image. Every feature. Free to run.
            </h2>
            <p className="mt-2 max-w-xl text-ink-soft">
              Community edition ships at full power. A license file flips it to Enterprise at boot.
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
    </SiteShell>
  );
}
