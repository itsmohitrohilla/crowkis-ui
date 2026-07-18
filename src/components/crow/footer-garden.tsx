"use client";

import { useEffect, useRef } from "react";

/**
 * The footer forest: a green pixel garden running under the footer links, with
 * its OWN slow day → afternoon → evening → night sky cycle, scoped entirely to
 * this ~180px strip via CSS variables on a rAF clock, so nothing else on the
 * page is affected. Fruit trees, bushes, grass, blinking perched crows, a
 * drifting flyer, and the copyright living on the grass.
 */

const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";
const LEAF = "#7fae6a";
const LEAF_DARK = "#5d8a4e";
const LEAF_LIGHT = "#a3c98b";
const FRUIT = "#d62221";

/* slow sky cycle, contained to the footer */
const CYCLE_MS = 80000;
const START_T = 0.1;

type Stop = { at: number; top: string; bottom: string };
const STOPS: Stop[] = [
  { at: 0.0, top: "#cfe2ec", bottom: "#eef0e4" }, // dawn
  { at: 0.22, top: "#bfe0ef", bottom: "#eef3e6" }, // morning
  { at: 0.42, top: "#aed4ec", bottom: "#ebf2e6" }, // afternoon
  { at: 0.55, top: "#f1cb9d", bottom: "#f6e6d0" }, // golden
  { at: 0.64, top: "#e8956a", bottom: "#f1cbab" }, // sunset
  { at: 0.74, top: "#9aa0c0", bottom: "#c2c6d6" }, // dusk
  { at: 0.85, top: "#7e87a8", bottom: "#a7afc4" }, // night
  { at: 1.0, top: "#cfe2ec", bottom: "#eef0e4" }, // → dawn
];

function hexRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(h1: string, h2: string, t: number): string {
  const a = hexRgb(h1);
  const b = hexRgb(h2);
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}
function sample(t: number) {
  let i = 0;
  while (i < STOPS.length - 1 && t >= STOPS[i + 1].at) i++;
  const a = STOPS[i];
  const b = STOPS[Math.min(i + 1, STOPS.length - 1)];
  const span = b.at - a.at || 1;
  const lt = Math.min(1, Math.max(0, (t - a.at) / span));
  return { top: mix(a.top, b.top, lt), bottom: mix(a.bottom, b.bottom, lt) };
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
function arc(p: number) {
  const x = clamp01(p);
  return { x: 6 + x * 88, y: 14 + (1 - Math.sin(x * Math.PI)) * 30 };
}

function PerchedCrow({ x, bottom, flip, delay }: { x: string; bottom: number; flip?: boolean; delay: string }) {
  return (
    <svg
      viewBox="0 0 16 12"
      style={{ left: x, bottom, animationDelay: delay, transform: flip ? "scaleX(-1)" : undefined }}
      className="absolute h-[32px] w-auto"
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
      <rect className="footer-crow-eye" x="11" y="1" width="1" height="1" fill={EYE} style={{ animationDelay: delay }} />
    </svg>
  );
}

function FruitTree({ x, h, flip }: { x: string; h: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 100"
      style={{ left: x, height: h, transform: flip ? "scaleX(-1)" : undefined }}
      className="absolute bottom-[36px] w-auto"
      aria-hidden
    >
      <rect x="26" y="42" width="8" height="58" fill={INK} />
      <rect x="18" y="50" width="10" height="5" fill={INK} />
      <rect x="34" y="38" width="14" height="5" fill={INK} />
      <rect x="8" y="8" width="44" height="36" fill={LEAF} stroke={INK} strokeWidth="2.5" />
      <rect x="2" y="24" width="20" height="18" fill={LEAF_DARK} stroke={INK} strokeWidth="2.5" />
      <rect x="38" y="20" width="20" height="18" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2.5" />
      <rect x="16" y="2" width="24" height="14" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2.5" />
      <rect x="14" y="16" width="5" height="5" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="40" y="26" width="5" height="5" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="27" y="30" width="5" height="5" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="8" y="32" width="4" height="4" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
      <rect x="48" y="10" width="4" height="4" fill={FRUIT} stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

function Bush({ x, w = 54 }: { x: string; w?: number }) {
  return (
    <svg viewBox="0 0 40 18" style={{ left: x, width: w }} className="absolute bottom-[34px] h-auto" aria-hidden>
      <rect x="2" y="6" width="16" height="12" fill={LEAF_DARK} stroke={INK} strokeWidth="2" />
      <rect x="12" y="2" width="18" height="16" fill={LEAF} stroke={INK} strokeWidth="2" />
      <rect x="26" y="8" width="12" height="10" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2" />
      <rect x="18" y="7" width="4" height="4" fill={FRUIT} stroke={INK} strokeWidth="1.2" />
    </svg>
  );
}

function Grass({ x }: { x: string }) {
  return (
    <svg viewBox="0 0 12 8" style={{ left: x }} className="absolute bottom-[34px] h-[14px] w-auto" aria-hidden>
      <rect x="1" y="3" width="2" height="5" fill={LEAF_DARK} />
      <rect x="5" y="0" width="2" height="8" fill={LEAF} />
      <rect x="9" y="4" width="2" height="4" fill={LEAF_DARK} />
    </svg>
  );
}

export function FooterGarden({ children }: { children?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    start.current = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const el = ref.current;
      if (el) {
        const t = ((now - start.current) / CYCLE_MS + START_T) % 1;
        const c = sample(t);
        el.style.setProperty("--fg-top", c.top);
        el.style.setProperty("--fg-bottom", c.bottom);

        const sun = arc(t / 0.66);
        const sunOp = t < 0.66 ? clamp01(Math.min(t / 0.05, (0.66 - t) / 0.05)) : 0;
        el.style.setProperty("--fg-sun-x", `${sun.x}%`);
        el.style.setProperty("--fg-sun-y", `${sun.y}%`);
        el.style.setProperty("--fg-sun-op", String(sunOp));

        const moon = arc((t - 0.66) / 0.34);
        const moonOp = t >= 0.66 ? clamp01(Math.min((t - 0.66) / 0.04, (1 - t) / 0.04)) : 0;
        el.style.setProperty("--fg-moon-x", `${moon.x}%`);
        el.style.setProperty("--fg-moon-y", `${moon.y}%`);
        el.style.setProperty("--fg-moon-op", String(moonOp));

        const starOp = clamp01((t - 0.6) / 0.1) * (t > 0.97 ? clamp01((1 - t) / 0.03) : 1);
        el.style.setProperty("--fg-star-op", String(starOp));
        el.style.setProperty("--fg-cloud-op", String(clamp01(1 - starOp) * 0.8));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      className="relative h-[300px] overflow-hidden sm:h-[340px]"
      style={{
        // fade the sky up from the footer's own background so it blends in
        // rather than reading as a separate boxed section
        background:
          "linear-gradient(to bottom, transparent 0%, var(--fg-top, #bfe0ef) 40%, var(--fg-bottom, #eef3e6) 100%)",
        ["--fg-top" as string]: "#bfe0ef",
        ["--fg-bottom" as string]: "#eef3e6",
      }}
      aria-hidden
    >
      {/* sun */}
      <div className="absolute" style={{ left: "var(--fg-sun-x,82%)", top: "var(--fg-sun-y,18%)", opacity: "var(--fg-sun-op,1)" }}>
        <div className="absolute -inset-3 rounded-full bg-amber-200/70 blur-lg" />
        <div className="relative h-9 w-9 rounded-full border-2 border-ink bg-amber-300" />
      </div>
      {/* moon */}
      <div className="absolute" style={{ left: "var(--fg-moon-x,16%)", top: "var(--fg-moon-y,18%)", opacity: "var(--fg-moon-op,0)" }}>
        <div className="absolute -inset-2 rounded-full bg-white/70 blur-lg" />
        <div className="relative h-8 w-8 rounded-full border-2 border-ink bg-stone-100" />
      </div>

      {/* stars */}
      <div className="absolute inset-0" style={{ opacity: "var(--fg-star-op,0)" }}>
        {Array.from({ length: 26 }).map((_, i) => (
          <span
            key={i}
            className="arcade-star absolute rounded-sm bg-paper-card"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 47) % 55}%`,
              width: i % 4 === 0 ? 3 : 2,
              height: i % 4 === 0 ? 3 : 2,
              animationDelay: `${(i % 6) * 0.35}s`,
            }}
          />
        ))}
      </div>

      {/* clouds */}
      <div className="absolute inset-0" style={{ opacity: "var(--fg-cloud-op,0.8)" }}>
        {[
          { x: "14%", y: "14%", w: 80 },
          { x: "60%", y: "10%", w: 110 },
          { x: "40%", y: "22%", w: 64 },
        ].map((c, i) => (
          <div
            key={i}
            className="cloud-drift absolute rounded-full border-2 border-ink-line bg-paper-card/70"
            style={{ left: c.x, top: c.y, width: c.w, height: 18, animationDelay: `${i * 1.5}s` }}
          />
        ))}
      </div>

      {/* drifting flyer */}
      <svg viewBox="0 0 16 12" className="footer-flyer absolute top-5 h-[24px] w-auto">
        <rect x="10" y="0" width="4" height="4" fill={INK} />
        <rect x="14" y="1" width="2" height="1" fill={INK} />
        <rect x="9" y="3" width="2" height="2" fill={INK} />
        <rect x="3" y="4" width="8" height="4" fill={INK} />
        <rect x="0" y="5" width="3" height="2" fill={INK} />
        <rect className="footer-flyer-wing" x="4" y="0" width="5" height="3" fill={WING} />
        <rect x="12" y="1" width="1" height="1" fill={EYE} />
      </svg>

      {/* forest */}
      <FruitTree x="2%" h={170} />
      <FruitTree x="13%" h={128} flip />
      <FruitTree x="28%" h={190} />
      <FruitTree x="44%" h={120} flip />
      <FruitTree x="57%" h={176} />
      <FruitTree x="73%" h={138} flip />
      <FruitTree x="87%" h={182} />
      <Bush x="9%" />
      <Bush x="23%" w={44} />
      <Bush x="39%" />
      <Bush x="52%" w={42} />
      <Bush x="68%" />
      <Bush x="82%" w={46} />
      <Grass x="6%" />
      <Grass x="19%" />
      <Grass x="35%" />
      <Grass x="49%" />
      <Grass x="64%" />
      <Grass x="78%" />
      <Grass x="94%" />

      {/* crows, always sitting */}
      <PerchedCrow x="4.5%" bottom={176} delay="0s" />
      <PerchedCrow x="30.5%" bottom={196} flip delay="1.4s" />
      <PerchedCrow x="59%" bottom={182} delay="2.3s" />
      <PerchedCrow x="89%" bottom={188} flip delay="0.8s" />
      <PerchedCrow x="47%" bottom={34} delay="3.1s" />

      {/* the lawn, copyright lives on the grass */}
      <div className="absolute bottom-0 left-0 right-0 h-[34px] border-t-2 border-ink" style={{ background: LEAF_DARK }}>
        <div className="section flex h-full items-center justify-between gap-2 font-mono text-[11px]" style={{ color: "#f0ead9" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
