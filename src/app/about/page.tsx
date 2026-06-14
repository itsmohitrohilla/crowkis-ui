import { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { TiltCard } from "@/components/ui/tilt-card";
import { CountUp } from "@/components/ui/count-up";
import { ContactForm } from "@/components/marketing/contact-form";

// TODO: swap in the real invite once it's ready.
const DISCORD_URL = "#";
const EMAIL = "contact@crowkis.com";

function DiscordMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.317 4.369A19.79 19.79 0 0016.558 3.2a.074.074 0 00-.079.037c-.34.6-.717 1.385-.98 2.001a18.27 18.27 0 00-5.487 0 12.6 12.6 0 00-.997-2.001.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C1.533 7.62.952 10.775 1.237 13.89a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.1 13.1 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127c-.598.349-1.22.645-1.873.892a.076.076 0 00-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.056c.5-3.598-.838-6.728-2.549-9.494a.06.06 0 00-.031-.028zM8.02 12.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z" />
    </svg>
  );
}

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

      {/* contact */}
      <section id="contact" className="scroll-mt-24 border-t-2 border-ink bg-paper-deep py-16 md:py-20">
        <div className="section">
          <div className="max-w-2xl">
            <p className="eyebrow">Contact</p>
            <h2 className="responsive-title mt-4">
              Building with LLMs? Let&apos;s talk caches.
            </h2>
            <p className="responsive-subtitle mt-4">
              Evaluating Crowkis, stuck on a deploy, weighing Enterprise, or just want to compare
              notes on semantic caching — send a message and a human will get back to you.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h3 className="font-display text-lg font-bold">Send us a message</h3>
              <p className="mt-1.5 text-sm text-ink-soft">
                Fill this in and it&apos;ll open your mail app, ready to send to us.
              </p>
              <div className="mt-5">
                <ContactForm />
              </div>
            </div>

            <aside className="space-y-5">
              {/* email card */}
              <div className="card-block bg-paper-card p-6">
                <p className="eyebrow">Prefer email?</p>
                <h3 className="mt-2 font-display text-lg font-bold">Write to us directly</h3>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Our inbox is open and read by people, not bots.
                </p>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Hello%20Crowkis`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-sm font-semibold text-crow"
                >
                  {EMAIL} <span aria-hidden>→</span>
                </a>
              </div>

              {/* discord card */}
              <div className="card-block bg-roost p-6 text-stone-200">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-400">
                  Community
                </p>
                <h3 className="mt-2 flex items-center gap-2 font-display text-lg font-bold text-stone-50">
                  <DiscordMark className="h-6 w-6 text-[#5865F2]" />
                  Join us on Discord
                </h3>
                <p className="mt-1.5 text-sm text-stone-400">
                  Swap caching war stories, get help fast, and hear what&apos;s shipping next — be
                  part of the community.
                </p>
                <a
                  href={DISCORD_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-4 py-2.5 font-display text-sm font-bold text-white transition hover:-translate-y-0.5"
                >
                  <DiscordMark className="h-5 w-5" />
                  Join the Discord server
                </a>
              </div>

              {/* enterprise nudge */}
              <div className="card-block bg-paper-card p-6">
                <p className="eyebrow">Enterprise</p>
                <h3 className="mt-2 font-display text-lg font-bold">Talking scale or compliance?</h3>
                <p className="mt-1.5 text-sm text-ink-soft">
                  We&apos;ll run your own traffic through Crowkis Replay on a call and show you the
                  savings before you commit.
                </p>
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(
                    "Crowkis Enterprise — let's talk",
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-4 !py-2 text-sm"
                >
                  Book a call
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
