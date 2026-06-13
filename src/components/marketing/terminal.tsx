"use client";

import { useEffect, useRef, useState } from "react";

type Line = {
  text: string;
  tone: "cmd" | "ok" | "str" | "dim" | "key";
  prompt?: boolean;
  typed?: boolean;
};

const SCRIPT: Line[] = [
  { text: "crowkis cli", tone: "cmd", prompt: true, typed: true },
  { text: "connected to 127.0.0.1:6383 · community edition · all systems live", tone: "dim" },
  {
    text: 'CSET "What is your refund window?" "Refunds are issued within 5 business days of approval." EX 86400 MODEL gpt-4o TENANT support',
    tone: "cmd",
    prompt: true,
    typed: true,
  },
  { text: "OK", tone: "ok" },
  { text: "· intent=factual  confidence=0.96  poison-check=passed", tone: "dim" },
  { text: 'CGET "how long do refunds take?" TENANT support', tone: "cmd", prompt: true, typed: true },
  { text: '"Refunds are issued within 5 business days of approval."', tone: "str" },
  { text: "· semantic hit  0.4ms  one less call to gpt-4o", tone: "dim" },
  { text: 'CGET "cancel my subscription right now" TENANT support', tone: "cmd", prompt: true, typed: true },
  { text: "(nil)", tone: "key" },
  { text: "· different intent — similar words are not the same question", tone: "dim" },
];

const toneClass: Record<Line["tone"], string> = {
  cmd: "tok-cmd",
  ok: "tok-ok",
  str: "tok-str",
  dim: "tok-dim",
  key: "tok-key",
};

export function HeroTerminal() {
  const [lines, setLines] = useState<{ line: Line; chars: number }[]>([]);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setLines(SCRIPT.map((line) => ({ line, chars: line.text.length })));
      setDone(true);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    (async () => {
      await wait(600);
      for (const line of SCRIPT) {
        if (cancelled) return;
        if (line.typed) {
          setLines((prev) => [...prev, { line, chars: 0 }]);
          for (let c = 1; c <= line.text.length; c++) {
            if (cancelled) return;
            setLines((prev) => {
              const next = [...prev];
              next[next.length - 1] = { line, chars: c };
              return next;
            });
            await wait(line.text.length > 60 ? 7 : 22);
          }
          await wait(260);
        } else {
          setLines((prev) => [...prev, { line, chars: line.text.length }]);
          await wait(340);
        }
        bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
      }
      if (!cancelled) setDone(true);
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="code-panel">
      <div className="code-chrome">
        <span className="flex gap-1.5" aria-hidden>
          <i className="h-2.5 w-2.5 rounded-full bg-crow" />
          <i className="h-2.5 w-2.5 rounded-full bg-stone-600" />
          <i className="h-2.5 w-2.5 rounded-full bg-stone-600" />
        </span>
        <span className="ml-2">crowkis cli — redis clients work too</span>
      </div>
      <div ref={bodyRef} className="max-h-[340px] overflow-y-auto p-4 sm:p-5">
        <div className="font-mono text-[12.5px] leading-[1.85] sm:text-[13px]">
          {lines.map(({ line, chars }, i) => (
            <div key={i} className="whitespace-pre-wrap break-words">
              {line.prompt ? <span className="tok-key">→ </span> : null}
              <span className={toneClass[line.tone]}>{line.text.slice(0, chars)}</span>
              {!done && i === lines.length - 1 ? (
                <span className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-blink bg-stone-300" />
              ) : null}
            </div>
          ))}
          {done ? (
            <div>
              <span className="tok-key">→ </span>
              <span className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[3px] animate-blink bg-stone-300" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
