"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArcadeAudio } from "./arcade-audio";

const MUTE_KEY = "crowkis-arcade-muted";

/**
 * BRAIN ROT: a full-screen crow shooter. Crows fly across the screen, you click
 * them out of the sky, the score counts up, combos stack, and a 30-second round
 * keeps you coming back. Behind it, a slow, continuous day → afternoon →
 * evening → night sky cycle drifts by — driven entirely by CSS variables on a
 * rAF clock, so it never snaps and never re-renders the game. Paper/ink/crow.
 */

const PX = 3.4;
const GW = 16;
const GH = 12;
const W = GW * PX;
const H = GH * PX;
const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";
const ROUND_SECONDS = 60;
const BEST_KEY = "crowkis-shooter-best";

const LEAF = "#6f9e5c";
const LEAF_DARK = "#547d44";
const LEAF_LIGHT = "#93bd79";

type R = [number, number, number, number, string?];
const FLY: R[] = [
  [10, 0, 4, 4], [14, 1, 2, 1], [9, 3, 2, 2], [3, 4, 8, 4], [0, 4, 2, 1], [0, 5, 3, 2],
];
const WING_UP: R[] = [[4, 0, 5, 2, WING], [5, 2, 4, 2, WING]];
const WING_DOWN: R[] = [[5, 8, 4, 2, WING], [4, 6, 5, 2, WING]];

function FlyingSprite({ frame, facing, golden }: { frame: 0 | 1; facing: 1 | -1; golden?: boolean }) {
  const rects = [...FLY, ...(frame === 0 ? WING_UP : WING_DOWN)];
  const body = golden ? "#d62221" : INK;
  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${GW} ${GH}`}
      shapeRendering="crispEdges"
      style={{ transform: facing === -1 ? "scaleX(-1)" : undefined }}
      aria-hidden
    >
      {rects.map(([x, y, w, h, f], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={f ?? body} />
      ))}
      <rect x={12} y={1} width={1} height={1} fill={golden ? "#fffdf9" : EYE} />
    </svg>
  );
}

/* ----------------------------- sky cycle ----------------------------- */

const CYCLE_MS = 96000; // a slow, full day in ~96s
const START_T = 0.12; // open mid-morning

type Stop = { at: number; skyTop: string; skyBottom: string; water: string; waterHi: string };
// monotonic in `at`; last entry mirrors the first for a seamless loop
const STOPS: Stop[] = [
  { at: 0.0, skyTop: "#cfe2ec", skyBottom: "#f5ead7", water: "#7fb3cf", waterHi: "#b6dae8" }, // dawn
  { at: 0.2, skyTop: "#bfe0ef", skyBottom: "#eaf5ee", water: "#5fa8c9", waterHi: "#9fd0e3" }, // morning
  { at: 0.4, skyTop: "#aed4ec", skyBottom: "#e9f3ec", water: "#5aa0c2", waterHi: "#9bccdf" }, // afternoon
  { at: 0.55, skyTop: "#f0c89a", skyBottom: "#f7e6cf", water: "#9a8bb0", waterHi: "#c9b9d8" }, // golden
  { at: 0.64, skyTop: "#e8956a", skyBottom: "#f3c9a8", water: "#b9737a", waterHi: "#e0a9ab" }, // sunset
  { at: 0.74, skyTop: "#9aa0c0", skyBottom: "#c2c6d6", water: "#6a6f93", waterHi: "#9aa0bf" }, // dusk
  { at: 0.85, skyTop: "#888fae", skyBottom: "#abb3c6", water: "#5c6b8c", waterHi: "#8b98b5" }, // night
  { at: 1.0, skyTop: "#cfe2ec", skyBottom: "#f5ead7", water: "#7fb3cf", waterHi: "#b6dae8" }, // → dawn
];

function hexRgb(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mix(h1: string, h2: string, t: number): string {
  const a = hexRgb(h1);
  const b = hexRgb(h2);
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r},${g},${bl})`;
}
function sampleStops(t: number) {
  let i = 0;
  while (i < STOPS.length - 1 && t >= STOPS[i + 1].at) i++;
  const a = STOPS[i];
  const b = STOPS[Math.min(i + 1, STOPS.length - 1)];
  const span = b.at - a.at || 1;
  const lt = Math.min(1, Math.max(0, (t - a.at) / span));
  return {
    skyTop: mix(a.skyTop, b.skyTop, lt),
    skyBottom: mix(a.skyBottom, b.skyBottom, lt),
    water: mix(a.water, b.water, lt),
    waterHi: mix(a.waterHi, b.waterHi, lt),
  };
}
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
// arc across the sky: x left→right, y a gentle parabola (high at the middle)
function arc(progress: number) {
  const p = clamp01(progress);
  return { x: 5 + p * 90, y: 12 + (1 - Math.sin(p * Math.PI)) * 42 };
}

function SceneTree({ x, h, flip }: { x: string; h: number; flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 100" style={{ left: x, height: h, transform: flip ? "scaleX(-1)" : undefined }} className="absolute bottom-[60px] w-auto" aria-hidden>
      <rect x="26" y="42" width="8" height="58" fill={INK} />
      <rect x="18" y="50" width="10" height="5" fill={INK} />
      <rect x="34" y="38" width="14" height="5" fill={INK} />
      <rect x="8" y="8" width="44" height="36" fill={LEAF} stroke={INK} strokeWidth="2.5" />
      <rect x="2" y="24" width="20" height="18" fill={LEAF_DARK} stroke={INK} strokeWidth="2.5" />
      <rect x="38" y="20" width="20" height="18" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2.5" />
      <rect x="16" y="2" width="24" height="14" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2.5" />
      <rect x="14" y="16" width="5" height="5" fill={EYE} stroke={INK} strokeWidth="1.5" />
      <rect x="40" y="26" width="5" height="5" fill={EYE} stroke={INK} strokeWidth="1.5" />
      <rect x="27" y="30" width="5" height="5" fill={EYE} stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}
function SceneBush({ x, w = 60 }: { x: string; w?: number }) {
  return (
    <svg viewBox="0 0 40 18" style={{ left: x, width: w }} className="absolute bottom-[62px] h-auto" aria-hidden>
      <rect x="2" y="6" width="16" height="12" fill={LEAF_DARK} stroke={INK} strokeWidth="2" />
      <rect x="12" y="2" width="18" height="16" fill={LEAF} stroke={INK} strokeWidth="2" />
      <rect x="26" y="8" width="12" height="10" fill={LEAF_LIGHT} stroke={INK} strokeWidth="2" />
    </svg>
  );
}

type Weather = "clear" | "cloudy" | "rain" | "storm";

// random weather — mostly clear skies; rain is a once-in-a-while treat
function nextWeather(): Weather {
  const r = Math.random();
  if (r < 0.64) return "clear";
  if (r < 0.9) return "cloudy";
  if (r < 0.97) return "rain";
  return "storm";
}
function weatherMs(w: Weather): number {
  if (w === "clear") return 15000 + Math.random() * 15000;
  if (w === "storm") return 7000 + Math.random() * 6000;
  return 8000 + Math.random() * 8000; // cloudy / rain
}

function ArcadeScene({ onWeather }: { onWeather?: (w: Weather) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const start = useRef(performance.now());
  const [weather, setWeather] = useState<Weather>("clear");
  const onWeatherRef = useRef(onWeather);
  onWeatherRef.current = onWeather;

  // random weather, re-rolled each spell
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cur: Weather = "clear";
    let to: ReturnType<typeof setTimeout>;
    const step = () => {
      cur = nextWeather();
      setWeather(cur);
      onWeatherRef.current?.(cur);
      to = setTimeout(step, weatherMs(cur));
    };
    to = setTimeout(step, 9000 + Math.random() * 8000); // start clear for a bit
    return () => clearTimeout(to);
  }, []);

  const raining = weather === "rain" || weather === "storm";
  const storming = weather === "storm";
  const darken = storming ? 0.36 : weather === "rain" ? 0.2 : weather === "cloudy" ? 0.08 : 0;
  const extraClouds = weather === "cloudy" || raining;

  useEffect(() => {
    let raf = 0;
    const tick = (now: number) => {
      const el = ref.current;
      if (el) {
        const t = ((now - start.current) / CYCLE_MS + START_T) % 1;
        const c = sampleStops(t);
        el.style.setProperty("--sky-top", c.skyTop);
        el.style.setProperty("--sky-bottom", c.skyBottom);
        el.style.setProperty("--water", c.water);
        el.style.setProperty("--water-hi", c.waterHi);

        // sun arcs through the day window [0, 0.66]; moon through the night
        const sunP = t / 0.66;
        const sun = arc(sunP);
        const sunOp = t < 0.66 ? clamp01(Math.min(t / 0.06, (0.66 - t) / 0.06)) : 0;
        el.style.setProperty("--sun-x", `${sun.x}%`);
        el.style.setProperty("--sun-y", `${sun.y}%`);
        el.style.setProperty("--sun-op", String(sunOp));

        const moonP = (t - 0.66) / 0.34;
        const moon = arc(moonP);
        const moonOp = t >= 0.66 ? clamp01(Math.min((t - 0.66) / 0.04, (1 - t) / 0.04)) : 0;
        el.style.setProperty("--moon-x", `${moon.x}%`);
        el.style.setProperty("--moon-y", `${moon.y}%`);
        el.style.setProperty("--moon-op", String(moonOp));

        // stars rise after sunset, fade before dawn
        const starOp = clamp01((t - 0.6) / 0.1) * (t > 0.97 ? clamp01((1 - t) / 0.03) : 1);
        el.style.setProperty("--star-op", String(starOp));
        el.style.setProperty("--cloud-op", String(clamp01(1 - starOp) * 0.85));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        background: "linear-gradient(var(--sky-top, #bfe0ef), var(--sky-bottom, #eaf5ee))",
        ["--sky-top" as string]: "#bfe0ef",
        ["--sky-bottom" as string]: "#eaf5ee",
        ["--water" as string]: "#5fa8c9",
        ["--water-hi" as string]: "#9fd0e3",
      }}
    >
      {/* sun */}
      <div className="absolute" style={{ left: "var(--sun-x,82%)", top: "var(--sun-y,14%)", opacity: "var(--sun-op,1)" }}>
        <div className="absolute -inset-5 rounded-full bg-amber-200/70 blur-xl" />
        <div className="relative h-16 w-16 rounded-full border-2 border-ink bg-amber-300" />
      </div>
      {/* moon */}
      <div className="absolute" style={{ left: "var(--moon-x,16%)", top: "var(--moon-y,14%)", opacity: "var(--moon-op,0)" }}>
        <div className="absolute -inset-4 rounded-full bg-white/70 blur-xl" />
        <div className="relative h-14 w-14 rounded-full border-2 border-ink bg-stone-100" />
      </div>

      {/* stars */}
      <div className="absolute inset-0" style={{ opacity: "var(--star-op,0)" }}>
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="arcade-star absolute rounded-sm bg-paper-card"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 58}%`,
              width: i % 4 === 0 ? 4 : 2,
              height: i % 4 === 0 ? 4 : 2,
              animationDelay: `${(i % 7) * 0.3}s`,
            }}
          />
        ))}
        {/* a shooting star streaks across the night */}
        <span
          className="wx-shoot absolute h-[2px] w-16 rounded-full bg-paper-card"
          style={{ left: "74%", top: "10%", boxShadow: "0 0 6px #fff, -10px 0 10px #fff" }}
        />
      </div>

      {/* clouds */}
      <div className="absolute inset-0" style={{ opacity: "var(--cloud-op,0.85)" }}>
        {[
          { x: "12%", y: "16%", w: 90 },
          { x: "58%", y: "10%", w: 120 },
          { x: "38%", y: "26%", w: 70 },
          { x: "76%", y: "20%", w: 84 },
        ].map((c, i) => (
          <div
            key={i}
            className="cloud-drift absolute rounded-full border-2 border-ink-line bg-paper-card/70"
            style={{ left: c.x, top: c.y, width: c.w, height: 22, animationDelay: `${i * 1.5}s` }}
          />
        ))}
      </div>

      {/* storm clouds — darker, fade in for cloudy / rain / storm */}
      <div
        className="absolute inset-0"
        style={{ opacity: extraClouds ? 1 : 0, transition: "opacity 1.8s ease" }}
      >
        {[
          { x: "6%", y: "8%", w: 130 },
          { x: "44%", y: "5%", w: 160 },
          { x: "70%", y: "12%", w: 140 },
        ].map((c, i) => (
          <div
            key={i}
            className="cloud-drift absolute rounded-full border-2 border-roost-line bg-roost-card/80"
            style={{ left: c.x, top: c.y, width: c.w, height: 28, animationDelay: `${i * 1.2}s` }}
          />
        ))}
      </div>

      {/* garden — a fuller treeline */}
      <SceneTree x="1%" h={150} />
      <SceneTree x="9%" h={116} flip />
      <SceneTree x="17%" h={170} />
      <SceneTree x="25%" h={104} flip />
      <SceneTree x="34%" h={158} />
      <SceneTree x="43%" h={120} flip />
      <SceneTree x="52%" h={148} />
      <SceneTree x="61%" h={110} flip />
      <SceneTree x="69%" h={166} />
      <SceneTree x="78%" h={118} flip />
      <SceneTree x="86%" h={156} />
      <SceneTree x="94%" h={108} flip />
      <SceneBush x="6%" />
      <SceneBush x="21%" w={48} />
      <SceneBush x="31%" />
      <SceneBush x="47%" w={44} />
      <SceneBush x="58%" />
      <SceneBush x="74%" w={50} />
      <SceneBush x="90%" />

      {/* grassy bank */}
      <div className="absolute bottom-[64px] left-0 right-0 h-3" style={{ background: LEAF_DARK }} />

      {/* flowing river */}
      <div className="absolute bottom-0 left-0 right-0 h-[64px] border-t-2 border-ink" style={{ background: "var(--water,#5fa8c9)" }}>
        <div
          className="water-flow absolute inset-0 opacity-70"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, var(--water-hi,#9fd0e3) 0 9px, transparent 9px 32px)",
            backgroundSize: "64px 100%",
          }}
        />
        <div
          className="water-flow-slow absolute inset-x-0 top-2 h-2 opacity-80"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, var(--water-hi,#9fd0e3) 0 12px, transparent 12px 28px)",
            backgroundSize: "64px 100%",
          }}
        />
      </div>

      {/* storm darken */}
      <div
        className="pointer-events-none absolute inset-0 bg-slate-900"
        style={{ opacity: darken, transition: "opacity 1.8s ease" }}
      />

      {/* rain */}
      <div
        className="wx-rain pointer-events-none absolute inset-0"
        style={{
          opacity: raining ? (storming ? 0.6 : 0.4) : 0,
          transition: "opacity 1.6s ease",
          backgroundImage:
            "repeating-linear-gradient(100deg, rgba(205,218,232,0.6) 0 1px, transparent 1px 9px), repeating-linear-gradient(100deg, rgba(205,218,232,0.35) 0 1px, transparent 1px 15px)",
          backgroundSize: "90px 90px, 50px 50px",
        }}
      />

      {/* lightning */}
      {storming ? <div className="wx-lightning pointer-events-none absolute inset-0 bg-white" /> : null}
    </div>
  );
}

/* ------------------------------- the game ------------------------------- */

type Bird = {
  id: number;
  x: number; y: number;
  vx: number; vy: number;
  facing: 1 | -1;
  frame: 0 | 1;
  golden: boolean;
  born: number;
};
type Poof = { id: number; x: number; y: number; pts: number; golden: boolean };
type Mode = "idle" | "playing" | "over";

export function CrowShooter({ onClose }: { onClose: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const birdRefs = useRef(new Map<number, HTMLButtonElement>());
  const birdsRef = useRef<Bird[]>([]);
  const [birdMeta, setBirdMeta] = useState<{ id: number; facing: 1 | -1; frame: 0 | 1; golden: boolean }[]>([]);
  const [poofs, setPoofs] = useState<Poof[]>([]);
  const [mode, setMode] = useState<Mode>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const [time, setTime] = useState(ROUND_SECONDS);
  const [muted, setMuted] = useState(false);
  const [arcWeather, setArcWeather] = useState<Weather>("clear");

  const audioRef = useRef<ArcadeAudio | null>(null);
  const modeRef = useRef<Mode>("idle");
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const lastKill = useRef(0);
  const startedAt = useRef(0);
  const nextId = useRef(0);
  const poofId = useRef(0);
  const lastSpawn = useRef(0);
  const flapAccum = useRef(0);
  modeRef.current = mode;

  useEffect(() => {
    setBest(Number(localStorage.getItem(BEST_KEY) ?? 0));
    const startMuted = localStorage.getItem(MUTE_KEY) === "1";
    setMuted(startMuted);
    const audio = new ArcadeAudio(startMuted);
    audioRef.current = audio;
    return () => audio.dispose();
  }, []);

  // rain bed follows the sky
  useEffect(() => {
    const lvl = arcWeather === "storm" ? 0.75 : arcWeather === "rain" ? 0.4 : 0;
    audioRef.current?.setRain(lvl);
  }, [arcWeather]);

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      localStorage.setItem(MUTE_KEY, next ? "1" : "0");
      const a = audioRef.current;
      if (a) {
        if (!next) a.resume(); // let the user switch sound on anytime
        a.setMuted(next);
      }
      return next;
    });
  };

  const syncMeta = () => {
    setBirdMeta(birdsRef.current.map((b) => ({ id: b.id, facing: b.facing, frame: b.frame, golden: b.golden })));
  };

  const spawn = (now: number) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 1200;
    const h = rect?.height ?? 700;
    const elapsed = (now - startedAt.current) / 1000;
    const fromLeft = Math.random() < 0.5;
    const base = 130 + elapsed * 9 + Math.random() * 90;
    const golden = Math.random() < 0.12;
    birdsRef.current.push({
      id: nextId.current++,
      x: fromLeft ? -W : w + W,
      y: 70 + Math.random() * (h * 0.55),
      vx: (fromLeft ? 1 : -1) * (golden ? base * 1.7 : base),
      vy: (Math.random() - 0.5) * 40,
      facing: fromLeft ? 1 : -1,
      frame: 0,
      golden,
      born: now,
    });
    // the odd caw drifting in keeps the murder alive
    if (Math.random() < 0.18) audioRef.current?.caw(golden);
    syncMeta();
  };

  const kill = (id: number) => {
    if (modeRef.current !== "playing") return;
    const bird = birdsRef.current.find((b) => b.id === id);
    if (!bird) return;
    audioRef.current?.hit(bird.golden);
    const now = performance.now();
    const isCombo = now - lastKill.current < 1400;
    lastKill.current = now;
    comboRef.current = isCombo ? comboRef.current + 1 : 1;
    setCombo(comboRef.current);
    const mult = Math.min(5, 1 + Math.floor(comboRef.current / 3));
    const pts = (bird.golden ? 5 : 1) * mult;
    scoreRef.current += pts;
    setScore(scoreRef.current);

    const pid = poofId.current++;
    setPoofs((p) => [...p, { id: pid, x: bird.x + W / 2, y: bird.y + H / 2, pts, golden: bird.golden }]);
    setTimeout(() => setPoofs((p) => p.filter((q) => q.id !== pid)), 700);

    birdsRef.current = birdsRef.current.filter((b) => b.id !== id);
    birdRefs.current.delete(id);
    syncMeta();
  };

  const endRound = useCallback(() => {
    setMode("over");
    audioRef.current?.stopMusic();
    birdsRef.current = [];
    syncMeta();
    setBest((b) => {
      const nb = Math.max(b, scoreRef.current);
      localStorage.setItem(BEST_KEY, String(nb));
      return nb;
    });
  }, []);

  const start = () => {
    scoreRef.current = 0;
    comboRef.current = 0;
    setScore(0);
    setCombo(0);
    setTime(ROUND_SECONDS);
    birdsRef.current = [];
    syncMeta();
    startedAt.current = performance.now();
    lastSpawn.current = 0;
    const a = audioRef.current;
    if (a) {
      a.resume();
      a.startMusic();
      const lvl = arcWeather === "storm" ? 0.75 : arcWeather === "rain" ? 0.4 : 0;
      a.setRain(lvl);
    }
    setMode("playing");
  };

  useEffect(() => {
    if (mode !== "playing") return;
    let alive = true;
    let raf = 0;
    let prev = performance.now();

    const loop = (now: number) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;

      const left = Math.max(0, ROUND_SECONDS - (now - startedAt.current) / 1000);
      setTime(Math.ceil(left));
      if (left <= 0) {
        endRound();
        return;
      }

      const elapsed = (now - startedAt.current) / 1000;
      const interval = Math.max(420, 1100 - elapsed * 22);
      if (now - lastSpawn.current > interval) {
        lastSpawn.current = now;
        spawn(now);
        if (elapsed > 12 && Math.random() < 0.4) spawn(now);
      }

      flapAccum.current += dt;
      const flip = flapAccum.current > 0.12;
      if (flip) flapAccum.current = 0;

      const rect = wrapRef.current?.getBoundingClientRect();
      const w = rect?.width ?? 1200;
      let metaDirty = false;
      birdsRef.current.forEach((b) => {
        b.x += b.vx * dt;
        b.y += b.vy * dt + Math.sin(now / 240 + b.id) * 0.5;
        if (flip) {
          b.frame = b.frame === 0 ? 1 : 0;
          metaDirty = true;
        }
        const el = birdRefs.current.get(b.id);
        if (el) el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
      });
      const before = birdsRef.current.length;
      birdsRef.current = birdsRef.current.filter((b) => b.x > -W * 2 && b.x < w + W * 2);
      if (birdsRef.current.length !== before) metaDirty = true;
      if (metaDirty) syncMeta();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [mode, endRound]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " " && modeRef.current !== "playing") {
        e.preventDefault();
        start();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={wrapRef} className="fixed inset-0 z-[100] cursor-crosshair overflow-hidden bg-paper">
      <ArcadeScene onWeather={setArcWeather} />
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-25" />

      {/* HUD — fixed high-contrast colours so it reads on any sky / theme */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between p-4 sm:p-6">
        <div className="flex gap-3">
          <div className="rounded-xl border-2 border-stone-900 bg-stone-50/95 px-4 py-2 shadow-[3px_3px_0_0_rgba(12,12,12,0.85)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">score</p>
            <p className="font-display text-3xl font-bold leading-none text-stone-900 sm:text-4xl">{score}</p>
          </div>
          <div className="rounded-xl border-2 border-stone-900 bg-stone-50/95 px-4 py-2 shadow-[3px_3px_0_0_rgba(12,12,12,0.85)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">best</p>
            <p className="font-display text-3xl font-bold leading-none text-stone-900 sm:text-4xl">{best}</p>
          </div>
          {combo > 2 ? (
            <div className="rounded-xl border-2 border-stone-900 bg-stone-50/95 px-4 py-2 shadow-[3px_3px_0_0_#d62221]">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-crow">combo</p>
              <p className="font-display text-3xl font-bold leading-none text-crow sm:text-4xl">
                ×{Math.min(5, 1 + Math.floor(combo / 3))}
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          {mode === "playing" ? (
            <div className="rounded-xl border-2 border-stone-900 bg-stone-50/95 px-4 py-2 text-center shadow-[3px_3px_0_0_rgba(12,12,12,0.85)]">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">time</p>
              <p className={`font-display text-3xl font-bold leading-none sm:text-4xl ${time <= 5 ? "text-crow" : "text-stone-900"}`}>
                {time}
              </p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "turn sound on" : "turn sound off"}
            aria-pressed={!muted}
            title={muted ? "Sound off" : "Sound on"}
            className="pointer-events-auto flex items-center gap-1.5 rounded-lg border-2 border-stone-900 bg-stone-50/95 px-3 py-2 font-mono text-xs font-semibold text-stone-900 shadow-[3px_3px_0_0_rgba(12,12,12,0.85)] transition hover:-translate-y-0.5"
          >
            <span className="text-base leading-none">{muted ? "🔇" : "🔊"}</span>
            <span className="hidden sm:inline">{muted ? "off" : "on"}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="pointer-events-auto rounded-lg border-2 border-stone-900 bg-stone-50/95 px-3 py-2 font-mono text-xs font-semibold text-stone-900 shadow-[3px_3px_0_0_rgba(12,12,12,0.85)] transition hover:-translate-y-0.5"
          >
            ✕ esc
          </button>
        </div>
      </div>

      {/* birds */}
      {birdMeta.map((m) => (
        <button
          key={m.id}
          type="button"
          ref={(el) => {
            if (el) birdRefs.current.set(m.id, el);
            else birdRefs.current.delete(m.id);
          }}
          onClick={() => kill(m.id)}
          onMouseDown={() => kill(m.id)}
          className="absolute left-0 top-0 will-change-transform"
          style={{ lineHeight: 0 }}
          aria-label="shoot crow"
        >
          <FlyingSprite frame={m.frame} facing={m.facing} golden={m.golden} />
        </button>
      ))}

      {/* feather poofs + points */}
      {poofs.map((p) => (
        <div key={p.id} className="pointer-events-none absolute" style={{ left: p.x, top: p.y }}>
          <span className={`bonk-label absolute -top-7 left-1/2 -translate-x-1/2 font-display text-xl font-bold ${p.golden ? "text-crow" : "text-ink"}`}>
            +{p.pts}
          </span>
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="feather absolute h-1.5 w-2.5 rounded-sm"
              style={{
                background: i % 3 === 0 ? EYE : i % 2 === 0 ? INK : WING,
                ["--fx" as string]: `${Math.cos((i / 8) * Math.PI * 2) * (30 + (i % 3) * 12)}px`,
                ["--fy" as string]: `${Math.sin((i / 8) * Math.PI * 2) * (24 + (i % 2) * 14) - 14}px`,
                animationDelay: `${i * 16}ms`,
              }}
            />
          ))}
        </div>
      ))}

      {/* idle / over panels */}
      {mode !== "playing" ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-paper/60 backdrop-blur-sm">
          <div className="card-block mx-4 max-w-md bg-paper-card p-8 text-center">
            {mode === "over" ? (
              <>
                <p className="eyebrow">round over</p>
                <p className="mt-3 font-display text-6xl font-bold tracking-tight">{score}</p>
                <p className="mt-1 font-mono text-xs text-ink-faint">
                  crows downed · best {best}
                  {score >= best && score > 0 ? " · new record!" : ""}
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow">brain rot · certified</p>
                <h2 className="mt-3 font-display text-3xl font-bold leading-tight">Shoot the murder.</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  Click crows out of the sky for {ROUND_SECONDS} seconds. Chain kills for a combo
                  multiplier. <span className="font-semibold text-crow">Red ones are worth 5×.</span>{" "}
                  No crows are harmed; they respawn out of spite.
                </p>
              </>
            )}
            <button type="button" onClick={start} className="btn-primary mt-6 w-full !py-3 !text-base">
              {mode === "over" ? "Play again" : "Start shooting"}
            </button>
            <button type="button" onClick={onClose} className="btn-ghost mt-2 w-full !py-2 text-sm">
              ← leave the aviary
            </button>
            <p className="mt-2 font-mono text-[11px] text-ink-faint">
              space to start · esc to exit · 🔊 sound toggle top-right
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
