"use client";

import { ReactNode, useState } from "react";

export function CopyButton({ text, className = "" }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        });
      }}
      className={`rounded-md border border-roost-line px-2.5 py-1 font-mono text-[11px] text-stone-400 transition hover:border-stone-500 hover:text-stone-200 ${className}`}
      aria-label="Copy to clipboard"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

export function CodeTabs({
  tabs,
}: {
  tabs: { label: string; copyText: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <div className="code-panel">
      <div className="code-chrome justify-between !py-0">
        <div className="flex">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setActive(i)}
              className={`border-b-2 px-3 py-2.5 font-mono text-xs transition ${
                i === active
                  ? "border-crow text-stone-100"
                  : "border-transparent text-stone-500 hover:text-stone-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <CopyButton text={tab.copyText} />
      </div>
      <pre>{tab.content}</pre>
    </div>
  );
}

export function CommandCard({ command, note }: { command: string; note?: string }) {
  return (
    <div className="code-panel">
      <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
        <code className="overflow-x-auto whitespace-pre font-mono text-[13px] text-stone-200">
          <span className="tok-dim">$ </span>
          {command}
        </code>
        <CopyButton text={command} className="shrink-0" />
      </div>
      {note ? (
        <div className="border-t border-roost-line px-4 py-2.5 font-mono text-[11px] text-stone-500 sm:px-5">
          {note}
        </div>
      ) : null}
    </div>
  );
}
