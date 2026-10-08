// Inline-SVG diagrams for /why. Server component, no client JS, no dependencies.
// Every colour is a theme token (fill-*/stroke-* → rgb(var(--c-*))), so light and
// dark mode both work. viewBoxes are phone-width on purpose: at 320–400px the SVG
// renders ~1:1, so text never shrinks below ~9px; wider layouts cap via max-w.
// Topology was designed and validated with archify (workflow type) before porting.

type Pt = [number, number];

function Arrow({ pts, bad }: { pts: Pt[]; bad?: boolean }) {
  const [x, y] = pts[pts.length - 1];
  const [px, py] = pts[pts.length - 2];
  const rad = Math.atan2(y - py, x - px);
  // stop the line inside the arrowhead so no blunt stroke end pokes out of the tip
  const line = [...pts.slice(0, -1), [x - 6 * Math.cos(rad), y - 6 * Math.sin(rad)]];
  return (
    <g>
      <polyline
        points={line.map((p) => p.join(",")).join(" ")}
        fill="none"
        strokeWidth={1.75}
        strokeLinejoin="round"
        className={bad ? "stroke-crow" : "stroke-ink"}
      />
      <path
        d="M0 0 L-8 -4.5 L-8 4.5 Z"
        transform={`translate(${x} ${y}) rotate(${(rad * 180) / Math.PI})`}
        className={bad ? "fill-crow" : "fill-ink"}
      />
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  l1,
  l2,
  tone = "plain",
  display,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  l1: string;
  l2?: string;
  tone?: "plain" | "bad" | "input" | "solid";
  display?: boolean;
}) {
  const box = {
    plain: "fill-paper-card stroke-ink",
    bad: "fill-crow-tint stroke-crow",
    input: "fill-paper-deep stroke-ink",
    solid: "fill-ink stroke-ink",
  }[tone];
  const solid = tone === "solid";
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} strokeWidth={2} className={box} />
      <text
        x={cx}
        y={y + h / 2 + (l2 ? -3 : 4.5)}
        textAnchor="middle"
        fontSize={display ? 14 : 12.5}
        fontWeight={700}
        className={`${display ? "font-display" : "font-mono"} ${solid ? "fill-paper-card" : "fill-ink"}`}
      >
        {l1}
      </text>
      {l2 ? (
        <text
          x={cx}
          y={y + h / 2 + 13}
          textAnchor="middle"
          fontSize={10}
          className={`font-mono ${solid ? "fill-paper-deep" : "fill-ink-soft"}`}
        >
          {l2}
        </text>
      ) : null}
    </g>
  );
}

/* ── query → verdict rows (repeat traffic, exact-match, similarity-only) ── */

type Row = { q: string; via: string; l1: string; l2?: string; bad?: boolean };

const CHIP_H = 34;
const ELBOW_X = 22;
const VERDICT_X = 156;
const VERDICT_W = 176;
const BUS_X = 342;

export function QueryRows({
  label,
  rows,
  merge,
}: {
  /** text alternative read by screen readers */
  label: string;
  rows: Row[];
  /** every row funnels into this one box (the fan-in on the right) */
  merge?: { l1: string; l2: string };
}) {
  const vh = rows.some((r) => r.l2) ? 44 : 32;
  const pitch = CHIP_H + 10 + vh + 16;
  const mid = (i: number) => 2 + i * pitch + CHIP_H + 10 + vh / 2;
  const rowsEnd = 2 + rows.length * pitch - 16;
  const mergeY = rowsEnd + 20;
  const height = (merge ? mergeY + 46 : rowsEnd) + 2;

  return (
    <div className="p-4 sm:p-5">
      <svg
        viewBox={`0 0 348 ${height}`}
        role="img"
        aria-label={label}
        className="mx-auto block h-auto w-full max-w-[400px]"
      >
        {rows.map((r, i) => {
          const y = 2 + i * pitch;
          const cy = mid(i);
          const viaW = r.via.length * 6.3 + 10;
          const viaX = (ELBOW_X + VERDICT_X) / 2;
          return (
            <g key={r.q}>
              <Arrow
                bad={r.bad}
                pts={[
                  [ELBOW_X, y + CHIP_H],
                  [ELBOW_X, cy],
                  [VERDICT_X, cy],
                ]}
              />
              <rect x={2} y={y} width={250} height={CHIP_H} rx={8} strokeWidth={1.5} className="fill-paper-deep stroke-ink" />
              <text x={14} y={y + 21.5} fontSize={13} className="fill-ink font-mono">
                {`“${r.q}”`}
              </text>
              <rect x={viaX - viaW / 2} y={cy - 8} width={viaW} height={16} className="fill-paper-card" />
              <text x={viaX} y={cy + 3.5} textAnchor="middle" fontSize={10.5} className="fill-ink-soft font-mono">
                {r.via}
              </text>
              <Box x={VERDICT_X} y={cy - vh / 2} w={VERDICT_W} h={vh} l1={r.l1} l2={r.l2} tone={r.bad ? "bad" : "plain"} />
              {merge ? (
                <line x1={VERDICT_X + VERDICT_W} y1={cy} x2={BUS_X} y2={cy} strokeWidth={1.75} className="stroke-ink" />
              ) : null}
            </g>
          );
        })}
        {merge ? (
          <g>
            <Arrow
              pts={[
                [BUS_X, mid(0)],
                [BUS_X, mergeY + 23],
                [306, mergeY + 23],
              ]}
            />
            <Box x={40} y={mergeY} w={266} h={46} l1={merge.l1} l2={merge.l2} tone="solid" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

/* ── the gap: three caches, same incoming question, side by side ── */
// DOM order follows the page narrative (two failed fixes, then Crowkis); on desktop
// CSS order puts Crowkis in the middle column, where the gap is.

type End = { l1: string; l2: string; via?: string; bad?: boolean };
type Lane = {
  name: string;
  kind: string;
  hero?: boolean;
  compares: [string, string];
  decides: [string, string];
  ends: End[]; // one outcome, or two for a gate that can pass or veto
  verdict: string;
};

const LANES: Lane[] = [
  {
    name: "exact-match",
    kind: "redis-style",
    compares: ["bytes", "identical or nothing"],
    decides: ["MISS", "one word changed"],
    ends: [{ l1: "model call, again ✗", l2: "full price, every time", bad: true }],
    verdict: "never wrong · never hits",
  },
  {
    name: "similarity-only",
    kind: "vector-style",
    compares: ["embedding distance", "near is enough"],
    decides: ["HIT", "0.91 similar"],
    ends: [{ l1: "wrong answer served ✗", l2: "‘cancel’ gets the ‘pause’ answer", bad: true }],
    verdict: "always hits · sometimes lies",
  },
  {
    name: "crowkis",
    kind: "the gap in the middle",
    hero: true,
    compares: ["meaning + structure", "both must agree"],
    decides: ["confidence + trust", "floor vetoes unsafe matches"],
    ends: [
      { l1: "reuse ✓", l2: "where they agree", via: "pass" },
      { l1: "refuse ✓", l2: "where they don’t", via: "veto" },
    ],
    verdict: "reuses aggressively · refuses the rest",
  },
];

const NODE_H = 48;
const STEP = 78; // node height + 30px connector
const STAGES = ["compares", "decides", "you get"];

function LaneFlow({ lane }: { lane: Lane }) {
  const y = (i: number) => 10 + i * STEP;
  const nodes: [string, string][] = [
    ["incoming question", "close to one already cached"],
    lane.compares,
    lane.decides,
  ];
  const fork = lane.ends.length === 2;
  const endY = y(3);
  const gateBottom = y(2) + NODE_H;
  return (
    <svg
      viewBox={`0 0 300 ${endY + NODE_H + 10}`}
      role="img"
      aria-label={`${lane.name} cache: an incoming question close to a cached one is compared by ${lane.compares[0]} (${lane.compares[1]}), then ${lane.decides[0]} (${lane.decides[1]}), result: ${lane.ends.map((e) => `${e.l1} ${e.l2}`).join("; or ")}.`}
      className="mx-auto block h-auto w-full max-w-[340px]"
    >
      {nodes.map(([l1, l2], i) => (
        <g key={l1}>
          <Box x={20} y={y(i)} w={260} h={NODE_H} l1={l1} l2={l2} tone={i === 0 ? "input" : "plain"} display />
          {i < 2 || !fork ? (
            <>
              <Arrow
                bad={i === 2 && lane.ends[0].bad}
                pts={[
                  [150, y(i) + NODE_H],
                  [150, y(i + 1)],
                ]}
              />
              <text x={162} y={y(i) + NODE_H + 18.5} fontSize={9.5} letterSpacing={1.2} className="fill-ink-soft font-mono uppercase">
                {STAGES[i]}
              </text>
            </>
          ) : null}
        </g>
      ))}
      {fork ? (
        lane.ends.map((e, i) => {
          const cx = i === 0 ? 82 : 218;
          return (
            <g key={e.l1}>
              <Arrow
                pts={[
                  [150, gateBottom],
                  [150, gateBottom + 12],
                  [cx, gateBottom + 12],
                  [cx, endY],
                ]}
              />
              <text x={cx + (i === 0 ? -8 : 8)} y={gateBottom + 25} textAnchor={i === 0 ? "end" : "start"} fontSize={9.5} letterSpacing={1.2} className="fill-ink-soft font-mono uppercase">
                {e.via}
              </text>
              <Box x={cx - 62} y={endY} w={124} h={NODE_H} l1={e.l1} l2={e.l2} display />
            </g>
          );
        })
      ) : (
        <Box x={20} y={endY} w={260} h={NODE_H} l1={lane.ends[0].l1} l2={lane.ends[0].l2} tone={lane.ends[0].bad ? "bad" : "plain"} display />
      )}
    </svg>
  );
}

export function CacheGap() {
  return (
    <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-3">
      {LANES.map((lane, i) => (
        <section
          key={lane.name}
          className={`overflow-hidden rounded-lg border-2 border-ink bg-paper ${
            lane.hero ? "shadow-block-red lg:order-2" : i === 1 ? "lg:order-3" : ""
          }`}
        >
          <h3
            className={`flex items-baseline justify-between gap-3 border-b-2 border-ink px-3 py-2 font-display text-base font-bold ${
              lane.hero ? "bg-crow text-stone-50" : "bg-paper-deep text-ink"
            }`}
          >
            {lane.name}
            <span className={`font-mono text-[10px] font-medium uppercase tracking-[0.14em] ${lane.hero ? "text-stone-50" : "text-ink-soft"}`}>
              {lane.kind}
            </span>
          </h3>
          <LaneFlow lane={lane} />
          <p className="border-t border-ink-line px-3 py-2 text-center font-mono text-[11px] font-semibold text-ink">
            {lane.verdict}
          </p>
        </section>
      ))}
    </div>
  );
}
