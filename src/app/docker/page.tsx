import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/ui/motion";
import { CodeTabs, CommandCard, CopyButton } from "@/components/ui/code-tabs";
import { TiltCard } from "@/components/ui/tilt-card";

export const metadata: Metadata = {
  title: "Official Docker Image",
  description:
    "Run Crowkis in production with one hardened Docker image: non-root, read-only filesystem, dropped capabilities, built-in healthcheck, amd64 + arm64. Free Community edition, no license required.",
};

const ENV_VARS: [string, string, string][] = [
  ["CROWKIS_ADMIN_KEY", "change-me-admin-key", "Auth key for the management API and dashboard metrics."],
  ["CROWKIS_AUTH_TOKEN", "change-me-resp-grpc-token", "Bearer token required for RESP and gRPC traffic."],
  ["CROWKIS_BIND_ADDR", "127.0.0.1", "Published-port bind address. Keep localhost until you mean it."],
  ["CROWKIS_MEMORY_LIMIT", "512m", "Runtime memory ceiling for the cache process."],
  ["CROWKIS_BLOCK_CACHE_BYTES", "64m", "Block cache capacity for hot SSTable reads."],
  ["CROWKIS_MAX_CONNECTIONS", "10000", "Concurrent connection ceiling."],
  ["CROWKIS_LOG_QUERY_PREVIEWS", "0", "Keeps prompt text out of logs. On by default, on purpose."],
  ["CROWKIS_LICENSE_PATH", "/etc/crowkis/license.json", "Enterprise license file. Absent = Community edition, free."],
];

const HARDENING: [string, string][] = [
  ["read_only: true", "The container filesystem is immutable. Data lives on the mounted volume; /tmp is tmpfs."],
  ["cap_drop: ALL", "Every Linux capability dropped. The process needs none of them."],
  ["no-new-privileges", "Even a compromised process can't gain privileges it didn't start with."],
  ["Non-root user", "Built into the image — not something you have to remember to configure."],
  ["pids_limit: 512", "Fork bombs hit a wall."],
  ["Localhost-only ports", "Published to 127.0.0.1 by default. Going public is an explicit choice."],
  ["HEALTHCHECK built in", "/health endpoint wired into the image, so orchestrators see real readiness."],
  ["Binary-only image", "One stripped Rust binary, a non-root user, /data. No shell tooling, no package manager, no supply chain."],
];

const PORTS: [string, string, string, string][] = [
  ["6379", "RESP3", "Redis wire protocol — crowkis cli or any Redis client.", "#d62221"],
  ["6380", "HTTP", "Dashboard + management REST API + /health.", "#f59e0b"],
  ["6381", "gRPC", "h2c — Get / Set / GetStream / Stats / Invalidate.", "#14b8a6"],
];

const RUN_CMD = `docker run -d --name crowkis \\
  -p 127.0.0.1:6379:6379 \\
  -p 127.0.0.1:6380:6380 \\
  -p 127.0.0.1:6381:6381 \\
  -v crowkis-data:/data \\
  crowkis/crowkis:latest`;

const COMPOSE_SNIPPET = `services:
  crowkis:
    image: crowkis/crowkis:latest
    container_name: crowkis
    ports:
      - "127.0.0.1:6379:6379"   # RESP3
      - "127.0.0.1:6380:6380"   # dashboard + REST
      - "127.0.0.1:6381:6381"   # gRPC
    volumes:
      - crowkis-data:/data
      # - ./license.json:/etc/crowkis/license.json:ro   # Enterprise
    environment:
      CROWKIS_ADMIN_KEY: change-me-admin-key
      CROWKIS_AUTH_TOKEN: change-me-resp-grpc-token
      CROWKIS_MEMORY_LIMIT: 512m
    read_only: true
    tmpfs: [/tmp]
    cap_drop: [ALL]
    security_opt: [no-new-privileges:true]
    pids_limit: 512
    restart: unless-stopped

volumes:
  crowkis-data:`;

/* the hero "quickstart" terminal */
function QuickstartTerminal() {
  return (
    <div className="code-panel shadow-block">
      <div className="code-chrome justify-between">
        <span className="flex items-center gap-2">
          <i className="h-2.5 w-2.5 rounded-full bg-crow" />
          <i className="h-2.5 w-2.5 rounded-full bg-stone-600" />
          <i className="h-2.5 w-2.5 rounded-full bg-stone-600" />
          <span className="ml-2">quickstart — ~60s to a cache hit</span>
        </span>
        <CopyButton text={`docker pull crowkis/crowkis:latest\n${RUN_CMD}`} />
      </div>
      <pre className="!leading-[1.9]">
        <code>
          <span className="tok-dim">$ </span>
          <span className="tok-cmd">docker pull crowkis/crowkis:latest</span>
          {"\n"}
          <span className="tok-ok">✓ pulled</span>
          <span className="tok-dim"> · signed · linux/amd64 · linux/arm64</span>
          {"\n\n"}
          <span className="tok-dim">$ </span>
          <span className="tok-cmd">docker run -d -p 6379:6379 -p 6380:6380 \</span>
          {"\n    "}
          <span className="tok-cmd">-v crowkis-data:/data crowkis/crowkis</span>
          {"\n"}
          <span className="tok-ok">✓ crowkis up</span>
          <span className="tok-dim"> · RESP :6379 · dashboard :6380</span>
          {"\n\n"}
          <span className="tok-dim">$ </span>
          <span className="tok-cmd">curl 127.0.0.1:6380/health</span>
          {"\n"}
          <span className="tok-str">{`{ "status": "ok", "admin_auth": "enabled" }`}</span>
          {"\n"}
          <span className="tok-key">▮</span>
        </code>
      </pre>
    </div>
  );
}

function StepCard({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <TiltCard className="flex h-full flex-col p-6" max={5}>
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-ink bg-crow font-mono text-base font-bold text-stone-50 shadow-block-sm">
          {n}
        </span>
        <h3 className="font-display text-lg font-bold sm:text-xl">{title}</h3>
      </div>
      <div className="mt-4 flex-1 space-y-3">{children}</div>
    </TiltCard>
  );
}

export default function DockerPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-10 py-14 lg:grid-cols-[1fr_1.1fr] md:py-20">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md border-2 border-ink bg-paper-card px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider">
                Official image
              </span>
              <span className="rounded-md border border-ink-line bg-paper-card px-2.5 py-1 font-mono text-[11px] text-ink-soft">
                amd64 · arm64
              </span>
              <span className="rounded-md border-2 border-ink bg-crow px-2.5 py-1 font-mono text-[11px] font-bold text-stone-50">
                free · no license
              </span>
            </div>
            <h1 className="responsive-title mt-6">
              One image.
              <br />
              Every feature.
              <br />
              <span className="relative inline-block">
                Hardened.
                <span className="absolute -bottom-1 left-0 h-2 w-full bg-crow" aria-hidden />
              </span>
            </h1>
            <p className="responsive-subtitle mt-5 max-w-md">
              A single hardened Docker image with the whole engine compiled in. Pull it, run it, and
              free Community edition is live at full power — a license file flips it to Enterprise at
              boot.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#run" className="btn-primary">
                Get running
              </a>
              <Link href="/docs" className="btn-secondary">
                Read the quickstart
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <QuickstartTerminal />
          </Reveal>
        </div>
      </section>

      {/* ports */}
      <section className="section py-12 md:py-16">
        <p className="eyebrow">Three ports, three surfaces</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {PORTS.map(([port, proto, desc, color]) => (
            <TiltCard key={port} className="p-5" max={6}>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm" style={{ background: color }} aria-hidden />
                <p className="font-mono text-2xl font-bold">
                  :{port}
                  <span className="ml-2 text-sm font-medium text-crow">{proto}</span>
                </p>
              </div>
              <p className="mt-2 text-sm text-ink-soft">{desc}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* run + compose tabs */}
      <section id="run" className="section scroll-mt-24 pb-4">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">Step 1 · run it</p>
            <h2 className="responsive-title mt-3">Pick run or compose.</h2>
            <p className="responsive-subtitle mt-4">
              One <code className="inline">docker run</code> for a quick spin, or the hardened
              compose file for the real thing. Ports publish to localhost only — going public is an
              explicit choice, never a default you discover.
            </p>
            <div className="mt-5">
              <CommandCard command="docker pull crowkis/crowkis:latest" note="Docker Hub & GHCR · signed releases" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <CodeTabs
              tabs={[
                {
                  label: "docker run",
                  copyText: RUN_CMD,
                  content: <code className="tok-cmd">{RUN_CMD}</code>,
                },
                {
                  label: "docker-compose.yml",
                  copyText: COMPOSE_SNIPPET,
                  content: <code className="tok-cmd">{COMPOSE_SNIPPET}</code>,
                },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* remaining steps */}
      <section className="section py-12 md:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          <StepCard n="2" title="Verify it's healthy">
            <p className="text-sm leading-relaxed text-ink-soft">
              Ask the container itself — the health endpoint reports status and whether admin auth
              is active.
            </p>
            <CommandCard command="curl 127.0.0.1:6380/health" note='expect "admin_auth": "enabled"' />
          </StepCard>
          <StepCard n="3" title="Prove the auth boundary">
            <p className="text-sm leading-relaxed text-ink-soft">
              Don&apos;t trust it — test it. Unauthenticated management reads must bounce when auth
              is on.
            </p>
            <CommandCard command="curl -i 127.0.0.1:6380/api/metrics" note="rejected without a key" />
          </StepCard>
          <StepCard n="4" title="Talk to it">
            <p className="text-sm leading-relaxed text-ink-soft">
              The binary ships the REPL — or point any Redis client at 6379 and watch the dashboard.
            </p>
            <CommandCard command="docker exec -it crowkis crowkis cli" note="built-in REPL" />
          </StepCard>
        </div>
      </section>

      {/* hardening */}
      <section className="border-y-2 border-ink bg-roost py-16 text-stone-200 md:py-20">
        <div className="section">
          <Reveal>
            <p className="eyebrow">Hardened by default</p>
            <h2 className="responsive-title mt-4 max-w-2xl !text-stone-50">
              The compose file is the security checklist.
            </h2>
            <p className="mt-4 max-w-2xl text-stone-400">
              Everything below is the stock deployment shape. You harden it by not editing it.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-roost-line bg-roost-line sm:grid-cols-2 lg:grid-cols-4">
            {HARDENING.map(([what, why]) => (
              <div key={what} className="h-full bg-roost-card p-5">
                <p className="flex items-start gap-2 font-mono text-[13px] font-semibold text-crow">
                  <span className="text-stone-500">✓</span>
                  {what}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-stone-400">{why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* env reference */}
      <section className="section py-16 md:py-20">
        <Reveal>
          <p className="eyebrow">Environment reference</p>
          <h2 className="responsive-title mt-4">The knobs that matter.</h2>
          <p className="responsive-subtitle mt-4 max-w-2xl">
            None are required — the image boots with sensible defaults. Full reference in the{" "}
            <Link href="/docs/configuration" className="font-semibold text-crow underline underline-offset-2">
              configuration docs
            </Link>
            .
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card-block mt-8 overflow-hidden !p-0">
            <div className="table-scroll">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-ink bg-paper-deep font-display">
                    <th className="px-5 py-3.5 font-bold">Variable</th>
                    <th className="px-5 py-3.5 font-bold">Default</th>
                    <th className="px-5 py-3.5 font-bold">What it does</th>
                  </tr>
                </thead>
                <tbody>
                  {ENV_VARS.map(([name, def, desc]) => (
                    <tr key={name} className="border-b border-ink-line align-top last:border-0">
                      <td className="px-5 py-3 font-mono text-xs font-semibold">{name}</td>
                      <td className="px-5 py-3 font-mono text-xs text-ink-faint">{def}</td>
                      <td className="px-5 py-3 text-ink-soft">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="card-quiet mt-6 border-l-4 !border-l-crow p-5">
            <p className="text-sm text-ink-soft">
              <span className="font-semibold text-ink">Local experiments only:</span>{" "}
              <code className="inline">CROWKIS_ALLOW_UNAUTHENTICATED_ADMIN=1</code> disables the
              management auth gate. Never set it on anything with a public interface.
            </p>
          </div>
        </Reveal>
      </section>

      {/* day-2 + next */}
      <section className="section pb-16 md:pb-24">
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">Day-2 commands</h2>
            <div className="mt-5 space-y-3">
              <CommandCard
                command="docker pull crowkis/crowkis:latest && docker compose up -d"
                note="the entire upgrade path — binary swap, stable on-disk format, no migrations"
              />
              <CommandCard command="docker compose down" note="stop, keep data" />
              <CommandCard command="docker compose down -v" note="stop and remove the data volume" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-2xl font-bold">Where to next</h2>
            <div className="mt-5 grid gap-3">
              {[
                ["Quickstart", "First commands against a running instance.", "/docs"],
                ["Configuration", "Every environment variable, explained.", "/docs/configuration"],
                ["MCP for AI apps", "Let Claude Code and agents use the cache.", "/docs/mcp"],
                ["Pricing", "Community is free. Enterprise unlocks with a license file.", "/pricing"],
              ].map(([title, desc, href]) => (
                <Link key={href} href={href} className="card-quiet group p-5 transition-colors hover:border-ink">
                  <p className="font-display font-bold">
                    {title}{" "}
                    <span className="text-crow transition-transform group-hover:translate-x-0.5">→</span>
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">{desc}</p>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
