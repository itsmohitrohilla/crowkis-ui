import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { CopyButton, CommandCard } from "@/components/ui/code-tabs";
import { InstallPicker, type Install } from "@/components/marketing/install-picker";
import Cubes from "@/components/ui/cubes";

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

/* platform marks for the install picker */
function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#fff" aria-hidden>
      <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.7 1.1 8.9.7 1.1 1.6 2.3 2.8 2.2 1.1 0 1.5-.7 2.9-.7 1.3 0 1.7.7 2.9.7 1.2 0 2-1.1 2.7-2.1.8-1.2 1.2-2.4 1.2-2.5-.1 0-2.3-.9-2.3-3.7zM14.2 5.8c.6-.8 1-1.8.9-2.9-.9 0-2 .6-2.6 1.3-.6.7-1.1 1.7-.9 2.8 1 0 2-.5 2.6-1.2z" />
    </svg>
  );
}
function WindowsMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="#fff" aria-hidden>
      <rect x="3" y="3" width="8.2" height="8.2" />
      <rect x="12.8" y="3" width="8.2" height="8.2" />
      <rect x="3" y="12.8" width="8.2" height="8.2" />
      <rect x="12.8" y="12.8" width="8.2" height="8.2" />
    </svg>
  );
}
function LinuxMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
      <ellipse cx="12" cy="13" rx="6.4" ry="7.6" fill="#fff" />
      <ellipse cx="12" cy="15" rx="3.6" ry="4.8" fill="#f7d04a" />
      <circle cx="9.8" cy="9.5" r="1.5" fill="#16130e" />
      <circle cx="14.2" cy="9.5" r="1.5" fill="#16130e" />
      <ellipse cx="9" cy="20.5" rx="2" ry="1.1" fill="#f59e0b" />
      <ellipse cx="15" cy="20.5" rx="2" ry="1.1" fill="#f59e0b" />
    </svg>
  );
}
function DockerMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#fff" aria-hidden>
      <rect x="3" y="10.5" width="3" height="3" />
      <rect x="7" y="10.5" width="3" height="3" />
      <rect x="11" y="10.5" width="3" height="3" />
      <rect x="7" y="6.5" width="3" height="3" />
      <rect x="11" y="6.5" width="3" height="3" />
      <path d="M2 14.5h18c0 3-2.4 4.8-6 4.8H7.2C4 19.3 2 17.4 2 14.5z" />
    </svg>
  );
}

const INSTALLS: Install[] = [
  {
    os: "macOS",
    method: "Homebrew",
    tint: "#16130e",
    mark: <AppleMark />,
    steps: [
      { cmd: "brew install crowkis/tap/crowkis", note: "install the engine + CLI" },
      { cmd: "crowkis server", note: "start it — RESP on :6379, dashboard on :6380" },
    ],
  },
  {
    os: "Linux",
    method: "Homebrew or script",
    tint: "#26282c",
    mark: <LinuxMark />,
    steps: [
      { cmd: "brew install crowkis/tap/crowkis", note: "with Homebrew" },
      { cmd: "curl -fsSL https://get.crowkis.io/crowkis-linux.sh | sh", note: "or, no Homebrew" },
    ],
  },
  {
    os: "Windows",
    method: "Scoop",
    tint: "#0078D6",
    mark: <WindowsMark />,
    steps: [
      { cmd: "scoop bucket add crowkis https://github.com/crowkis/scoop-bucket" },
      { cmd: "scoop install crowkis" },
    ],
  },
  {
    os: "Docker",
    method: "Any system",
    tint: "#2496ED",
    mark: <DockerMark />,
    hint: "works today · no setup",
    steps: [{ cmd: "docker run -d -p 6379:6379 -p 6380:6380 crowkis/crowkis" }],
  },
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

      {/* ── Install ───────────────────────────────────────────────────── */}
      <section id="install" className="section scroll-mt-24 py-16 md:py-20">
        <span className="eyebrow">One command per platform</span>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight">Get Crowkis running</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
          Install the engine and CLI through the package manager you already use, or run the Docker
          image — same engine either way. Then talk to it with any Redis client.
        </p>
        <div className="mt-9">
          <InstallPicker installs={INSTALLS} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <CommandCard command="crowkis cli" note="the built-in REPL — ships in the binary" />
          <CommandCard command="crowkis cli 127.0.0.1:6379" note="point it at any running instance" />
        </div>
        <p className="mt-5 font-mono text-xs text-ink-faint">
          Every build is signed, with checksums published alongside the release · macOS · Linux ·
          Windows · Docker.
        </p>
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
              <span>crowkis cli · port 6379</span>
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
            <Link href="/roost/csession-multi-turn-memory" className="btn-secondary">
              More on memory & sessions →
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
