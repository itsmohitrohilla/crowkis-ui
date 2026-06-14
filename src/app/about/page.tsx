import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SiteShell } from "@/components/layout/site-shell";
import { TiltCard } from "@/components/ui/tilt-card";
import { CountUp } from "@/components/ui/count-up";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Crowkis exists: an LLM cache that understands meaning and knows when to refuse. Built in Rust, closed-source, offline, free where it should be — by Mohit Rohilla.",
};

const INK = "#16130e";
const WING = "#37322a";
const EYE = "#d62221";

/* a big pixel crow mark, drawn in the Crowkis house style */
function PixelCrowLogo() {
  const R: [number, number, number, number, string?][] = [
    // crest
    [10, 0, 1, 1, EYE],
    [12, 0, 1, 1, INK],
    // head
    [9, 1, 4, 4],
    [10, 2, 1, 1, "eye"],
    // beak
    [13, 2, 3, 1],
    [13, 3, 2, 1],
    // neck
    [8, 3, 2, 1],
    // body
    [3, 4, 9, 5],
    // tail (fanned)
    [0, 4, 3, 2],
    [0, 6, 2, 1],
    // wing
    [5, 5, 5, 3, WING],
    // legs
    [6, 9, 1, 2],
    [9, 9, 1, 2],
    // feet
    [5, 11, 2, 1],
    [9, 11, 2, 1],
  ];
  return (
    <svg viewBox="0 0 16 12" className="h-auto w-full" shapeRendering="crispEdges" aria-label="Crowkis">
      {R.map(([x, y, w, h, fill], i) =>
        fill === "eye" ? (
          <rect key={i} x={x} y={y} width={w} height={h} fill={EYE} />
        ) : (
          <rect key={i} x={x} y={y} width={w} height={h} fill={fill ?? INK} />
        ),
      )}
    </svg>
  );
}

const PRINCIPLES = [
  {
    title: "Free where it should be free",
    body: "Everything an individual or small team needs costs nothing — full engine, real production use. We'd rather you grow into a conversation than resent a paywall.",
  },
  {
    title: "Safety is the product",
    body: "A cache that reuses LLM answers is a trust system. Saying 'no' to an unsafe hit is the feature — five checks gate every read, five stages gate every write.",
  },
  {
    title: "No supply chain to attack",
    body: "One signed Rust binary. No Python, no PyPI, no dependency tree in the runtime image. The attack class that hit the ecosystem in 2026 can't apply by construction.",
  },
  {
    title: "Offline, always",
    body: "Nothing phones home. The license check is local Ed25519. Your customers' questions never leave your network — air-gapped deployments are first-class.",
  },
  {
    title: "Built in Rust, on purpose",
    body: "A custom LSM engine, an in-process vector index, no garbage collector in the read path. Sub-millisecond hits aren't a benchmark trick; they're the architecture.",
  },
  {
    title: "Boring on purpose",
    body: "The highest compliment infrastructure can earn is 'we never think about it.' One image, stable on-disk format, fail-open everything. Upgrades are a non-event.",
  },
];

const FACTS: { to: number; prefix?: string; suffix?: string; label: string }[] = [
  { to: 33000, prefix: "~", label: "lines of Rust" },
  { to: 347, label: "integration tests" },
  { to: 7, label: "intelligence systems" },
  { to: 4, label: "protocol surfaces" },
];

export default function AboutPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="relative overflow-hidden border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section grid items-center gap-10 py-16 md:grid-cols-[1.3fr_1fr] md:py-20">
          <div>
            <p className="eyebrow">About Crowkis</p>
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl">
              The cache that knows when to say{" "}
              <span className="relative inline-block text-crow">
                no
                <span className="absolute -bottom-1 left-0 h-2 w-full bg-crow/30" aria-hidden />
              </span>
              .
            </h1>
            <p className="responsive-subtitle mt-5 max-w-xl">
              Crowkis is a Redis-compatible cache, written in Rust, that understands what your LLM is
              being asked — and only reuses an answer when it can prove the reuse is safe. It exists
              because the cheapest token is the one you never spend twice, and the most dangerous
              cache is the one that can&apos;t tell two questions apart.
            </p>
          </div>
          <div className="relative mx-auto flex max-w-[300px] items-center justify-center">
            <div
              className="pointer-events-none absolute h-56 w-56 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(214,34,33,0.25), transparent 70%)" }}
              aria-hidden
            />
            <div className="card-block bg-paper-card p-8">
              <PixelCrowLogo />
            </div>
          </div>
        </div>
      </section>

      {/* the why */}
      <section className="section py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
          <h2 className="responsive-title">Why it exists.</h2>
          <div className="space-y-4 text-[15px] leading-relaxed text-ink-soft">
            <p>
              Every LLM team we met was paying twice for the same answers — the same questions,
              rephrased all day, billed at full price every time — and hoping a vector database would
              save them. It doesn&apos;t. Match by raw similarity and you serve &ldquo;cancel my
              subscription&rdquo; the answer meant for &ldquo;pause my subscription.&rdquo; Match by
              exact bytes and you never hit at all.
            </p>
            <p>
              Crowkis is the cache built for that gap: it reuses aggressively when meaning{" "}
              <em>and</em> structure agree, and refuses when they don&apos;t. We wrote the storage
              engine from scratch in Rust, gave it an immune system against poisoned writes, and
              shipped it as a single signed image that never phones home — because the component
              holding every question your customers ask should be the most trustworthy thing in your
              stack, not the least.
            </p>
            <p className="font-semibold text-ink">
              The bill gets lighter. The answers get faster. And the cache earns its place by being
              the part of the stack you stop worrying about.
            </p>
          </div>
        </div>
      </section>

      {/* numbers */}
      <section className="border-y-2 border-ink bg-roost text-stone-200">
        <div className="section grid grid-cols-2 gap-y-8 py-12 sm:grid-cols-4 md:py-14">
          {FACTS.map((f) => (
            <div key={f.label} className="px-2 text-center">
              <p className="font-display text-3xl font-bold tracking-tight text-stone-50 sm:text-4xl">
                <CountUp to={f.to} prefix={f.prefix} suffix={f.suffix} />
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-stone-500">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* principles */}
      <section className="section py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">What we believe</p>
          <h2 className="responsive-title mt-4">Six principles, no compromises.</h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p) => (
            <TiltCard key={p.title} className="h-full p-6" max={6}>
              <h3 className="font-display text-lg font-bold leading-snug">{p.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{p.body}</p>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* founder */}
      <section className="border-t-2 border-ink bg-paper-deep py-16 md:py-20">
        <div className="section">
          <p className="eyebrow">The founder</p>
          <div className="mt-6 grid items-center gap-8 md:grid-cols-[200px_1fr]">
            <div className="relative mx-auto md:mx-0">
              <div className="overflow-hidden rounded-2xl border-2 border-ink shadow-block">
                <Image
                  src="/brand/founder.jpg"
                  alt="Mohit Rohilla, founder of Crowkis"
                  width={200}
                  height={200}
                  className="h-[200px] w-[200px] object-cover"
                />
              </div>
              <svg
                viewBox="0 0 16 12"
                className="absolute -top-7 right-3 h-9 w-auto"
                shapeRendering="crispEdges"
                aria-hidden
              >
                <rect x="9" y="0" width="4" height="4" fill={INK} />
                <rect x="13" y="1" width="2" height="1" fill={INK} />
                <rect x="3" y="3" width="8" height="5" fill={INK} />
                <rect x="0" y="3" width="3" height="2" fill={INK} />
                <rect x="4" y="4" width="5" height="3" fill={WING} />
                <rect x="6" y="8" width="1" height="2" fill={INK} />
                <rect x="9" y="8" width="1" height="2" fill={INK} />
                <rect x="11" y="1" width="1" height="1" fill={EYE} />
              </svg>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Mohit Rohilla</h2>
              <p className="mt-1 font-mono text-xs text-ink-faint">
                builder of Crowkis · Rust, caches, and one very opinionated crow
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
                &ldquo;I built Crowkis because every LLM team I met was overpaying for answers they
                already had, and reaching for tools that couldn&apos;t tell when reuse was safe. So I
                wrote a cache that understands meaning and refuses when it should — from the storage
                engine up, in Rust. No meters, no phone-home, no nonsense. If it lands in your stack,
                it should quietly save you money first and your time soon after.&rdquo;
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://www.linkedin.com/in/itsmohitrohilla/"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !py-2 text-sm"
                >
                  Connect on LinkedIn
                </a>
                <a
                  href="mailto:info.crowkis@gmail.com?subject=Hi%20Mohit"
                  className="btn-ghost !py-2 text-sm"
                >
                  info.crowkis@gmail.com →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* connect CTA */}
      <section className="section py-16 md:py-24">
        <div className="card-block flex flex-col items-center gap-5 p-10 text-center">
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight">
            Building with LLMs? Let&apos;s talk caches.
          </h2>
          <p className="max-w-lg text-sm text-ink-soft">
            Questions, ideas, or just want to compare notes on semantic caching — the inbox is open.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href="mailto:info.crowkis@gmail.com?subject=Hello%20Crowkis" className="btn-primary">
              Email us
            </a>
            <Link href="/docker" className="btn-secondary">
              Run Crowkis free
            </Link>
          </div>
          <p className="mt-2 font-mono text-xs text-ink-faint">info.crowkis@gmail.com</p>
        </div>
      </section>
    </SiteShell>
  );
}
