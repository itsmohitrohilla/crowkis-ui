"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { CommandCard } from "@/components/ui/code-tabs";

export type Way = {
  name: string;
  tint: string;
  mark: ReactNode;
  cmd: string;
  blurb: string;
  href: string;
  cta: string;
};

/**
 * The four ways to use Crowkis, stacked one on top of the other. Clicking a row
 * expands it (smooth grid-rows animation, no JS height measuring) to show the
 * full install command, so nothing gets truncated into a scrollbar.
 */
export function WaysSelector({ ways }: { ways: Way[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="w-full overflow-hidden rounded-2xl border-2 border-ink shadow-block">
      {ways.map((w, i) => {
        const active = i === open;
        return (
          <div
            key={w.name}
            className={`border-b-2 border-ink last:border-b-0 transition-colors ${
              active ? "bg-paper-card" : "bg-paper-deep"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(active ? -1 : i)}
              aria-expanded={active}
              className="flex w-full items-center gap-4 p-5 text-left"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-ink shadow-block-sm"
                style={{ background: w.tint }}
              >
                {w.mark}
              </span>
              <span className="min-w-0 flex-1">
                <span className="font-display text-lg font-bold">{w.name}</span>
                <span className="ml-2 font-mono text-[11px] text-ink-faint">{w.cmd.split(" ")[0]}</span>
              </span>
              <span
                className={`shrink-0 font-display text-xl transition-transform duration-300 ${
                  active ? "rotate-90 text-crow" : "text-ink-faint"
                }`}
                aria-hidden
              >
                →
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                active ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div
                  className={`px-5 pb-5 transition-opacity duration-300 ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <p className="mb-4 max-w-xl text-sm leading-relaxed text-ink-soft">{w.blurb}</p>
                  <CommandCard command={w.cmd} />
                  {w.href.startsWith("#") ? (
                    <a href={w.href} className="group mt-3 inline-block font-mono text-xs font-semibold text-crow">
                      {w.cta} <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </a>
                  ) : (
                    <Link href={w.href} className="group mt-3 inline-block font-mono text-xs font-semibold text-crow">
                      {w.cta} <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
