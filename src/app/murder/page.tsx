import { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { CrowGarden } from "@/components/crow/crow-garden";
import { CrowGameLauncher } from "@/components/crow/crow-game-launcher";

export const metadata: Metadata = {
  title: "The Murder — brain-rot crow game",
  description:
    "A group of crows is called a murder. This is ours: a full-screen brain-rot game where you shoot crows out of the sky for score, plus a pixel garden and the Crowkis monument.",
};

export default function MurderPage() {
  return (
    <SiteShell>
      {/* hero — lead with the game */}
      <section className="border-b-2 border-ink bg-roost text-paper-card">
        <div className="section grid items-center gap-8 py-12 md:grid-cols-[1.3fr_1fr] md:py-16">
          <div>
            <p className="eyebrow">A group of crows is called a murder</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
              Shoot the murder.
              <span className="text-crow">_</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-stone-400 sm:text-lg">
              Certified brain rot. Crows fly across the screen, you click them out of the sky,
              combos stack, the clock runs. Thirty seconds. One high score. No crows are harmed —
              they respawn out of spite.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <CrowGameLauncher
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-paper-card bg-crow px-7 py-3 text-base font-semibold text-paper-card shadow-block-sm transition-transform hover:-translate-y-0.5"
                label="▶ Play full-screen"
              />
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-stone-600 px-7 py-3 text-base font-semibold text-stone-200 transition hover:border-stone-300"
              >
                Back to work
              </Link>
            </div>
            <p className="mt-5 font-mono text-xs text-stone-500">
              red crows = 5× · chain kills for a combo multiplier · esc to leave
            </p>
          </div>
          <div className="hidden justify-center md:flex">
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <svg key={i} viewBox="0 0 16 12" className="h-10 w-12" shapeRendering="crispEdges" aria-hidden>
                  <rect x="10" y="0" width="4" height="4" fill={i === 4 ? "#d62221" : "#f3eee5"} />
                  <rect x="14" y="1" width="2" height="1" fill={i === 4 ? "#d62221" : "#f3eee5"} />
                  <rect x="9" y="3" width="2" height="2" fill={i === 4 ? "#d62221" : "#f3eee5"} />
                  <rect x="3" y="4" width="8" height="4" fill={i === 4 ? "#d62221" : "#f3eee5"} />
                  <rect x="0" y="5" width="3" height="2" fill={i === 4 ? "#d62221" : "#f3eee5"} />
                  <rect x="4" y="0" width="5" height="3" fill="#37322a" />
                  <rect x="12" y="1" width="1" height="1" fill="#d62221" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* the chill garden below */}
      <section className="section py-10 md:py-14">
        <p className="eyebrow">Or just watch them potter about</p>
        <h2 className="mt-2 font-display text-2xl font-bold">The garden</h2>
        <p className="mt-2 max-w-xl text-sm text-ink-soft">
          A calmer murder. Click a crow to make it caw; the flock scatters. The monument is the
          Crowkis cube. Nothing here is productive, and that&apos;s the point.
        </p>
        <div className="mt-6">
          <CrowGarden />
        </div>
        <div className="card-quiet mt-8 grid gap-4 p-6 sm:grid-cols-3">
          {[
            ["Crows remember faces", "Corvids recognize individual humans for years — hold a grudge, too. Our cache remembers answers the same way: with receipts."],
            ["Crows use tools", "They bend wire into hooks and drop nuts on crosswalks for cars to crack. Ours uses an LSM tree and an HNSW index."],
            ["Crows share knowledge", "A murder teaches its young which faces to trust. That's a distributed trust ledger, if you squint."],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="font-display font-bold">{title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
