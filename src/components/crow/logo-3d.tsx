"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export function Logo3D({ size = 120 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number } | null>(null);

  return (
    <div
      style={{ perspective: 900 }}
      className="inline-block"
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ rx: -py * 26, ry: px * 26 });
      }}
      onMouseLeave={() => setTilt(null)}
    >
      <div
        ref={ref}
        className={tilt ? "" : "logo3d-idle"}
        style={{
          transformStyle: "preserve-3d",
          transform: tilt
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px)`
            : undefined,
          transition: tilt ? "transform 0.1s ease-out" : "transform 0.6s ease",
        }}
      >
        <div
          className="rounded-2xl border-2 border-ink bg-white shadow-block"
          style={{ width: size, height: size, transform: "translateZ(24px)" }}
        >
          <Image
            src="/logo.png"
            alt="Crowkis"
            width={size}
            height={size}
            className="h-full w-full rounded-2xl object-cover"
            priority={false}
          />
        </div>
        {/* ground shadow that breathes with the float */}
        <div
          aria-hidden
          className="logo3d-shadow mx-auto mt-4 rounded-full bg-ink/25 blur-md"
          style={{ width: size * 0.66, height: size * 0.12 }}
        />
      </div>
    </div>
  );
}
