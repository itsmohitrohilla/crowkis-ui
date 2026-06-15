"use client";

import { ReactNode, useEffect, useState } from "react";
import { CommandCard } from "@/components/ui/code-tabs";

export type Install = {
  os: string;
  method: string;
  tint: string;
  mark: ReactNode;
  steps: { cmd: string; note?: string }[];
  hint?: string;
};

/**
 * Pick-your-platform installer. A tab row up top, one full-width panel below —
 * so cards never end up half-empty and commands always have room. The visitor's
 * OS is auto-selected on load, and the panel fades in when the tab changes.
 */
export function InstallPicker({ installs }: { installs: Install[] }) {
  const [sel, setSel] = useState(0);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const guess = installs.findIndex(
      (d) =>
        (d.os === "macOS" && /mac/.test(ua)) ||
        (d.os === "Windows" && /win/.test(ua)) ||
        (d.os === "Linux" && /linux/.test(ua) && !/android/.test(ua)),
    );
    if (guess >= 0) setSel(guess);
  }, [installs]);

  const cur = installs[sel];

  return (
    <div>
      {/* platform tabs */}
      <div className="flex flex-wrap gap-2.5">
        {installs.map((d, i) => {
          const active = i === sel;
          return (
            <button
              key={d.os}
              type="button"
              onClick={() => setSel(i)}
              aria-pressed={active}
              className={`flex items-center gap-2.5 rounded-xl border-2 border-ink px-3.5 py-2 font-display text-sm font-bold transition ${
                active
                  ? "bg-ink text-paper shadow-block-sm"
                  : "bg-paper-card text-ink hover:-translate-y-0.5"
              }`}
            >
              <span
                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg border-2 border-ink"
                style={{ background: d.tint }}
              >
                {d.mark}
              </span>
              {d.os}
            </button>
          );
        })}
      </div>

      {/* selected panel — keyed so it re-mounts and replays the fade */}
      <div key={sel} className="card-block install-fade mt-5 p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-ink shadow-block-sm"
              style={{ background: cur.tint }}
            >
              {cur.mark}
            </span>
            <div>
              <h3 className="font-display text-xl font-bold">{cur.os}</h3>
              <p className="font-mono text-[11px] text-ink-faint">{cur.method}</p>
            </div>
          </div>
          {cur.hint ? (
            <span className="rounded-md border-2 border-ink bg-crow px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-stone-50">
              {cur.hint}
            </span>
          ) : null}
        </div>

        <div className="mt-5 space-y-3">
          {cur.steps.map((s, i) => (
            <div key={i}>
              {s.note ? (
                <p className="mb-1.5 font-mono text-[11px] text-ink-faint">{s.note}</p>
              ) : null}
              <CommandCard command={s.cmd} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
