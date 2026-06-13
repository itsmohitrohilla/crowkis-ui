"use client";

import { useRef, useState } from "react";

export type Sys = { n: string; name: string; plain: string; tech: string };

function Card({ sys }: { sys: Sys }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number } | null>(null);
  const hovered = tilt !== null;

  return (
    <div
      style={{ perspective: 1400 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: -py * 6, ry: px * 7 });
      }}
      onMouseLeave={() => setTilt(null)}
    >
      <article
        ref={ref}
        className="card-block group relative grid gap-5 overflow-hidden p-6 pl-7 sm:p-7 sm:pl-9 md:grid-cols-[44px_1fr_1fr]"
        style={{
          transform: tilt
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-5px) scale(1.012)`
            : "rotateX(0deg) rotateY(0deg)",
          transition: tilt
            ? "transform 0.09s ease-out, box-shadow 0.2s ease"
            : "transform 0.5s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          boxShadow: hovered ? "9px 12px 0 0 rgb(var(--shadow-color))" : undefined,
        }}
      >
        {/* crow accent rail */}
        <span
          aria-hidden
          className="absolute left-0 top-0 h-full w-1.5 bg-crow transition-all duration-300 group-hover:w-2.5"
        />

        <p
          className="font-mono text-lg font-bold text-crow"
          style={{ transform: hovered ? "translateZ(48px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
        >
          {sys.n}
        </p>

        <div
          style={{ transform: hovered ? "translateZ(28px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
        >
          <h3 className="font-display text-lg font-bold leading-snug">{sys.name}</h3>
          <p className="mt-2 rounded-lg border border-ink-line bg-paper-deep p-3 text-[13px] leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">In plain words: </span>
            {sys.plain}
          </p>
        </div>

        <p
          className="text-[13px] leading-relaxed text-ink-soft md:border-l md:border-ink-line md:pl-5"
          style={{ transform: hovered ? "translateZ(16px)" : "translateZ(0)", transition: "transform 0.3s ease" }}
        >
          <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
            under the hood ·{" "}
          </span>
          {sys.tech}
        </p>
      </article>
    </div>
  );
}

export function Systems3D({ systems }: { systems: Sys[] }) {
  return (
    <div className="mt-8 space-y-5">
      {systems.map((s) => (
        <Card key={s.n} sys={s} />
      ))}
    </div>
  );
}
