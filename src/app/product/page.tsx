import { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/ui/motion";
import { FeatureExplorer } from "@/components/marketing/feature-explorer";
import { Systems3D } from "@/components/marketing/systems-3d";
import { HeroArt } from "@/components/marketing/hero-art";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Everything inside Crowkis, in detail: the seven intelligence systems, the storage engine, four protocol surfaces, the operator control plane, and the Pro/Enterprise layer.",
};

const SYSTEMS: {
  n: string;
  name: string;
  plain: string;
  tech: string;
}[] = [
  {
    n: "01",
    name: "Semantic + structural matching",
    plain:
      "It knows 'how do refunds work?' and 'what's your refund window?' are the same question, but 'cancel' and 'pause' are not.",
    tech: "Every query gets an embedding in the HNSW vector index and a structural template, numbers, dates, and entities abstracted into slots. A hit requires both signals to agree, which kills the false-positive class that similarity-only caches are infamous for.",
  },
  {
    n: "02",
    name: "Anti-poisoning pipeline",
    plain:
      "One bad answer in a smart cache spreads to everyone who asks anything similar. Crowkis checks every answer's trustworthiness before storing it.",
    tech: "Five weighted stages, coherence 0.30, content 0.10, source trust 0.30, tenant isolation 0.15, neighbourhood agreement 0.15, with a 0.75 composite floor. Every accept and refuse lands in an append-only trust ledger, so writers with bad history face a higher bar.",
  },
  {
    n: "03",
    name: "Adaptive thresholds",
    plain:
      "The cache learns where it can afford to be generous and where it must be strict, by watching its own results.",
    tech: "Per-intent reuse thresholds adjust from live hit/miss feedback within bounded ranges, with complexity adjustment and EMA decay. Twelve intent classes, each with its own bar; any threshold can be pinned via the management API.",
  },
  {
    n: "04",
    name: "Reasoning reuse",
    plain:
      "Beyond reusing answers, Crowkis reuses the way an answer was worked out, the expensive part of an LLM call.",
    tech: "Chain-of-thought output is parsed into typed steps, specifics are abstracted into slots, and the step-sequence signature is stored. New inputs that match the signature get the recomposed skeleton, savings response-level caching can't reach.",
  },
  {
    n: "05",
    name: "Smart eviction",
    plain:
      "When space runs low, it doesn't throw out the most valuable answers, it knows what each one cost to make.",
    tech: "Eviction scores recency, frequency, isolation, and compute cost at 0.25 each. A $0.40 chain-of-thought answer and a $0.0004 one-liner are not equally disposable, and the evictor knows it.",
  },
  {
    n: "06",
    name: "Confidence scoring",
    plain:
      "Every served answer clears a quality bar first. Uncertain matches go to the model instead of guessing.",
    tech: "A geometric mean of five signals, similarity, freshness, trust, hit history, intent threshold, gates every response. Factual content needs 0.88; creative gets 0.70. The geometric mean means one weak signal tanks the score, by design.",
  },
  {
    n: "07",
    name: "Freshness control",
    plain: "Yesterday's truth doesn't outlive its shelf life. Prices change; the cache keeps up.",
    tech: "Five TTL policies plus version pinning and invalidation webhooks. Freshness also feeds confidence, an aging entry decays toward recompute before it ever serves something stale.",
  },
];

const SURFACES: [string, string, string][] = [
  ["RESP3", "Redis wire protocol", "redis-py, ioredis, Lettuce connect unmodified. crowkis cli ships in the binary."],
  ["gRPC", "h2c, protobuf", "Get / Set / GetStream / Stats / Invalidate for service meshes that prefer contracts."],
  ["REST", "management API", "Thresholds, tenants, budgets, PII reports, compliance exports, canary control."],
  ["MCP", "for AI apps", "Claude Code and agent frameworks check the cache before spending tokens."],
];

const CONTROL_PLANE: [string, string][] = [
  ["Live verdict feed", "Every hit, miss, and block streamed with its confidence score and the stage that decided it."],
  ["Cost accounting", "Dollars and tokens saved, per tenant and per model, the number your CFO actually asks for."],
  ["Canary & migration", "Upgrade models without torching the warm cache: canary a slice, compare, migrate with leasing."],
  ["Budgets & circuit breakers", "Per-tenant spending walls enforced locally, before the invoice surprises you."],
  ["PII & compliance", "Scrubbing, erasure workflows, and compliance report exports through the management API."],
  ["Prometheus & OTel", "Lights up in Grafana or Datadog with zero adapters."],
];

export default function ProductPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-8 py-14 md:grid-cols-[1.5fr_1fr] md:py-18">
          <Reveal>
            <p className="eyebrow">The product, in detail</p>
            <h1 className="responsive-title mt-3 max-w-3xl">
              Seven systems, four protocols, one binary.
            </h1>
            <p className="responsive-subtitle mt-4 max-w-2xl">
              This page is the long answer to &quot;what exactly do I get?&quot;, each system
              explained twice: once in plain words for whoever pays the bill, once in specifics for
              whoever deploys the binary.
            </p>
          </Reveal>
          <div className="hidden md:block">
            <HeroArt variant={1} />
          </div>
        </div>
      </section>

      {/* the seven systems */}
      <section className="section py-14 md:py-18">
        <Reveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            The seven intelligence systems
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            All seven ship in every edition, including free Community. No other cache ships them
            together.
          </p>
        </Reveal>
        <Systems3D systems={SYSTEMS} />
      </section>

      {/* engine band */}
      <section className="border-y-2 border-ink bg-roost py-14 text-stone-200 md:py-18">
        <div className="section grid items-center gap-10 md:grid-cols-2">
          <Reveal>
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
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["< 1ms", "cache hits, in-process"],
                ["347", "integration tests on the suite"],
                ["WAL", "crash-safe, CRC-checked records"],
                ["0 GC", "Rust, no collector pauses"],
              ].map(([big, small]) => (
                <div key={big} className="rounded-xl border border-roost-line bg-roost-card p-5">
                  <p className="font-display text-2xl font-bold text-stone-50">{big}</p>
                  <p className="mt-1 text-xs text-stone-500">{small}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* surfaces */}
      <section className="section py-14 md:py-18">
        <Reveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Four ways in, one cache</h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SURFACES.map(([proto, sub, desc], i) => (
            <Reveal key={proto} delay={i * 0.05} className="h-full">
              <div className="card-quiet h-full p-5 transition-colors hover:border-ink">
                <p className="font-display text-xl font-bold">
                  {proto} <span className="ml-1 text-xs font-medium text-crow">{sub}</span>
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* control plane */}
      <section className="section pb-14 md:pb-18">
        <Reveal>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">The operator control plane</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Every decision leaves evidence. The dashboard and management API expose all of it.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTROL_PLANE.map(([title, desc], i) => (
            <Reveal key={title} delay={(i % 3) * 0.05} className="h-full">
              <div className="card-quiet h-full p-5">
                <p className="font-display font-bold">{title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* full feature field guide */}
      <section className="border-t-2 border-ink bg-paper-deep py-14 md:py-18">
        <div className="section">
          <FeatureExplorer />
        </div>
      </section>
    </SiteShell>
  );
}
