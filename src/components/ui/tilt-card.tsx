"use client";

import { ReactNode, useRef, useState } from "react";

/**
 * A card that sits flat at rest and tilts toward the pointer in 3D on hover,
 * with a lift and a deepening block shadow. Wraps arbitrary content.
 */
export function TiltCard({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number } | null>(null);
  const hovered = tilt !== null;

  return (
    <div
      style={{ perspective: 1400 }}
      className="h-full"
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setTilt({ rx: -py * max, ry: px * max });
      }}
      onMouseLeave={() => setTilt(null)}
    >
      <article
        ref={ref}
        className={`card-block ${className}`}
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
        {children}
      </article>
    </div>
  );
}
