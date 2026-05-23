"use client";

import { motion } from "framer-motion";
import { HoverCard, Reveal } from "@/components/motion";
import { benchmarkNotes, proofBlocks } from "@/lib/content/benchmarks";
import { featurePillars, howItWorksDeep } from "@/lib/content/features";
import { heroNarrative, personaStrips, positioningClaims } from "@/lib/content/positioning";
import { securityDefaults } from "@/lib/content/security";

export function HeroSection() {
  return (
    <section className="section pt-10 sm:pt-12 md:pt-16">
      <Reveal>
        <div className="glass p-4 sm:p-6 md:p-12">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-brand-neon sm:text-sm">Claim-safe infrastructure messaging</p>
          <h1 className="max-w-4xl text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
            {heroNarrative.title}
          </h1>
          <p className="mt-5 max-w-2xl text-slate-300">{heroNarrative.body}</p>
          <p className="mt-3 text-xs text-slate-400">Source: {heroNarrative.source}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {[
              { label: "Protocol support", value: "RESP + gRPC + HTTP" },
              { label: "Built in", value: "Rust" },
              { label: "Positioning", value: "Safe reuse over naive hit" },
            ].map((item, idx) => (
              <motion.div key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.15 }}>
                <div className="rounded-xl border border-glass-200 bg-white/5 p-4">
                  <p className="text-xl font-semibold sm:text-2xl">{item.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function WhySection() {
  return (
    <section id="why" className="section mt-12 sm:mt-14 md:mt-16">
      <Reveal>
        <h2 className="text-2xl font-semibold sm:text-3xl">Why teams evaluate Crowkis</h2>
      </Reveal>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {positioningClaims.map((card, idx) => (
          <Reveal key={card.title} delay={idx * 0.08}>
            <HoverCard className="glass h-full p-4 sm:p-5 md:p-6">
              <h3 className="text-lg font-semibold text-brand-violet sm:text-xl">{card.title}</h3>
              <p className="mt-3 text-slate-300">{card.body}</p>
              <p className="mt-4 text-xs text-slate-400">{card.source}</p>
            </HoverCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section mt-12 sm:mt-14 md:mt-16">
      <Reveal>
        <h2 className="text-2xl font-semibold sm:text-3xl">Architecture-level flow</h2>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {howItWorksDeep.map((step, idx) => (
          <Reveal key={step} delay={idx * 0.08}>
            <div className="glass h-full p-4 sm:p-5">
              <p className="text-sm uppercase tracking-wide text-brand-neon">Step {idx + 1}</p>
              <p className="mt-3 text-sm text-slate-300">{step}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="section mt-12 sm:mt-14 md:mt-16">
      <Reveal>
        <h2 className="text-2xl font-semibold sm:text-3xl">Feature depth from current docs</h2>
      </Reveal>
      <div className="glass mt-6 overflow-hidden">
        {featurePillars.map((item) => (
          <div key={item.title} className="grid gap-3 border-b border-glass-200 p-4 last:border-b-0 sm:p-5 md:grid-cols-[220px_1fr]">
            <p className="font-medium text-brand-mint">{item.title}</p>
            <div>
              <p className="text-sm text-slate-300">{item.body}</p>
              <p className="mt-2 text-xs text-slate-400">{item.source}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section id="trust" className="section mt-12 sm:mt-14 md:mt-16">
      <Reveal>
        <div className="glass p-4 sm:p-6 md:p-7">
          <h2 className="text-2xl font-semibold sm:text-3xl">Trust, proof, and operating posture</h2>
          <p className="mt-3 max-w-3xl text-slate-300">
            Crowkis docs emphasize a claim-safe story: clear safety defaults, structured release gates, and explicit known
            boundaries during beta hardening.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {proofBlocks.map((block) => (
              <div key={block} className="rounded-xl border border-glass-200 bg-white/5 p-4 text-sm text-slate-200">
                {block}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {securityDefaults.map((item) => (
              <div key={item} className="rounded-xl border border-glass-200 bg-black/20 p-4 text-sm text-slate-300">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {benchmarkNotes.map((note) => (
              <div key={note.title} className="rounded-xl border border-glass-200 bg-black/20 p-4">
                <p className="font-medium text-brand-neon">{note.title}</p>
                <p className="mt-2 text-sm text-slate-300">{note.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export function PersonaSection() {
  return (
    <section className="section mt-12 sm:mt-14 md:mt-16">
      <Reveal>
        <h2 className="text-2xl font-semibold sm:text-3xl">Value by persona</h2>
      </Reveal>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {personaStrips.map((item) => (
          <div key={item.persona} className="glass p-5">
            <p className="text-sm uppercase tracking-wide text-brand-neon">{item.persona}</p>
            <p className="mt-3 text-sm text-slate-300">{item.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SourcesSection() {
  return (
    <section className="section mt-12 sm:mt-14 md:mt-16">
      <Reveal>
        <div className="glass p-6">
          <h3 className="text-xl font-semibold">Evidence Sources</h3>
          <ul className="mt-3 grid gap-2 text-sm text-slate-300 md:grid-cols-2">
            {[
              "crowkis/README.md",
              "crowkis/DEVELOPER_GUIDE.md",
              "crowkis/DOCKER_USER_GUIDE.md",
              "crowkis.docs/CROWKIS_USP_AND_FEATURE_POSITIONING.md",
              "crowkis.docs/CROWKIS_VECTOR_BENCHMARKING.md",
              "crowkis.docs/CROWKIS_DEEP_TEST_MATRIX.md",
            ].map((source) => (
              <li key={source} className="rounded border border-glass-200 bg-white/5 px-3 py-2">
                {source}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
