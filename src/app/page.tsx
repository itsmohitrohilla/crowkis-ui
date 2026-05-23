import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import {
  HeroSection,
  WhySection,
  HowItWorks,
  FeaturesSection,
  TrustSection,
  PersonaSection,
  SourcesSection,
} from "@/components/marketing-sections";

export default function Home() {
  return (
    <SiteShell>
      <HeroSection />
      <WhySection />
      <PersonaSection />
      <HowItWorks />
      <FeaturesSection />
      <TrustSection />
      <SourcesSection />
      <section className="section mt-12 pb-8 sm:mt-14 md:mt-16">
        <div className="glass flex flex-col items-start justify-between gap-4 p-4 sm:p-6 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold">Explore deeper Crowkis content</h3>
            <p className="mt-1 text-sm text-slate-300">Jump into docs, product surfaces, or the operator app preview.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/docs" className="touch-target rounded-full border border-glass-300 px-5 py-2 text-center text-sm font-semibold text-white">
              Open Docs Hub
            </Link>
            <Link href="/app/dashboard" className="touch-target rounded-full bg-brand-neon px-5 py-2 text-center text-sm font-semibold text-slate-950">
              Launch App Preview
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
