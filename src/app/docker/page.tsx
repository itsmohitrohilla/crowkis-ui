import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/ui/motion";
import { CommandCard, CopyButton } from "@/components/ui/code-tabs";
import { HeroArt } from "@/components/marketing/hero-art";

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

const PORTS: [string, string, string][] = [
  ["6379", "RESP3", "Redis wire protocol — crowkis cli or any Redis client."],
  ["6380", "HTTP", "Dashboard + management REST API + /health."],
  ["6381", "gRPC", "h2c — Get / Set / GetStream / Stats / Invalidate."],
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
    tmpfs:
      - /tmp
    cap_drop: [ALL]
    security_opt:
      - no-new-privileges:true
    pids_limit: 512
    restart: unless-stopped

volumes:
  crowkis-data:`;

function StepHeading({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-crow font-mono text-sm font-bold text-stone-50">
        {n}
      </span>
      <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
    </div>
  );
}

export default function DockerPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-8 py-14 lg:grid-cols-[1.6fr_1fr] md:py-20">
          <Reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md border-2 border-ink bg-paper-card px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider">
                Official image
              </span>
              <span className="rounded-md border border-ink-line bg-paper-card px-2.5 py-1 font-mono text-[11px] text-ink-soft">
                linux/amd64 · linux/arm64
              </span>
              <span className="rounded-md border border-ink-line bg-paper-card px-2.5 py-1 font-mono text-[11px] text-ink-soft">
                alpine · non-root · binary-only
              </span>
              <span className="rounded-md border-2 border-ink bg-crow px-2.5 py-1 font-mono text-[11px] font-bold text-stone-50">
                free · no license needed
              </span>
            </div>
            <h1 className="responsive-title mt-6 max-w-3xl">
              One image. Every feature. Hardened before you ask.
            </h1>
            <p className="responsive-subtitle mt-4 max-w-2xl">
              Crowkis ships as a single Docker image with the entire engine compiled in. Pull it,
              run it, and the free Community edition is live at full power — a license file
              upgrades the same image to Enterprise at boot. There is no &quot;remember to
              secure it later&quot; step.
            </p>
            <div className="mt-8 max-w-2xl">
              <CommandCard
                command="docker pull crowkis/crowkis:latest"
                note="Docker Hub and GHCR · signed releases · then step 2 below"
              />
            </div>
          </Reveal>
          <div className="hidden lg:block">
            <HeroArt variant={0} />
          </div>
        </div>
      </section>

      {/* ports */}
      <section className="section py-14 md:py-16">
        <Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {PORTS.map(([port, proto, desc]) => (
              <div key={port} className="card-block p-5">
                <p className="font-mono text-2xl font-bold">
                  :{port}
                  <span className="ml-2 text-sm font-medium text-crow">{proto}</span>
                </p>
                <p className="mt-2 text-sm text-ink-soft">{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* steps */}
      <section className="section space-y-14 pb-16">
        <Reveal>
          <StepHeading n="1" title="Run it" />
          <p className="mt-4 max-w-2xl text-ink-soft">
            One command, persistent volume included. Ports publish to localhost only — exposing
            Crowkis to a network is a decision you make explicitly, not a default you discover.
          </p>
          <div className="code-panel mt-5 max-w-2xl">
            <div className="code-chrome justify-between">
              <span>shell</span>
              <CopyButton text={RUN_CMD} />
            </div>
            <pre>{RUN_CMD}</pre>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-ink-soft">
            Prefer Compose? The hardened file below is the recommended production shape — copy it
            as <code className="inline">docker-compose.yml</code> and{" "}
            <code className="inline">docker compose up -d</code>.
          </p>
          <div className="code-panel mt-4 max-w-2xl">
            <div className="code-chrome justify-between">
              <span>docker-compose.yml</span>
              <CopyButton text={COMPOSE_SNIPPET} />
            </div>
            <pre>{COMPOSE_SNIPPET}</pre>
          </div>
        </Reveal>

        <Reveal>
          <StepHeading n="2" title="Verify it's healthy" />
          <p className="mt-4 max-w-2xl text-ink-soft">
            Ask the container itself. The health endpoint reports service status and whether admin
            auth is active.
          </p>
          <div className="mt-5 grid max-w-4xl gap-4 lg:grid-cols-2">
            <CommandCard command="curl http://127.0.0.1:6380/health" note='expect JSON with "admin_auth": "enabled"' />
            <CommandCard command="docker logs -f crowkis" note="one structured log line per significant event" />
          </div>
        </Reveal>

        <Reveal>
          <StepHeading n="3" title="Prove the auth boundary" />
          <p className="mt-4 max-w-2xl text-ink-soft">
            Don&apos;t trust it — test it. Unauthenticated management reads must be rejected when
            auth is on:
          </p>
          <div className="mt-5 grid max-w-4xl gap-4 lg:grid-cols-2">
            <CommandCard command="curl -i http://127.0.0.1:6380/api/metrics" note="should be rejected without a key" />
            <CommandCard
              command='curl -H "x-crowkis-admin-key: $KEY" http://127.0.0.1:6380/api/metrics'
              note="authenticated read succeeds"
            />
          </div>
        </Reveal>

        <Reveal>
          <StepHeading n="4" title="Talk to it" />
          <p className="mt-4 max-w-2xl text-ink-soft">
            The binary inside the container ships the interactive REPL — or point any Redis client
            at port 6379.
          </p>
          <div className="mt-5 grid max-w-4xl gap-4 lg:grid-cols-2">
            <CommandCard command="docker exec -it crowkis crowkis cli" note="built-in REPL against the running server" />
            <CommandCard
              command='CSET "hello" "world" EX 3600 MODEL gpt-4o TENANT demo'
              note="then CGET a paraphrase and watch the dashboard"
            />
          </div>
        </Reveal>
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
            {HARDENING.map(([what, why], i) => (
              <Reveal key={what} delay={(i % 4) * 0.05} className="h-full">
                <div className="h-full bg-roost-card p-5">
                  <p className="font-mono text-[13px] font-semibold text-crow">{what}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-stone-400">{why}</p>
                </div>
              </Reveal>
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
                    {title} <span className="text-crow transition-transform group-hover:translate-x-0.5">→</span>
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
