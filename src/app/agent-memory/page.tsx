import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { CopyButton } from "@/components/ui/code-tabs";
import Cubes from "@/components/ui/cubes";

export const metadata: Metadata = {
  title: "Agent Memory",
  description:
    "Crowkis gives your agents long-term memory that survives restarts, consolidates contradictions, and recalls the right fact at the right time — 70.4% recall@10 on LoCoMo, 92.7% recall@5 on LongMemEval, zero external API calls.",
};

const memCommands: { cmd: string; sig: string; body: string }[] = [
  {
    cmd: "CMEMSET",
    sig: "CMEMSET agent user fact [TOPIC t]",
    body: "Store a durable fact, scoped to (agent, user). Consolidating: a contradicting fact auto-retires the old one instead of piling up.",
  },
  {
    cmd: "CMEMGET",
    sig: "CMEMGET agent user query [K n]",
    body: "Semantic recall of the top-K facts, ranked by relevance blended with recency. Optional cross-encoder rerank lifts quality further.",
  },
  {
    cmd: "CMEMHISTORY",
    sig: "CMEMHISTORY agent user query",
    body: "Recall including retired versions, each with its validity window — so you can see what the agent used to believe.",
  },
  {
    cmd: "CMEMASOF",
    sig: "CMEMASOF agent user query AT instant",
    body: "Bi-temporal recall: the facts that were believed current at a given moment in time. Memory with a clock.",
  },
  {
    cmd: "CMEMEXTRACT",
    sig: "CMEMEXTRACT agent user conversation",
    body: "Auto-extract durable facts from a conversation — deterministic, no model call, no egress.",
  },
  {
    cmd: "CMEMLINK / CMEMGRAPH",
    sig: "CMEMLINK agent user subj rel obj",
    body: "Graph memory: store subject→relation→object edges and traverse multi-hop, fan-out bounded to 512 edges.",
  },
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
              <Link href="/docs" className="btn-primary">
                Get started
              </Link>
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

      {/* ── Command suite ─────────────────────────────────────────────── */}
      <section className="border-y-2 border-ink bg-paper-deep">
        <div className="section py-16 md:py-20">
          <span className="eyebrow">The memory command suite</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            If you can talk to Redis, you can give your agent a memory
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
            Speak it over plain RESP, gRPC, or the SDKs. No new protocol to learn.
          </p>
          <div className="mt-9 grid gap-4 md:grid-cols-2">
            {memCommands.map((c) => (
              <div key={c.cmd} className="card-block p-5">
                <span className="font-mono text-sm font-bold text-crow">{c.cmd}</span>
                <code className="mt-2 block font-mono text-xs text-ink-soft">{c.sig}</code>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benchmarks ────────────────────────────────────────────────── */}
      <section className="section py-16 md:py-20">
        <span className="eyebrow">Measured, not asserted</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
          The benchmarks that actually matter
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Numbers from independent harnesses on real public datasets — SNAP Research&apos;s LoCoMo
          (1,986 QA pairs over multi-session dialogue) and LongMemEval. CPU-only laptop, bundled
          embedder, no cloud.
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
                    <div className="h-2 rounded-full bg-crow" style={{ width: `${row.rerank}%` }} />
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
      </section>

      {/* ── Quickstart ────────────────────────────────────────────────── */}
      <section className="border-t-2 border-ink bg-paper-deep">
        <div className="section py-16 md:py-20">
          <span className="eyebrow">Four lines</span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">
            Give an agent a memory in four lines
          </h2>
          <div className="code-panel mt-8">
            <div className="code-chrome justify-between">
              <span>redis-cli · port 6379</span>
              <CopyButton
                text={`CMEMSET support u_42 "prefers email over phone"
CMEMSET support u_42 "moved to Berlin in March"
CMEMSET support u_42 "no longer in Munich"
CMEMGET support u_42 "where does this customer live?" K 1`}
              />
            </div>
            <pre>
              <span className="tok-dim"># teach it three things across a conversation</span>
              {"\n"}
              <span className="tok-cmd">CMEMSET</span> support u_42{" "}
              <span className="tok-str">&quot;prefers email over phone&quot;</span>
              {"\n"}
              <span className="tok-cmd">CMEMSET</span> support u_42{" "}
              <span className="tok-str">&quot;moved to Berlin in March&quot;</span>
              {"\n"}
              <span className="tok-cmd">CMEMSET</span> support u_42{" "}
              <span className="tok-str">&quot;no longer in Munich&quot;</span>
              {"\n\n"}
              <span className="tok-dim"># ask — consolidation already retired &quot;Munich&quot;</span>
              {"\n"}
              <span className="tok-cmd">CMEMGET</span> support u_42{" "}
              <span className="tok-str">&quot;where does this customer live?&quot;</span> K 1
              {"\n"}
              <span className="tok-ok">→ &quot;moved to Berlin in March&quot;</span>
            </pre>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/docs" className="btn-primary">
              Read the docs
            </Link>
            <Link href="/docker" className="btn-secondary">
              docker pull crowkis/crowkis
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
