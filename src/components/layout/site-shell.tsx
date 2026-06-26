"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { navLinks } from "@/lib/content";
import { PixelCrow } from "@/components/crow/pixel-crow";
import { FooterGarden } from "@/components/crow/footer-garden";
import { CrowShooter } from "@/components/crow/crow-shooter";
import { ThemeToggle } from "@/components/ui/theme-toggle";

function Wordmark({ className = "h-4" }: { className?: string }) {
  return (
    <Image
      src="/text-logo.png"
      alt="CROWKIS"
      width={210}
      height={30}
      priority
      className={`site-wordmark w-auto ${className}`}
    />
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [gameOpen, setGameOpen] = useState(false);

  return (
    <div className="relative">
      <PixelCrow />
      {gameOpen ? <CrowShooter onClose={() => setGameOpen(false)} /> : null}
      <div className="border-b-2 border-ink bg-crow px-4 py-2 text-center font-mono text-[11px] font-medium tracking-wide text-stone-50 sm:text-xs">
        One signed binary. Every feature compiled in. Free to run.{" "}
        <Link href="/docker" className="underline underline-offset-2 hover:no-underline">
          Install Crowkis →
        </Link>
      </div>
      <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur-md">
        <nav className="section flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Crowkis home">
            <Image
              src="/logo.png"
              alt=""
              width={34}
              height={34}
              priority
              className=" transition-transform duration-300 hover:rotate-[-8deg] hover:scale-110"
            />
            <Wordmark className="h-3 sm:h-3.5" />
          </Link>

          <div className="hidden items-center gap-0.5 rounded-xl border-2 border-ink bg-paper-card px-1 py-1 shadow-block-sm lg:flex">
            {navLinks.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-lg px-2.5 py-1.5 text-[13px] font-semibold transition ${
                    active ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => setGameOpen(true)}
              className="ml-0.5 flex items-center gap-1 rounded-lg border-2 border-crow px-2.5 py-1 text-[13px] font-bold text-crow transition hover:bg-crow hover:text-stone-50"
              title="brain-rot crow game — opens full-screen"
            >
              <span aria-hidden>▸</span> Arcade
            </button>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Link href="/docs" className="btn-primary !px-4 !py-2">
              Get started
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="touch-target rounded-lg border-2 border-ink bg-paper-card px-3 py-1.5 text-sm font-semibold shadow-block-sm"
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        {menuOpen ? (
          <div className="border-t-2 border-ink bg-paper px-4 pb-4 pt-3 lg:hidden">
            <div className="grid gap-2 text-sm font-medium">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="touch-target rounded-lg border border-ink-line bg-paper-card px-3 py-2.5"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setGameOpen(true);
                }}
                className="touch-target rounded-lg border-2 border-crow bg-crow-tint px-3 py-2.5 text-left font-bold text-crow"
              >
                ▸ Arcade — brain-rot crow game
              </button>
              <Link
                href="/docs"
                onClick={() => setMenuOpen(false)}
                className="touch-target rounded-lg border-2 border-ink bg-crow px-3 py-2.5 text-center font-semibold text-stone-50"
              >
                Get started
              </Link>
            </div>
          </div>
        ) : null}
      </header>

      <main className="relative">{children}</main>

      <footer className="border-t-2 border-ink bg-paper-deep paper-grid text-ink">
        <div className="section grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="" width={36} height={36} className="" />
              <Image
                src="/text-logo.png"
                alt="CROWKIS"
                width={180}
                height={26}
                className="site-wordmark h-4 w-auto"
              />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              The Redis-compatible cache built in Rust for LLM workloads. It understands what a
              query means, checks whether reuse is safe, and only then answers from cache.
            </p>
            <p className="mt-4 font-mono text-xs text-ink-faint">
              RESP3 · gRPC · REST · MCP — one binary, one Docker image.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: [
                ["Overview", "/product"],
                ["Enterprise", "/enterprise"],
                ["Docker image", "/docker"],
                ["Benchmarks", "/benchmarks"],
                ["Security model", "/security"],
              ],
            },
            {
              title: "Build",
              links: [
                ["Quickstart", "/docs/quickstart"],
                ["Commands", "/docs/commands"],
                ["Python SDK", "/docs/sdk-python"],
                ["Node SDK", "/docs/sdk-node"],
                ["MCP for AI apps", "/docs/mcp"],
              ],
            },
            {
              title: "Company",
              links: [
                                ["About", "/about"],
["The Roost", "/roost"],
                ["The Murder ▸ game", "/murder"],
                ["Changelog", "/changelog"],
                ["FAQ", "/faq"],
                ["Contact", "/about#contact"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
                {col.links.map(([label, href]) =>
                  href.startsWith("mailto:") ? (
                    <li key={href}>
                      <a href={href} className="transition hover:text-crow">
                        {label}
                      </a>
                    </li>
                  ) : (
                    <li key={href}>
                      <Link href={href} className="transition hover:text-crow">
                        {label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
        <FooterGarden>
          <span>
            © {new Date().getFullYear()} Crowkis. Built in Rust by{" "}
            <a
              href="https://www.linkedin.com/in/itsmohitrohilla/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline underline-offset-2 transition hover:text-crow"
              style={{ color: "#f0ead9" }}
            >
              Mohit Rohilla
            </a>
            . Caw responsibly.
          </span>
          <span className="hidden sm:inline">a group of crows is a murder · this one&apos;s ours</span>
        </FooterGarden>
      </footer>
    </div>
  );
}
