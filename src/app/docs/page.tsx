import Link from "next/link";
import { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { SiteShell } from "@/components/site-shell";
import { docsSections } from "@/lib/content/docsIndex";

export const metadata: Metadata = {
  title: "Docs",
  description: "Crowkis docs hub covering getting started, APIs, SDKs, deployment, and testing gates.",
};

export default function DocsPage() {
  return (
    <SiteShell>
      <section className="section pt-10 sm:pt-12 md:pt-14">
        <Reveal>
          <p className="text-sm uppercase tracking-[0.18em] text-brand-neon">Docs Hub</p>
          <h1 className="responsive-title mt-3 font-semibold">Crowkis documentation map</h1>
          <p className="mt-4 max-w-3xl text-slate-300">
            A high-level docs hub assembled from Crowkis source documentation to support onboarding, operations, and decision making.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {docsSections.map((section) => (
            <Reveal key={section.title}>
              <article className="glass h-full p-4 sm:p-5 md:p-6">
                <h2 className="text-lg font-semibold text-brand-violet sm:text-xl">{section.title}</h2>
                <ul className="mt-3 space-y-2 text-sm text-slate-300">
                  {section.items.map((item) => (
                    <li key={item} className="rounded border border-glass-200 bg-white/5 px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-slate-400">Source: {section.source}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/product" className="glass touch-target p-5 hover:border-brand-neon">
            <p className="font-medium">Read next: Product</p>
            <p className="mt-2 text-sm text-slate-300">Capability-level overview.</p>
          </Link>
          <Link href="/security" className="glass touch-target p-5 hover:border-brand-neon">
            <p className="font-medium">Read next: Security</p>
            <p className="mt-2 text-sm text-slate-300">Controls and default posture.</p>
          </Link>
          <Link href="/benchmarks" className="glass touch-target p-5 hover:border-brand-neon">
            <p className="font-medium">Read next: Benchmarks</p>
            <p className="mt-2 text-sm text-slate-300">Methodology and proof framing.</p>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
