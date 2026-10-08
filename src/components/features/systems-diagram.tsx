// How the seven systems sit around one verdict, for /features. Server component:
// inline SVG in theme tokens (same house style as marketing/why-diagrams.tsx), no
// client JS of its own. Each numbered node is a plain in-page link to that system's
// write-up; features-motion.tsx lights the node whose write-up is on screen, and
// features.module.css moves the packets.

import type { CSSProperties, ReactNode } from "react";
import s from "./features.module.css";

type Sys = { n: string; name: string; short: string };

const vars = (v: Record<string, number | string>) => v as CSSProperties;

// Four systems each supply one of the confidence signals named in the copy.
const SOURCES: { n: string; y: number; signal: string }[] = [
  { n: "01", y: 66, signal: "similarity" },
  { n: "07", y: 116, signal: "freshness" },
  { n: "02", y: 166, signal: "trust" },
  { n: "03", y: 216, signal: "intent threshold" },
];
const SRC_X = 36;
const SRC_W = 170;
const NODE_H = 40;
const BUS_X = 326;
const GATE = { x: 36, y: 286, w: 314, h: 52 };
const OUT_Y = 372;
const OUT_H = 44;
const TAIL_Y = 436;
// [node, centre x] under each outcome
const TAILS: [string, number][] = [
  ["05", 110],
  ["04", 276],
];

function Head({ x, y }: { x: number; y: number }) {
  return <path d="M0 0 L-4.5 -8 L4.5 -8 Z" transform={`translate(${x} ${y})`} className="fill-ink" />;
}

function Node({
  sys,
  x,
  y,
  w,
  h = NODE_H,
  solid,
  sub,
  children,
}: {
  sys: Sys;
  x: number;
  y: number;
  w: number;
  h?: number;
  solid?: boolean;
  sub?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={`#system-${sys.n}`}
      data-node={sys.n}
      aria-label={`${sys.n} ${sys.name}: jump to its explanation`}
    >
      {children}
      <rect x={x + 1} y={y + 1} width={w} height={h} rx={8} className={`fill-crow ${s.glow}`} />
      <g className={s.node}>
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={8}
          strokeWidth={2}
          className={solid ? "fill-ink stroke-ink" : "fill-paper-card stroke-ink"}
        />
        <text
          x={solid ? x + w / 2 : x + 12}
          y={y + h / 2 + (sub ? -3 : 4.5)}
          textAnchor={solid ? "middle" : "start"}
          fontSize={12.5}
          fontWeight={700}
          className={`font-mono ${solid ? "fill-paper-card" : "fill-ink"}`}
        >
          <tspan className={solid ? undefined : "fill-crow"}>{sys.n}</tspan> {sys.short}
        </text>
        {sub ? (
          <text
            x={x + w / 2}
            y={y + h / 2 + 14}
            textAnchor="middle"
            fontSize={10}
            className={`font-mono ${solid ? "fill-paper-deep" : "fill-ink-soft"}`}
          >
            {sub}
          </text>
        ) : null}
      </g>
    </a>
  );
}

function Outcome({ cx, l1, l2 }: { cx: number; l1: string; l2: string }) {
  return (
    <g>
      <rect x={cx - 75} y={OUT_Y} width={150} height={OUT_H} rx={8} strokeWidth={2} className="fill-paper-deep stroke-ink" />
      <text x={cx} y={OUT_Y + 19} textAnchor="middle" fontSize={12.5} fontWeight={700} className="fill-ink font-display">
        {l1}
      </text>
      <text x={cx} y={OUT_Y + 34} textAnchor="middle" fontSize={10} className="fill-ink-soft font-mono">
        {l2}
      </text>
    </g>
  );
}

export function SystemsDiagram({ systems }: { systems: Sys[] }) {
  const sys = (n: string) => systems.find((x) => x.n === n)!;
  const gateCx = GATE.x + GATE.w / 2;
  const forkY = GATE.y + GATE.h + 14;

  return (
    <svg
      data-stage
      viewBox="0 0 360 482"
      role="group"
      aria-label="How the seven systems work together: an incoming question is checked by matching, freshness control, the anti-poisoning pipeline and adaptive thresholds; confidence scoring combines their signals and either serves the answer from cache or sends the question to the model. Smart eviction decides what stays in the cache, and reasoning reuse covers what a model call would otherwise repeat."
      className={`mx-auto block h-auto w-full max-w-[380px] ${s.stage}`}
    >
      {/* the question, and the trunk that hands it to each check */}
      <rect x={10} y={4} width={340} height={44} rx={8} strokeWidth={1.5} className="fill-paper-deep stroke-ink" />
      <text x={22} y={23} fontSize={12.5} className="fill-ink font-mono">
        “what’s your refund window?”
      </text>
      <text x={22} y={38} fontSize={10} className="fill-ink-soft font-mono">
        incoming question
      </text>
      <path
        d={`M22 48 V${SOURCES[3].y + 20} ${SOURCES.map((r) => `M22 ${r.y + 20} H${SRC_X}`).join(" ")}`}
        fill="none"
        strokeWidth={1.75}
        className="stroke-ink"
      />

      {/* signal wires into the bus, then down into the gate */}
      <path
        d={`${SOURCES.map((r) => `M${SRC_X + SRC_W} ${r.y + 20} H${BUS_X}`).join(" ")} M${BUS_X} ${SOURCES[0].y + 20} V${GATE.y - 6}`}
        fill="none"
        strokeWidth={1.75}
        className="stroke-ink"
      />
      <Head x={BUS_X} y={GATE.y} />

      {SOURCES.map((r, i) => {
        const cy = r.y + 20;
        const labelW = r.signal.length * 5.9 + 10;
        const labelX = (SRC_X + SRC_W + BUS_X) / 2;
        return (
          <Node key={r.n} sys={sys(r.n)} x={SRC_X} y={r.y} w={SRC_W}>
            {/* packet first, so it passes behind the label rather than over it */}
            <rect
              x={SRC_X + SRC_W - 3.5}
              y={cy - 3.5}
              width={7}
              height={7}
              className={`fill-crow ${s.packet}`}
              style={vars({ "--dx": BUS_X - SRC_X - SRC_W, "--dy": GATE.y - cy - 10, "--i": i })}
            />
            <rect x={labelX - labelW / 2} y={cy - 8} width={labelW} height={16} className="fill-paper-card" />
            <text x={labelX} y={cy + 3.5} textAnchor="middle" fontSize={9.5} className="fill-ink-soft font-mono">
              {r.signal}
            </text>
          </Node>
        );
      })}

      {/* the gate forks: clears the bar, or doesn't */}
      <path
        d={`M${gateCx} ${GATE.y + GATE.h} V${forkY} M${TAILS[0][1]} ${OUT_Y - 6} V${forkY} H${TAILS[1][1]} V${OUT_Y - 6}`}
        fill="none"
        strokeWidth={1.75}
        strokeLinejoin="round"
        className="stroke-ink"
      />
      {TAILS.map(([n, cx]) => (
        <g key={n}>
          <Head x={cx} y={OUT_Y} />
          <path d={`M${cx} ${OUT_Y + OUT_H} V${TAIL_Y}`} strokeWidth={1.75} className="stroke-ink" />
        </g>
      ))}
      <Node sys={sys("06")} {...GATE} solid sub="geometric mean of five signals">
        {TAILS.map(([n, cx], i) => (
          <rect
            key={n}
            x={gateCx - 3.5}
            y={forkY - 3.5}
            width={7}
            height={7}
            className={`fill-crow ${s.packet}`}
            style={vars({ "--dx": cx - gateCx, "--dy": OUT_Y - forkY - 10, "--i": i })}
          />
        ))}
      </Node>
      <Outcome cx={TAILS[0][1]} l1="serve from cache" l2="clears the bar" />
      <Outcome cx={TAILS[1][1]} l1="go to the model" l2="uncertain match" />

      {TAILS.map(([n, cx]) => (
        <Node key={n} sys={sys(n)} x={cx - 80} y={TAIL_Y} w={160}>
          <rect
            x={cx - 3.5}
            y={OUT_Y + OUT_H}
            width={7}
            height={7}
            className={`fill-crow ${s.packet} ${s.drip}`}
            style={vars({ "--fall": `${TAIL_Y - OUT_Y - OUT_H - 7}px` })}
          />
        </Node>
      ))}
    </svg>
  );
}
