import { SiteShell } from "@/components/site-shell";
import { Reveal } from "@/components/motion";

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
      <section className="section pt-10 sm:pt-12 md:pt-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.18em] text-brand-neon sm:text-sm">{eyebrow}</p>
          <h1 className="responsive-title mt-3 font-semibold">{title}</h1>
          <p className="responsive-subtitle mt-4 max-w-3xl">{intro}</p>
        </Reveal>
        <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2">
          {sections.map((item) => (
            <Reveal key={item.title}>
              <article className="glass h-full p-4 sm:p-5 md:p-6">
                <h2 className="text-lg font-semibold text-brand-violet sm:text-xl">{item.title}</h2>
                <p className="mt-3 text-sm text-slate-300">{item.body}</p>
                {item.source ? <p className="mt-4 text-xs text-slate-400">Source: {item.source}</p> : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
