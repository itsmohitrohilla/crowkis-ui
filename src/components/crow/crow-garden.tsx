"use client";

import { useEffect, useRef, useState } from "react";
import { Logo3D } from "@/components/crow/logo-3d";

/**
 * The Murder: part garden, part brain-rot game. Crows fly between perches,
 * hop, blink, and you BONK them. Each bonk scores, bonked crows poof into
 * feathers and respawn, the flock gets faster as your score climbs, and at
 * higher scores perched crows start fleeing your cursor. High score sticks
 * in localStorage. No crows are harmed; they respawn out of spite.
 */

const PX = 2.6;
const GW = 16;
const GH = 12;
const W = GW * PX;
const H = GH * PX;
const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";
const MAX_CROWS = 12;
const BEST_KEY = "crowkis-murder-best";

type R = [number, number, number, number, string?];

const PERCH_RECTS: R[] = [
  [9, 0, 4, 4], [13, 1, 2, 1], [3, 3, 8, 5], [8, 2, 2, 1], [0, 3, 3, 2],
  [4, 4, 5, 3, WING], [6, 8, 1, 2], [9, 8, 1, 2], [5, 10, 2, 1], [8, 10, 2, 1],
];
const FLY_RECTS: R[] = [
  [10, 0, 4, 4], [14, 1, 2, 1], [9, 3, 2, 2], [3, 4, 8, 4], [0, 4, 2, 1], [0, 5, 3, 2],
];
const WING_UP: R[] = [[4, 0, 5, 2, WING], [5, 2, 4, 2, WING]];
const WING_DOWN: R[] = [[5, 8, 4, 2, WING], [4, 6, 5, 2, WING]];

function Sprite({ rects, eye }: { rects: R[]; eye: [number, number] }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${GW} ${GH}`} shapeRendering="crispEdges" aria-hidden>
      {rects.map(([x, y, w, h, f], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={f ?? INK} />
      ))}
      <rect x={eye[0]} y={eye[1]} width={1} height={1} fill={EYE} />
    </svg>
  );
}

function Tree({ x, h: height, flip }: { x: string; h: number; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 60 100"
      style={{ left: x, height, transform: flip ? "scaleX(-1)" : undefined }}
      className="absolute bottom-10 w-auto"
      aria-hidden
    >
      <rect x="26" y="40" width="8" height="60" fill={INK} />
      <rect x="18" y="48" width="10" height="5" fill={INK} />
      <rect x="34" y="36" width="14" height="5" fill={INK} />
      <rect x="10" y="10" width="40" height="34" fill="#f3eee5" stroke={INK} strokeWidth="2.5" />
      <rect x="4" y="26" width="18" height="16" fill="#f3eee5" stroke={INK} strokeWidth="2.5" />
      <rect x="38" y="22" width="18" height="16" fill="#fbe9e8" stroke={INK} strokeWidth="2.5" />
    </svg>
  );
}

type Crow = {
  id: number;
  x: number; y: number;
  fx: number; fy: number; tx: number; ty: number;
  t0: number; dur: number;
  state: "fly" | "perch";
  until: number;
  facing: 1 | -1;
  caw: boolean;
};

type Poof = { id: number; x: number; y: number };

export function CrowGarden() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const crowRefs = useRef(new Map<number, HTMLDivElement>());
  const crowsRef = useRef<Crow[]>([]);
  const [crowMeta, setCrowMeta] = useState<{ id: number; state: "fly" | "perch"; facing: 1 | -1; caw: boolean }[]>([]);
  const [poofs, setPoofs] = useState<Poof[]>([]);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(0);
  const scoreRef = useRef(0);
  const lastBonk = useRef(0);
  const nextId = useRef(0);
  const poofId = useRef(0);
  const addCrowRef = useRef<() => void>(() => {});

  useEffect(() => {
    setBest(Number(localStorage.getItem(BEST_KEY) ?? 0));
  }, []);

  const syncMeta = () => {
    setCrowMeta(
      crowsRef.current.map((c) => ({ id: c.id, state: c.state, facing: c.facing, caw: c.caw })),
    );
  };

  // the flock speeds up as your score climbs
  const speed = () => Math.min(2.6, 1 + scoreRef.current * 0.04);

  const perchPoints = () => {
    const rect = sceneRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 800;
    const h = rect?.height ?? 480;
    const ground = h - 44 - H;
    return [
      { x: w * 0.08, y: ground },
      { x: w * 0.2, y: ground },
      { x: w * 0.62, y: ground },
      { x: w * 0.88, y: ground },
      { x: w * 0.14, y: h - 44 - 150 - H + 6 },
      { x: w * 0.78, y: h - 44 - 180 - H + 6 },
      { x: w * 0.46, y: h * 0.36 },
      { x: w * 0.55, y: h * 0.36 },
    ];
  };

  const sendSomewhere = (c: Crow, now: number) => {
    const rect = sceneRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 800;
    const points = perchPoints();
    const p = points[Math.floor(Math.random() * points.length)];
    c.fx = c.x;
    c.fy = c.y;
    c.tx = Math.max(8, Math.min(w - W - 8, p.x + (Math.random() * 40 - 20)));
    c.ty = p.y;
    c.t0 = now;
    c.dur = (1800 + Math.random() * 2200) / speed();
    c.state = "fly";
    c.facing = c.tx >= c.x ? 1 : -1;
  };

  const addCrow = () => {
    if (crowsRef.current.length >= MAX_CROWS) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    const w = rect?.width ?? 800;
    const c: Crow = {
      id: nextId.current++,
      x: Math.random() < 0.5 ? -60 : w + 60,
      y: 40 + Math.random() * 120,
      fx: 0, fy: 0, tx: 0, ty: 0,
      t0: performance.now(),
      dur: 0,
      state: "fly",
      until: 0,
      facing: 1,
      caw: false,
    };
    sendSomewhere(c, performance.now());
    crowsRef.current.push(c);
    syncMeta();
  };
  addCrowRef.current = addCrow;

  const bonk = (id: number) => {
    const now = performance.now();
    const crow = crowsRef.current.find((c) => c.id === id);
    if (!crow) return;
    // feathers!
    const pid = poofId.current++;
    setPoofs((p) => [...p, { id: pid, x: crow.x + W / 2, y: crow.y + H / 2 }]);
    setTimeout(() => setPoofs((p) => p.filter((q) => q.id !== pid)), 700);
    // score + combo
    const isCombo = now - lastBonk.current < 2000;
    lastBonk.current = now;
    setCombo((c) => (isCombo ? c + 1 : 1));
    scoreRef.current += isCombo ? 2 : 1;
    setScore(scoreRef.current);
    setBest((b) => {
      const nb = Math.max(b, scoreRef.current);
      localStorage.setItem(BEST_KEY, String(nb));
      return nb;
    });
    // the bonked crow despawns; the rest scatter; a fresh one flies in shortly
    crowsRef.current = crowsRef.current.filter((c) => c.id !== id);
    crowsRef.current.forEach((c) => {
      if (c.state === "perch" && Math.random() < 0.7) {
        c.caw = true;
        setTimeout(() => {
          c.caw = false;
          syncMeta();
        }, 700);
        sendSomewhere(c, now);
      }
    });
    syncMeta();
    setTimeout(() => addCrowRef.current(), 900 + Math.random() * 1200);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let alive = true;
    for (let i = 0; i < 6; i++) setTimeout(() => alive && addCrowRef.current(), i * 600);

    // past 15 points, perched crows start dodging your cursor
    const onMove = (e: MouseEvent) => {
      if (scoreRef.current < 15) return;
      const rect = sceneRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const now = performance.now();
      crowsRef.current.forEach((c) => {
        if (c.state !== "perch") return;
        if (Math.hypot(mx - (c.x + W / 2), my - (c.y + H / 2)) < 60) {
          sendSomewhere(c, now);
        }
      });
    };
    const scene = sceneRef.current;
    scene?.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    const tick = (now: number) => {
      if (!alive) return;
      let metaDirty = false;
      crowsRef.current.forEach((c) => {
        if (c.state === "fly") {
          const p = Math.min((now - c.t0) / c.dur, 1);
          const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
          c.x = c.fx + (c.tx - c.fx) * ease;
          c.y = c.fy + (c.ty - c.fy) * ease + Math.sin(p * Math.PI * 3) * 12 * (1 - p * 0.5);
          if (p >= 1) {
            c.state = "perch";
            c.until = now + (2600 + Math.random() * 6000) / speed();
            metaDirty = true;
          }
        } else if (now > c.until) {
          sendSomewhere(c, now);
          metaDirty = true;
        }
        const el = crowRefs.current.get(c.id);
        if (el) el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      });
      if (metaDirty) syncMeta();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      scene?.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* HUD */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-3">
          <div className="card-block !shadow-block-sm px-4 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">bonks</p>
            <p className="font-display text-2xl font-bold leading-none">{score}</p>
          </div>
          <div className="card-quiet px-4 py-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">best</p>
            <p className="font-display text-2xl font-bold leading-none">{best}</p>
          </div>
          {combo > 1 ? (
            <div className="card-block !shadow-block-red px-4 py-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-crow">combo</p>
              <p className="font-display text-2xl font-bold leading-none text-crow">×{combo}</p>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          onClick={addCrow}
          className="btn-secondary !py-2 text-sm"
          disabled={crowMeta.length >= MAX_CROWS}
        >
          {crowMeta.length >= MAX_CROWS ? "the murder is full" : "summon another crow"}
        </button>
      </div>

      <div
        ref={sceneRef}
        className="paper-grid relative h-[480px] cursor-crosshair overflow-hidden rounded-xl border-2 border-ink bg-paper shadow-block sm:h-[520px]"
      >
        <div className="absolute right-8 top-7 h-12 w-12 rounded-full border-2 border-ink bg-crow-tint" aria-hidden />
        <Tree x="10%" h={150} />
        <Tree x="74%" h={180} flip />
        <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
          <Logo3D size={96} />
          <p className="mt-9 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
            the monument
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-11 border-t-2 border-ink bg-paper-deep" aria-hidden>
          <div className="flex h-full items-center gap-6 overflow-hidden px-4 font-mono text-[9px] uppercase tracking-[0.3em] text-ink-line">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i}>caw</span>
            ))}
          </div>
        </div>

        {/* feather poofs */}
        {poofs.map((p) => (
          <div key={p.id} className="pointer-events-none absolute" style={{ left: p.x, top: p.y }}>
            <span className="bonk-label absolute -top-6 left-1/2 -translate-x-1/2 font-display text-lg font-bold text-crow">
              BONK!
            </span>
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="feather absolute h-1.5 w-2.5 rounded-sm"
                style={{
                  background: i % 3 === 0 ? EYE : i % 2 === 0 ? INK : WING,
                  ["--fx" as string]: `${Math.cos((i / 7) * Math.PI * 2) * (26 + (i % 3) * 12)}px`,
                  ["--fy" as string]: `${Math.sin((i / 7) * Math.PI * 2) * (20 + (i % 2) * 14) - 12}px`,
                  animationDelay: `${i * 18}ms`,
                }}
              />
            ))}
          </div>
        ))}

        {/* crows */}
        {crowMeta.map((m) => (
          <div
            key={m.id}
            ref={(el) => {
              if (el) crowRefs.current.set(m.id, el);
              else crowRefs.current.delete(m.id);
            }}
            className="absolute left-0 top-0 will-change-transform"
          >
            {m.caw ? (
              <div className="caw-bubble absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border-2 border-ink bg-crow px-1.5 py-0.5 font-mono text-[10px] font-bold text-stone-50">
                CAW!
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => bonk(m.id)}
              className="block cursor-crosshair"
              style={{ lineHeight: 0, transform: m.facing === -1 ? "scaleX(-1)" : undefined }}
              aria-label="bonk this crow"
            >
              {m.state === "perch" ? (
                <Sprite rects={PERCH_RECTS} eye={[11, 1]} />
              ) : (
                <span className="garden-flap relative block" style={{ width: W, height: H }}>
                  <span className="frame-a absolute inset-0">
                    <Sprite rects={[...FLY_RECTS, ...WING_UP]} eye={[12, 1]} />
                  </span>
                  <span className="frame-b absolute inset-0">
                    <Sprite rects={[...FLY_RECTS, ...WING_DOWN]} eye={[12, 1]} />
                  </span>
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-ink-faint">
          murder size: <span className="font-bold text-ink">{crowMeta.length}</span> / {MAX_CROWS} ·
          bonk within 2s for combo ×2 · past 15 bonks they dodge your cursor
        </p>
        <p className="font-mono text-[10px] text-ink-faint">
          no crows were harmed, they respawn out of spite
        </p>
      </div>
    </div>
  );
}
