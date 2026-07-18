/**
 * Branded vector art for Roost posts. Flat, geometric, on-theme (crimson #d62221
 * on cream #f3eee5, ink #120f17). Vector, so crisp at any size, designed, not
 * generated. Rendered via the `art` block (inline SVG).
 */

const INK = "#120f17";
const CROW = "#d62221";
const CREAM = "#f3eee5";
const PAPER = "#fffdf9";
const TAUPE = "#847c6e";
const MINT = "#8fd6a4";
const CORAL = "#ff8a87";

const font = `font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"`;
const mono = `font-family="ui-monospace, SFMono-Regular, Menlo, monospace"`;

/** Meaning, not spelling: three phrasings collapse to one meaning-point. */
export const ART_MEANING = `
<svg viewBox="0 0 880 330" role="img" aria-label="Three differently worded questions map to the same meaning">
  <rect x="0" y="0" width="880" height="330" fill="${CREAM}"/>
  ${[
    ["“how do I reset my password?”", 60],
    ["“forgot my login, help”", 140],
    ["“change account password”", 220],
  ]
    .map(
      ([t, y]) => `
    <g>
      <rect x="34" y="${y}" width="300" height="52" rx="10" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
      <circle cx="60" cy="${(y as number) + 26}" r="6" fill="${CROW}"/>
      <text x="82" y="${(y as number) + 31}" ${font} font-size="15" fill="${INK}">${t}</text>
      <path d="M340 ${(y as number) + 26} C 400 ${(y as number) + 26}, 400 165, 452 165" fill="none" stroke="${TAUPE}" stroke-width="2" stroke-dasharray="4 4"/>
    </g>`
    )
    .join("")}
  <g transform="translate(452,165)">
    <circle r="46" fill="${PAPER}" stroke="${INK}" stroke-width="2.5"/>
    <circle r="30" fill="none" stroke="${CROW}" stroke-width="2.5"/>
    <circle r="7" fill="${CROW}"/>
    <text x="0" y="74" ${mono} font-size="11" fill="${TAUPE}" text-anchor="middle" letter-spacing="1.5">CROWSIGHT</text>
  </g>
  <path d="M498 165 H 566" fill="none" stroke="${INK}" stroke-width="2.5" marker-end="url(#ar)"/>
  <g transform="translate(590,40)">
    <rect x="0" y="0" width="256" height="250" rx="12" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
    <circle cx="70" cy="120" r="60" fill="none" stroke="${CROW}" stroke-width="1.5" stroke-dasharray="5 5"/>
    ${[
      [58, 108],
      [92, 132],
      [66, 150],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${CROW}"/>`)
      .join("")}
    ${[
      [180, 60],
      [210, 190],
      [150, 210],
      [200, 100],
      [130, 70],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${TAUPE}"/>`)
      .join("")}
    <text x="128" y="235" ${mono} font-size="11" fill="${TAUPE}" text-anchor="middle">one meaning · one cache hit</text>
  </g>
  <defs><marker id="ar" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${INK}"/></marker></defs>
</svg>`;

/** The repeat bill: what identical questions cost with and without a meaning-aware cache. */
export const ART_PAYTWICE = `
<svg viewBox="0 0 880 300" role="img" aria-label="The same answer billed many times, versus billed once">
  <rect width="880" height="300" fill="${CREAM}"/>
  <text x="40" y="46" ${mono} font-size="12" fill="${TAUPE}" letter-spacing="1.5">WITHOUT A SEMANTIC CACHE</text>
  ${[0, 1, 2, 3].map((i) => `
    <g transform="translate(${40 + i * 92},64)">
      <rect width="76" height="96" rx="8" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
      <line x1="14" y1="26" x2="62" y2="26" stroke="${TAUPE}" stroke-width="2"/>
      <line x1="14" y1="42" x2="52" y2="42" stroke="${TAUPE}" stroke-width="2"/>
      <text x="38" y="78" ${mono} font-size="15" fill="${CROW}" text-anchor="middle" font-weight="bold">$</text>
    </g>`).join("")}
  <text x="40" y="196" ${mono} font-size="12" fill="${TAUPE}" letter-spacing="1.5">WITH CROWKIS</text>
  <g transform="translate(40,214)">
    <rect width="76" height="60" rx="8" fill="${PAPER}" stroke="${CROW}" stroke-width="2.5"/>
    <text x="38" y="38" ${mono} font-size="15" fill="${CROW}" text-anchor="middle" font-weight="bold">$</text>
  </g>
  ${[1, 2, 3].map((i) => `
    <g transform="translate(${40 + i * 92},214)">
      <rect width="76" height="60" rx="8" fill="none" stroke="${TAUPE}" stroke-width="2" stroke-dasharray="5 4"/>
      <text x="38" y="38" ${mono} font-size="13" fill="${TAUPE}" text-anchor="middle">reused</text>
    </g>`).join("")}
  <text x="470" y="250" ${font} font-size="15" fill="${INK}">one paid answer, the rest served from cache, that is the bill you stop paying.</text>
</svg>`;

/** A navigable small-world graph, the HNSW motif with a highlighted search path. */
export const ART_GRAPH = `
<svg viewBox="0 0 880 320" role="img" aria-label="A navigable small-world graph with a highlighted search path">
  <rect width="880" height="320" fill="${CREAM}"/>
  ${[
    [120, 70], [260, 50], [420, 90], [600, 60], [760, 100],
    [90, 180], [230, 210], [380, 180], [540, 220], [700, 190],
    [170, 280], [330, 270], [480, 290], [640, 280], [800, 250],
  ]
    .map(
      ([x, y], i) =>
        `<circle cx="${x}" cy="${y}" r="8" fill="${i === 0 ? CROW : PAPER}" stroke="${INK}" stroke-width="2"/>`
    )
    .join("")}
  ${[
    [120, 70, 260, 50], [260, 50, 420, 90], [420, 90, 380, 180], [380, 180, 540, 220],
    [540, 220, 700, 190], [230, 210, 380, 180], [90, 180, 230, 210], [330, 270, 480, 290],
    [600, 60, 420, 90], [700, 190, 760, 100], [170, 280, 330, 270], [480, 290, 640, 280],
  ]
    .map(([x1, y1, x2, y2]) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${TAUPE}" stroke-width="1.4"/>`)
    .join("")}
  <polyline points="120,70 260,50 420,90 380,180 540,220" fill="none" stroke="${CROW}" stroke-width="3"/>
  <circle cx="540" cy="220" r="12" fill="none" stroke="${CROW}" stroke-width="2.5"/>
  <text x="120" y="46" ${mono} font-size="11" fill="${CROW}" text-anchor="middle">enter</text>
  <text x="540" y="252" ${mono} font-size="11" fill="${CROW}" text-anchor="middle">nearest</text>
  <text x="40" y="308" ${mono} font-size="11" fill="${TAUPE}">a few hops across a million points · sub-millisecond</text>
</svg>`;

/** Isolated memory lanes, tenants/agents that never see each other's data. */
export const ART_LANES = `
<svg viewBox="0 0 880 300" role="img" aria-label="Separate agents with memory that never crosses lanes">
  <rect width="880" height="300" fill="${CREAM}"/>
  ${[
    ["agent · tenant A", 40, CROW],
    ["agent · tenant B", 130, INK],
    ["agent · tenant C", 220, TAUPE],
  ]
    .map(
      ([label, y, c]) => `
    <g>
      <rect x="34" y="${y}" width="812" height="72" rx="10" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
      <circle cx="72" cy="${(y as number) + 36}" r="16" fill="none" stroke="${c}" stroke-width="2.5"/>
      <circle cx="72" cy="${(y as number) + 36}" r="5" fill="${c}"/>
      <text x="104" y="${(y as number) + 41}" ${font} font-size="14" fill="${INK}">${label}</text>
      ${[0, 1, 2, 3, 4].map((i) => `<rect x="${300 + i * 100}" y="${(y as number) + 22}" width="86" height="28" rx="6" fill="${CREAM}" stroke="${c}" stroke-width="1.5"/>`).join("")}
    </g>`
    )
    .join("")}
  <line x1="290" y1="30" x2="290" y2="264" stroke="${INK}" stroke-width="2" stroke-dasharray="2 6"/>
  <text x="600" y="292" ${mono} font-size="11" fill="${TAUPE}" text-anchor="middle">every recall is scoped, no lane can read another’s memory</text>
</svg>`;

/** The quality gate, crowjudge giving the second opinion before an answer is served. */
export const ART_GATE = `
<svg viewBox="0 0 880 300" role="img" aria-label="A candidate answer passes a quality gate before it is served">
  <rect width="880" height="300" fill="${CREAM}"/>
  <rect x="40" y="120" width="150" height="60" rx="10" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
  <text x="115" y="146" ${font} font-size="13" fill="${INK}" text-anchor="middle">near-match</text>
  <text x="115" y="165" ${mono} font-size="11" fill="${TAUPE}" text-anchor="middle">cos 0.88</text>
  <path d="M190 150 H 300" stroke="${INK}" stroke-width="2.5" marker-end="url(#ar2)"/>
  <g transform="translate(360,150)">
    <path d="M0 -70 L60 0 L0 70 L-60 0 Z" fill="${PAPER}" stroke="${CROW}" stroke-width="2.5"/>
    <text x="0" y="-6" ${mono} font-size="12" fill="${CROW}" text-anchor="middle" font-weight="bold">CROW</text>
    <text x="0" y="12" ${mono} font-size="12" fill="${CROW}" text-anchor="middle" font-weight="bold">JUDGE</text>
    <text x="0" y="30" ${mono} font-size="10" fill="${TAUPE}" text-anchor="middle">re-reads both</text>
  </g>
  <path d="M420 120 C 520 70, 600 70, 690 70" fill="none" stroke="${MINT}" stroke-width="2.5" marker-end="url(#arg)"/>
  <path d="M420 180 C 520 230, 600 230, 690 230" fill="none" stroke="${CORAL}" stroke-width="2.5" marker-end="url(#arr)"/>
  <g transform="translate(700,52)"><rect width="150" height="40" rx="8" fill="${PAPER}" stroke="${MINT}" stroke-width="2.5"/><text x="75" y="26" ${font} font-size="13" fill="${INK}" text-anchor="middle">✓ served</text></g>
  <g transform="translate(700,210)"><rect width="150" height="40" rx="8" fill="${PAPER}" stroke="${CORAL}" stroke-width="2.5"/><text x="75" y="26" ${font} font-size="13" fill="${INK}" text-anchor="middle">✕ ask the model</text></g>
  <defs>
    <marker id="ar2" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${INK}"/></marker>
    <marker id="arg" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${MINT}"/></marker>
    <marker id="arr" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${CORAL}"/></marker>
  </defs>
</svg>`;

/** Drop-in: many clients, one port, model only on a miss. */
export const ART_DROPIN = `
<svg viewBox="0 0 880 300" role="img" aria-label="Existing Redis clients connect to Crowkis on the same port">
  <rect width="880" height="300" fill="${CREAM}"/>
  ${[
    ["redis-py", 40],
    ["ioredis", 110],
    ["Lettuce", 180],
  ]
    .map(
      ([t, y]) => `
    <g>
      <rect x="34" y="${y}" width="150" height="50" rx="9" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>
      <text x="109" y="${(y as number) + 30}" ${mono} font-size="14" fill="${INK}" text-anchor="middle">${t}</text>
      <path d="M184 ${(y as number) + 25} C 260 ${(y as number) + 25}, 300 150, 360 150" fill="none" stroke="${TAUPE}" stroke-width="2"/>
    </g>`
    )
    .join("")}
  <g transform="translate(360,110)">
    <rect width="180" height="80" rx="12" fill="${PAPER}" stroke="${CROW}" stroke-width="2.5"/>
    <text x="90" y="38" ${font} font-size="17" fill="${INK}" text-anchor="middle" font-weight="bold">crowkis</text>
    <text x="90" y="60" ${mono} font-size="11" fill="${TAUPE}" text-anchor="middle">RESP3 · :6379</text>
  </g>
  <path d="M540 150 H 660" stroke="${INK}" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#ar3)"/>
  <text x="600" y="140" ${mono} font-size="11" fill="${TAUPE}" text-anchor="middle">only on a miss</text>
  <g transform="translate(662,120)">
    <rect width="176" height="60" rx="12" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>
    <text x="88" y="37" ${font} font-size="14" fill="${INK}" text-anchor="middle">your LLM provider</text>
  </g>
  <defs><marker id="ar3" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="${INK}"/></marker></defs>
</svg>`;
