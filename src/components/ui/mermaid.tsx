"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Renders a Mermaid diagram client-side, themed to the Crowkis paper/ink/crow
 * palette. Mermaid is dynamically imported so it only ships on pages that
 * actually draw diagrams.
 */

let initialized = false;

async function getMermaid() {
  const mermaid = (await import("mermaid")).default;
  if (!initialized) {
    initialized = true;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      fontFamily: "var(--font-mono), monospace",
      flowchart: { curve: "linear", htmlLabels: true },
      themeVariables: {
        background: "#fffdf9",
        primaryColor: "#fffdf9",
        primaryBorderColor: "#16130e",
        primaryTextColor: "#16130e",
        secondaryColor: "#f3eee5",
        secondaryBorderColor: "#16130e",
        secondaryTextColor: "#16130e",
        tertiaryColor: "#fbe9e8",
        tertiaryBorderColor: "#d62221",
        tertiaryTextColor: "#16130e",
        lineColor: "#16130e",
        textColor: "#16130e",
        edgeLabelBackground: "#faf7f1",
        clusterBkg: "#f3eee5",
        clusterBorder: "#16130e",
        nodeTextColor: "#16130e",
        fontSize: "14px",
      },
      theme: "base",
    });
  }
  return mermaid;
}

export function Mermaid({ chart, className = "" }: { chart: string; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = await getMermaid();
        const { svg } = await mermaid.render(`crowkis-mmd-${id}`, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          const el = ref.current.querySelector("svg");
          if (el) {
            el.style.maxWidth = "100%";
            el.style.height = "auto";
          }
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (failed) {
    return (
      <pre className={`overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-ink ${className}`}>
        {chart}
      </pre>
    );
  }

  return <div ref={ref} className={`flex justify-center overflow-x-auto p-5 ${className}`} />;
}

/**
 * A two-set Venn diagram in the house style — used for "them vs Crowkis"
 * comparisons in the Roost. Pure SVG, no dependencies.
 */
export function Venn({
  left,
  right,
  overlap,
  leftItems = [],
  rightItems = [],
}: {
  left: string;
  right: string;
  overlap: string;
  leftItems?: string[];
  rightItems?: string[];
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-5">
      <svg viewBox="0 0 560 300" className="w-full max-w-xl" role="img" aria-label={`${left} versus ${right}`}>
        <circle cx="200" cy="150" r="130" fill="#f3eee5" stroke="#16130e" strokeWidth="2.5" fillOpacity="0.85" />
        <circle cx="360" cy="150" r="130" fill="#fbe9e8" stroke="#d62221" strokeWidth="2.5" fillOpacity="0.85" />
        <text x="140" y="78" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="700" fontSize="17" fill="#16130e">
          {left}
        </text>
        <text x="420" y="78" textAnchor="middle" fontFamily="var(--font-display), sans-serif" fontWeight="700" fontSize="17" fill="#d62221">
          {right}
        </text>
        <text x="280" y="148" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontWeight="600" fontSize="12" fill="#16130e">
          {overlap.split("\n").map((line, i) => (
            <tspan key={i} x="280" dy={i === 0 ? 0 : 16}>
              {line}
            </tspan>
          ))}
        </text>
        {leftItems.map((item, i) => (
          <text key={item} x="135" y={120 + i * 22} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="11" fill="#4a443a">
            {item}
          </text>
        ))}
        {rightItems.map((item, i) => (
          <text key={item} x="425" y={120 + i * 22} textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="11" fill="#4a443a">
            {item}
          </text>
        ))}
      </svg>
    </div>
  );
}
