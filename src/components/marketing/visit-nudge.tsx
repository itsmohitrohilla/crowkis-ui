"use client";

import { useEffect, useRef, useState } from "react";
import { FlyingSprite } from "@/components/crow/crow-shooter";
import { DemoLink } from "@/components/marketing/demo-link";

const DELAY_MS = 15_000;
type Kind = "arcade" | "demo";

/** One centred prompt per browser session, a while after the visitor lands.
 *  Visits alternate between the two prompts; once shown it stays away until
 *  they come back in a new session. */
export function VisitNudge({ onPlay }: { onPlay: () => void }) {
  const [kind, setKind] = useState<Kind | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let timer: number | undefined;
    try {
      if (sessionStorage.getItem("crowkis-nudge") === "shown") return;
      // the delay counts from landing, not from each page navigation
      const start = Number(sessionStorage.getItem("crowkis-nudge-start")) || Date.now();
      sessionStorage.setItem("crowkis-nudge-start", String(start));
      timer = window.setTimeout(() => {
        const next: Kind = localStorage.getItem("crowkis-nudge-last") === "demo" ? "arcade" : "demo";
        localStorage.setItem("crowkis-nudge-last", next);
        sessionStorage.setItem("crowkis-nudge", "shown");
        setKind(next);
      }, Math.max(0, start + DELAY_MS - Date.now()));
    } catch {
      // storage blocked: skip the prompt rather than risk showing it repeatedly
    }
    return () => window.clearTimeout(timer);
  }, []);

  // native modal dialog: focus trap, Esc to close and the ::backdrop come for free
  useEffect(() => {
    if (kind) ref.current?.showModal();
  }, [kind]);

  if (!kind) return null;

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      onClose={() => setKind(null)}
      onClick={(e) => {
        if (e.target === ref.current) close(); // click on the blurred backdrop
      }}
      aria-label={kind === "arcade" ? "Play the Arcade" : "Book a demo"}
      className={`install-fade m-auto max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] overflow-y-auto rounded-xl border-2 border-ink bg-paper-card p-0 text-ink shadow-block backdrop:bg-black/50 backdrop:backdrop-blur-sm ${
        kind === "arcade" ? "max-w-md" : "max-w-2xl"
      }`}
    >
      <button
        type="button"
        onClick={close}
        aria-label="Close"
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-paper-card text-lg leading-none text-ink shadow-block-sm transition hover:-translate-y-0.5"
      >
        ×
      </button>
      {kind === "arcade" ? (
        <ArcadePrompt
          onPlay={() => {
            close();
            onPlay();
          }}
          onClose={close}
        />
      ) : (
        <DemoPrompt onClose={close} />
      )}
    </dialog>
  );
}

/* ------------------------------ Arcade prompt ----------------------------- */

// [top %, start left %, travel from px, travel to px, seconds, delay s, golden]
const FLOCK: [number, number, number, number, number, number, boolean][] = [
  [14, 12, -130, 430, 6.5, 0, false],
  [38, 46, -290, 290, 8, 1.2, false],
  [24, 70, -400, 190, 5.2, 2.6, true],
  [52, 28, -210, 380, 9.5, 0.6, false],
];

function ArcadePrompt({ onPlay, onClose }: { onPlay: () => void; onClose: () => void }) {
  return (
    <>
      <style>{`
        @keyframes nudge-fly { from { transform: translateX(var(--from)); } to { transform: translateX(var(--to)); } }
        @keyframes nudge-flap { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        @keyframes nudge-aim { 0% { transform: translate(0, 0); } 35% { transform: translate(120px, -34px); } 70% { transform: translate(-70px, 22px); } 100% { transform: translate(0, 0); } }
      `}</style>
      {/* a miniature of the game, playing by itself */}
      <div className="relative h-52 overflow-hidden border-b-2 border-ink bg-gradient-to-b from-sky-300 via-sky-100 to-amber-50" aria-hidden>
        <div className="absolute right-10 top-6 h-10 w-10 rounded-full border-2 border-ink bg-amber-300" />
        <div className="cloud-drift absolute left-36 top-12 h-4 w-20 rounded-full border-2 border-ink bg-white/80" />
        <div className="cloud-drift absolute right-24 top-20 h-3 w-14 rounded-full border-2 border-ink bg-white/80" />
        {FLOCK.map(([top, left, from, to, secs, delay, golden], i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${top}%`,
              left: `${left}%`,
              ["--from" as string]: `${from}px`,
              ["--to" as string]: `${to}px`,
              animation: `nudge-fly ${secs}s linear ${delay}s infinite`,
            }}
          >
            <div className="relative">
              <div style={{ animation: "nudge-flap 0.36s linear infinite" }}>
                <FlyingSprite frame={0} facing={1} golden={golden} />
              </div>
              <div className="absolute inset-0" style={{ animation: "nudge-flap 0.36s linear -0.18s infinite" }}>
                <FlyingSprite frame={1} facing={1} golden={golden} />
              </div>
            </div>
          </div>
        ))}
        {/* crosshair */}
        <svg
          viewBox="0 0 40 40"
          className="absolute left-[42%] top-[44%] h-10 w-10 text-crow"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          style={{ animation: "nudge-aim 5s ease-in-out infinite" }}
        >
          <circle cx="20" cy="20" r="12" />
          <path d="M20 2v10M20 28v10M2 20h10M28 20h10" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 h-5 border-t-2 border-ink bg-[#6f9e5c]" />
        <span className="absolute left-3 top-3 rounded-md border-2 border-ink bg-paper-card px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink">
          Arcade · 60s
        </span>
      </div>
      <div className="p-6 sm:p-7">
        <p className="eyebrow">A group of crows is called a murder</p>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight">Shoot the murder.</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Crows fly across the screen, you click them out of the sky, combos stack. One minute, one
          high score.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onPlay} className="btn-primary">
            <span aria-hidden>▸</span> Play now
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">
            Not now
          </button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------- Demo prompt ------------------------------ */

const DEMO_STEPS = [
  "Bring a sample of your real traffic.",
  "We replay it through Crowkis on the call.",
  "You see the savings before you commit.",
];

function DemoPrompt({ onClose }: { onClose: () => void }) {
  return (
    <div className="grid sm:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col justify-between gap-6 border-b-2 border-ink bg-roost p-6 text-stone-50 sm:border-b-0 sm:border-r-2 sm:p-7">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-stone-400">
          Live demo
        </p>
        <p className="font-display font-bold leading-none">
          <span className="text-7xl tracking-tight">30</span>
          <span className="ml-2 text-xl text-crow">min</span>
        </p>
        <p className="font-mono text-[11px] leading-relaxed text-stone-400">
          Video call with the team.
          <br />
          No commitment.
        </p>
      </div>
      <div className="p-6 sm:p-7">
        <p className="eyebrow">Book a demo</p>
        <h2 className="mt-2 pr-8 font-display text-2xl font-bold leading-tight">
          See it on your own traffic.
        </h2>
        <ol className="mt-4 space-y-2.5">
          {DEMO_STEPS.map((step, i) => (
            <li key={step} className="flex items-start gap-3 text-sm text-ink-soft">
              <span className="mt-0.5 font-mono text-xs font-bold text-crow">0{i + 1}</span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <DemoLink where="popup" onClick={onClose} className="btn-primary">
            Pick a time <span aria-hidden>→</span>
          </DemoLink>
          <button type="button" onClick={onClose} className="btn-ghost">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
