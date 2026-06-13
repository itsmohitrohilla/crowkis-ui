"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A pixel-art crow that lives in the site. It flies in, perches (bottom
 * corners or on the header's edge), looks left/right/up/down, hops, blinks —
 * and startles away if your cursor creeps up on it. Catch it with a click
 * before it escapes and it gets ANGRY: the whole site flips into rage mode
 * for a few seconds. Reduced-motion users get a calm static sprite.
 */

const PX = 3.2; // pixel scale — visible, not overbearing
const GRID_W = 16;
const GRID_H = 12;
const W = GRID_W * PX;
const H = GRID_H * PX;
const NOTICE_RADIUS = 150;
const FLEE_RADIUS = 65;
const RAGE_MS = 6000;

type Frame = "perch" | "up" | "down";

type Rect = [number, number, number, number, string?];

const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";

const BODY_PERCH: Rect[] = [
  [9, 0, 4, 4], // head
  [13, 1, 2, 1], // beak
  [3, 3, 8, 5], // body
  [8, 2, 2, 1], // neck slope
  [0, 3, 3, 2], // tail
  [4, 4, 5, 3, WING], // folded wing
  [6, 8, 1, 2], // leg
  [9, 8, 1, 2], // leg
  [5, 10, 2, 1], // foot
  [8, 10, 2, 1], // foot
];

const BODY_FLY: Rect[] = [
  [10, 0, 4, 4], // head, raised above the body line
  [14, 1, 2, 1], // beak
  [9, 3, 2, 2], // neck
  [3, 4, 8, 4], // body
  [0, 4, 2, 1], // tail, fanned
  [0, 5, 3, 2], // tail
];

const WING_UP: Rect[] = [
  [4, 0, 5, 2, WING],
  [5, 2, 4, 2, WING],
];

const WING_DOWN: Rect[] = [
  [5, 8, 4, 2, WING],
  [4, 6, 5, 2, WING],
];

function CrowSprite({
  frame,
  facing,
  blink,
  headTilt,
  angry,
}: {
  frame: Frame;
  facing: 1 | -1;
  blink: boolean;
  headTilt: number;
  angry: boolean;
}) {
  const rects =
    frame === "perch"
      ? BODY_PERCH
      : [...BODY_FLY, ...(frame === "up" ? WING_UP : WING_DOWN)];
  const eye: Rect = frame === "perch" ? [11, 1, 1, 1] : [12, 1, 1, 1];

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${GRID_W} ${GRID_H}`}
      shapeRendering="crispEdges"
      style={{
        transform: `${facing === -1 ? "scaleX(-1) " : ""}rotate(${headTilt * facing}deg)`,
        transformOrigin: "60% 80%",
        transition: "transform 0.25s ease",
      }}
      aria-hidden
    >
      {rects.map(([x, y, w, h, fill], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={fill ?? INK} />
      ))}
      {angry ? (
        <>
          {/* furious wide eye + open beak */}
          <rect x={eye[0] - 0.5} y={eye[1] - 0.5} width={2} height={2} fill={EYE} />
          <rect
            x={frame === "perch" ? 13 : 14}
            y={frame === "perch" ? 2.5 : 2.5}
            width={2}
            height={1}
            fill={EYE}
          />
        </>
      ) : !blink ? (
        <rect x={eye[0]} y={eye[1]} width={1} height={1} fill={EYE} />
      ) : null}
    </svg>
  );
}

type Mode = "hidden" | "flying" | "perched";

export function PixelCrow() {
  const [mode, setMode] = useState<Mode>("hidden");
  const [frame, setFrame] = useState<Frame>("perch");
  const [facing, setFacing] = useState<1 | -1>(1);
  const [blink, setBlink] = useState(false);
  const [headTilt, setHeadTilt] = useState(0);
  const [hop, setHop] = useState(0);
  const [angry, setAngry] = useState(false);
  const [reduced, setReduced] = useState<boolean | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -200, y: -200 });
  const modeRef = useRef<Mode>("hidden");
  const angryRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);
  const fleeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const raf = useRef(0);
  const interrupted = useRef(false);
  const fleeRef = useRef<(restMs?: number) => void>(() => {});
  const rageRef = useRef<() => void>(() => {});

  modeRef.current = mode;
  angryRef.current = angry;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced !== false) return;

    let alive = true;
    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => alive && fn(), ms);
      timers.current.push(t);
    };
    const every = (fn: () => void, ms: number) => {
      const i = setInterval(() => alive && fn(), ms);
      intervals.current.push(i);
      return i;
    };
    const clearPerchLoops = () => {
      intervals.current.forEach(clearInterval);
      intervals.current = [];
    };
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const place = (x: number, y: number) => {
      posRef.current = { x, y };
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };

    const fly = (
      from: { x: number; y: number },
      to: { x: number; y: number },
      ms: number,
      onDone: () => void,
    ) => {
      setMode("flying");
      setHeadTilt(0);
      setFacing(to.x >= from.x ? 1 : -1);
      const flap = every(() => setFrame((f) => (f === "up" ? "down" : "up")), 110);
      const bobs = Math.max(2, Math.round(ms / 900));
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - t0) / ms, 1);
        const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        const x = from.x + (to.x - from.x) * ease;
        const y =
          from.y + (to.y - from.y) * ease + Math.sin(p * Math.PI * bobs) * 16 * (1 - p * 0.4);
        place(x, y);
        if (p < 1 && alive) {
          raf.current = requestAnimationFrame(step);
        } else if (alive) {
          clearInterval(flap);
          onDone();
        }
      };
      raf.current = requestAnimationFrame(step);
    };

    const exitAndRest = (restMs: number) => {
      clearPerchLoops();
      const { x, y } = posRef.current;
      const vw = window.innerWidth;
      const exit = {
        x: x > vw / 2 ? vw + 90 : -90,
        y: Math.max(50, y - rand(80, 180)),
      };
      fly({ x, y }, exit, rand(1400, 2200), () => {
        setMode("hidden");
        setAngry(false);
        later(cycle, restMs);
      });
    };
    fleeRef.current = (restMs = rand(16000, 30000)) => {
      if (modeRef.current !== "perched" || interrupted.current || angryRef.current) return;
      interrupted.current = true;
      cancelAnimationFrame(raf.current);
      exitAndRest(restMs);
    };

    // the easter egg: catch the crow and everyone pays for it
    rageRef.current = () => {
      if (angryRef.current) return;
      interrupted.current = true;
      cancelAnimationFrame(raf.current);
      clearPerchLoops();
      setAngry(true);
      setMode("perched");
      setFrame("perch");
      setHeadTilt(0);
      document.documentElement.classList.add("crow-rage");
      later(() => {
        document.documentElement.classList.remove("crow-rage");
      }, RAGE_MS);
      // screams for a moment, then storms off
      later(() => {
        if (!alive) return;
        const { x, y } = posRef.current;
        const vw = window.innerWidth;
        const exit = { x: x > vw / 2 ? vw + 90 : -90, y: Math.max(40, y - 200) };
        fly({ x, y }, exit, 1100, () => {
          setMode("hidden");
          setAngry(false);
          later(cycle, rand(25000, 45000));
        });
      }, 1500);
    };

    const perchSpots = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const headerBottom =
        document.querySelector("header")?.getBoundingClientRect().bottom ?? 96;
      return [
        { x: rand(16, 70), y: vh - H - 4 },
        { x: vw - W - rand(16, 70), y: vh - H - 4 },
        { x: rand(vw * 0.25, vw * 0.7), y: headerBottom - H + 2 },
      ];
    };

    const startPerchLife = () => {
      setMode("perched");
      setFrame("perch");
      every(() => {
        if (angryRef.current) return;
        setBlink(true);
        later(() => setBlink(false), 130);
      }, rand(1700, 3200));
      every(() => {
        if (angryRef.current) return;
        const roll = Math.random();
        if (roll < 0.3) {
          setFacing((f) => (-f) as 1 | -1);
        } else if (roll < 0.55) {
          setHeadTilt(-14);
          later(() => setHeadTilt(0), rand(500, 1100));
        } else if (roll < 0.72) {
          setHeadTilt(10);
          later(() => setHeadTilt(0), rand(400, 900));
        } else if (roll < 0.86) {
          setHop(-7);
          later(() => setHop(0), 160);
          place(posRef.current.x + rand(-14, 14), posRef.current.y);
        }
      }, 1500);
      later(() => {
        if (!interrupted.current && !angryRef.current && alive) {
          exitAndRest(rand(20000, 38000));
        }
      }, rand(11000, 22000));
    };

    const cycle = () => {
      if (!alive) return;
      interrupted.current = false;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const fromLeft = Math.random() < 0.5;
      const start = { x: fromLeft ? -80 : vw + 80, y: rand(vh * 0.12, vh * 0.45) };

      if (Math.random() < 0.35) {
        const end = { x: fromLeft ? vw + 80 : -80, y: rand(vh * 0.1, vh * 0.5) };
        place(start.x, start.y);
        fly(start, end, rand(5200, 7400), () => {
          setMode("hidden");
          later(cycle, rand(18000, 34000));
        });
        return;
      }

      const spots = perchSpots();
      const spot = spots[Math.floor(Math.random() * spots.length)];
      place(start.x, start.y);
      fly(start, spot, rand(2800, 4200), () => {
        if (!interrupted.current) startPerchLife();
      });
    };

    // a real crow doesn't let you walk straight up to it — but it hesitates
    // for a beat first, which is your one chance to actually catch it
    const onMouseMove = (e: MouseEvent) => {
      if (modeRef.current !== "perched" || angryRef.current) return;
      const { x, y } = posRef.current;
      const dx = e.clientX - (x + W / 2);
      const dy = e.clientY - (y + H / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < FLEE_RADIUS) {
        if (!fleeTimer.current) {
          fleeTimer.current = setTimeout(() => {
            fleeTimer.current = null;
            fleeRef.current();
          }, 420);
        }
      } else {
        if (fleeTimer.current) {
          clearTimeout(fleeTimer.current);
          fleeTimer.current = null;
        }
        if (dist < NOTICE_RADIUS) setFacing(dx >= 0 ? 1 : -1);
      }
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    later(cycle, rand(3500, 8000));

    return () => {
      alive = false;
      window.removeEventListener("mousemove", onMouseMove);
      if (fleeTimer.current) clearTimeout(fleeTimer.current);
      timers.current.forEach(clearTimeout);
      intervals.current.forEach(clearInterval);
      cancelAnimationFrame(raf.current);
    };
  }, [reduced]);

  if (reduced === null) return null;

  if (reduced) {
    return (
      <div className="pointer-events-none fixed bottom-1 left-4 z-50" aria-hidden>
        <CrowSprite frame="perch" facing={1} blink={false} headTilt={0} angry={false} />
      </div>
    );
  }

  if (mode === "hidden") return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-50 will-change-transform"
      aria-hidden
    >
      {angry ? (
        <div className="caw-bubble pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border-2 border-ink bg-crow px-2.5 py-1 font-mono text-xs font-bold text-paper-card shadow-block-sm">
          CAW!!
        </div>
      ) : null}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => rageRef.current()}
        className={`pointer-events-auto block cursor-pointer bg-transparent ${angry ? "crow-fuming" : ""}`}
        style={{ lineHeight: 0, transform: `translateY(${hop}px)`, transition: "transform 0.16s ease" }}
        aria-label="a crow"
      >
        <CrowSprite frame={frame} facing={facing} blink={blink} headTilt={headTilt} angry={angry} />
      </button>
    </div>
  );
}
