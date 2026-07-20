"use client";

import { useEffect, useState } from "react";
import { submitRating } from "@/lib/feedback";

const SEEN_KEY = "crowkis-rating-seen";
const COOLDOWN_MS = 5 * 24 * 60 * 60 * 1000; // don't nag again for 5 days
const CHANCE = 0.2; // only ~1 in 5 eligible visits
const DELAY_MS = 20000; // and only after 20s on the page

export function RatingWidget() {
  const [open, setOpen] = useState(false);
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  // Occasionally auto-open to ask for a rating — rarely, and never twice within the cooldown.
  useEffect(() => {
    try {
      const last = Number(localStorage.getItem(SEEN_KEY) || 0);
      if (Date.now() - last < COOLDOWN_MS) return;
      if (Math.random() > CHANCE) return;
      const t = setTimeout(() => {
        setOpen(true);
        localStorage.setItem(SEEN_KEY, String(Date.now()));
      }, DELAY_MS);
      return () => clearTimeout(t);
    } catch {
      /* no localStorage — just skip the auto-popup */
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  async function send() {
    if (!stars) return;
    setState("sending");
    const res = await submitRating({ stars, comment });
    setState(res.ok ? "done" : "error");
    if (res.ok) setTimeout(dismiss, 1400);
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 print:hidden">
      {open ? (
        <div className="w-72 rounded-xl border-2 border-ink bg-paper-card p-4 shadow-block">
          <div className="flex items-start justify-between">
            <p className="font-display text-sm font-bold">
              {state === "done" ? "Thanks — caw! 🐦‍⬛" : "How's the crow treating you?"}
            </p>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close"
              className="text-ink-faint transition hover:text-ink"
            >
              ✕
            </button>
          </div>

          {state !== "done" ? (
            <>
              <div className="mt-3 flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => setStars(n)}
                    className={`text-2xl leading-none transition ${
                      n <= (hover || stars) ? "text-crow" : "text-ink-line"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="anything you'd tell the crow? (optional)"
                className="mt-3 w-full rounded-lg border-2 border-ink bg-paper-card px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-crow"
              />
              {state === "error" ? (
                <p className="mt-1 text-xs font-semibold text-crow">Try again in a bit.</p>
              ) : null}
              <button
                type="button"
                onClick={send}
                disabled={!stars || state === "sending"}
                className="btn-primary mt-3 w-full !py-2 !text-xs disabled:opacity-50"
              >
                {state === "sending" ? "sending…" : "Send rating"}
              </button>
            </>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper-card px-4 py-2 text-sm font-bold shadow-block-sm transition hover:-translate-y-0.5"
          title="Rate Crowkis"
        >
          <span aria-hidden>🐦‍⬛</span> Rate the crow
        </button>
      )}
    </div>
  );
}
