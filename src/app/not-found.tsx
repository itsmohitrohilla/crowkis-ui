import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
      <section className="section flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
        <p className="font-mono text-sm text-ink-faint">CGET &quot;/this-page&quot;</p>
        <h1 className="mt-4 font-display text-7xl font-bold tracking-tight text-crow sm:text-8xl">
          (nil)
        </h1>
        <p className="mt-5 max-w-md text-ink-soft">
          Cache miss. We checked meaning, structure, and all five trust stages — this page
          genuinely doesn&apos;t exist. Even the crow looked.
        </p>
        <p className="mt-2 font-mono text-xs text-ink-faint">
          · confidence 0.00 · intent: lost · no semantic neighbours found
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn-primary">
            Back to a cache hit
          </Link>
          <Link href="/murder" className="btn-secondary">
            Visit the crows instead
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
