import { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Crowkis positioning, integrations, and deployment expectations.",
};

const faqs = [
  {
    q: "Is Crowkis just a Redis clone?",
    a: "No. Docs position Crowkis as a Redis-compatible cache layer with semantic, structural, safety, and migration intelligence.",
  },
  {
    q: "Does Crowkis replace LLM providers?",
    a: "No. It sits between your app and provider path to decide safe reuse versus recomputation/fallback.",
  },
  {
    q: "Can I use it with SDKs today?",
    a: "Python and Node SDK surfaces are documented, alongside protocol-level options (RESP, HTTP management, gRPC).",
  },
  {
    q: "Is every enterprise feature fully production complete?",
    a: "Messaging should remain claim-safe: current controls are substantial, but roadmap and hardening phases are explicitly documented.",
  },
];

export default function FaqPage() {
  return (
    <SiteShell>
      <section className="section pt-10 sm:pt-12 md:pt-14">
        <Reveal>
          <h1 className="responsive-title font-semibold">Frequently asked questions</h1>
        </Reveal>
        <div className="mt-8 space-y-4">
          {faqs.map((item) => (
            <Reveal key={item.q}>
              <div className="glass p-4 sm:p-5 md:p-6">
                <h2 className="text-lg font-semibold text-brand-violet sm:text-xl">{item.q}</h2>
                <p className="mt-3 text-sm text-slate-300">{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
