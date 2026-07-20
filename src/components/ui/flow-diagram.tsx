// Custom, on-brand flow diagram — replaces Mermaid. Pure SVG/CSS, no external JS.
// Parses the node labels out of a mermaid-style `flowchart` string and renders
// them as a clean vertical sequence of step cards connected by crow arrows.
// (We use the node sequence, not full graph layout — reads clean and never breaks.)

type Node = { id: string; label: string };

function parseNodes(chart: string): Node[] {
  const nodes: Node[] = [];
  const seen = new Set<string>();
  const nodeRe =
    /([A-Za-z0-9_]+)(?:\["([^"]*)"\]|\[([^\]]*)\]|\("([^"]*)"\)|\{"?([^}"]*)"?\})/g;
  for (const line of chart.split("\n")) {
    const t = line.trim();
    if (!t || /^(flowchart|graph|style|classDef|subgraph|end|direction|%%|linkStyle)/.test(t))
      continue;
    let m: RegExpExecArray | null;
    nodeRe.lastIndex = 0;
    while ((m = nodeRe.exec(line)) !== null) {
      const id = m[1];
      const label = (m[2] ?? m[3] ?? m[4] ?? m[5] ?? "")
        .replace(/<br\s*\/?>/gi, " · ")
        .replace(/&amp;/g, "&")
        .replace(/‹|›/g, (c) => (c === "‹" ? "<" : ">"))
        .trim();
      if (label && !seen.has(id)) {
        seen.add(id);
        nodes.push({ id, label });
      }
    }
  }
  return nodes;
}

export function FlowDiagram({ chart }: { chart: string }) {
  const nodes = parseNodes(chart);
  if (nodes.length === 0) {
    return (
      <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-ink-soft">
        {chart}
      </pre>
    );
  }
  return (
    <div className="p-5 sm:p-6">
      <ol className="mx-auto flex max-w-md flex-col">
        {nodes.map((n, i) => {
          const last = i === nodes.length - 1;
          return (
            <li key={n.id} className="flex flex-col items-center">
              <div className="flex w-full items-center gap-3">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-ink font-mono text-[11px] font-bold ${
                    last ? "bg-crow text-stone-50" : "bg-paper-deep text-ink"
                  }`}
                >
                  {i + 1}
                </span>
                <div
                  className={`flex-1 rounded-lg border-2 p-3 text-sm leading-snug ${
                    last
                      ? "border-crow bg-crow-tint font-semibold text-ink"
                      : "border-ink bg-paper-card text-ink"
                  }`}
                >
                  {n.label}
                </div>
              </div>
              {!last ? (
                <span aria-hidden className="my-1 flex flex-col items-center text-ink-line">
                  <span className="h-3 w-0.5 bg-ink-line" />
                  <span className="-mt-1 text-crow">▼</span>
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
