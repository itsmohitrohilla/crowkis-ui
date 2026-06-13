"use client";

import { useRef, useState } from "react";

export type Sys = { n: string; name: string; plain: string; tech: string };

function Card({ sys, i }: { sys: Sys; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number } | null>(null);
  const left = i % 2 === 0;
  // resting pose: alternating left/right lean, shifted to its side
  const rest = `rotateX(2deg) rotateY(${left ? 7 : -7}deg)`;

  return (
    <div
      className={`w-full md:w-[93%] ${left ? "md:mr-auto" : "md:ml-auto"}`}
      style={{ perspective: 1300 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: -py * 10, ry: px * 12 });
      }}
      onMouseLeave={() => setTilt(null)}
    >
      <article
        ref={ref}
        className="card-block grid gap-5 p-6 sm:p-7 md:grid-cols-[44px_1fr_1fr]"
        style={{
          transform: tilt
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-6px)`
            : rest,
          transition: tilt
            ? "transform 0.08s ease-out, box-shadow 0.2s ease"
            : "transform 0.55s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease",
          transformStyle: "preserve-3d",
          boxShadow: tilt
            ? "10px 14px 0 0 rgb(var(--shadow-color))"
            : undefined,
        }}
      >
        <p className="font-mono text-lg font-bold text-crow" style={{ transform: "translateZ(45px)" }}>
          {sys.n}
        </p>
        <div style={{ transform: "translateZ(28px)" }}>
          <h3 className="font-display text-lg font-bold leading-snug">{sys.name}</h3>
          <p className="mt-2 rounded-lg border border-ink-line bg-paper-deep p-3 text-[13px] leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">In plain words: </span>
            {sys.plain}
          </p>
        </div>
        <p
          className="text-[13px] leading-relaxed text-ink-soft md:border-l md:border-ink-line md:pl-5"
          style={{ transform: "translateZ(14px)" }}
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
    <div className="mt-8 space-y-6 md:space-y-8">
      {systems.map((s, i) => (
        <Card key={s.n} sys={s} i={i} />
      ))}
    </div>
  );
}
