import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Mermaid, Venn } from "@/components/ui/mermaid";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { CountUp } from "@/components/ui/count-up";

export const metadata: Metadata = {
  title: "The Problem",
  description:
    "The problems Crowkis solves: repeated LLM spend, caches that miss paraphrases, caches that over-serve, poisoned entries, and model upgrades that torch warm cache value.",
};

function Figure({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="card-block overflow-hidden !p-0">
      <figcaption className="border-b-2 border-ink bg-paper-deep px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
        {title}
      </figcaption>
      {children}
      {caption ? (
        <p className="border-t border-ink-line px-4 py-2.5 text-xs italic text-ink-faint">
          {caption}
        </p>
      ) : null}
    </figure>
  );
}

const PROBLEMS = [
  {
    n: "01",
    title: "You're billed for reruns",
    plain:
      "The same questions arrive all day in different words, and every variation is a fresh, full-price model call.",
    solve: "Semantic + structural matching turns paraphrases into sub-millisecond cache hits.",
  },
  {
    n: "02",
    title: "Exact caches miss everything",
    plain:
      "Redis-style caches compare bytes. Change one word and it's a 'new' question — so LLM hit rates round to zero.",
    solve: "Crowkis compares meaning and structure, so rephrasing doesn't reset the bill.",
  },
  {
    n: "03",
    title: "Similarity caches can't be trusted",
    plain:
      "Vector-only caches serve 'cancel my subscription' for 'pause my subscription'. Close in math, catastrophic in production.",
    solve: "Intent classes, template checks, and a confidence floor veto unsafe matches.",
  },
  {
    n: "04",
    title: "One bad entry poisons the neighbourhood",
    plain:
      "A hallucination or injected answer in a semantic cache gets served to every nearby query — poison radiates.",
    solve: "A five-stage trust pipeline scores every write before it can ever be served.",
  },
  {
    n: "05",
    title: "Model upgrades torch your cache",
    plain:
      "Switch models and a normal cache cold-starts: all the value you accumulated is gone overnight.",
    solve: "Canary + migration workflows carry warm cache value across model versions.",
  },
];

export default function WhyPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section py-16 text-center md:py-20">
          <p className="eyebrow">The problem</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
            Your LLM bill is mostly
            <br />
            <span className="text-crow">déjà vu</span>.
          </h1>
          <p className="responsive-subtitle mx-auto mt-5 max-w-2xl">
            Support bots, copilots, RAG apps, and agents answer the same questions all day — just
            phrased differently. This page is the anatomy of that waste, and what Crowkis does
            about each piece of it.
          </p>
        </div>
      </section>

      {/* the repeat math */}
      <section className="section py-14 md:py-18">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Same question. Different words. Full price, every time.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              A production assistant doesn&apos;t get a thousand unique questions — it gets a few
              hundred questions a thousand ways. Without a cache that understands meaning, each
              variation is a separate, billable, seconds-long model round-trip.
            </p>
            <div className="card-quiet mt-6 grid grid-cols-3 divide-x divide-ink-line p-4 text-center">
              <div>
                <p className="font-display text-3xl font-bold">
                  <CountUp to={30} suffix="–70%" />
                </p>
                <p className="mt-1 font-mono text-[10px] text-ink-faint">of spend is repeats*</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold">
                  <CountUp to={2} suffix="s+" />
                </p>
                <p className="mt-1 font-mono text-[10px] text-ink-faint">per model round-trip</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold">&lt;1ms</p>
                <p className="mt-1 font-mono text-[10px] text-ink-faint">per Crowkis hit</p>
              </div>
            </div>
            <p className="mt-3 font-mono text-[10px] text-ink-faint">
              *typical range for support, docs, and copilot workloads — measure yours with Crowkis
              Replay.
            </p>
          </div>
          <Figure
            title="what actually happens to repeated traffic"
            caption="Without semantic caching, the second and third ask are pure waste."
          >
            <Mermaid
              chart={`flowchart TD
  Q1["'how do refunds work?'"] --> LLM1["model call · $$ · 2s"]
  Q2["'what's the refund window?'"] --> LLM2["model call · $$ · 2s"]
  Q3["'refund timeline?'"] --> LLM3["model call · $$ · 2s"]
  LLM1 --> A1["the same answer"]
  LLM2 --> A1
  LLM3 --> A1
  style A1 fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`}
            />
          </Figure>
        </div>
      </section>

      {/* two failed fixes */}
      <section className="border-y-2 border-ink bg-paper-deep py-14 md:py-18">
        <div className="section">
          <h2 className="font-display text-3xl font-bold tracking-tight">
            The two obvious fixes both fail.
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            One misses everything; the other serves things it shouldn&apos;t. The whole reason
            Crowkis exists is the gap in the middle.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Figure
              title="fix #1 — exact-match caching (redis-style)"
              caption="Byte-for-byte matching means paraphrases never hit. Hit rate ≈ 0 on LLM traffic."
            >
              <Mermaid
                chart={`flowchart LR
  A["'how do refunds work?'"] -->|cached| HIT["HIT ✓"]
  B["'how do refunds work'"] -->|missing '?'| MISS1["MISS → pay"]
  C["'what's the refund window?'"] -->|different bytes| MISS2["MISS → pay"]
  style HIT fill:#fbe9e8,stroke:#d62221,stroke-width:2px
  style MISS1 fill:#f3eee5
  style MISS2 fill:#f3eee5`}
              />
            </Figure>
            <Figure
              title="fix #2 — similarity-only caching (vector-style)"
              caption="Everything near in embedding space gets served — including the things that must not be."
            >
              <Mermaid
                chart={`flowchart LR
  D["'cancel my subscription'"] -->|0.91 similar| W["serves the cached<br/>'pause' answer ✗"]
  E["'pause my subscription'"] -->|cached| W2["HIT — correct"]
  style W fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style W2 fill:#f3eee5`}
              />
            </Figure>
          </div>
          <div className="mt-8">
            <Figure
              title="the gap crowkis occupies"
              caption="Reuse aggressively where meaning and structure agree. Refuse where they don't."
            >
              <Venn
                left="exact-match"
                right="similarity-only"
                overlap={"crowkis:\nmeaning + structure\n+ confidence + trust"}
                leftItems={["never wrong", "never hits"]}
                rightItems={["always hits", "sometimes lies"]}
              />
            </Figure>
          </div>
        </div>
      </section>

      {/* problem cards with solutions */}
      <section className="section py-14 md:py-18">
        <h2 className="font-display text-3xl font-bold tracking-tight">
          Five problems. One binary.
        </h2>
        <div className="mt-8 space-y-4">
          {PROBLEMS.map((p) => (
            <Tilt3D key={p.n} max={3}>
              <article className="card-block grid gap-4 p-6 md:grid-cols-[52px_1.2fr_1fr] md:items-center">
                <p className="font-display text-2xl font-bold text-crow">{p.n}</p>
                <div>
                  <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.plain}</p>
                </div>
                <p className="rounded-lg border border-ink-line bg-paper-deep p-4 text-sm leading-relaxed text-ink-soft md:justify-self-stretch">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-crow">
                    how crowkis solves it ·{" "}
                  </span>
                  {p.solve}
                </p>
              </article>
            </Tilt3D>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section pb-16 md:pb-24">
        <div className="card-block flex flex-col items-center gap-5 p-10 text-center">
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight">
            Stop reading about the waste. Measure yours.
          </h2>
          <p className="max-w-lg text-sm text-ink-soft">
            Pull the free image and watch the dashboard count what you save — or book a call and
            we&apos;ll replay your own traffic through the cache live.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/docker" className="btn-primary">
              Run it free
            </Link>
            <a
              href="mailto:license@crowkis.io?subject=Crowkis%20demo%20request"
              className="btn-secondary"
            >
              Book the replay call
            </a>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
