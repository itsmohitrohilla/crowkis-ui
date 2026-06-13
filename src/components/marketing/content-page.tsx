import { SiteShell } from "@/components/layout/site-shell";
import { Reveal } from "@/components/ui/motion";

type Section = {
  title: string;
  body: string;
  source?: string;
};

export function ContentPage({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <SiteShell>
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section py-12 md:py-16">
          <Reveal>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="responsive-title mt-3">{title}</h1>
            <p className="responsive-subtitle mt-4 max-w-3xl">{intro}</p>
          </Reveal>
        </div>
      </section>
      <section className="section py-10 md:py-14">
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.06} className="h-full">
              <article className="card-quiet h-full p-6 transition-colors hover:border-ink">
                <h2 className="font-display text-lg font-bold sm:text-xl">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>
                {item.source ? (
                  <p className="mt-4 font-mono text-xs text-ink-faint">Source: {item.source}</p>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
