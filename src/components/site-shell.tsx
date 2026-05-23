"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { navLinks } from "@/lib/content";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 faded-grid opacity-25" />
      <header className="sticky top-0 z-40 border-b border-glass-200 bg-ink/70 backdrop-blur-xl">
        <nav className="section flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-wide text-brand-neon">
            Crowkis
          </Link>
          <details className="group md:hidden">
            <summary className="touch-target cursor-pointer list-none rounded-lg border border-glass-300 px-3 py-2 text-sm text-slate-200">
              Menu
            </summary>
            <div className="absolute left-4 right-4 top-16 z-50 glass p-3">
              <div className="grid gap-2 text-sm text-slate-200">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="touch-target rounded border border-glass-200 bg-white/5 px-3 py-2">
                    {link.label}
                  </Link>
                ))}
                <Link href="/roadmap" className="touch-target rounded border border-glass-200 bg-white/5 px-3 py-2">
                  Roadmap
                </Link>
                <Link href="/app/dashboard" className="touch-target rounded border border-glass-200 bg-white/5 px-3 py-2">
                  Open App
                </Link>
                <Link href="/docs" className="touch-target rounded bg-brand-neon px-3 py-2 font-semibold text-slate-950">
                  Docs Hub
                </Link>
              </div>
            </div>
          </details>
          <div className="hidden items-center gap-5 text-sm text-slate-200 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-brand-neon">
                {link.label}
              </Link>
            ))}
            <Link href="/roadmap" className="transition hover:text-brand-neon">
              Roadmap
            </Link>
            <Link href="/app/dashboard" className="rounded-full border border-glass-300 px-4 py-2 hover:border-brand-neon">
              Open App
            </Link>
            <Link href="/docs" className="rounded-full bg-brand-neon px-4 py-2 font-semibold text-slate-950">
              Docs Hub
            </Link>
          </div>
        </nav>
      </header>
      <main className="relative">{children}</main>
      <footer className="section mt-20 border-t border-glass-200 py-10 text-sm text-slate-300">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p className="max-w-3xl">Crowkis is the intelligent control and cache layer between applications and LLM providers.</p>
          <p className="mt-2 max-w-3xl text-slate-400">Built in Rust. Designed for safe reuse, lower latency, and lower spend.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            {[
              ["Docs", "/docs"],
              ["Product", "/product"],
              ["Security", "/security"],
              ["Benchmarks", "/benchmarks"],
              ["Integrations", "/integrations"],
              ["FAQ", "/faq"],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="rounded border border-glass-200 bg-white/5 px-3 py-2 hover:border-brand-neon">
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </footer>
    </div>
  );
}
