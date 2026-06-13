"use client";

import { CrowBot } from "@/components/crow/crow-bot";

/**
 * Inner-page hero mascot: the CrowBot floating over a soft gradient halo, with
 * a per-page accent colour so every page gets its own version of the little
 * robot. `variant` picks the accent.
 */

const ACCENTS = ["#d62221", "#8b5cf6", "#f59e0b", "#14b8a6", "#3b82f6", "#22c55e"];
const HALOS = [
  "radial-gradient(circle, rgba(214,34,33,0.26), rgba(214,34,33,0.10), transparent 70%)",
  "radial-gradient(circle, rgba(139,92,246,0.26), rgba(214,34,33,0.10), transparent 70%)",
  "radial-gradient(circle, rgba(245,158,11,0.26), rgba(214,34,33,0.10), transparent 70%)",
  "radial-gradient(circle, rgba(20,184,166,0.24), rgba(59,130,246,0.10), transparent 70%)",
  "radial-gradient(circle, rgba(59,130,246,0.26), rgba(139,92,246,0.10), transparent 70%)",
  "radial-gradient(circle, rgba(34,197,94,0.24), rgba(20,184,166,0.10), transparent 70%)",
];

export function HeroArt({ variant = 0, className = "" }: { variant?: number; className?: string }) {
  const i = ((variant % ACCENTS.length) + ACCENTS.length) % ACCENTS.length;
  return (
    <div
      className={`relative mx-auto flex h-56 w-full max-w-[280px] items-center justify-center ${className}`}
    >
      <div
        className="pointer-events-none absolute h-52 w-52 rounded-full blur-2xl"
        style={{ background: HALOS[i] }}
        aria-hidden
      />
      <CrowBot size={210} accent={ACCENTS[i]} />
    </div>
  );
}
