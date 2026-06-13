import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { CommandCard, CodeTabs } from "@/components/ui/code-tabs";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { CountUp } from "@/components/ui/count-up";
import { CrowBot } from "@/components/crow/crow-bot";

export const metadata: Metadata = {
  title: "Crowkis MCP — memory for AI apps",
  description:
    "The Crowkis binary ships an MCP server. Claude Code, agents, and any MCP-capable app check the cache before spending tokens — repeated work becomes free, locally.",
};

const MCP_JSON = `{
  "mcpServers": {
    "crowkis": {
      "command": "crowkis",
      "args": ["mcp"]
    }
  }
}`;

const MCP_DOCKER = `{
  "mcpServers": {
    "crowkis": {
      "command": "docker",
      "args": ["exec", "-i", "crowkis", "crowkis", "mcp"]
    }
  }
}`;

const STEPS = [
  {
    n: "1",
    title: "Run Crowkis",
    body: "One docker pull, one docker run. The same instance can serve your app traffic and your AI tools at once.",
  },
  {
    n: "2",
    title: "Register the server",
    body: "One config block — or one CLI line — and your assistant holds the cache as a tool.",
  },
  {
    n: "3",
    title: "Watch tokens stop burning",
    body: "The assistant checks the cache before calling the model and banks what it computes. The dashboard counts the savings.",
  },
];

const WORKLOADS: [string, string][] = [
  ["Doc & API lookups", "The same 'how does X work?' recurs across your whole team, all day. First ask pays; every ask after is free."],
  ["Code explanation", "Explanations of stable code are stable. Cached until the file changes, then invalidated."],
  ["Agent tool results", "Deterministic tool calls — schema fetches, searches — are pure savings on replay."],
  ["Multi-agent fan-out", "Five agents asking variants of one question become one model call and four sub-millisecond hits."],
];

export default function McpPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-8 py-14 md:grid-cols-[1.2fr_1fr] md:py-18">
          <div>
            <p className="eyebrow">Crowkis MCP · Model Context Protocol</p>
            <h1 className="responsive-title mt-4 max-w-2xl">
              Give your AI tools a memory.
              <br />
              Keep your tokens.
            </h1>
            <p className="responsive-subtitle mt-4 max-w-xl">
              Claude Code and every MCP-capable app can hold the Crowkis cache as a tool: check it
              before spending tokens, bank every answer they compute. Repeated work becomes a local
              sub-millisecond hit — and nothing leaves your machine.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#setup" className="btn-primary">
                Set it up in two minutes
              </a>
              <Link href="/docs/mcp" className="btn-secondary">
                Read the MCP docs
              </Link>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <CrowBot size={230} />
          </div>
        </div>
      </section>

      {/* numbers strip */}
      <section className="border-b-2 border-ink bg-roost text-stone-50">
        <div className="section grid grid-cols-3 py-8 text-center">
          {[
            { to: 1, suffix: " config block", label: "is the entire integration" },
            { to: 0, suffix: " tokens", label: "spent on a cache hit" },
            { to: 100, suffix: "%", label: "local — nothing leaves your machine" },
          ].map((f) => (
            <div key={f.label} className="px-2">
              <p className="font-display text-2xl font-bold sm:text-3xl">
                <CountUp to={f.to} suffix={f.suffix} />
              </p>
              <p className="mx-auto mt-1.5 max-w-[180px] font-mono text-[10px] leading-relaxed text-stone-500 sm:text-[11px]">
                {f.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* why */}
      <section className="section py-14 md:py-18">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight">
              Your assistant repeats itself. Constantly.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              AI coding assistants and agents re-ask the same questions with industrial
              enthusiasm: the same doc lookups, the same code explanations, the same boilerplate
              reasoning — dozens of times a day, billed at full token price every time. With
              Crowkis behind MCP, the model gains two reflexes: <em>check the cache first</em>, and{" "}
              <em>bank what you compute</em>.
            </p>
            <p className="mt-4 rounded-lg border border-ink-line bg-paper-deep p-4 text-sm leading-relaxed text-ink-soft">
              <span className="font-semibold text-ink">In plain words:</span> your AI assistant
              gets a memory that lives on your machine. Questions it has already answered stop
              costing you money — and your whole team shares the same memory.
            </p>
          </div>
          <div className="grid gap-3">
            {WORKLOADS.map(([title, body]) => (
              <Tilt3D key={title} max={3}>
                <div className="card-quiet p-5">
                  <p className="font-display font-bold">{title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{body}</p>
                </div>
              </Tilt3D>
            ))}
          </div>
        </div>
      </section>

      {/* setup */}
      <section id="setup" className="scroll-mt-24 border-y-2 border-ink bg-paper-deep py-14 md:py-18">
        <div className="section">
          <p className="eyebrow">The two-minute setup</p>
          <h2 className="responsive-title mt-3">Three steps, no SDK, no rewrite.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="card-block p-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-crow font-mono text-sm font-bold text-stone-50">
                  {step.n}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div>
              <CommandCard
                command="claude mcp add crowkis -- crowkis mcp"
                note="the one-liner — Claude Code registers the cache as a tool"
              />
              <p className="mt-4 text-sm text-ink-soft">
                Or add the config block by hand — works in any MCP-capable app, with a Docker
                variant if Crowkis runs in a container:
              </p>
            </div>
            <CodeTabs
              tabs={[
                {
                  label: ".mcp.json",
                  copyText: MCP_JSON,
                  content: <code className="tok-cmd">{MCP_JSON}</code>,
                },
                {
                  label: "docker variant",
                  copyText: MCP_DOCKER,
                  content: <code className="tok-cmd">{MCP_DOCKER}</code>,
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* safety + CTA */}
      <section className="section py-14 md:py-18">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="card-quiet border-l-4 !border-l-crow p-6">
            <h2 className="font-display text-xl font-bold">Agents can&apos;t poison it</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Every MCP write walks the same five-stage trust pipeline as all other traffic, with
              the assistant tracked as a source in the trust ledger. An agent that stores garbage
              earns a higher bar automatically — one assistant&apos;s hallucination never becomes
              the team&apos;s shared belief.
            </p>
            <p className="mt-3 font-mono text-xs text-ink-faint">
              same gates · same ledger · same receipts in the dashboard
            </p>
          </div>
          <div className="card-block flex flex-col justify-center p-6 text-center">
            <h2 className="font-display text-2xl font-bold leading-tight">
              Two minutes from now, your assistant remembers.
            </h2>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/docker" className="btn-primary">
                Run Crowkis free
              </Link>
              <Link href="/docs/mcp" className="btn-secondary">
                Full MCP reference
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
