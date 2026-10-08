"use client";

import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";

export type AdminView = { id: string; label: string; count?: number };

// 24px line icons, one per section
const ICONS: Record<string, string> = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6v-9h-6v9Zm0-16v5h6V4h-6Z",
  traffic: "M4 19h16M7 16V9m5 7V5m5 11v-4",
  demo: "M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Zm4 9 2 2 4-4",
  arcade: "M6 9h12a4 4 0 0 1 4 4v1a4 4 0 0 1-7 2.6h-6A4 4 0 0 1 2 14v-1a4 4 0 0 1 4-4Zm1 3v4m-2-2h4m6-1h.01M18 15h.01",
  copies: "M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Zm-4 6H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1",
  messages: "M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1Zm4 5h8m-8 3h5",
  ratings: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z",
};

/** Sidebar + section switcher. Every section is already rendered by the server,
 *  so moving between them is instant; the URL hash remembers where you are. */
export function AdminShell({
  views,
  sections,
  note,
  footer,
}: {
  views: AdminView[];
  sections: Record<string, ReactNode>;
  note: string;
  footer: ReactNode;
}) {
  const [view, setView] = useState(views[0].id);

  useEffect(() => {
    const sync = () => {
      const id = window.location.hash.slice(1);
      setView(views.some((v) => v.id === id) ? id : views[0].id);
      window.scrollTo(0, 0);
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, [views]);

  const current = views.find((v) => v.id === view) ?? views[0];

  return (
    <main className="min-h-screen bg-paper-deep text-ink lg:flex">
      <aside className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b-2 border-ink bg-roost px-4 py-3 text-stone-300 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:flex-nowrap lg:items-stretch lg:border-b-0 lg:border-r-2 lg:px-5 lg:py-7">
        <div className="flex items-center gap-3">
          <Image src="/logo.svg" alt="Crowkis" width={49} height={35} priority className="h-8 w-auto" />
          <div>
            <p className="font-display text-lg font-bold leading-none text-stone-50">crowkis</p>
            <p className="eyebrow mt-1 !text-[10px]">Admin</p>
          </div>
        </div>

        <nav
          aria-label="Admin sections"
          className="order-last -mx-1 flex w-[calc(100%+0.5rem)] gap-1.5 overflow-x-auto px-1 pb-1 lg:order-none lg:mx-0 lg:mt-8 lg:w-auto lg:flex-col lg:overflow-visible lg:p-0"
        >
          {views.map((v) => {
            const active = v.id === current.id;
            return (
              <a
                key={v.id}
                href={`#${v.id}`}
                aria-current={active ? "page" : undefined}
                className={`flex shrink-0 items-center gap-3 rounded-lg border-2 px-3 py-2 text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "border-stone-50 bg-crow text-stone-50 shadow-[3px_3px_0_0_rgb(250_250_249)] lg:translate-x-1"
                    : "border-transparent text-stone-400 hover:border-roost-line hover:bg-roost-card hover:text-stone-100"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={ICONS[v.id] ?? ICONS.overview} />
                </svg>
                {v.label}
                {v.count !== undefined ? (
                  <span className={`ml-auto rounded-md px-1.5 py-0.5 font-mono text-[11px] tabular-nums ${active ? "bg-stone-50/20" : "bg-roost-card text-stone-300"}`}>
                    {v.count.toLocaleString("en-US")}
                  </span>
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:mt-auto lg:flex-col lg:items-stretch">{footer}</div>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-8 md:px-8 lg:px-10 lg:py-10">
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-ink pb-5">
          <div>
            <p className="eyebrow">Site metrics</p>
            <h1 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {current.label}
            </h1>
          </div>
          <p className="text-xs text-ink-soft">{note}</p>
        </header>
        {/* keyed so each section plays its entrance when you switch to it */}
        <div key={current.id} className="install-fade mt-6 space-y-6">
          {sections[current.id]}
        </div>
      </div>
    </main>
  );
}
