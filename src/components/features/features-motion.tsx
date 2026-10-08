"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement for /features. Renders nothing: the page is plain
 * server-rendered HTML, and this only flips data attributes that
 * features.module.css reacts to.
 *
 *   [data-reveal]  gets data-in when it scrolls into view (staggered via --i)
 *   [data-count]   counts up from 0 to its number the first time it is seen
 *   [data-step]    the one crossing mid-viewport lights its [data-node] twin
 *                  in the systems diagram (data-on) and sets data-active on
 *                  [data-stage]
 */
export function FeaturesMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-features]");
    if (!root) return;
    const observers: IntersectionObserver[] = [];

    // Reveals and counters are motion: skip them entirely under reduced motion,
    // which leaves the server-rendered final state in place.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const seen = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const el = e.target as HTMLElement;
            seen.unobserve(el);
            el.setAttribute("data-in", "");
            if (el.dataset.count) countUp(el);
          }
        },
        { rootMargin: "0px 0px -8% 0px" },
      );
      observers.push(seen);
      root.querySelectorAll<HTMLElement>("[data-reveal],[data-count]").forEach((el) => {
        // already on screen at load: leave it alone, so nothing visible ever blinks
        if (el.getBoundingClientRect().top < window.innerHeight) el.setAttribute("data-in", "");
        else seen.observe(el);
      });
      root.setAttribute("data-motion", "");
    }

    // Diagram sync is state, not motion, so it runs either way.
    const stage = root.querySelector("[data-stage]");
    const linked = root.querySelectorAll<HTMLElement>("[data-node],[data-step]");
    const steps = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const n = (e.target as HTMLElement).dataset.step;
          stage?.setAttribute("data-active", n ?? "");
          linked.forEach((el) =>
            el.toggleAttribute("data-on", (el.dataset.node ?? el.dataset.step) === n),
          );
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    observers.push(steps);
    root.querySelectorAll("[data-step]").forEach((el) => steps.observe(el));

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}

function countUp(el: HTMLElement) {
  const to = Number(el.dataset.count);
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
