import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/ui/motion";
import { CommandCard } from "@/components/ui/code-tabs";

export const metadata: Metadata = {
  title: "Enterprise & editions",
  description:
    "Crowkis editions: Community free forever, Enterprise by conversation. One image, license-gated, no phone-home, no usage metering.",
};

const DEMO_MAILTO = "mailto:info.crowkis@gmail.com?subject=Crowkis%20demo%20request";

const TIERS = [
  {
    name: "Community",
    price: "Free",
    cadence: "forever · no license file · no sign-up",
    plain: "Run the real thing in production at small scale, for nothing, with no strings.",
    points: [
      "All 7 differentiators: semantic + structural matching, anti-poisoning, adaptive thresholds, reasoning reuse, smart eviction, confidence scoring, freshness control",
      "Up to 3 tenants · 100,000 cache entries (soft cap)",
      "Local dashboard with live verdict feed",
      "Prometheus /metrics + OpenTelemetry",
      "Python SDK, Node SDK, crowkis cli, MCP server",
      "RESP3 · gRPC · REST — full protocol surface",
      "Works fully offline and air-gapped",
    ],
    cta: ["Pull the image — it's yours", "/docker"],
    featured: false,
  },
  {
    name: "Enterprise",
    price: "Let's talk",
    cadence: "flat per cluster · annual · priced on a call, not a meter",
    plain:
      "Everything Crowkis can do, ceilings removed, compliance included — and a human who picks up the phone.",
    points: [
      "Everything in Community, unlimited tenants and entries",
      "Virtual API keys — per-key budgets with hard TPM / RPM limits",
      "Crowkis Replay — we run your own traffic through the cache on the demo call and show your real savings first",
      "Provider Arbitrage Router — cheapest model that clears your quality bar",
      "Cross-Provider Cache Bridge — switch vendors without losing warm cache",
      "Compliance modes: HIPAA · SOC2 · GDPR-EU · FedRAMP",
      "SSO / SAML / OIDC · persistent audit log with export",
      "Prompt management, agent conversation + tool-call caches",
      "Auto-Tuner, Privacy Vault, Live Edit",
      "Priority support — a human, fast",
    ],
    cta: ["Schedule a call", DEMO_MAILTO],
    featured: true,
  },
];

const COMPARISON: { group: string; rows: [string, string, string][] }[] = [
  {
    group: "Engine & intelligence",
    rows: [
      ["Full Rust engine — LSM store, HNSW index, WAL durability", "✓", "✓"],
      ["All 7 intelligence systems", "✓", "✓"],
      ["Multimodal (image + text) cache", "✓", "✓"],
      ["Reasoning patterns library", "—", "✓"],
      ["Auto-Tuner (thresholds, eviction)", "—", "✓"],
    ],
  },
  {
    group: "Scale & tenancy",
    rows: [
      ["Tenants", "up to 3", "unlimited"],
      ["Cache entries", "100K soft cap", "unlimited"],
      ["Virtual API keys + per-key budgets", "—", "✓"],
      ["TPM / RPM rate limits per key", "—", "✓"],
    ],
  },
  {
    group: "Operations & integrations",
    rows: [
      ["Dashboard + live verdict feed", "✓", "✓"],
      ["Prometheus + OpenTelemetry", "✓", "✓"],
      ["Crowkis Replay on your own traffic", "—", "✓"],
      ["Slack integrations & alerts", "—", "✓"],
      ["Provider Arbitrage Router", "—", "✓"],
      ["Cross-Provider Cache Bridge", "—", "✓"],
      ["Prompt management & versioning", "—", "✓"],
      ["Agent conversation + tool-call caches", "—", "✓"],
    ],
  },
  {
    group: "Security & compliance",
    rows: [
      ["Anti-poisoning pipeline + trust ledger", "✓", "✓"],
      ["Tenant isolation + PII scrubbing", "✓", "✓"],
      ["SSO / SAML / OIDC", "—", "✓"],
      ["Compliance modes (HIPAA · SOC2 · GDPR-EU · FedRAMP)", "—", "✓"],
      ["Persistent audit log + export", "—", "✓"],
      ["Privacy Vault", "—", "✓"],
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

export default function PricingPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section py-14 text-center md:py-18">
          <Reveal>
            <p className="eyebrow">Editions &amp; Enterprise</p>
            <h1 className="responsive-title mx-auto mt-4 max-w-3xl">
              Free for everyone. One call for everything else.
            </h1>
            <p className="responsive-subtitle mx-auto mt-4 max-w-2xl">
              One Docker image carries every feature; a signed license file decides what unlocks at
              boot. No usage-based billing, no per-seat math, no phone-home — the license check is
              offline Ed25519, the same model HashiCorp and Redis Enterprise proved.
            </p>
          </Reveal>
        </div>
      </section>

      {/* tier cards */}
      <section className="section py-12 md:py-16">
        <div className="mx-auto grid max-w-4xl items-stretch gap-5 md:grid-cols-2">
          {TIERS.map((tier) => (
            <Reveal key={tier.name} className="h-full">
              <article
                className={`flex h-full flex-col p-6 sm:p-7 ${
                  tier.featured ? "card-block !shadow-block-red" : "card-block"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold">{tier.name}</h2>
                  {tier.featured ? (
                    <span className="rounded-md border-2 border-ink bg-crow px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-50">
                      call only
                    </span>
                  ) : (
                    <span className="rounded-md border border-ink-line bg-paper-deep px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                      no license needed
                    </span>
                  )}
                </div>
                <p className="mt-5 font-display text-5xl font-bold tracking-tight">{tier.price}</p>
                <p className="mt-1.5 font-mono text-xs text-ink-faint">{tier.cadence}</p>
                <p className="mt-4 rounded-lg border border-ink-line bg-paper-deep p-3 text-[13px] leading-relaxed text-ink-soft">
                  <span className="font-semibold text-ink">In plain words: </span>
                  {tier.plain}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-[13px] leading-relaxed text-ink-soft">
                  {tier.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 font-mono text-crow">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.cta[1]}
                  className={`mt-7 ${tier.featured ? "btn-primary" : "btn-secondary"} w-full`}
                >
                  {tier.cta[0]}
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-6 text-center font-mono text-xs text-ink-faint">
            A cluster = one Crowkis deployment, however many cores you give it. Renewal is a new
            license file — replace it, no downtime.
          </p>
        </Reveal>
      </section>

      {/* supply-chain pitch */}
      <section className="border-y-2 border-ink bg-roost py-14 text-stone-200 md:py-18">
        <div className="section grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="eyebrow">Why security teams sign off</p>
            <h2 className="responsive-title mt-4 !text-stone-50">
              No Python. No PyPI. No supply chain to compromise.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-stone-400">
              In March 2026 a popular Python-based LLM gateway was compromised through its package
              supply chain — 95 million monthly downloads exposed, national cyber alerts issued.
              Crowkis is a single closed-source Rust binary with signed releases. The class of
              attack that hit the Python ecosystem cannot hit this architecture by construction.
            </p>
            <p className="mt-4 max-w-xl rounded-lg border border-roost-line bg-roost-card p-4 text-sm leading-relaxed text-stone-400">
              <span className="font-semibold text-stone-200">In plain words:</span> there&apos;s no
              pile of third-party packages inside Crowkis for an attacker to poison. You deploy one
              signed file. It never calls home. Your security team can verify that in an afternoon.
            </p>
          </Reveal>
          <Reveal>
            <div className="space-y-3">
              <CommandCard command="docker pull crowkis/crowkis:latest" note="signed image · amd64 + arm64" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["0 deps", "in the runtime image — one binary"],
                  ["0 calls home", "license check is offline Ed25519"],
                  ["100% offline", "works air-gapped"],
                  ["1 file", "to security-review, not thousands"],
                ].map(([big, small]) => (
                  <div key={big} className="rounded-xl border border-roost-line bg-roost-card p-4">
                    <p className="font-display text-xl font-bold text-stone-50">{big}</p>
                    <p className="mt-1 text-xs text-stone-500">{small}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* comparison table */}
      <section className="section py-14 md:py-18">
        <Reveal>
          <p className="eyebrow">The full comparison</p>
          <h2 className="responsive-title mt-4">Every line, both tiers.</h2>
        </Reveal>
        <Reveal>
          <div className="card-block mt-8 overflow-hidden !p-0">
            <div className="table-scroll">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-ink bg-paper-deep font-display">
                    <th className="px-5 py-3.5 font-bold">Capability</th>
                    <th className="w-36 px-4 py-3.5 text-center font-bold">Community</th>
                    <th className="w-36 px-4 py-3.5 text-center font-bold text-crow">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((group) => (
                    <React.Fragment key={group.group}>
                      <tr className="border-b border-ink-line bg-paper-deep/60">
                        <td
                          colSpan={3}
                          className="px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint"
                        >
                          {group.group}
                        </td>
                      </tr>
                      {group.rows.map(([cap, c, e]) => (
                        <tr key={cap} className="border-b border-ink-line last:border-0">
                          <td className="px-5 py-2.5 text-ink-soft">{cap}</td>
                          {[c, e].map((cell, i) => (
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
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>

      {/* pricing FAQ + demo CTA */}
      <section className="section pb-16 md:pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-bold">Pricing questions, answered straight</h2>
            <div className="mt-5 space-y-4">
              {[
                [
                  "Why is Enterprise priced on a call?",
                  "Because the right number depends on your cluster count, compliance needs, and traffic — not on a pricing-page grid. Flat per cluster, annual, settled in one conversation. No meters, ever.",
                ],
                [
                  "What exactly is a cluster?",
                  "One running Crowkis deployment. Vertical scale is free — give it more cores and RAM, same license. You only license another cluster when you run another cluster.",
                ],
                [
                  "How does the license work?",
                  "We email you a signed JSON file. You mount it at /etc/crowkis/license.json and restart. The signature is verified offline — air-gapped deployments work fine.",
                ],
                [
                  "What happens when a license expires?",
                  "A 14-day grace period with everything still working and loud warnings — then it degrades to Community. Your data is never held hostage.",
                ],
                [
                  "Is Community really enough for production?",
                  "Yes, deliberately. If you're under 3 tenants and 100K entries, run it forever for free. We'd rather you grow into a call than resent a paywall.",
                ],
              ].map(([q, a]) => (
                <div key={q} className="card-quiet p-5">
                  <p className="font-display font-bold">{q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="card-block flex h-full flex-col justify-center p-8 text-center">
              <p className="eyebrow">Talk to a human</p>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight">
                See your own traffic through Crowkis.
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
                A 30-minute call: we run Crowkis Replay against a sample of your real queries and
                show you the hit rate and dollar savings before you spend anything.
              </p>
              <div className="mt-7 flex flex-col gap-3">
                <a href={DEMO_MAILTO} className="btn-primary">
                  Schedule a demo call
                </a>
                <a
                  href="mailto:info.crowkis@gmail.com?subject=Crowkis%20pricing%20question"
                  className="btn-secondary"
                >
                  Ask a pricing question
                </a>
              </div>
              <p className="mt-5 font-mono text-xs text-ink-faint">info.crowkis@gmail.com</p>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
