import { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the people behind Crowkis. Send a message, email contact@crowkis.com, or join the community on Discord.",
};

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

export default function ContactPage() {
  return (
    <SiteShell>
      {/* hero */}
      <section className="border-b-2 border-ink bg-paper-deep paper-grid">
        <div className="section py-14 md:py-20">
          <p className="eyebrow">Contact</p>
          <h1 className="responsive-title mt-4 max-w-3xl">
            Got a question? We&apos;d love to{" "}
            <span className="relative inline-block">
              hear from you
              <span className="absolute -bottom-1 left-0 h-2 w-full bg-crow" aria-hidden />
            </span>
            .
          </h1>
          <p className="responsive-subtitle mt-5 max-w-xl">
            Whether you&apos;re evaluating Crowkis, stuck on a deploy, kicking the tires on
            Enterprise, or just want to talk caches — send a message and a human will get back to you.
          </p>
        </div>
      </section>

      {/* form + sidebar */}
      <section className="section grid gap-8 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20">
        <div>
          <h2 className="font-display text-xl font-bold">Send us a message</h2>
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
              href={`mailto:${EMAIL}?subject=Hello%20Crowkis`}
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
              Swap caching war stories, get help fast, and hear what&apos;s shipping next — be part of
              the community.
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
              href={`mailto:${EMAIL}?subject=Crowkis%20Enterprise%20%E2%80%94%20let%27s%20talk`}
              className="btn-secondary mt-4 !py-2 text-sm"
            >
              Book a call
            </a>
          </div>
        </aside>
      </section>
    </SiteShell>
  );
}
