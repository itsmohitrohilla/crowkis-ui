"use client";

import { ReactNode, useRef, useState } from "react";

/**
 * CRED-style NeoPOP depth: the card tilts in 3D toward the pointer and its
 * hard offset shadow deepens, like a physical tile you're pressing on.
 */
export function Tilt3D({
  children,
  className = "",
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number } | null>(null);

  return (
    <div
      ref={ref}
      style={{ perspective: 1100 }}
      className={className}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ rx: -py * max, ry: px * max });
      }}
      onMouseLeave={() => setTilt(null)}
    >
      <div
        style={{
          transform: tilt
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-3px)`
            : "rotateX(0deg) rotateY(0deg)",
          transition: tilt ? "transform 0.08s ease-out" : "transform 0.45s ease",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  );
}
