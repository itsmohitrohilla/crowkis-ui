"use client";

import { useMemo, useState } from "react";
import { featureGroups, FeatureItem } from "@/lib/content/features-full";

/**
 * The full feature index as a field guide: every feature is a specimen tag,
 * hovering (or tapping) one pins its card — what it does, why it matters —
 * to the inspection panel.
 */
export function FeatureExplorer() {
  const total = useMemo(
    () => featureGroups.reduce((n, g) => n + g.items.length, 0),
    [],
  );
  const first = featureGroups[0].items[0];
  const [active, setActive] = useState<{ item: FeatureItem; group: string }>({
    item: first,
    group: featureGroups[0].group,
  });

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          The field guide — all {total} features
        </h2>
        <p className="font-mono text-xs text-ink-faint">
          hover a tag · the card explains what it does and why it matters
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* specimen tags */}
        <div className="space-y-7">
          {featureGroups.map((group) => (
            <div key={group.group}>
              <p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-faint">
                <span className="inline-block h-2 w-2 rounded-sm bg-crow" />
                {group.group}
                <span className="text-ink-line">·</span>
                {group.items.length}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const isActive = active.item.name === item.name;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onMouseEnter={() => setActive({ item, group: group.group })}
                      onFocus={() => setActive({ item, group: group.group })}
                      onClick={() => setActive({ item, group: group.group })}
                      className={`rounded-lg border px-2.5 py-1.5 text-left font-mono text-[12px] transition-all duration-100 ${
                        isActive
                          ? "border-ink bg-ink text-paper-card shadow-block-sm"
                          : item.tier === "enterprise"
                            ? "border-crow/40 bg-crow-tint text-ink hover:border-crow"
                            : "border-ink-line bg-paper-card text-ink-soft hover:border-ink hover:text-ink"
                      }`}
                    >
                      {item.name}
                      {item.tier === "enterprise" ? (
                        <span className="ml-1.5 text-[9px] font-bold uppercase text-crow">ent</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* inspection card */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <article className="card-block relative overflow-hidden p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-5 -top-5 rotate-12 rounded-lg border-2 border-crow px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-crow opacity-70"
            >
              {active.item.tier === "enterprise" ? "enterprise" : "every edition"}
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              {active.group}
            </p>
            <h3 className="mt-2 pr-16 font-display text-xl font-bold leading-snug">
              {active.item.name}
            </h3>
            <div className="mt-4 space-y-3 text-sm leading-relaxed">
              <p className="text-ink-soft">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-faint">
                  what it does ·{" "}
                </span>
                {active.item.what}
              </p>
              <p className="rounded-lg border border-ink-line bg-paper-deep p-3 text-ink-soft">
                <span className="font-semibold text-ink">Why it matters: </span>
                {active.item.why}
              </p>
            </div>
            <p className="mt-5 border-t border-ink-line pt-3 font-mono text-[10px] text-ink-faint">
              crowkis field guide · specimen{" "}
              {String(
                featureGroups
                  .flatMap((g) => g.items)
                  .findIndex((i) => i.name === active.item.name) + 1,
              ).padStart(2, "0")}{" "}
              of {total}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
