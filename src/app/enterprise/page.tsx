import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { TiltCard } from "@/components/ui/tilt-card";
import { HeroArt } from "@/components/marketing/hero-art";

export const metadata: Metadata = {
  title: "Enterprise",
  description:
    "Crowkis is free to run. Enterprise is the layer that turns the cache into leverage — unlimited scale, compliance you can pass an audit with, smart provider routing, and a human on call. No checkout, a conversation.",
};

const DEMO_MAILTO = "mailto:info.crowkis@gmail.com?subject=Crowkis%20Enterprise%20%E2%80%94%20let%27s%20talk";

const VALUE = [
  {
    n: "01",
    title: "It saves money first",
    body: "The repeated half of your LLM bill stops being billed — and Enterprise compounds it: the Provider Arbitrage Router sends each query to the cheapest model that still clears your quality bar, and per-key budgets stop runaway spend before the invoice does.",
  },
  {
    n: "02",
    title: "Then it frees your time",
    body: "Model upgrades stop cold-starting your cache. Per-team budgets stop being a monthly firefight. The Auto-Tuner keeps the cache sharp on its own. It becomes the part of the stack you stop thinking about — which is the whole point of infrastructure.",
  },
  {
    n: "03",
    title: "Then it de-risks you",
    body: "Compliance modes, SSO, a tamper-evident audit trail, and a privacy vault are the boxes security and legal need ticked before AI ships. Enterprise turns 'is it compliant?' into a config flag and an exportable report.",
  },
];

const FEATURES: [string, string][] = [
  ["Unlimited scale", "Tenant and entry ceilings removed — growth is a license, not a re-architecture."],
  ["Virtual API keys + budgets", "One key per app/team/customer, each with hard dollar and TPM/RPM walls."],
  ["Crowkis Replay", "Replay your real traffic through the cache and see exact hit rate and savings — on the call, before you commit."],
  ["Provider Arbitrage Router", "Route each query to the cheapest model that clears your quality bar for its intent."],
  ["Cross-Provider Cache Bridge", "Answers cached on one provider serve equivalent traffic on another — switch vendors without losing warm cache."],
  ["Compliance modes", "HIPAA · SOC2 · GDPR-EU · FedRAMP presets for retention, PII handling, and audit behaviour."],
  ["SSO / SAML / OIDC", "Your identity provider owns who can touch the control plane."],
  ["Tamper-evident audit + export", "sha256-chained audit log, attestation with a CI-friendly verdict, JSONL evidence export."],
  ["Auto-Tuner · Privacy Vault · Live Edit", "Self-optimizing thresholds, stricter handling for sensitive entries, and in-place correction of a cached answer — audited."],
  ["Priority support", "A human, fast — and a standing offer to get on a call."],
];

const COMPARISON: { group: string; rows: [string, string, string][] }[] = [
  {
    group: "Engine & intelligence",
    rows: [
      ["Full Rust engine, all 7 intelligence systems", "✓", "✓"],
      ["Multimodal (image + text) cache", "✓", "✓"],
      ["Reasoning patterns library · Auto-Tuner", "—", "✓"],
    ],
  },
  {
    group: "Scale & tenancy",
    rows: [
      ["Tenants", "up to 3", "unlimited"],
      ["Cache entries", "100K soft cap", "unlimited"],
      ["Virtual API keys · per-key budgets · rate limits", "—", "✓"],
    ],
  },
  {
    group: "Cost & routing",
    rows: [
      ["$-saved dashboard · budgets + circuit breaker", "✓", "✓"],
      ["Crowkis Replay on your own traffic", "—", "✓"],
      ["Provider Arbitrage Router · cross-provider bridge", "—", "✓"],
    ],
  },
  {
    group: "Security & compliance",
    rows: [
      ["Anti-poisoning, tenant isolation, PII scrubbing", "✓", "✓"],
      ["SSO / SAML / OIDC · persistent audit export", "—", "✓"],
      ["Compliance modes (HIPAA · SOC2 · GDPR-EU · FedRAMP)", "—", "✓"],
    ],
  },
  {
    group: "Support",
    rows: [
      ["Community channels", "✓", "✓"],
      ["Priority support with a human", "—", "✓"],
    ],
  },
];

const STEPS = [
  ["Run it free", "Pull the image and put Community edition in production. Full engine, no license, no sign-up. Most teams live here for a long time."],
  ["Hit a ceiling", "More than 3 tenants, an audit on the horizon, per-customer keys, multi-provider routing — the signals that you've outgrown free."],
  ["Book a call", "We run Crowkis Replay on a sample of your real traffic, show you the actual savings, and issue a signed license. No meter, no checkout — a conversation."],
];

export default function EnterprisePage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-10 py-14 md:grid-cols-[1.4fr_1fr] md:py-20">
          <div>
            <p className="eyebrow">Enterprise</p>
            <h1 className="responsive-title mt-4">
              Free to run. Enterprise when it{" "}
              <span className="relative inline-block">
                pays for itself
                <span className="absolute -bottom-1 left-0 h-2 w-full bg-crow" aria-hidden />
              </span>
              .
            </h1>
            <p className="responsive-subtitle mt-5 max-w-xl">
              Crowkis Community is genuinely free — the full engine, real production use. Enterprise
              is the layer that turns the cache into leverage: unlimited scale, compliance you can
              pass an audit with, routing that picks the cheapest model that still clears your bar,
              and a human on call. It&apos;s not a checkout — it&apos;s a conversation.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={DEMO_MAILTO} className="btn-primary">
                Book a call
              </a>
              <Link href="/docker" className="btn-secondary">
                Run it free first
              </Link>
            </div>
            <p className="mt-5 font-mono text-xs text-ink-faint">
              one signed image · a license file flips the tier at boot · nothing phones home
            </p>
          </div>
          <div className="hidden md:block">
            <HeroArt variant={0} />
          </div>
        </div>
      </section>

      {/* the value */}
      <section className="section py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Put it in your stack</p>
          <h2 className="responsive-title mt-4">It changes the economics of your AI.</h2>
          <p className="responsive-subtitle mt-4">
            The same cache that&apos;s free to start becomes leverage at scale. Three things happen,
            in order.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {VALUE.map((v) => (
            <TiltCard key={v.n} className="h-full p-7" max={6}>
              <p className="font-mono text-sm font-bold text-crow">{v.n}</p>
              <h3 className="mt-3 font-display text-xl font-bold leading-snug">{v.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{v.body}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* what enterprise unlocks */}
      <section className="border-y-2 border-ink bg-roost py-16 text-stone-200 md:py-20">
        <div className="section">
          <p className="eyebrow">What Enterprise unlocks</p>
          <h2 className="responsive-title mt-4 max-w-2xl !text-stone-50">
            The features that earn their keep.
          </h2>
          <p className="mt-4 max-w-2xl text-stone-400">
            Every one of these is built and in the binary today — the license file just turns it on.
          </p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-roost-line bg-roost-line sm:grid-cols-2">
            {FEATURES.map(([name, why]) => (
              <div key={name} className="h-full bg-roost-card p-5">
                <p className="flex items-start gap-2 font-display text-[15px] font-bold text-stone-100">
                  <span className="text-crow">→</span>
                  {name}
                </p>
                <p className="mt-2 pl-5 text-[13px] leading-relaxed text-stone-400">{why}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* comparison */}
      <section className="section py-16 md:py-20">
        <p className="eyebrow">Free vs Enterprise</p>
        <h2 className="responsive-title mt-4">Everything free includes, and where Enterprise begins.</h2>
        <div className="card-block mt-8 overflow-hidden !p-0">
          <div className="table-scroll">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b-2 border-ink bg-paper-deep font-display">
                  <th className="px-5 py-3.5 font-bold">Capability</th>
                  <th className="w-32 px-4 py-3.5 text-center font-bold">Free</th>
                  <th className="w-36 px-4 py-3.5 text-center font-bold text-crow">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((g) => (
                  <FragmentRows key={g.group} group={g.group} rows={g.rows} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-6 text-center font-mono text-xs text-ink-faint">
          Free is not a trial. Run it forever — Enterprise is for when you outgrow it.
        </p>
      </section>

      {/* how it works */}
      <section className="border-t-2 border-ink bg-paper-deep py-16 md:py-20">
        <div className="section">
          <p className="eyebrow">How you get there</p>
          <h2 className="responsive-title mt-4">No checkout. A conversation.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map(([title, body], i) => (
              <div key={title} className="card-block p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-crow font-mono text-base font-bold text-stone-50 shadow-block-sm">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-16 md:py-24">
        <div className="card-block flex flex-col items-center gap-5 p-10 text-center">
          <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight sm:text-4xl">
            Put Crowkis in the stack. Watch the bill — and your week — get lighter.
          </h2>
          <p className="max-w-lg text-sm text-ink-soft">
            We&apos;ll run your own traffic through Crowkis Replay on a 30-minute call and show you
            the savings before you spend anything.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={DEMO_MAILTO} className="btn-primary">
              Book the call
            </a>
            <Link href="/docker" className="btn-secondary">
              Or run it free now
            </Link>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-faint">info.crowkis@gmail.com</p>
        </div>
      </section>
    </SiteShell>
  );
}

function FragmentRows({ group, rows }: { group: string; rows: [string, string, string][] }) {
  return (
    <>
      <tr className="border-b border-ink-line bg-paper-deep/60">
        <td
          colSpan={3}
          className="px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint"
        >
          {group}
        </td>
      </tr>
      {rows.map(([cap, free, ent]) => (
        <tr key={cap} className="border-b border-ink-line last:border-0">
          <td className="px-5 py-2.5 text-ink-soft">{cap}</td>
          {[free, ent].map((cell, i) => (
            <td
              key={i}
              className={`px-4 py-2.5 text-center font-mono text-xs ${
                cell === "—" ? "text-ink-faint" : "font-semibold text-ink"
              }`}
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
