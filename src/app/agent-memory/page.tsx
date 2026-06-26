import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Mermaid } from "@/components/ui/mermaid";
import Cubes from "@/components/ui/cubes";

const BRAIN_DIAGRAM = `flowchart LR
  C["a conversation"] --> X["extract<br/>durable facts"]
  X --> CN["consolidate<br/>retire contradictions"]
  CN --> ST["memory store<br/>(agent, user) · bounded · persists"]
  ST --> G["graph edges<br/>subject → relation → object"]
  Q["a new question"] --> R["semantic recall<br/>+ cross-encoder rerank"]
  ST --> R
  G --> R
  R --> A["the right fact, right now"]
  style A fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style ST fill:#f3eee5,stroke:#16130e,stroke-width:2px`;

// How Crowkis memory compares to the dedicated memory tools (as of June 2026;
// competitor capabilities vary by plan and version).
const COMPARE_ROWS: { feature: string; crowkis: string; mem0: string; zep: string; letta: string }[] = [
  { feature: "Runs fully self-hosted", crowkis: "yes", mem0: "partial", zep: "partial", letta: "yes" },
  { feature: "Zero external API calls (local models)", crowkis: "yes", mem0: "no", zep: "no", letta: "partial" },
  { feature: "Consolidates contradictions", crowkis: "yes", mem0: "yes", zep: "yes", letta: "partial" },
  { feature: "Bi-temporal recall (as-of a past time)", crowkis: "yes", mem0: "partial", zep: "yes", letta: "partial" },
  { feature: "Graph memory", crowkis: "yes", mem0: "yes", zep: "yes", letta: "partial" },
  { feature: "Cross-encoder reranking", crowkis: "yes", mem0: "partial", zep: "partial", letta: "no" },
  { feature: "Also a Redis-compatible cache", crowkis: "yes", mem0: "no", zep: "no", letta: "no" },
  { feature: "Guardrails + evals built in", crowkis: "yes", mem0: "no", zep: "no", letta: "no" },
  { feature: "Reasoning reuse", crowkis: "yes", mem0: "no", zep: "no", letta: "no" },
];

function Mark({ v }: { v: string }) {
  if (v === "yes") return <span className="font-bold text-crow" aria-label="yes">●</span>;
  if (v === "partial") return <span className="text-ink-faint" aria-label="partial">◐</span>;
  return <span className="text-ink-line" aria-label="no">○</span>;
}

export const metadata: Metadata = {
  title: "Agent Memory",
  description:
    "Crowkis gives your agents long-term memory that survives restarts, consolidates contradictions, and recalls the right fact at the right time — 70.4% recall@10 on LoCoMo, 92.7% recall@5 on LongMemEval, zero external API calls.",
};

/* ── how memory actually works ──────────────────────────────────────────── */
const mechanics: { title: string; body: string }[] = [
  {
    title: "Consolidation, not accumulation",
    body: "When a new fact contradicts an old one above a similarity threshold, Crowkis retires the old version instead of storing both. 'Lives in Munich' becomes 'moved to Berlin' — and a later question gets the current answer, not all three.",
  },
  {
    title: "Recency-blended relevance",
    body: "Recall ranks facts by semantic relevance blended with recency, with a configurable half-life (30 days by default). A preference stated today outranks one from six months ago, even when both match the query.",
  },
  {
    title: "Bi-temporal recall",
    body: "Memory keeps validity windows, so you can ask what was believed true at any past instant. The agent can reason about the present and reconstruct the past — useful for audits, disputes, and 'what did we know when?'",
  },
  {
    title: "Cross-encoder reranking",
    body: "A second, sharper model re-scores the top candidates before they're returned. It's the single change that tripled LoCoMo recall — bounded to the top-K so the cost stays small.",
  },
  {
    title: "Graph edges",
    body: "Facts can be linked as subject→relation→object edges and traversed multi-hop, so 'who works at the customer's company?' is a graph walk, not a guess. Fan-out is bounded to 512 edges per (agent, user).",
  },
  {
    title: "Bounded & durable",
    body: "Memory is capped per user (500 facts by default) so it can't sprawl, and it persists across restarts — a rescheduled pod comes back remembering exactly what it knew.",
  },
];

/* ── use cases ──────────────────────────────────────────────────────────── */
const useCases: { tag: string; title: string; body: string }[] = [
  {
    tag: "Support agents",
    title: "Remember the customer across tickets",
    body: "Channel preference, past issues, account context — recalled on the next ticket without re-asking. Consolidation keeps 'their address' current as it changes.",
  },
  {
    tag: "Coding agents",
    title: "Remember the codebase's conventions",
    body: "Which test runner, which lint rules, which patterns the team rejected last week. The agent stops relearning your repo on every session.",
  },
  {
    tag: "Personal assistants",
    title: "Remember the human, not just the chat",
    body: "Preferences, relationships, recurring context that should outlive a single conversation — recalled by meaning, ranked by recency.",
  },
  {
    tag: "Multi-agent systems",
    title: "Shared memory, isolated per tenant",
    body: "A swarm of agents writes to one (agent, user)-scoped store with zero cross-tenant leakage — proven under 16-thread concurrency with zero leaks.",
  },
  {
    tag: "Compliance-bound apps",
    title: "Memory that never leaves the building",
    body: "Bundled models mean recall happens locally — no conversation shipped to a hosted memory API. CMEMFORGET executes erasure on request.",
  },
  {
    tag: "Long-running chats",
    title: "Recall past the context window",
    body: "Semantic search over the whole history surfaces what was said forty messages ago, so 'as I mentioned earlier' actually works.",
  },
];

/* ── achievements / milestones ──────────────────────────────────────────── */
const achievements: { value: string; label: string }[] = [
  { value: "70.4%", label: "LoCoMo recall@10 — 3× the bi-encoder baseline" },
  { value: "92.7%", label: "LongMemEval recall@5 (oracle); 84.3% on the hard split" },
  { value: "95.5%", label: "recall@5 on temporal-reasoning questions" },
  { value: "0", label: "cross-tenant leaks under 16-thread concurrency" },
  { value: "29/29", label: "free features pass; 84/84 stress checks green" },
  { value: "0", label: "external API calls — fully self-hosted, zero egress" },
];

// LoCoMo recall@10 — bi-encoder baseline vs + cross-encoder rerank.
const locomo: { label: string; base: number; rerank: number }[] = [
  { label: "Overall", base: 25, rerank: 70.4 },
  { label: "Single-hop", base: 28, rerank: 73.7 },
  { label: "Temporal", base: 26, rerank: 71.3 },
  { label: "Multi-hop", base: 22, rerank: 67.0 },
  { label: "Open-domain", base: 15, rerank: 47.8 },
];

// LongMemEval-S (hard) recall@5 by question type.
const longmem: { label: string; v: number }[] = [
  { label: "Temporal reasoning", v: 95.5 },
  { label: "Knowledge update", v: 90.9 },
  { label: "Single-session user", v: 81.8 },
  { label: "Multi-session", v: 76.2 },
  { label: "Single-session preference", v: 60.0 },
];

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card-quiet px-5 py-4">
      <div className="font-display text-2xl font-bold sm:text-3xl">{value}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </div>
    </div>
  );
}

/* ── pure-SVG charts, theme-aware via CSS vars ──────────────────────────── */
function RadialGauge({ value, label, sub }: { value: number; label: string; sub: string }) {
  const R = 54;
  const C = 2 * Math.PI * R;
  const off = C * (1 - value / 100);
  return (
    <div className="card-block flex flex-col items-center p-5 text-center">
      <svg viewBox="0 0 140 140" className="w-full max-w-[150px]" role="img" aria-label={`${value}%`}>
        <circle
          cx="70"
          cy="70"
          r={R}
          fill="none"
          strokeWidth="13"
          style={{ stroke: "rgb(var(--c-ink-line))" }}
        />
        <circle
          cx="70"
          cy="70"
          r={R}
          fill="none"
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={off}
          transform="rotate(-90 70 70)"
          style={{ stroke: "rgb(var(--c-crow))" }}
        />
        <text
          x="70"
          y="71"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="27"
          fontWeight="700"
          fontFamily="var(--font-display), sans-serif"
          style={{ fill: "rgb(var(--c-ink))" }}
        >
          {value}%
        </text>
      </svg>
      <p className="mt-3 font-display text-sm font-bold">{label}</p>
      <p className="mt-0.5 font-mono text-[11px] text-ink-faint">{sub}</p>
    </div>
  );
}

function Donut({
  title,
  segments,
  centerTop,
  centerSub,
  caption,
}: {
  title: string;
  segments: { label: string; value: number; color: string }[];
  centerTop: string;
  centerSub: string;
  caption: string;
}) {
  const R = 54;
  const C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="card-block flex flex-col p-6">
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <svg
          viewBox="0 0 140 140"
          className="w-40 shrink-0"
          role="img"
          aria-label={`${centerTop} ${centerSub}`}
        >
          {segments.map((s) => {
            const f = s.value / 100;
            const dash = `${f * C} ${C - f * C}`;
            const offset = -acc * C;
            acc += f;
            return (
              <circle
                key={s.label}
                cx="70"
                cy="70"
                r={R}
                fill="none"
                strokeWidth="20"
                stroke={s.color}
                strokeDasharray={dash}
                strokeDashoffset={offset}
                transform="rotate(-90 70 70)"
              />
            );
          })}
          <text
            x="70"
            y="64"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="25"
            fontWeight="700"
            fontFamily="var(--font-display), sans-serif"
            style={{ fill: "rgb(var(--c-ink))" }}
          >
            {centerTop}
          </text>
          <text
            x="70"
            y="83"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8.5"
            letterSpacing="0.5"
            fontFamily="var(--font-mono), monospace"
            style={{ fill: "rgb(var(--c-ink-faint))" }}
          >
            {centerSub}
          </text>
        </svg>
        <ul className="w-full space-y-3 text-sm">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2.5 text-ink-soft">
                <span
                  className="inline-block h-3 w-3 shrink-0 rounded-sm"
                  style={{ background: s.color }}
                />
                {s.label}
              </span>
              <span className="font-mono text-xs font-semibold text-ink">{s.value}%</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-5 border-t border-ink-line pt-3 text-xs italic text-ink-faint">{caption}</p>
    </div>
  );
}

export default function AgentMemoryPage() {
  return (
    <SiteShell>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="eyebrow">Crowkis · Agent Memory</span>
            <h1 className="responsive-title mt-4">Memory your agents don&apos;t have to rebuild.</h1>
            <p className="responsive-subtitle mt-5 max-w-2xl">
              Most agents forget the moment a session ends. Crowkis gives them long-term memory that
              survives restarts, consolidates contradictions instead of hoarding them, and recalls
              the right fact at the right time — all from one self-hosted binary, with{" "}
              <span className="font-semibold text-ink">zero external API calls</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#install" className="btn-primary">
                Install Crowkis
              </a>
              <Link href="/roost/agent-memory-benchmarks" className="btn-secondary">
                Read the benchmark write-up →
              </Link>
            </div>
            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat value="70.4%" label="LoCoMo recall@10" />
              <Stat value="92.7%" label="LongMemEval recall@5" />
              <Stat value="3×" label="lift from reranking" />
              <Stat value="0" label="external API calls" />
            </div>
          </div>

          {/* Cubes accent — themed to the paper/ink palette */}
          <div className="mx-auto w-full max-w-[340px]">
            <div className="card-block overflow-hidden p-6">
              <div className="aspect-square">
                <Cubes
                  gridSize={7}
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
                every fact a cell · click to ripple recall
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recall at a glance — charts ───────────────────────────────── */}
      <section className="section py-16 md:py-20">
        <span className="eyebrow">Recall at a glance</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
          The numbers, drawn
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          One donut and three gauges — the whole memory story in a glance, then the full bars below.
        </p>
        <div className="mt-9 space-y-4">
          <Donut
            title="LoCoMo · how 70.4% recall@10 is built"
            centerTop="70.4%"
            centerSub="recall@10"
            segments={[
              { label: "Found by bi-encoder", value: 25, color: "#8a8275" },
              { label: "Added by reranking", value: 45.4, color: "#d62221" },
              { label: "Not recalled", value: 29.6, color: "#e2dccf" },
            ]}
            caption="The cross-encoder reranker contributes the largest slice — the lift from ~25% to 70.4%."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <RadialGauge value={92.7} label="LongMemEval" sub="recall@5 · oracle" />
            <RadialGauge value={84.3} label="LongMemEval" sub="recall@5 · hard" />
            <RadialGauge value={95.5} label="Temporal" sub="recall@5 · best type" />
          </div>
        </div>
      </section>

      {/* ── What it is ────────────────────────────────────────────────── */}
      <section className="section py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="eyebrow">Not a vector dump</span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
              A memory layer, not a pile of embeddings
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              A pile of embeddings is not memory. Real memory knows that &ldquo;I moved to
              Berlin&rdquo; retires &ldquo;I live in Munich,&rdquo; that a preference stated today
              outranks one from six months ago, and that the question &ldquo;where do they
              live?&rdquo; should surface the current answer — not all three.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Crowkis memory is scoped to <span className="font-semibold text-ink">(agent, user)</span>,
              bounded per user, consolidating by default, and bi-temporal: it remembers not just what
              is true, but what <em>was</em> believed true, and when. All of it persists across
              restarts and runs entirely on the bundled ONNX embedder.
            </p>
          </div>
          <div className="card-quiet self-start p-6">
            <p className="eyebrow">What makes it memory</p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              {[
                ["Consolidating", "A contradicting fact retires the old one — no stale pile-up."],
                ["Bi-temporal", "Recall what was believed true at any past instant."],
                ["Per-user bounded", "Scoped to (agent, user), capped so memory can't sprawl."],
                ["Rerank-boosted", "A cross-encoder sharpens recall over the top candidates."],
                ["Graph edges", "Subject→relation→object links, traversed multi-hop."],
                ["Zero-egress", "Bundled models. Nothing leaves your machine."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crow" />
                  <span>
                    <span className="font-semibold text-ink">{t}.</span> {d}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="border-y-2 border-ink bg-paper-deep">
        <div className="section py-16 md:py-20">
          <span className="eyebrow">Under the hood</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            How the memory actually works
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
            Six design decisions separate a memory layer from a vector dump. Each one is a default you
            can tune, not a black box you have to trust.
          </p>

          {/* the memory "brain" — one fact's journey from conversation to recall */}
          <figure className="card-block mt-9 overflow-hidden !p-0">
            <figcaption className="border-b-2 border-ink bg-paper-card px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              the memory brain — how a fact gets in, and back out
            </figcaption>
            <Mermaid chart={BRAIN_DIAGRAM} />
            <p className="border-t border-ink-line px-4 py-2.5 text-xs italic text-ink-faint">
              Facts flow left-to-right into the store; a question pulls them back through recall and
              reranking. Consolidation keeps the picture current; the graph keeps it connected.
            </p>
          </figure>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mechanics.map((m, i) => (
              <div key={m.title} className="card-block p-5">
                <span className="font-mono text-xs font-bold text-crow">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use cases ─────────────────────────────────────────────────── */}
      <section className="border-y-2 border-ink bg-paper-deep">
        <div className="section py-16 md:py-20">
          <span className="eyebrow">Where it earns its place</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Use cases that need real memory
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
            Anywhere an agent should know something on the next session that it learned on the last
            one.
          </p>
          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((u) => (
              <div key={u.tag} className="card-block flex flex-col p-5">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-crow">
                  {u.tag}
                </span>
                <h3 className="mt-2 font-display text-lg font-bold leading-snug">{u.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Achievements ──────────────────────────────────────────────── */}
      <section className="section py-16 md:py-20">
        <span className="eyebrow">The receipts</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
          What we&apos;ve measured, not just claimed
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Every number here comes from an independent harness on public datasets, run on a CPU-only
          laptop with the bundled models. The full method is in the{" "}
          <Link
            href="/roost/agent-memory-benchmarks"
            className="font-semibold text-crow underline underline-offset-2"
          >
            benchmark write-up
          </Link>
          .
        </p>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <div key={a.label} className="card-block flex items-start gap-4 p-5">
              <span className="font-display text-3xl font-bold text-crow">{a.value}</span>
              <span className="pt-1 text-sm leading-relaxed text-ink-soft">{a.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Benchmarks ────────────────────────────────────────────────── */}
      <section className="border-y-2 border-ink bg-paper-deep">
        <div className="section py-16 md:py-20">
          <span className="eyebrow">Measured, not asserted</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            The benchmarks that actually matter
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
            SNAP Research&apos;s LoCoMo (1,986 QA pairs over multi-session dialogue) and LongMemEval.
            CPU-only laptop, bundled embedder, no cloud.
          </p>

          {/* LoCoMo */}
          <div className="card-block mt-9 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-bold">LoCoMo — retrieval recall@10</h3>
              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-ink-faint">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-ink-faint" /> bi-encoder
                </span>
                <span className="flex items-center gap-1.5 text-crow">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-crow" /> + rerank
                </span>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {locomo.map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex justify-between font-mono text-xs text-ink-soft">
                    <span>{row.label}</span>
                    <span className="text-crow">{row.rerank}%</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-2 rounded-full bg-paper-deep">
                      <div
                        className="h-2 rounded-full bg-ink-faint"
                        style={{ width: `${row.base}%` }}
                      />
                    </div>
                    <div className="h-2 rounded-full bg-paper-deep">
                      <div
                        className="h-2 rounded-full bg-crow"
                        style={{ width: `${row.rerank}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-ink-line pt-3 text-xs italic text-ink-faint">
              The cross-encoder reranker roughly triples overall recall — from ~25% to 70.4%.
            </p>
          </div>

          {/* LongMemEval */}
          <div className="card-block mt-6 p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-lg font-bold">
                LongMemEval-S (hard) — recall@5 by question type
              </h3>
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-faint">
                ~49 sessions · ~500 turns / question
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {longmem.map((row) => (
                <div key={row.label}>
                  <div className="mb-1.5 flex justify-between font-mono text-xs text-ink-soft">
                    <span>{row.label}</span>
                    <span className="text-crow">{row.v}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-paper-deep">
                    <div className="h-2.5 rounded-full bg-crow" style={{ width: `${row.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 border-t border-ink-line pt-3 text-xs italic text-ink-faint">
              92.7% recall@5 in oracle mode; 84.3% on the stratified hard split — competitive with
              hosted memory services, with nothing leaving your machine.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Crowkis vs the memory tools ───────────────────────────── */}
      <section className="section py-16 md:py-20">
        <span className="eyebrow">Why Crowkis</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
          How it compares to the dedicated memory tools
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Mem0, Zep, and Letta are good at memory — but they&apos;re memory <em>only</em>, and most
          lean on a hosted API or an external model to do their work. Crowkis matches them on the
          memory features and adds the part nobody else has: it&apos;s also your{" "}
          <span className="font-semibold text-ink">cache, your guardrails, and your gateway</span> —
          one self-hosted binary, with nothing leaving your machine.
        </p>

        <div className="card-block mt-9 overflow-hidden !p-0">
          <div className="table-scroll">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink bg-paper-deep font-display">
                  <th className="px-5 py-3.5 font-bold">Capability</th>
                  <th className="px-4 py-3.5 text-center font-bold text-crow">Crowkis</th>
                  <th className="px-4 py-3.5 text-center font-bold">Mem0</th>
                  <th className="px-4 py-3.5 text-center font-bold">Zep</th>
                  <th className="px-4 py-3.5 text-center font-bold">Letta</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((r) => (
                  <tr key={r.feature} className="border-b border-ink-line last:border-0">
                    <td className="px-5 py-3 text-ink-soft">{r.feature}</td>
                    <td className="bg-crow-tint/40 px-4 py-3 text-center text-base">
                      <Mark v={r.crowkis} />
                    </td>
                    <td className="px-4 py-3 text-center text-base">
                      <Mark v={r.mem0} />
                    </td>
                    <td className="px-4 py-3 text-center text-base">
                      <Mark v={r.zep} />
                    </td>
                    <td className="px-4 py-3 text-center text-base">
                      <Mark v={r.letta} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap items-center gap-4 border-t border-ink-line px-5 py-3 font-mono text-[11px] text-ink-faint">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-crow">●</span> yes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-ink-faint">◐</span> partial / plan-dependent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-ink-line">○</span> no
            </span>
            <span className="ml-auto italic">As of June 2026; competitor features vary by plan &amp; version.</span>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-soft">
          Honest take: on raw headline recall, the hosted leaders post strong numbers too. Crowkis
          wins on a different axis — comparable recall while running{" "}
          <span className="font-semibold text-ink">fully local with zero egress</span>, and folding
          memory, semantic caching, guardrails, evals, and an AI gateway into one Redis-compatible
          process instead of four services to wire together.
        </p>
      </section>

      {/* ── Closing CTA ───────────────────────────────────────────────── */}
      <section className="border-t-2 border-ink bg-paper-deep">
        <div className="section py-16 md:py-20">
          <div className="card-block flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Give your agents a memory that lasts.
              </h2>
              <p className="mt-2 max-w-xl text-ink-soft">
                Self-hosted, zero-egress, and free to run. Install it from the Usage page and the
                CMEM commands are live in seconds.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/docker" className="btn-primary">
                Install Crowkis
              </Link>
              <Link href="/roost/csession-multi-turn-memory" className="btn-secondary">
                Memory &amp; sessions →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
