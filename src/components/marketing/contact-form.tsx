"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/feedback";

const LABEL = "font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint";
const FIELD =
  "mt-1.5 w-full rounded-lg border-2 border-ink bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-faint focus:border-crow focus:shadow-block-sm";

/** Contact form on /about. Saves to the feedback table (source "contact"),
 *  which is what the admin dashboard lists under Messages. */
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await submitFeedback({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
      source: "contact",
    });
    if (res.ok) {
      setState("done");
    } else {
      setState("error");
      setError(res.error ?? "Something went wrong.");
    }
  }

  if (state === "done") {
    return (
      <div className="card-block p-8 text-center" role="status">
        <p className="font-display text-2xl font-bold">Message received.</p>
        <p className="mt-2 text-ink-soft">Thanks, a human will read it and reply to your email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-block p-6 sm:p-8">
      <h3 className="font-display text-xl font-bold">Send us a message</h3>
      <p className="mt-1.5 text-sm text-ink-soft">A human reads every one and replies by email.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>Your name</span>
          <input name="name" type="text" required autoComplete="name" maxLength={120} placeholder="Jane Crow" className={FIELD} />
        </label>
        <label className="block">
          <span className={LABEL}>Email</span>
          <input name="email" type="email" required autoComplete="email" maxLength={200} placeholder="you@company.com" className={FIELD} />
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL}>Message</span>
          <textarea
            name="message"
            required
            rows={5}
            maxLength={4000}
            placeholder="Tell us what you're building, what you need, or just say hi…"
            className={`${FIELD} resize-y`}
          />
        </label>
      </div>

      {state === "error" ? (
        <p className="mt-4 text-sm font-semibold text-crow" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={state === "sending"} className="btn-primary mt-5 w-full !py-3 disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
