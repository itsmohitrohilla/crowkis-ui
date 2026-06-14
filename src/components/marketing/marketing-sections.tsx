import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import { HeroScene } from "@/components/marketing/hero-scene";
import { CodeTabs, CommandCard } from "@/components/ui/code-tabs";
import { CountUp } from "@/components/ui/count-up";
import { Logo3D } from "@/components/crow/logo-3d";
import { TiltCard } from "@/components/ui/tilt-card";
import { IntegrationHub } from "@/components/marketing/integration-hub";

/* ---------------------------------- hero --------------------------------- */

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-paper paper-grid">
      <div className="section grid items-center gap-8 py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-4 lg:py-20">
        <div className="relative z-10">
          <p className="eyebrow">The cache with a brain · built in Rust</p>
          <h1 className="mt-6 font-display font-bold leading-none tracking-tight">
            <span className="block text-[3rem] sm:text-[4rem] md:text-[4.6rem]">STOP</span>
            <span className="relative -ml-1 mt-1 inline-block -rotate-2 border-2 border-ink bg-crow px-3 py-0.5 text-[3rem] text-stone-50 shadow-block sm:text-[4rem] md:text-[4.6rem]">
              PAYING TWICE
            </span>
            <span className="mt-2 block text-[3rem] sm:text-[4rem] md:text-[4.6rem]">
              FOR THE SAME
              <br />
              ANSWER<span className="text-crow">.</span>
            </span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-ink-soft">
            Crowkis understands what your LLM is being asked — and serves the answer it already
            has, only when it&apos;s safe to. Your bill drops. Your users stop waiting.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/docker" className="btn-primary !px-7 !py-3 !text-base">
              Run it free
            </Link>
            <Link href="/why" className="btn-secondary !px-7 !py-3 !text-base">
              See the problem
            </Link>
          </div>
          <p className="mt-6 font-mono text-xs text-ink-faint">
            docker pull crowkis/crowkis:latest · works with your Redis client
          </p>
        </div>
        <HeroScene />
      </div>
    </section>
  );
}

/* ------------------------------ USP trio ------------------------------ */

const USPS = [
  {
    title: "It matches meaning",
    body: "“How do refunds work?” and “What's your refund window?” become one answer, not two bills.",
    mark: "01",
  },
  {
    title: "It refuses unsafe reuse",
    body: "Five checks gate every hit — wrong, stale, or poisoned answers never leave the cache.",
    mark: "02",
  },
  {
    title: "It drops into your stack",
    body: "Speaks Redis, gRPC, REST, and MCP. One Docker image, one port change, zero rewrites.",
    mark: "03",
  },
];

export function UspTrio() {
  return (
    <section className="section py-16 md:py-24">
      <div className="grid gap-5 md:grid-cols-3">
        {USPS.map((usp) => (
          <TiltCard key={usp.mark} className="h-full p-7">
            <p className="font-mono text-sm font-bold text-crow">{usp.mark}</p>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight">{usp.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{usp.body}</p>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------- problem teaser ---------------------------- */

export function ProblemTeaser() {
  return (
    <section className="border-y-2 border-ink bg-roost py-16 text-stone-200 md:py-20">
      <div className="section grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="eyebrow">The problem, in one line</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-stone-50 sm:text-4xl md:text-5xl">
            Most of your LLM bill
            <br />
            is <span className="text-crow">reruns</span>.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-stone-400">
            The same questions, rephrased all day, billed at full price every time. The obvious
            fixes fail — exact-match caches miss the rephrasing, similarity caches serve answers
            they shouldn&apos;t. We built the cache that does neither.
          </p>
          <div className="mt-7">
            <Link
              href="/why"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-stone-50 bg-crow px-6 py-3 font-semibold text-stone-50 shadow-block-sm transition-transform hover:-translate-y-0.5"
            >
              The full story, with diagrams →
            </Link>
          </div>
        </div>
        <div className="grid gap-3">
          {[
            ["“how do refunds work?”", "→ paid compute", "tok-key"],
            ["“what's the refund window?”", "→ paid again", "tok-key"],
            ["“refund timeline?”", "→ paid again", "tok-key"],
            ["with crowkis", "→ one bill, three hits", "tok-ok"],
          ].map(([q, verdict, tone], i) => (
            <div
              key={q}
              className={`flex items-center justify-between gap-3 rounded-xl border px-5 py-3.5 font-mono text-[13px] ${
                i === 3 ? "border-crow bg-roost-card" : "border-roost-line bg-roost-card/60"
              }`}
            >
              <span className="text-stone-300">{q}</span>
              <span className={tone}>{verdict}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- integration hub --------------------------- */

export function ConnectHub() {
  return (
    <section className="border-y-2 border-ink bg-paper-deep py-16 md:py-24">
      <div className="section">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">One cache · every door in</p>
          <h2 className="responsive-title mt-4">Whatever you already use, it already speaks.</h2>
          <p className="responsive-subtitle mt-4">
            Python, Node, the Redis CLI, gRPC, REST, and MCP all plug into the same engine. Point a
            client at one port and you have a semantic cache — no rewrite, no new mental model.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-4xl">
          <IntegrationHub />
        </div>
      </div>
    </section>
  );
}

/* ------------------------- real-world use cases ------------------------- */

const USE_CASES = [
  {
    title: "Customer support bots",
    who: "SaaS · e-commerce · fintech support desks",
    body: "Refunds, resets, shipping windows — the same fifty intents in thousands of phrasings. The repeats become instant, free answers; only new questions reach the model.",
    stat: "the highest hit rates of any workload",
    href: "/roost/support-bots-cache-goldmine",
  },
  {
    title: "Internal copilots",
    who: "HR, IT, and engineering assistants",
    body: "Your whole company asks the same policy and how-to questions. One shared memory across Slack bots, portals, and IDE plugins — the first answer serves everyone.",
    stat: "one answer, four hundred askers",
    href: "/roost/internal-copilots-shared-memory",
  },
  {
    title: "RAG applications",
    who: "docs assistants · knowledge products",
    body: "Retrieval is cheap; the synthesis step is the bill. Crowkis caches the finished answer, version-pinned to your docs, so popular questions skip the whole pipeline.",
    stat: "cache the synthesis, not just the chunks",
    href: "/roost/rag-apps-cache-the-synthesis",
  },
  {
    title: "Agent fleets",
    who: "automation · multi-agent platforms",
    body: "Agents re-ask, re-plan, and re-fetch relentlessly. Semantic hits, reasoning reuse, and tool-call caching deflate the 10–50× call multiplier that breaks agent economics.",
    stat: "five agents, one model call",
    href: "/roost/agent-fleets-token-furnaces",
  },
  {
    title: "AI coding assistants",
    who: "engineering teams on Claude Code & friends",
    body: "Ten developers, one codebase, the same questions. Behind MCP, the team shares a local memory — doc lookups and code explanations stop billing per person.",
    stat: "one config block via MCP",
    href: "/roost/coding-assistants-mcp",
  },
  {
    title: "High-traffic chat & voice",
    who: "consumer apps · voice assistants",
    body: "At scale, traffic converges on shared intents while every millisecond counts. Sub-millisecond streamed hits keep the experience instant and the unit economics sane.",
    stat: "<1ms hits inside a 1s voice budget",
    href: "/roost/voice-assistants-latency",
  },
];

export function UseCasesSection() {
  return (
    <section className="border-t-2 border-ink bg-paper-deep py-16 md:py-24">
      <div className="section">
        <p className="eyebrow">Where it earns, in the real world</p>
        <h2 className="responsive-title mt-4 max-w-2xl">
          If your app answers questions, Crowkis pays for itself.
        </h2>
        <p className="responsive-subtitle mt-4 max-w-2xl">
          Six production workloads where teams deploy Crowkis today — each one a repetition engine
          wearing a product&apos;s clothes.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((uc) => (
            <Link key={uc.title} href={uc.href} className="group block h-full">
              <article className="card-block flex h-full flex-col p-6 transition-transform group-hover:-translate-y-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  {uc.who}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug">{uc.title}</h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{uc.body}</p>
                <p className="mt-4 border-t border-ink-line pt-3 font-mono text-xs font-semibold text-crow">
                  → {uc.stat}
                </p>
              </article>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-ink-faint">
          Don&apos;t see yours? The Roost covers twenty more —{" "}
          <Link href="/roost" className="font-semibold text-crow underline underline-offset-2">
            browse by use case →
          </Link>
        </p>
      </div>
    </section>
  );
}

/* --------------------------- docker + mcp strip --------------------------- */

export function DockerMcpStrip() {
  return (
    <section className="section grid gap-5 pb-16 md:grid-cols-2 md:pb-24">
      <TiltCard className="flex h-full flex-col p-7">
        <p className="eyebrow">Official Docker image</p>
        <h2 className="mt-3 font-display text-2xl font-bold">Free. Hardened. One pull away.</h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
          Community edition runs at full power with no license, no sign-up, no phone-home.
          Non-root, read-only, every capability dropped — before you ask.
        </p>
        <div className="mt-5">
          <CommandCard command="docker pull crowkis/crowkis:latest" note="then one docker run — full guide on the Docker page" />
        </div>
        <Link href="/docker" className="btn-secondary mt-5 self-start">
          The Docker guide
        </Link>
      </TiltCard>
      <TiltCard className="flex h-full flex-col p-7">
        <p className="eyebrow">Crowkis MCP · for AI apps</p>
        <h2 className="mt-3 font-display text-2xl font-bold">
          Claude Code asks. The cache answers.
        </h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
          The binary ships an MCP server, so AI assistants and agents check the cache before
          burning tokens — repeated lookups become free, locally.
        </p>
        <div className="mt-5">
          <CommandCard command="claude mcp add crowkis -- crowkis mcp" note="two minutes in any MCP-capable app" />
        </div>
        <Link href="/docs/mcp" className="btn-secondary mt-5 self-start">
          Set up MCP
        </Link>
      </TiltCard>
    </section>
  );
}

/* ------------------- fact strip — Redis-style live counters ------------------- */

const FACTS: { to: number; prefix?: string; suffix?: string; label: string }[] = [
  { to: 33000, prefix: "~", label: "lines of Rust, no GC pauses" },
  { to: 347, label: "integration tests in the suite" },
  { to: 12, label: "intent classes scored per query" },
  { to: 5, label: "anti-poisoning stages per write" },
  { to: 3, label: "protocols — RESP3 · gRPC · REST" },
  { to: 1, label: "image, every feature compiled in" },
];

export function FactStrip() {
  return (
    <section className="border-b-2 border-ink bg-roost text-stone-50">
      <div className="section grid grid-cols-2 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-6 md:py-12">
        {FACTS.map((fact) => (
          <div key={fact.label} className="px-2 text-center">
            <p className="font-display text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl">
              <CountUp to={fact.to} prefix={fact.prefix} suffix={fact.suffix} />
            </p>
            <p className="mx-auto mt-2 max-w-[160px] font-mono text-[11px] leading-relaxed text-stone-500">
              {fact.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------- problem -------------------------------- */

const TRAPS = [
  {
    title: "Exact-match caches miss",
    body: "“How do refunds work?” and “What's your refund window?” are the same question. A key-value cache sees two different strings, calls the model twice, and bills you twice.",
    tag: "the string problem",
  },
  {
    title: "Naive vector caches lie",
    body: "“Cancel my subscription” and “pause my subscription” embed close together. A similarity-only cache happily serves one as the other. Similar is not the same as safe.",
    tag: "the embedding problem",
  },
  {
    title: "Poisoned entries spread",
    body: "One bad write — a prompt injection, a hallucination, a cross-tenant leak — gets served back to every user who asks anything nearby. Most caches have no immune system.",
    tag: "the trust problem",
  },
];

export function WhySection() {
  return (
    <section className="section py-16 md:py-24">
      <Reveal>
        <p className="eyebrow">Why this exists</p>
        <h2 className="responsive-title mt-4 max-w-2xl">
          Caching LLM traffic is a trap from both sides.
        </h2>
        <p className="responsive-subtitle mt-4 max-w-2xl">
          Teams burn a large share of model spend recomputing answers they already paid for. The
          two obvious fixes both fail — one misses too much, the other reuses too much.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {TRAPS.map((trap, i) => (
          <Reveal key={trap.title} delay={i * 0.08} className="h-full">
            <article className="card-block h-full p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-crow">
                {trap.tag}
              </p>
              <h3 className="mt-3 font-display text-xl font-bold">{trap.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{trap.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.2}>
        <p className="mx-auto mt-10 max-w-2xl text-center text-base text-ink-soft">
          Crowkis sits in the middle: it reuses aggressively when meaning and structure agree, and
          refuses when they don&apos;t. Saying <span className="font-semibold text-ink">no</span> is
          the feature.
        </p>
      </Reveal>
    </section>
  );
}

/* -------------------------------- pipeline -------------------------------- */

const PIPELINE = [
  {
    step: "01",
    title: "Classify intent",
    body: "Every query is sorted into one of 12 intent classes. Factual questions tolerate reuse; creative or personal ones get stricter treatment.",
  },
  {
    step: "02",
    title: "Abstract structure",
    body: "Numbers, dates, and entities are lifted into slots, so “invoice #4412” and “invoice #9981” share one cached template.",
  },
  {
    step: "03",
    title: "Match meaning",
    body: "An HNSW vector index finds semantic neighbours, cross-checked against the structural template — two signals, not one.",
  },
  {
    step: "04",
    title: "Score confidence",
    body: "Five signals — similarity, freshness, trust, hit history, intent threshold — combine into one score. Below threshold, no reuse.",
  },
  {
    step: "05",
    title: "Check for poison",
    body: "A 5-stage pipeline scores coherence, content, source trust, tenant isolation, and neighbourhood consistency before a write is trusted.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-y-2 border-ink bg-roost py-16 text-stone-200 md:py-24">
      <div className="section">
        <Reveal>
          <p className="eyebrow">What happens to one query</p>
          <h2 className="responsive-title mt-4 max-w-2xl !text-stone-50">
            Five checks between a question and a cached answer.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-400 sm:text-lg">
            Each stage can veto. A hit is only served when meaning, structure, confidence, and
            trust all agree — anything else goes to the model.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-xl border border-roost-line bg-roost-line md:grid-cols-5">
          {PIPELINE.map((stage, i) => (
            <Reveal key={stage.step} delay={i * 0.06} className="h-full">
              <div className="flex h-full flex-col bg-roost-card p-5">
                <p className="font-mono text-xs text-crow">{stage.step}</p>
                <h3 className="mt-3 font-display text-base font-bold text-stone-100">
                  {stage.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-400">{stage.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-stone-500">
            <span>your app</span>
            <span className="text-crow">→</span>
            <span className="text-stone-300">crowkis</span>
            <span className="text-crow">→</span>
            <span>llm provider · only when the cache says no</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ eight systems ----------------------------- */

const SYSTEMS = [
  {
    name: "Semantic + structural matching",
    body: "Vector similarity and template structure must both agree before a hit counts. Either alone is how caches embarrass you.",
  },
  {
    name: "Anti-poisoning pipeline",
    body: "Five weighted stages with an append-only trust ledger. Suspicious writes are quarantined before they can spread.",
  },
  {
    name: "Adaptive thresholds",
    body: "Reuse thresholds tune themselves per intent class from live hit/miss feedback — stricter where mistakes hurt, looser where they don't.",
  },
  {
    name: "Reasoning reuse",
    body: "Chain-of-thought structure is extracted, abstracted, and recomposed for new inputs — savings beyond response-level caching.",
  },
  {
    name: "Smart eviction",
    body: "Eviction weighs recency, frequency, isolation, and what the entry cost to compute. Expensive answers don't get evicted like cheap ones.",
  },
  {
    name: "Confidence scoring",
    body: "A geometric mean of five signals gates every response. Factual content needs 0.88 to serve; creative content gets more room.",
  },
  {
    name: "Freshness control",
    body: "Five TTL policies plus version pinning and invalidation webhooks, so yesterday's truth doesn't outlive its shelf life.",
  },
  {
    name: "Migration without cold starts",
    body: "Canary and migration workflows carry warm cache value across model upgrades instead of torching it.",
  },
];

export function FeaturesSection() {
  return (
    <section className="section py-16 md:py-24">
      <Reveal>
        <p className="eyebrow">The systems inside</p>
        <h2 className="responsive-title mt-4 max-w-2xl">
          Eight systems no other cache ships together.
        </h2>
        <p className="responsive-subtitle mt-4 max-w-2xl">
          All of it on a custom LSM storage engine — WAL, SSTables, bloom filters, compaction —
          written from scratch in Rust. No RocksDB underneath. No garbage collector in the path.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SYSTEMS.map((sys, i) => (
          <Reveal key={sys.name} delay={(i % 4) * 0.06} className="h-full">
            <article className="card-quiet h-full p-5 transition-colors hover:border-ink">
              <p className="font-mono text-xs text-ink-faint">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-display text-base font-bold leading-snug">{sys.name}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">{sys.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------ drop-in section --------------------------- */

const PY_SNIPPET = (
  <code>
    <span className="tok-key">from</span> <span className="tok-cmd">crowkis</span>{" "}
    <span className="tok-key">import</span> <span className="tok-cmd">CrowkisClient</span>
    {"\n\n"}
    <span className="tok-cmd">cache = </span>
    <span className="tok-fn">CrowkisClient</span>
    <span className="tok-cmd">(host=</span>
    <span className="tok-str">&quot;127.0.0.1&quot;</span>
    <span className="tok-cmd">, port=</span>
    <span className="tok-str">6383</span>
    <span className="tok-cmd">, tenant=</span>
    <span className="tok-str">&quot;demo&quot;</span>
    <span className="tok-cmd">, model=</span>
    <span className="tok-str">&quot;gpt-4o&quot;</span>
    <span className="tok-cmd">)</span>
    {"\n\n"}
    <span className="tok-dim"># one call: serve from cache, or compute and store</span>
    {"\n"}
    <span className="tok-cmd">answer = cache.</span>
    <span className="tok-fn">get_or_compute</span>
    <span className="tok-cmd">(</span>
    {"\n    "}
    <span className="tok-str">&quot;Explain vector caches&quot;</span>
    <span className="tok-cmd">,</span>
    {"\n    "}
    <span className="tok-key">lambda</span>
    <span className="tok-cmd"> query: </span>
    <span className="tok-fn">call_llm</span>
    <span className="tok-cmd">(query),</span>
    {"\n    "}
    <span className="tok-cmd">ttl=</span>
    <span className="tok-str">3600</span>
    <span className="tok-cmd">,</span>
    {"\n"}
    <span className="tok-cmd">)</span>
  </code>
);

const TS_SNIPPET = (
  <code>
    <span className="tok-key">import</span>
    <span className="tok-cmd"> {"{ CrowkisClient }"} </span>
    <span className="tok-key">from</span> <span className="tok-str">&quot;@crowkis/client&quot;</span>
    <span className="tok-cmd">;</span>
    {"\n\n"}
    <span className="tok-key">const</span>
    <span className="tok-cmd"> cache = </span>
    <span className="tok-key">new</span> <span className="tok-fn">CrowkisClient</span>
    <span className="tok-cmd">({"{"}</span>
    {"\n  "}
    <span className="tok-cmd">host: </span>
    <span className="tok-str">&quot;127.0.0.1&quot;</span>
    <span className="tok-cmd">, port: </span>
    <span className="tok-str">6383</span>
    <span className="tok-cmd">,</span>
    {"\n  "}
    <span className="tok-cmd">tenant: </span>
    <span className="tok-str">&quot;demo&quot;</span>
    <span className="tok-cmd">, model: </span>
    <span className="tok-str">&quot;gpt-4o&quot;</span>
    <span className="tok-cmd">,</span>
    {"\n"}
    <span className="tok-cmd">{"}"});</span>
    {"\n\n"}
    <span className="tok-key">const</span>
    <span className="tok-cmd"> answer = </span>
    <span className="tok-key">await</span>
    <span className="tok-cmd"> cache.</span>
    <span className="tok-fn">getOrCompute</span>
    <span className="tok-cmd">(</span>
    {"\n  "}
    <span className="tok-str">&quot;Explain vector caches&quot;</span>
    <span className="tok-cmd">,</span>
    {"\n  "}
    <span className="tok-key">async</span>
    <span className="tok-cmd"> (query) =&gt; </span>
    <span className="tok-fn">callLLM</span>
    <span className="tok-cmd">(query),</span>
    {"\n  "}
    <span className="tok-cmd">{"{ ttl: 3600 }"},</span>
    {"\n"}
    <span className="tok-cmd">);</span>
  </code>
);

const CLI_SNIPPET = (
  <code>
    <span className="tok-dim"># the built-in REPL — redis clients work too</span>
    {"\n"}
    <span className="tok-cmd">crowkis cli</span>
    {"\n\n"}
    <span className="tok-key">&gt; </span>
    <span className="tok-cmd">CSET</span>
    <span className="tok-str"> &quot;Explain vector caches&quot; &quot;…&quot; </span>
    <span className="tok-cmd">EX 86400 MODEL gpt-4o TENANT demo</span>
    {"\n"}
    <span className="tok-ok">OK</span>
    {"\n\n"}
    <span className="tok-key">&gt; </span>
    <span className="tok-cmd">CGET</span>
    <span className="tok-str"> &quot;what are vector caches?&quot; </span>
    <span className="tok-cmd">TENANT demo</span>
    {"\n"}
    <span className="tok-str">&quot;…cached answer, semantic hit…&quot;</span>
  </code>
);

const PY_COPY = `from crowkis import CrowkisClient

cache = CrowkisClient(host="127.0.0.1", port=6383, tenant="demo", model="gpt-4o")

answer = cache.get_or_compute(
    "Explain vector caches",
    lambda query: call_llm(query),
    ttl=3600,
)`;

const TS_COPY = `import { CrowkisClient } from "@crowkis/client";

const cache = new CrowkisClient({
  host: "127.0.0.1", port: 6383,
  tenant: "demo", model: "gpt-4o",
});

const answer = await cache.getOrCompute(
  "Explain vector caches",
  async (query) => callLLM(query),
  { ttl: 3600 },
);`;

const CLI_COPY = `crowkis cli
CSET "Explain vector caches" "…" EX 86400 MODEL gpt-4o TENANT demo
CGET "what are vector caches?" TENANT demo`;

export function DropInSection() {
  return (
    <section className="section grid items-center gap-10 py-16 md:grid-cols-[0.85fr_1.15fr] md:py-24">
      <Reveal>
        <p className="eyebrow">Adoption is one port change</p>
        <h2 className="responsive-title mt-4">
          It speaks Redis, so your code already speaks Crowkis.
        </h2>
        <p className="responsive-subtitle mt-4">
          Crowkis serves RESP3 — the Redis wire protocol — alongside gRPC and a REST management
          API. Point your existing client at port 6383 and you have a semantic cache. The Python
          and Node SDKs add <code className="inline">get_or_compute</code>, streaming, and
          multimodal helpers on top.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/docs/sdk-python" className="btn-secondary">
            Python SDK
          </Link>
          <Link href="/docs/sdk-node" className="btn-secondary">
            Node SDK
          </Link>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <CodeTabs
          tabs={[
            { label: "python", copyText: PY_COPY, content: PY_SNIPPET },
            { label: "typescript", copyText: TS_COPY, content: TS_SNIPPET },
            { label: "crowkis cli", copyText: CLI_COPY, content: CLI_SNIPPET },
          ]}
        />
      </Reveal>
    </section>
  );
}

/* ------------------------------ docker section ---------------------------- */

const HARDENING: [string, string][] = [
  ["read_only: true", "immutable root filesystem"],
  ["cap_drop: ALL", "zero Linux capabilities"],
  ["non-root user", "no privilege to escalate"],
  ["no-new-privileges", "and it stays that way"],
  ["healthcheck built in", "orchestrators see real state"],
  ["amd64 + arm64", "one tag, both architectures"],
];

export function DockerSection() {
  return (
    <section className="border-y-2 border-ink bg-paper-deep py-16 md:py-24">
      <div className="section grid items-center gap-10 md:grid-cols-2">
        <Reveal className="order-2 md:order-1">
          <CommandCard
            command="docker pull crowkis/crowkis:latest"
            note="free Community edition, full power, no license file needed — then docker run and you're live"
          />
          <div className="mt-5 grid grid-cols-2 gap-3">
            {HARDENING.map(([what, why]) => (
              <div key={what} className="card-quiet p-3.5">
                <p className="font-mono text-xs font-semibold text-ink">{what}</p>
                <p className="mt-1 text-xs text-ink-soft">{why}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="order-1 md:order-2">
          <p className="eyebrow">Official Docker image</p>
          <h2 className="responsive-title mt-4">Ships like infrastructure, because it is.</h2>
          <p className="responsive-subtitle mt-4">
            One Alpine-based, multi-stage image with every feature compiled in — your license file
            decides what unlocks. The default compose file is hardened the way you&apos;d harden it
            yourself, except it&apos;s already done.
          </p>
          <div className="mt-7">
            <Link href="/docker" className="btn-primary">
              The full Docker guide
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------ operator section --------------------------- */

const CONSOLE_ROWS = [
  ["12:04:33", "acme-corp", "DUAL HIT", "conf 0.94", "tok-ok"],
  ["12:04:31", "demo", "VECTOR HIT", "conf 0.89", "tok-ok"],
  ["12:04:29", "acme-corp", "MISS → gpt-4o", "computed", "tok-dim"],
  ["12:04:27", "internal", "BLOCKED", "poison stage 3", "tok-key"],
  ["12:04:24", "acme-corp", "REASONING HIT", "conf 0.91", "tok-ok"],
] as const;

export function TrustSection() {
  return (
    <section className="section grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
      <Reveal>
        <p className="eyebrow">The operator view</p>
        <h2 className="responsive-title mt-4">Every decision leaves evidence.</h2>
        <p className="responsive-subtitle mt-4">
          The built-in dashboard streams every verdict live: what was served, what was refused, and
          what it saved you. Hit-type breakdowns, per-tenant budgets, safety blocks, PII reports,
          and migration state — all auditable through the same REST API it runs on.
        </p>
        <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
          {[
            "Live hit/miss/block feed with confidence scores",
            "Cost saved per tenant and per model",
            "Canary and migration progress during model upgrades",
            "Compliance and PII-erasure reporting built in",
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span className="mt-0.5 font-mono text-crow">→</span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="code-panel">
          <div className="code-chrome">
            <span>crowkis dashboard — live verdict feed</span>
          </div>
          <div className="p-4 font-mono text-[12px] leading-[2] sm:p-5 sm:text-[13px]">
            {CONSOLE_ROWS.map(([time, tenant, verdict, detail, tone]) => (
              <div key={time} className="flex flex-wrap gap-x-4">
                <span className="tok-dim">{time}</span>
                <span className="w-24 text-stone-300">{tenant}</span>
                <span className={`w-36 ${tone}`}>{verdict}</span>
                <span className="tok-dim">{detail}</span>
              </div>
            ))}
            <div className="mt-3 border-t border-roost-line pt-3 text-stone-400">
              saved today <span className="tok-ok">$1,240.80</span> · hit rate{" "}
              <span className="tok-ok">67.9%</span> · blocked <span className="tok-key">12</span>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}


/* -------------------------------- MCP section ------------------------------ */

const MCP_SNIPPET = `{
  "mcpServers": {
    "crowkis": {
      "command": "crowkis",
      "args": ["mcp"]
    }
  }
}`;

export function McpSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="section grid items-center gap-10 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Crowkis MCP · for AI apps & agents</p>
          <h2 className="responsive-title mt-4">
            Your AI tools ask the same questions all day. Stop billing yourself for it.
          </h2>
          <p className="responsive-subtitle mt-4">
            The Crowkis binary ships an MCP server —{" "}
            <code className="inline">crowkis mcp</code> — so Claude Code, agent frameworks, and any
            MCP-capable app can check the cache before burning tokens, and bank every answer they
            compute.
          </p>
          <p className="mt-4 rounded-lg border border-ink-line bg-paper-card p-4 text-sm leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">In plain words:</span> AI assistants repeat
            themselves constantly — same lookups, same explanations, same boilerplate reasoning.
            Crowkis remembers those answers locally, so the expensive model is only called for
            genuinely new questions. Your token bill drops; nothing leaves your machine.
          </p>
          <div className="mt-7">
            <Link href="/docs/mcp" className="btn-primary">
              Set up MCP in two minutes
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <CodeTabs
            tabs={[
              {
                label: "claude code / mcp.json",
                copyText: MCP_SNIPPET,
                content: (
                  <code>
                    <span className="tok-cmd">{`{`}</span>
                    {"\n  "}
                    <span className="tok-str">&quot;mcpServers&quot;</span>
                    <span className="tok-cmd">: {`{`}</span>
                    {"\n    "}
                    <span className="tok-str">&quot;crowkis&quot;</span>
                    <span className="tok-cmd">: {`{`}</span>
                    {"\n      "}
                    <span className="tok-str">&quot;command&quot;</span>
                    <span className="tok-cmd">: </span>
                    <span className="tok-str">&quot;crowkis&quot;</span>
                    <span className="tok-cmd">,</span>
                    {"\n      "}
                    <span className="tok-str">&quot;args&quot;</span>
                    <span className="tok-cmd">: [</span>
                    <span className="tok-str">&quot;mcp&quot;</span>
                    <span className="tok-cmd">]</span>
                    {"\n    "}
                    <span className="tok-cmd">{`}`}</span>
                    {"\n  "}
                    <span className="tok-cmd">{`}`}</span>
                    {"\n"}
                    <span className="tok-cmd">{`}`}</span>
                    {"\n\n"}
                    <span className="tok-dim">
                      # crowkis mcp speaks JSON-RPC on stdout —{"\n"}# cache lookups become a tool
                      your agent calls first
                    </span>
                  </code>
                ),
              },
            ]}
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- roost teaser ------------------------------ */

export function RoostTeaser() {
  return (
    <section className="section pb-16 md:pb-24">
      <Reveal>
        <div className="card-block flex flex-col items-start justify-between gap-5 p-6 sm:p-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">From the Roost</p>
            <h3 className="mt-2 font-display text-2xl font-bold">
              Engineering notes, written by the people building it.
            </h3>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">
              Why we wrote our own LSM tree, what cache poisoning actually looks like, and how the
              engine earned its production stripes — no growth-hack content, ever.
            </p>
          </div>
          <Link href="/roost" className="btn-secondary shrink-0">
            Visit the Roost
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------ founder section ----------------------------- */

export function FounderSection() {
  return (
    <section className="section py-16 md:py-20">
      <div className="card-block mx-auto grid max-w-3xl items-center gap-7 p-7 sm:p-9 md:grid-cols-[150px_1fr]">
        <div className="relative mx-auto md:mx-0">
          <div className="overflow-hidden rounded-2xl border-2 border-ink shadow-block">
            <Image
              src="/brand/founder.jpg"
              alt="Mohit Rohilla, founder of Crowkis"
              width={150}
              height={150}
              className="h-[150px] w-[150px] object-cover"
            />
          </div>
          {/* a crow perched on the portrait, obviously */}
          <svg
            viewBox="0 0 16 12"
            className="absolute -top-[26px] right-2 h-[30px] w-auto"
            shapeRendering="crispEdges"
            aria-hidden
          >
            <rect x="9" y="0" width="4" height="4" fill="#16130e" />
            <rect x="13" y="1" width="2" height="1" fill="#16130e" />
            <rect x="3" y="3" width="8" height="5" fill="#16130e" />
            <rect x="8" y="2" width="2" height="1" fill="#16130e" />
            <rect x="0" y="3" width="3" height="2" fill="#16130e" />
            <rect x="4" y="4" width="5" height="3" fill="#37322a" />
            <rect x="6" y="8" width="1" height="2" fill="#16130e" />
            <rect x="9" y="8" width="1" height="2" fill="#16130e" />
            <rect x="5" y="10" width="2" height="1" fill="#16130e" />
            <rect x="8" y="10" width="2" height="1" fill="#16130e" />
            <rect x="11" y="1" width="1" height="1" fill="#d62221" />
          </svg>
        </div>
        <div>
          <p className="eyebrow">From the founder</p>
          <h2 className="mt-2 font-display text-2xl font-bold">Mohit Rohilla</h2>
          <p className="mt-1 font-mono text-xs text-ink-faint">
            builder of Crowkis · Rust, caches, and one very opinionated crow
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
            &ldquo;I built Crowkis because every LLM team I met was paying twice for the same
            answers and hoping a vector database would save them. A cache for AI traffic has to
            understand meaning <em>and</em> know when to refuse — so I wrote one, from the storage
            engine up, in Rust. No meters, no phone-home, no nonsense.&rdquo;
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://www.linkedin.com/in/itsmohitrohilla/"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary !py-2 text-sm"
            >
              Connect on LinkedIn
            </a>
            <a
              href="mailto:contact@crowkis.com?subject=Hi%20Mohit"
              className="btn-ghost !py-2 text-sm"
            >
              Or just email →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- final CTA -------------------------------- */

export function FinalCta() {
  return (
    <section className="border-t-2 border-ink bg-roost py-20 text-center md:py-28">
      <div className="section">
        <Reveal>
          <Logo3D size={110} />
          <h2 className="mx-auto mt-8 max-w-2xl font-display text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl md:text-5xl">
            Your LLM bill has a cache-shaped hole in it.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-stone-400 sm:text-lg">
            Two commands to a running instance. Your Redis client already knows how to talk to it.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/docker" className="btn-primary !border-stone-50">
              Start with Docker
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-stone-600 px-5 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-stone-300"
            >
              Read the quickstart
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
