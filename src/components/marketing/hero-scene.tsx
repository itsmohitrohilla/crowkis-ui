"use client";

import { ReactNode, createContext, useContext, useEffect, useRef, useState } from "react";
import { HeroTerminal } from "@/components/marketing/terminal";
import { CrowBot } from "@/components/crow/crow-bot";

/**
 * The hero diorama: a paper-craft 3D scene. The whole stage tilts toward the
 * pointer and every layer parallaxes at its own depth — terminal slab,
 * floating Crowkis cubes, drifting verdict chips, the CrowBot, and a giant
 * outlined CAW in the back. Theme-pure: ink, paper, crow red.
 */

const MouseCtx = createContext({ mx: 0, my: 0 });

function Layer({
  depth,
  className = "",
  children,
}: {
  depth: number;
  className?: string;
  children: ReactNode;
}) {
  const { mx, my } = useContext(MouseCtx);
  return (
    <div
      className={`absolute will-change-transform ${className}`}
      style={{
        transform: `translate3d(${mx * depth}px, ${my * depth}px, 0)`,
        transition: "transform 0.18s ease-out",
      }}
    >
      {children}
    </div>
  );
}

function IsoCube({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 44 44" width={size} height={size} className={className} aria-hidden>
      <path d="M22 2 L42 12 L42 30 L22 40 L2 30 L2 12 Z" fill="#d62221" stroke="#16130e" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M2 12 L22 22 L42 12" fill="none" stroke="#16130e" strokeWidth="2" />
      <path d="M22 22 L22 40" fill="none" stroke="#16130e" strokeWidth="2" />
      <path d="M12 9 q6 -6 13 -3 q-2 5 -7 5 q5 1 7 5 q-7 3 -13 -2 Z" fill="#16130e" />
    </svg>
  );
}

const CHIPS: { text: string; tone: string; pos: string; depth: number; anim: string }[] = [
  { text: "semantic hit · 0.4ms", tone: "text-ink", pos: "left-[2%] top-[12%]", depth: 26, anim: "chip-float-a" },
  { text: "poison blocked · stage 3", tone: "text-crow", pos: "right-[-2%] top-[30%]", depth: 34, anim: "chip-float-b" },
  { text: "saved today · $1,240.80", tone: "text-ink", pos: "left-[6%] bottom-[8%]", depth: 30, anim: "chip-float-c" },
];

export function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ mx: 0, my: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <MouseCtx.Provider value={reduced ? { mx: 0, my: 0 } : pos}>
      <div
        ref={ref}
        className="relative h-[460px] select-none sm:h-[520px]"
        style={{ perspective: 1300 }}
        onMouseMove={(e) => {
          if (reduced) return;
          const r = ref.current?.getBoundingClientRect();
          if (!r) return;
          setPos({
            mx: ((e.clientX - r.left) / r.width - 0.5) * 2,
            my: ((e.clientY - r.top) / r.height - 0.5) * 2,
          });
        }}
        onMouseLeave={() => setPos({ mx: 0, my: 0 })}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: reduced
              ? undefined
              : `rotateX(${-pos.my * 4}deg) rotateY(${pos.mx * 5}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.25s ease-out",
          }}
        >
          {/* giant outline word in the back */}
          <Layer depth={-18} className="inset-x-0 top-[16%] text-center">
            <span
              className="font-display text-[7.5rem] font-bold leading-none tracking-tight sm:text-[9.5rem]"
              style={{
                color: "transparent",
                WebkitTextStroke: "2px rgba(22,19,14,0.13)",
              }}
            >
              CAW
            </span>
          </Layer>

          {/* terminal slab */}
          <Layer depth={10} className="inset-x-0 top-[13%] sm:left-[4%] sm:right-[10%]">
            <div
              style={{
                transform: "rotateY(-7deg) rotateX(3deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <HeroTerminal />
            </div>
          </Layer>

          {/* floating cubes */}
          <Layer depth={42} className="left-[-2%] top-[2%]">
            <IsoCube size={54} className="cube-bob-a" />
          </Layer>
          <Layer depth={56} className="right-[4%] top-[-4%]">
            <IsoCube size={74} className="cube-bob-b" />
          </Layer>
          <Layer depth={48} className="left-[38%] bottom-[-2%]">
            <IsoCube size={42} className="cube-bob-c" />
          </Layer>

          {/* verdict chips */}
          {CHIPS.map((chip) => (
            <Layer key={chip.text} depth={chip.depth} className={chip.pos}>
              <span
                className={`${chip.anim} inline-block rounded-lg border-2 border-ink bg-paper-card px-3 py-1.5 font-mono text-[11px] font-semibold shadow-block-sm ${chip.tone}`}
              >
                {chip.text}
              </span>
            </Layer>
          ))}

          {/* the bot, front and center-right */}
          <Layer depth={64} className="bottom-[-3%] right-[-4%] sm:right-[0%]">
            <CrowBot size={190} />
          </Layer>
        </div>
      </div>
    </MouseCtx.Provider>
  );
}
