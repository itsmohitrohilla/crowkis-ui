"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { CopyButton } from "@/components/ui/code-tabs";

const DOC_NAV: { group: string; items: [string, string][] }[] = [
  {
    group: "Getting started",
    items: [
      ["Quickstart", "/docs"],
      ["Docker deployment", "/docs/docker"],
    ],
  },
  {
    group: "Reference",
    items: [
      ["Commands", "/docs/commands"],
      ["Configuration", "/docs/configuration"],
      ["Security model", "/docs/security"],
    ],
  },
  {
    group: "SDKs & integrations",
    items: [
      ["Python", "/docs/sdk-python"],
      ["Node.js / TypeScript", "/docs/sdk-node"],
      ["MCP for AI apps", "/docs/mcp"],
    ],
  },
];

export function DocsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="section grid gap-10 py-10 md:grid-cols-[220px_1fr] md:py-14">
      <aside>
        <nav className="md:sticky md:top-28">
          {DOC_NAV.map((group) => (
            <div key={group.group} className="mb-7">
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-ink-faint">
                {group.group}
              </p>
              <ul className="mt-3 space-y-1 border-l-2 border-ink-line">
                {group.items.map(([label, href]) => {
                  const active = pathname === href;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`-ml-0.5 block border-l-2 py-1.5 pl-4 text-sm transition ${
                          active
                            ? "border-crow font-semibold text-ink"
                            : "border-transparent text-ink-soft hover:border-ink-faint hover:text-ink"
                        }`}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 max-w-3xl">{children}</div>
    </div>
  );
}

/* ------------------------- doc building blocks ------------------------- */

export function DocTitle({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <header className="border-b-2 border-ink pb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="responsive-title mt-3">{title}</h1>
      <p className="responsive-subtitle mt-4">{lead}</p>
    </header>
  );
}

export function DocH2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-12 scroll-mt-28 font-display text-2xl font-bold tracking-tight">
      <a href={`#${id}`} className="group">
        {children}
        <span className="ml-2 text-crow opacity-0 transition-opacity group-hover:opacity-100">#</span>
      </a>
    </h2>
  );
}

export function DocP({ children }: { children: ReactNode }) {
  return <p className="mt-4 leading-relaxed text-ink-soft">{children}</p>;
}

export function DocCode({ title, code }: { title?: string; code: string }) {
  return (
    <div className="code-panel mt-5">
      <div className="code-chrome justify-between">
        <span>{title ?? "shell"}</span>
        <CopyButton text={code} />
      </div>
      <pre>{code}</pre>
    </div>
  );
}

export function DocNote({ children }: { children: ReactNode }) {
  return (
    <div className="card-quiet mt-5 border-l-4 !border-l-crow p-4 text-sm text-ink-soft">
      {children}
    </div>
  );
}

export function DocTable({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="card-quiet mt-5 overflow-hidden !p-0">
      <div className="table-scroll">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-line bg-paper-deep">
              {head.map((h) => (
                <th key={h} className="px-4 py-3 font-display font-bold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-ink-line align-top last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-ink-soft">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function DocPager({
  prev,
  next,
}: {
  prev?: [string, string];
  next?: [string, string];
}) {
  return (
    <nav className="mt-14 flex justify-between gap-4 border-t-2 border-ink pt-6">
      {prev ? (
        <Link href={prev[1]} className="group text-sm font-semibold">
          <span className="font-mono text-xs text-ink-faint">← previous</span>
          <p className="mt-1 transition-colors group-hover:text-crow">{prev[0]}</p>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next[1]} className="group text-right text-sm font-semibold">
          <span className="font-mono text-xs text-ink-faint">next →</span>
          <p className="mt-1 transition-colors group-hover:text-crow">{next[0]}</p>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
