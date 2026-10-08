import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/motion";
import { HeroScene } from "@/components/marketing/hero-scene";
import { CodeTabs, CommandCard } from "@/components/ui/code-tabs";
import { CountUp } from "@/components/ui/count-up";
import { Logo3D } from "@/components/crow/logo-3d";
import { TiltCard } from "@/components/ui/tilt-card";
import { IntegrationHub } from "@/components/marketing/integration-hub";

// Language marks for the SDK buttons (Simple Icons, single path each).
const PYTHON_LOGO =
  "M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z";
const NODE_LOGO =
  "M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z";

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
            Crowkis understands what your LLM is being asked, and serves the answer it already
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
    body: "Five checks gate every hit, wrong, stale, or poisoned answers never leave the cache.",
    mark: "02",
  },
  {
    title: "It drops into your stack",
    body: "Speaks Redis, gRPC, and REST. One Docker image, one port change, zero rewrites.",
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
            fixes fail, exact-match caches miss the rephrasing, similarity caches serve answers
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
            Python, Node, the Redis CLI, gRPC, and REST all plug into the same engine. Point a
            client at one port and you have a semantic cache, no rewrite, no new mental model.
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
    body: "Refunds, resets, shipping windows, the same fifty intents in thousands of phrasings. The repeats become instant, free answers; only new questions reach the model.",
    stat: "the highest hit rates of any workload",
  },
  {
    title: "Internal copilots",
    who: "HR, IT, and engineering assistants",
    body: "Your whole company asks the same policy and how-to questions. One shared memory across Slack bots, portals, and IDE plugins, the first answer serves everyone.",
    stat: "one answer, four hundred askers",
  },
  {
    title: "RAG applications",
    who: "docs assistants · knowledge products",
    body: "Retrieval is cheap; the synthesis step is the bill. Crowkis caches the finished answer, version-pinned to your docs, so popular questions skip the whole pipeline.",
    stat: "cache the synthesis, not just the chunks",
  },
  {
    title: "Agent fleets",
    who: "automation · multi-agent platforms",
    body: "Agents re-ask, re-plan, and re-fetch relentlessly. Semantic hits, reasoning reuse, and tool-call caching deflate the 10-50× call multiplier that breaks agent economics.",
    stat: "five agents, one model call",
  },
  {
    title: "High-traffic chat & voice",
    who: "consumer apps · voice assistants",
    body: "At scale, traffic converges on shared intents while every millisecond counts. Sub-millisecond streamed hits keep the experience instant and the unit economics sane.",
    stat: "<1ms hits inside a 1s voice budget",
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
          Five production workloads where teams deploy Crowkis today, each one a repetition engine
          wearing a product&apos;s clothes.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map((uc) => (
            <article key={uc.title} className="card-block flex h-full flex-col p-6 md:last:col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">
                  {uc.who}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug">{uc.title}</h3>
                <p className="mt-3 flex-1 text-[13.5px] leading-relaxed text-ink-soft">{uc.body}</p>
                <p className="mt-4 border-t border-ink-line pt-3 font-mono text-xs font-semibold text-crow">
                  → {uc.stat}
                </p>
              </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ docker strip ------------------------------ */

export function DockerStrip() {
  return (
    <section className="section pb-16 md:pb-24">
      <TiltCard className="flex h-full flex-col p-7">
        <p className="eyebrow">Official Docker image</p>
        <h2 className="mt-3 font-display text-2xl font-bold">Free. Hardened. One pull away.</h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
          Community edition runs at full power with no license, no sign-up, no phone-home.
          Non-root, read-only, every capability dropped, before you ask.
        </p>
        <div className="mt-5">
          <CommandCard command="docker pull crowkis/crowkis:latest" note="then one docker run, full guide on the Docker page" />
        </div>
        <Link href="/docker" className="btn-secondary mt-5 self-start">
          The Docker guide
        </Link>
      </TiltCard>
    </section>
  );
}

/* ------------------- fact strip, Redis-style live counters ------------------- */

const FACTS: { to: number; prefix?: string; suffix?: string; label: string }[] = [
  { to: 33000, prefix: "~", label: "lines of Rust, no GC pauses" },
  { to: 347, label: "integration tests in the suite" },
  { to: 12, label: "intent classes scored per query" },
  { to: 5, label: "anti-poisoning stages per write" },
  { to: 3, label: "protocols, RESP3 · gRPC · REST" },
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
            <p className="mx-auto mt-2 max-w-[160px] font-mono text-[11px] leading-relaxed text-stone-400">
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
    body: "One bad write, a prompt injection, a hallucination, a cross-tenant leak, gets served back to every user who asks anything nearby. Most caches have no immune system.",
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
          two obvious fixes both fail, one misses too much, the other reuses too much.
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
    body: "An HNSW vector index finds semantic neighbours, cross-checked against the structural template, two signals, not one.",
  },
  {
    step: "04",
    title: "Score confidence",
    body: "Five signals, similarity, freshness, trust, hit history, intent threshold, combine into one score. Below threshold, no reuse.",
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
            trust all agree, anything else goes to the model.
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
          <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-stone-400">
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
    body: "Reuse thresholds tune themselves per intent class from live hit/miss feedback, stricter where mistakes hurt, looser where they don't.",
  },
  {
    name: "Reasoning reuse",
    body: "Chain-of-thought structure is extracted, abstracted, and recomposed for new inputs, savings beyond response-level caching.",
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
          All of it on a custom LSM storage engine, WAL, SSTables, bloom filters, compaction, written from scratch in Rust. No RocksDB underneath. No garbage collector in the path.
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
    <span className="tok-dim"># the built-in REPL, redis clients work too</span>
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
          Crowkis serves RESP3, the Redis wire protocol, alongside gRPC and a REST management
          API. Point your existing client at port 6383 and you have a semantic cache. The Python
          and Node SDKs add <code className="inline">get_or_compute</code>, streaming, and
          multimodal helpers on top.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/docs/sdk-python" className="btn-secondary">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#3776AB" aria-hidden>
              <path d={PYTHON_LOGO} />
            </svg>
            Python SDK
          </Link>
          <Link href="/docs/sdk-node" className="btn-secondary">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#5FA04E" aria-hidden>
              <path d={NODE_LOGO} />
            </svg>
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
            note="free Community edition, full power, no license file needed, then docker run and you're live"
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
            One Alpine-based, multi-stage image with every feature compiled in, your license file
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
          and migration state, all auditable through the same REST API it runs on.
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
            <span>crowkis dashboard, live verdict feed</span>
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
            understand meaning <em>and</em> know when to refuse, so I wrote one, from the storage
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
              href="mailto:mohit.r@tarkova.com,subhraneel@tarkova.com?subject=Hi%20Mohit"
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
