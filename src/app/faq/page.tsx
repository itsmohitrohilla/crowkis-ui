import { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Sixty straight answers about Crowkis: the problems it solves, what it can and cannot do, every enterprise feature, deployment, editions, and security.",
};

type QA = [string, string];
type Group = { id: string; title: string; intro: string; items: QA[] };

const GROUPS: Group[] = [
  {
    id: "problem",
    title: "The problem Crowkis solves",
    intro: "Why this product exists, in plain language.",
    items: [
      [
        "What problem does Crowkis actually solve?",
        "LLM apps pay to recompute answers they already produced. The same question arrives phrased a hundred ways, and every phrasing becomes a fresh model bill. Crowkis recognizes when a new question means the same thing as an old one and serves the stored answer, when it's safe to.",
      ],
      [
        "How much money is actually wasted without it?",
        "In most production LLM workloads, a large share of queries are paraphrases or repeats of earlier ones, support bots, internal copilots, and doc assistants are the worst offenders. Every one of those is full-price compute for an answer you already own.",
      ],
      [
        "Why can't I just use Redis for this?",
        "Redis matches exact bytes. 'How do refunds work?' and 'What's your refund window?' are different strings, so Redis treats them as different questions and you pay twice. Crowkis matches meaning and structure, not bytes.",
      ],
      [
        "Why can't I just use a vector database as a cache?",
        "Vector similarity alone over-serves. 'Cancel my subscription' and 'pause my subscription' embed close together, but serving one as the other is a customer-facing mistake. Crowkis adds structural template checks, intent classification, and confidence gates on top of vector search.",
      ],
      [
        "What is cache poisoning and why should I care?",
        "One bad entry, a hallucination, a prompt injection, a cross-tenant leak, gets served to every nearby query in a semantic cache. Poison radiates. Crowkis scores every write through a five-stage trust pipeline before it's ever served.",
      ],
      [
        "Does Crowkis make my app faster too, or just cheaper?",
        "Both. A cache hit returns in well under a millisecond from a local Rust engine, versus seconds for a model round-trip. Users see snappier answers; you see a smaller invoice.",
      ],
      [
        "In one sentence, what is Crowkis?",
        "A Redis-compatible cache, written in Rust, that understands what your LLM is being asked and only reuses an answer when it can justify that reuse.",
      ],
      [
        "Who is Crowkis for?",
        "Anyone paying an LLM bill on repetitive traffic: support and FAQ bots, internal copilots, RAG apps, agent fleets, and AI coding tools. Community edition is free, so 'for' includes solo developers.",
      ],
    ],
  },
  {
    id: "how",
    title: "How the cache decides",
    intro: "The five checks, for the technically curious.",
    items: [
      [
        "What has to be true for a cache hit to be served?",
        "Five things: the intent class matches, the structural template agrees, a semantic neighbour exists in the HNSW index, the composite confidence score clears that intent's threshold, and the entry passes trust and freshness checks. Any one of them can veto.",
      ],
      [
        "What are intent classes?",
        "Every query is classified into one of 12 intents, factual, creative, personal, transactional, and so on. Factual questions tolerate aggressive reuse; creative and personal ones get strict thresholds. A poem request never serves a cached poem meant for someone else.",
      ],
      [
        "What is structural template matching?",
        "Numbers, dates, and entities are lifted out of the query into slots, so 'invoice #4412 status' and 'invoice #9981 status' share one template. It catches paraphrases vectors miss and blocks false matches vectors invent.",
      ],
      [
        "How does confidence scoring work?",
        "Five signals, semantic similarity, freshness, source trust, hit history, and intent threshold, combine into a geometric mean. Factual content needs 0.88 to serve. Below threshold, the query goes to the model, full stop.",
      ],
      [
        "What exactly does the anti-poisoning pipeline check?",
        "Five weighted stages: coherence between question and answer (0.30), content heuristics (0.10), the writer's trust ledger history (0.30), tenant isolation consistency (0.15), and agreement with semantic neighbours (0.15). The composite must clear 0.75 or the write is refused and logged.",
      ],
      [
        "What is reasoning reuse?",
        "Crowkis extracts the step structure from chain-of-thought answers, abstracts the specifics into slots, and recomposes the skeleton for new inputs that share the pattern. It saves on the expensive part, the reasoning, not just the final words.",
      ],
      [
        "What are adaptive thresholds?",
        "Reuse thresholds tune themselves per intent class from live hit/miss feedback, within bounded ranges. Where mistakes hurt, the bar drifts up; where reuse is safe, it relaxes. You can pin any threshold by hand.",
      ],
      [
        "What happens on a cache miss?",
        "Exactly what happened before Crowkis existed: your request goes to the provider. Crowkis then offers the response to the write pipeline, and if it passes trust checks, the next paraphrase is a hit. Worst case, Crowkis behaves like a pass-through.",
      ],
    ],
  },
  {
    id: "features",
    title: "What Crowkis can do",
    intro: "The full feature surface, every tier.",
    items: [
      [
        "Which protocols does it speak?",
        "RESP3 (the Redis wire protocol, redis-py, ioredis, and Lettuce connect unmodified), gRPC over h2c for protobuf shops, a REST management API, and MCP for AI apps and agents. Same cache behind all four.",
      ],
      [
        "What's in the storage engine?",
        "A purpose-built Rust LSM tree: write-ahead log with CRC-checked records, 64 MB memtable, LZ4-compressed SSTables with bloom filters, three-level compaction, and an HNSW vector index that persists alongside. No RocksDB, no garbage collector in the read path.",
      ],
      [
        "Does it handle streaming responses?",
        "Yes, CGETSTREAM and the SDKs' stream_get_or_compute serve cached answers chunk by chunk, so a hit feels like live model output to your UI.",
      ],
      [
        "Does it handle images?",
        "Yes. Multimodal entries combine image and text signals, served through CIMGGET and the SDK helpers.",
      ],
      [
        "What does the dashboard show?",
        "A live verdict feed, every hit, miss, and block with its confidence score, plus hit-type breakdowns, cost saved per tenant and per model, top queries, top misses, safety blocks by stage, memory pressure, and license state.",
      ],
      [
        "Can I monitor it with my existing tools?",
        "Yes. Prometheus exposition on /metrics and OpenTelemetry support mean it lights up in Grafana or Datadog without an adapter.",
      ],
      [
        "What is model migration support?",
        "When you upgrade models, Crowkis treats it as a workflow: canary the new model on a slice of traffic, compare quality, then migrate cache entries with leasing. Your warm cache survives the upgrade instead of cold-starting.",
      ],
      [
        "What is federation and fallback routing?",
        "Crowkis can register multiple LLM backends and route around unhealthy ones. If your primary provider has an incident, traffic degrades to a fallback instead of failing.",
      ],
      [
        "What SDKs exist?",
        "Python (sync + async) and Node/TypeScript, both with get_or_compute, explicit semantic commands, and streaming. Plus the built-in crowkis cli REPL and the MCP server for AI-native tools.",
      ],
      [
        "What is get_or_compute?",
        "The one-liner pattern: give Crowkis the query and a function that calls your model. If a safe cached answer exists, your function never runs. If not, it runs once and the result is banked. Cache logic disappears from your codebase.",
      ],
      [
        "Can my AI coding assistant use it?",
        "Yes, that's the MCP integration. Claude Code and other MCP-capable apps register 'crowkis mcp' as a server and check the cache before spending tokens. Repeated lookups become free.",
      ],
      [
        "Does it work with LangChain or LlamaIndex?",
        "Yes, the Python SDK ships adapters and worked examples for both. The integration point is the same get_or_compute wrap around your chain's LLM call.",
      ],
    ],
  },
  {
    id: "limits",
    title: "What Crowkis deliberately does not do",
    intro: "Honest boundaries. A tool that claims everything does nothing.",
    items: [
      [
        "Does Crowkis replace my LLM provider?",
        "No. It sits in front of your provider and decides reuse-versus-recompute. It never generates content itself.",
      ],
      [
        "Is Crowkis a vector database for RAG?",
        "No. It uses a vector index internally for cache matching, but it isn't built to be your document retrieval store. Keep your RAG store; put Crowkis in front of the model calls.",
      ],
      [
        "Will it cache things that shouldn't be cached?",
        "It's engineered not to: personal, time-sensitive, and creative intents get strict thresholds, and the confidence gate refuses uncertain matches. You can also exclude tenants or set TTLs to zero for never-cache flows.",
      ],
      [
        "Does it phone home or collect telemetry?",
        "No. The license check is offline Ed25519 signature verification. Crowkis runs fully air-gapped. Nothing leaves your network unless you send it.",
      ],
      [
        "Can I read the source code?",
        "No, Crowkis is closed-source by design. You receive a signed binary in a minimal image: one file to security-review, no dependency tree to audit, no supply chain to poison.",
      ],
      [
        "Does it terminate TLS?",
        "Not in-process, run it behind your proxy or service mesh like you would most data-plane infrastructure, and keep the ports off the public internet.",
      ],
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise features",
    intro: "What the Enterprise license unlocks, line by line.",
    items: [
      [
        "What are virtual API keys? (Enterprise)",
        "Instead of one shared credential, you mint a key per app, team, or customer, each with its own budget and rate limits. When one app goes rogue, you throttle a key, not the whole cache.",
      ],
      [
        "What are per-key budgets and TPM/RPM limits? (Enterprise)",
        "Hard spending and rate ceilings per key. A runaway agent loop hits its budget and stops costing you money, Crowkis enforces the wall locally instead of you discovering it on the invoice.",
      ],
      [
        "What is Crowkis Replay? (Enterprise)",
        "The proof tool: replay a sample of your real production queries through the cache and get the exact hit rate and dollar savings you would have had. No projections, your own data. We run it for you on the demo call, before you spend anything.",
      ],
      [
        "What is prompt management? (Enterprise)",
        "Versioned prompts managed in the control plane, so prompt changes are tracked, comparable, and tied to cache behavior instead of scattered across codebases.",
      ],
      [
        "What are the agent conversation and tool-call caches? (Enterprise)",
        "Purpose-built cache paths for agent workloads: multi-turn conversation state and deterministic tool-call results. Agent fleets are the most repetitive traffic that exists, these two features usually justify the license on their own.",
      ],
      [
        "What is the reasoning patterns library? (Enterprise)",
        "A browsable library of the reasoning skeletons Crowkis has extracted, so teams can see which thought patterns recur and reuse them deliberately.",
      ],
      [
        "What is the Provider Arbitrage Router? (Enterprise)",
        "Routing that sends each query to the cheapest model that clears your quality bar for that intent, easy questions to cheap models, hard ones to frontier models, automatically.",
      ],
      [
        "What is the Cross-Provider Cache Bridge? (Enterprise)",
        "Answers cached from one provider serve equivalent queries on another. Switch from one vendor to another without abandoning the cache value you've built.",
      ],
      [
        "What are Compliance Modes? (Enterprise)",
        "Preset configurations for HIPAA, SOC2, GDPR-EU, and FedRAMP postures: retention rules, PII handling, audit behavior, and erasure workflows aligned to each regime out of the box.",
      ],
      [
        "What does the audit log cover? (Enterprise)",
        "Every administrative action and trust decision, persisted and exportable, the artifact your auditor actually asks for.",
      ],
      [
        "What is SSO/SAML/OIDC support? (Enterprise)",
        "Your identity provider controls who can touch the control plane. Offboarding an employee from Okta offboards them from Crowkis.",
      ],
      [
        "What are the Auto-Tuner, Privacy Vault, and Live Edit? (Enterprise)",
        "Auto-Tuner continuously optimizes thresholds and eviction weights against your live traffic. Privacy Vault isolates sensitive entries with stricter handling. Live Edit lets operators correct or redact a cached answer in place, with the change audited.",
      ],
      [
        "What support comes with each tier?",
        "Community: community channels. Enterprise: priority support with a fast human response, and we'll get on a call.",
      ],
    ],
  },
  {
    id: "deploy",
    title: "Deployment & operations",
    intro: "Running it for real.",
    items: [
      [
        "What's the fastest way to run Crowkis?",
        "docker pull crowkis/crowkis:latest, then docker run with a volume on /data. RESP on 6379, dashboard on 6380, gRPC on 6381. First cache hit visible in the dashboard within five minutes.",
      ],
      [
        "Does it need a config file to start?",
        "No. The binary boots with sensible defaults and zero required environment variables. Configuration is enrichment, not a prerequisite.",
      ],
      [
        "How do upgrades work?",
        "Binary swap: docker pull the new tag and restart. The on-disk format is stable, no schema migrations, no export/import dance.",
      ],
      [
        "What are the hardware requirements?",
        "Modest: it's a single Rust binary. The defaults assume 512 MB of memory; give it more and the block cache will use it. Vertical scaling is free within a cluster license.",
      ],
      [
        "Is the Docker image hardened?",
        "Yes, by default: non-root user, read-only filesystem, all Linux capabilities dropped, no-new-privileges, pids limit, localhost-only published ports, health checks, and log rotation, in the stock compose file.",
      ],
      [
        "What's actually inside the image?",
        "The stripped crowkis binary, a non-root user, and a /data directory. No source, no package manager, no shell tooling to live off.",
      ],
      [
        "Does it survive restarts?",
        "Yes, durability is WAL-based with CRC-checked records, and the vector index persists with the store. Restart recovery is part of the 347-test suite.",
      ],
      [
        "Can I run it in Kubernetes?",
        "Yes, it's a single container with a /health endpoint, so a Deployment with a PVC works today, and a Helm chart ships with the Kubernetes packaging milestone.",
      ],
      [
        "How do I watch what it's doing?",
        "Three ways: the built-in dashboard (live verdict feed), Prometheus /metrics for your existing Grafana, and structured JSON logs, one line per significant event, no log spam.",
      ],
    ],
  },
  {
    id: "pricing",
    title: "Editions & licensing",
    intro: "Flat, per cluster, no meter.",
    items: [
      [
        "What does Crowkis cost?",
        "Community is free forever, full engine, no license, no sign-up. Enterprise is flat per cluster per year, priced in one conversation: email contact@crowkis.com and we'll get on a call. No usage metering, no per-seat math.",
      ],
      [
        "What counts as a cluster?",
        "One running Crowkis deployment, regardless of how big the machine is. You buy another license when you run another cluster, not when you add cores.",
      ],
      [
        "Is Community a trial?",
        "No. It's the full engine, all seven differentiators, capped at 3 tenants and 100K entries. Solo developers and small teams can run it in production for free, indefinitely.",
      ],
      [
        "How is the license enforced?",
        "A signed JSON file mounted at /etc/crowkis/license.json, verified offline with Ed25519 at boot and every six hours. Invalid signature refuses to start; no file means Community; expiry has a 14-day grace period before degrading to Community.",
      ],
      [
        "Do you do usage-based billing?",
        "No, deliberately. Caches exist to make costs predictable; a cache with a meter on it would be self-defeating.",
      ],
      [
        "How do I buy or see a demo?",
        "Email contact@crowkis.com. For Enterprise we'll run Crowkis Replay on a sample of your own traffic during the call, so you see your real savings before spending anything.",
      ],
    ],
  },
  {
    id: "security",
    title: "Security & privacy",
    intro: "The questions your security team will ask.",
    items: [
      [
        "Why does closed-source make it safer here?",
        "The deliverable is one signed Rust binary, there is no dependency tree inside the runtime image for an attacker to poison. The 2026 supply-chain compromise of a major Python LLM gateway is exactly the attack class this architecture removes by construction.",
      ],
      [
        "How is multi-tenant data kept separate?",
        "Every entry is namespaced by tenant and lookups never cross the boundary. Tenant isolation is also a scored stage in the write-trust pipeline, so cross-tenant anomalies block the write itself.",
      ],
      [
        "How does Crowkis handle PII?",
        "A PII index supports scrubbing and erasure workflows with reports through the management API. Prompt previews stay out of logs by default, privacy is the default setting, not an option you enable.",
      ],
      [
        "What auth protects each surface?",
        "RESP and gRPC take a bearer token compared in constant time; the management API takes an admin key, RBAC API keys, or sessions with role-gated endpoints. Bind beyond localhost and management auth becomes mandatory automatically, misconfiguration fails closed.",
      ],
      [
        "Can a malicious user poison the cache through normal use?",
        "Every write, human, SDK, or agent, passes the same five-stage pipeline, and the source trust ledger means writers with a bad history face a higher bar. A blocked write is logged with the stage that vetoed it.",
      ],
      [
        "Can it run air-gapped?",
        "Fully. No phone-home, offline license verification, local dashboard. Air-gapped deployments are a first-class case, not a degraded one.",
      ],
    ],
  },
];

export default function FaqPage() {
  const total = GROUPS.reduce((n, g) => n + g.items.length, 0);

  return (
    <SiteShell>
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section py-12 md:py-16">
          <Reveal>
            <p className="eyebrow">{total} straight answers</p>
            <h1 className="responsive-title mt-3">Frequently asked questions</h1>
            <p className="responsive-subtitle mt-4 max-w-2xl">
              Everything Crowkis solves, everything it can do, everything it deliberately
              won&apos;t, in language for both the person paying the LLM bill and the person
              deploying the binary.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {GROUPS.map((group) => (
                <a
                  key={group.id}
                  href={`#${group.id}`}
                  className="rounded-lg border border-ink-line bg-paper-card px-3 py-1.5 font-mono text-xs text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  {group.title}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section max-w-4xl py-10 md:py-14">
        {GROUPS.map((group) => (
          <div key={group.id} id={group.id} className="mb-14 scroll-mt-28">
            <Reveal>
              <div className="flex items-baseline gap-3 border-b-2 border-ink pb-3">
                <h2 className="font-display text-2xl font-bold">{group.title}</h2>
                <span className="font-mono text-xs text-ink-faint">{group.items.length} Q</span>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{group.intro}</p>
            </Reveal>
            <div className="mt-5 space-y-3">
              {group.items.map(([q, a]) => (
                <details key={q} className="card-quiet group p-0 transition-colors hover:border-ink">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-[15px] font-bold sm:text-base [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="shrink-0 font-mono text-crow transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="border-t border-ink-line px-5 py-4 text-sm leading-relaxed text-ink-soft">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ))}
        <Reveal>
          <div className="card-block flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-display text-lg font-bold">Question not here?</p>
              <p className="mt-1 text-sm text-ink-soft">
                Email us, questions asked twice become documentation.
              </p>
            </div>
            <a
              href="mailto:contact@crowkis.com?subject=Crowkis%20question"
              className="btn-primary shrink-0"
            >
              Ask us directly
            </a>
          </div>
        </Reveal>
      </section>
    </SiteShell>
  );
}
