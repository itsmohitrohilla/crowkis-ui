"use client";

import { Logo3D } from "@/components/crow/logo-3d";

/**
 * A compact hero ornament for inner-page headers: the floating 3D Crowkis cube
 * with a soft gradient halo and a little pixel crow perched on it. `variant`
 * nudges the crow's pose / halo tint so each page reads slightly differently.
 */

const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";

function PixelCrowMark({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 12"
      className={className}
      shapeRendering="crispEdges"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      <rect x="9" y="0" width="4" height="4" fill={INK} />
      <rect x="13" y="1" width="2" height="1" fill={INK} />
      <rect x="3" y="3" width="8" height="5" fill={INK} />
      <rect x="8" y="2" width="2" height="1" fill={INK} />
      <rect x="0" y="3" width="3" height="2" fill={INK} />
      <rect x="4" y="4" width="5" height="3" fill={WING} />
      <rect x="6" y="8" width="1" height="2" fill={INK} />
      <rect x="9" y="8" width="1" height="2" fill={INK} />
      <rect x="5" y="10" width="2" height="1" fill={INK} />
      <rect x="8" y="10" width="2" height="1" fill={INK} />
      <rect x="11" y="1" width="1" height="1" fill={EYE} />
    </svg>
  );
}

const HALOS = [
  "radial-gradient(circle, rgba(214,34,33,0.24), rgba(139,92,246,0.16), transparent 70%)",
  "radial-gradient(circle, rgba(245,158,11,0.22), rgba(214,34,33,0.16), transparent 70%)",
  "radial-gradient(circle, rgba(20,184,166,0.20), rgba(59,130,246,0.16), transparent 70%)",
];

export function HeroArt({ variant = 0, className = "" }: { variant?: number; className?: string }) {
  const v = ((variant % 3) + 3) % 3;
  const crowPos =
    v === 0 ? "-top-1 right-4" : v === 1 ? "top-1 left-3" : "-top-2 left-1/2 -translate-x-1/2";
  return (
    <div className={`relative mx-auto flex h-44 w-full max-w-[260px] items-center justify-center sm:h-52 ${className}`}>
      <div
        className="pointer-events-none absolute h-44 w-44 rounded-full blur-2xl"
        style={{ background: HALOS[v] }}
        aria-hidden
      />
      <Logo3D size={132} />
      <PixelCrowMark className="absolute h-7 w-auto" flip={v === 1} />
      {/* the crow position is applied via a wrapper so it layers above the cube */}
      <span className={`pointer-events-none absolute ${crowPos}`} aria-hidden>
        <PixelCrowMark className="h-7 w-auto" flip={v === 1} />
      </span>
    </div>
  );
}
