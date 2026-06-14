"use client";

import { useState } from "react";

const TO = "contact@crowkis.com";

/** Gmail web compose — opens a real compose window in the browser, no desktop
 *  mail app required (which is why a plain mailto: often appears to "do nothing"). */
function gmailCompose(subject: string, body: string) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    TO,
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function mailto(subject: string, body: string) {
  return `mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * A static marketing site has no backend, so the form composes the message and
 * hands it off addressed to contact@crowkis.com. It opens Gmail's web compose in
 * a new tab (reliable everywhere), and offers a mailto fallback for anyone who'd
 * rather use their own mail app. Nothing is stored or routed through a third party.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const buildSubject = () => `Crowkis — message from ${name || "a visitor"}`;
  const buildBody = () =>
    [message, "", "—", name ? `From: ${name}` : null, email ? `Reply to: ${email}` : null]
      .filter(Boolean)
      .join("\n");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = buildSubject();
    const body = buildBody();
    const win = window.open(gmailCompose(subject, body), "_blank", "noopener,noreferrer");
    // popup blocked or no window → fall back to the OS mail handler
    if (!win) window.location.href = mailto(subject, body);
    setSent(true);
  };

  return (
    <form onSubmit={submit} className="card-block bg-paper-card p-6 sm:p-8">
      <div className="grid gap-4">
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Your name
          </span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Crow"
            className="mt-1.5 w-full rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:shadow-block-sm"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Email <span className="normal-case tracking-normal">(so we can reply)</span>
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="mt-1.5 w-full rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:shadow-block-sm"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
            Message
          </span>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you're building, what you need, or just say hi…"
            className="mt-1.5 w-full resize-y rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:shadow-block-sm"
          />
        </label>
      </div>

      <button type="submit" className="btn-primary mt-5 w-full !py-3">
        Send us a message
      </button>

      <p className="mt-3 text-center font-mono text-[11px] text-ink-faint">
        {sent ? (
          <>Opened a compose window — hit send and it reaches us.</>
        ) : (
          <>
            Opens a Gmail compose window. Prefer your own mail app?{" "}
            <a href={mailto(buildSubject(), buildBody())} className="font-semibold text-crow underline">
              email us
            </a>
            .
          </>
        )}
      </p>
    </form>
  );
}
