"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const tabs = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/tenants", label: "Tenants" },
  { href: "/app/cache-insights", label: "Cache Insights" },
  { href: "/app/live-log", label: "Live Log" },
  { href: "/app/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-roost text-slate-100">
      <div className="section py-6 sm:py-8 md:py-10">
      <div className="glass mb-6 p-3 sm:p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="text-sm text-brand-neon">
            {"<- Back to marketing"}
          </Link>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`touch-target shrink-0 rounded-full px-4 py-2 text-sm transition ${
                    active ? "bg-brand-violet/30 text-white" : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {children}
      </div>
    </div>
  );
}
