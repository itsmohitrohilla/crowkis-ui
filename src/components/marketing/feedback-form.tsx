"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/feedback";

export function FeedbackForm() {
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
      <div className="card-block p-8 text-center">
        <div className="font-display text-2xl font-bold">Caw received. 🐦‍⬛</div>
        <p className="mt-2 text-ink-soft">
          Thanks, a human reads every one of these. That&apos;s genuinely useful.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-block space-y-4 p-6 sm:p-7">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Name (optional)
          </span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border-2 border-ink bg-paper-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crow"
            placeholder="Jane Doe"
          />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
            Email (optional)
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className="mt-1.5 w-full rounded-lg border-2 border-ink bg-paper-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crow"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
          Your feedback
        </span>
        <textarea
          name="message"
          required
          rows={6}
          maxLength={4000}
          className="mt-1.5 w-full rounded-lg border-2 border-ink bg-paper-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-crow"
          placeholder="What's working, what's broken, what you wish it did…"
        />
      </label>
      {state === "error" ? <p className="text-sm font-semibold text-crow">{error}</p> : null}
      <button type="submit" disabled={state === "sending"} className="btn-primary disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send feedback"}
      </button>
    </form>
  );
}
