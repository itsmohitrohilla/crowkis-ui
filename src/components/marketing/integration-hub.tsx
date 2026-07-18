/**
 * Integration hub, every client/protocol orbits one cache. A frosted central
 * plate holds the Crowkis mark, a soft gradient halo sits behind it, and dashed
 * arcs connect six surface nodes. Pure SVG, theme-aware via CSS variables,
 * scales cleanly with the container.
 */

type Node = {
  label: string;
  cx: number;
  cy: number;
  color: string;
  glyph: string;
};

const HUB = { x: 450, y: 250 };

const NODES: Node[] = [
  { label: "Python SDK", cx: 150, cy: 92, color: "#3b82f6", glyph: "py" },
  { label: "Node SDK", cx: 758, cy: 84, color: "#22c55e", glyph: "JS" },
  { label: "crowkis cli · RESP3", cx: 108, cy: 250, color: "#8b5cf6", glyph: "›_" },
  { label: "MCP · agents", cx: 800, cy: 250, color: "#d62221", glyph: "AI" },
  { label: "gRPC", cx: 172, cy: 408, color: "#f59e0b", glyph: "gR" },
  { label: "REST API", cx: 732, cy: 408, color: "#14b8a6", glyph: "{}" },
];

function NodeChip({ node }: { node: Node }) {
  // width adapts to the label so long names (e.g. "crowkis cli · RESP3") fit
  const w = Math.max(168, Math.round(74 + node.label.length * 8.4));
  const h = 48;
  // center on cx, but clamp inside the 900-wide canvas so nothing clips
  const x = Math.max(6, Math.min(node.cx - w / 2, 894 - w));
  const y = node.cy - h / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill="var(--hub-card)"
        stroke="var(--hub-ink)"
        strokeWidth={2.5}
      />
      <rect x={x + 10} y={y + 10} width={28} height={28} rx={8} fill={node.color} />
      <text
        x={x + 24}
        y={y + 29}
        textAnchor="middle"
        fontFamily="var(--font-mono), monospace"
        fontWeight="700"
        fontSize="12"
        fill="#fffdf9"
      >
        {node.glyph}
      </text>
      <text
        x={x + 48}
        y={y + 30}
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="15"
        fill="var(--hub-ink)"
      >
        {node.label}
      </text>
    </g>
  );
}

export function IntegrationHub() {
  return (
    <svg
      viewBox="0 0 900 500"
      className="h-auto w-full"
      role="img"
      aria-label="Every client and protocol connects to one Crowkis cache"
      style={{
        ["--hub-ink" as string]: "rgb(var(--c-ink))",
        ["--hub-card" as string]: "rgb(var(--c-paper-card))",
        ["--hub-line" as string]: "rgb(var(--c-ink) / 0.35)",
      }}
    >
      <defs>
        <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d62221" stopOpacity="0.30" />
          <stop offset="45%" stopColor="#8b5cf6" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="plateFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
        </linearGradient>
        <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>

      {/* gradient halo */}
      <ellipse cx={HUB.x} cy={HUB.y} rx={300} ry={210} fill="url(#hubGlow)" filter="url(#soft)" />

      {/* dashed connector arcs (drawn first; the plate covers their inner ends) */}
      {NODES.map((n) => (
        <path
          key={n.label}
          className="hub-arc"
          d={`M ${HUB.x} ${HUB.y} Q ${HUB.x} ${n.cy} ${n.cx} ${n.cy}`}
          fill="none"
          stroke="var(--hub-line)"
          strokeWidth={2}
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
      ))}

      {/* small pulse dots travelling each arc endpoint */}
      {NODES.map((n) => (
        <circle key={`d-${n.label}`} cx={n.cx} cy={n.cy} r={3.5} fill={n.color} />
      ))}

      {/* frosted central plate (isometric-ish), logo embossed */}
      <g transform={`translate(${HUB.x} ${HUB.y})`}>
        <g transform="skewY(-8)">
          <rect x={-118} y={-78} width={236} height={156} rx={24} fill="rgb(var(--c-ink) / 0.12)" />
          <rect
            x={-118}
            y={-86}
            width={236}
            height={156}
            rx={24}
            fill="url(#plateFill)"
            stroke="var(--hub-ink)"
            strokeWidth={2.5}
          />
          <image href="/logo.png" x={-54} y={-62} width={108} height={108} opacity={0.92} />
        </g>
      </g>

      {/* the orbiting nodes */}
      {NODES.map((n) => (
        <NodeChip key={`chip-${n.label}`} node={n} />
      ))}
    </svg>
  );
}
