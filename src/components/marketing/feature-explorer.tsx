"use client";

import { useMemo, useState } from "react";
import { featureGroups, FeatureItem, FeatureStatus, FeatureTier } from "@/lib/content/features-full";

const STATUS_META: Record<FeatureStatus, { dot: string; label: string }> = {
  shipped: { dot: "bg-emerald-500", label: "shipped & tested" },
  hardening: { dot: "bg-amber-500", label: "present · hardening" },
  designed: { dot: "bg-ink-faint", label: "designed · on the roadmap" },
};

const TIER_META: Record<FeatureTier, { label: string; cls: string }> = {
  free: { label: "FREE", cls: "border-emerald-500/50 text-emerald-600" },
  pro: { label: "PRO", cls: "border-ink text-ink" },
  enterprise: { label: "ENT", cls: "border-crow/50 text-crow" },
};

/**
 * The full feature index as a field guide: every feature is a specimen tag;
 * hovering (or tapping) one pins its card — what it does, why it matters, plus
 * its honest shipped/hardening/designed status and tier gate.
 */
export function FeatureExplorer() {
  const total = useMemo(() => featureGroups.reduce((n, g) => n + g.items.length, 0), []);
  const shipped = useMemo(
    () =>
      featureGroups.reduce(
        (n, g) => n + g.items.filter((i) => i.status === "shipped").length,
        0,
      ),
    [],
  );
  const first = featureGroups[0].items[0];
  const [active, setActive] = useState<{ item: FeatureItem; group: string }>({
    item: first,
    group: featureGroups[0].group,
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            The field guide — {total} features
          </h2>
          <p className="mt-2 font-mono text-xs text-ink-faint">
            {shipped} shipped &amp; in the binary today · hover a tag for what it does and why
          </p>
        </div>
        <div className="flex flex-wrap gap-3 font-mono text-[11px] text-ink-soft">
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-emerald-500" /> shipped
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-amber-500" /> hardening
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 rounded-full bg-ink-faint" /> designed
          </span>
        </div>
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
                      className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left font-mono text-[12px] transition-all duration-100 ${
                        isActive
                          ? "border-ink bg-ink text-paper shadow-block-sm"
                          : "border-ink-line bg-paper-card text-ink-soft hover:border-ink hover:text-ink"
                      } ${item.status === "designed" && !isActive ? "border-dashed opacity-80" : ""}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_META[item.status].dot}`}
                        aria-hidden
                      />
                      {item.name}
                      {item.tier ? (
                        <span className={`text-[9px] font-bold ${isActive ? "text-paper/70" : "opacity-70"}`}>
                          {TIER_META[item.tier].label}
                        </span>
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
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-faint">
              {active.group}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold leading-snug">{active.item.name}</h3>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-md border border-ink-line bg-paper-deep px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-soft">
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_META[active.item.status].dot}`} />
                {STATUS_META[active.item.status].label}
              </span>
              <span
                className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${
                  active.item.tier ? TIER_META[active.item.tier].cls : "border-ink-line text-ink-faint"
                }`}
              >
                {active.item.tier ? `${TIER_META[active.item.tier].label}-tier` : "all editions"}
              </span>
            </div>

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
                featureGroups.flatMap((g) => g.items).findIndex((i) => i.name === active.item.name) + 1,
              ).padStart(2, "0")}{" "}
              of {total}
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
