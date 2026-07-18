"use client";

import { useEffect, useRef, useState } from "react";
import { CrowBot } from "@/components/crow/crow-bot";

/**
 * The CrowBot buddy: a small, ever-present mascot pinned to the corner of
 * every page. Click it (or get your cursor too close) and it talks back, * jokes, sarcasm, and cache propaganda. Dismissable, remembers nothing,
 * forgives nothing.
 */

const LINES = [
  "I cached that. You're welcome.",
  "Asking your model twice? In this economy?",
  "0.4ms. I don't even need to brag. (I do.)",
  "I've seen your token bill. Sit down. We should talk.",
  "CAW. That's 'hello' in production-grade.",
  "Touch me again and I'll invalidate your TTLs.",
  "I remember everything. Mostly your repeated questions.",
  "Semantic hit. Another dollar saved. Another crumb for me.",
  "Your LLM thinks. I remember. We are not the same.",
  "Poison? Not on my watch. Stage 3 veto, baby.",
  "I work offline. I'm basically a hermit with a ledger.",
  "redis-cli walked so crowkis cli could fly.",
  "I'd explain HNSW, but you'd ask twice and prove my point.",
  "Five gates. Zero mercy. Sub-millisecond.",
  "You again? Good thing I cache faces too. Kidding. Mostly.",
  "Fun fact: a group of cache hits is called a 'payday'.",
  "I don't hallucinate. I have receipts.",
  "Click the flying crow if you're feeling brave. Not my fault.",
  "Every paraphrase you type is rent money I'm saving you.",
  "My love language is acknowledged writes.",
];

export function CrowBotBuddy() {
  const [line, setLine] = useState<string | null>(null);
  const [bounce, setBounce] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastIdx = useRef(-1);
  const hoverCooldown = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const speak = (custom?: string) => {
    let idx = Math.floor(Math.random() * LINES.length);
    if (idx === lastIdx.current) idx = (idx + 1) % LINES.length;
    lastIdx.current = idx;
    setLine(custom ?? LINES[idx]);
    setBounce(true);
    setTimeout(() => setBounce(false), 350);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setLine(null), 4200);
  };

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed bottom-3 right-3 z-40 hidden md:block" aria-hidden>
      {line ? (
        <div className="caw-bubble absolute -top-2 right-[88px] w-56 -translate-y-full rounded-xl border-2 border-ink bg-paper-card p-3 text-[13px] font-medium leading-snug text-ink shadow-block-sm">
          {line}
          <span className="absolute -bottom-[9px] right-6 h-4 w-4 rotate-45 border-b-2 border-r-2 border-ink bg-paper-card" />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => speak()}
        onMouseEnter={() => {
          const now = Date.now();
          if (now - hoverCooldown.current > 12000) {
            hoverCooldown.current = now;
            speak("Hey. Watch the visor.");
          }
        }}
        className={`block cursor-pointer transition-transform duration-200 hover:scale-105 ${
          bounce ? "scale-110" : ""
        }`}
        style={{ lineHeight: 0 }}
        aria-label="the crowkis bot, click for wisdom"
        title="click me"
      >
        <CrowBot size={92} />
      </button>
      <button
        type="button"
        onClick={() => setHidden(true)}
        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-ink bg-paper-card font-mono text-[10px] font-bold text-ink-soft opacity-0 transition-opacity hover:opacity-100 [div:hover>&]:opacity-70"
        aria-label="dismiss the bot"
      >
        ×
      </button>
    </div>
  );
}
