import { Metadata } from "next";
import {
  DocTitle,
  DocH2,
  DocP,
  DocCode,
  DocNote,
  DocPager,
} from "@/components/layout/docs-shell";

export const metadata: Metadata = {
  title: "Node.js / TypeScript SDK",
  description:
    "The official Crowkis Node/TypeScript client. Model-agnostic: cache any LLM call and save the tokens. Full method reference, copy-paste ready, TypeScript typings included.",
};

export default function NodeSdkPage() {
  return (
    <article>
      <DocTitle
        eyebrow="SDKs"
        title="Node.js / TypeScript SDK"
        lead="Cache any model. Crowkis is model-agnostic, wrap the call you already make to OpenAI, Anthropic, a local model, or whatever comes next, and Crowkis serves the repeats for free. Fully async, TypeScript typings included."
      />

      <DocH2 id="install">Install</DocH2>
      <DocP>One command. The base client has no runtime dependencies.</DocP>
      <DocCode title="shell" code={`npm install @crowkis/client`} />

      <DocH2 id="idea">The one idea</DocH2>
      <DocP>
        Crowkis doesn&apos;t care which model you call. You wrap the call you already make; Crowkis
        remembers the answer by <em>meaning</em>, so the next time someone asks the same thing in
        different words it&apos;s served instantly and for free.
      </DocP>

      <DocH2 id="connect">Connect</DocH2>
      <DocCode
        title="typescript"
        code={`import { Crowkis } from "@crowkis/client";

const cache = new Crowkis({ host: "127.0.0.1", port: 6379, tenant: "my-app" });`}
      />

      <DocH2 id="cached">Cache any model, the wrapper</DocH2>
      <DocP>
        <code className="inline">cache.cached()</code> wraps any async function whose first argument
        is the prompt, and matches on meaning, so rephrased prompts hit too. The function inside
        can call <em>any</em> provider.
      </DocP>
      <DocCode
        title="typescript"
        code={`const answer = cache.cached(
  async (prompt: string) => myModel(prompt),   // OpenAI, Claude, local, anything
  { ttl: 3600 },
);

await answer("How do refunds work?");         // miss → your model runs, result cached
await answer("What's the refund process?");   // semantic HIT → no model call`}
      />

      <DocH2 id="ask">Cache any model, explicit form</DocH2>
      <DocCode
        title="typescript"
        code={`const text = await cache.ask(
  "How do refunds work?",
  async (prompt) => myModel(prompt),   // any model
  { ttl: 3600 },
);`}
      />

      <DocH2 id="lookup-store">Lookup &amp; store directly</DocH2>
      <DocCode
        title="typescript"
        code={`const hit = await cache.lookup("what's the refund timeline?");
if (hit) {
  console.log(hit.text, hit.similarity, hit.confidence);
} else {
  await cache.store("what's the refund timeline?", "5-7 business days.", { ttl: 3600 });
}`}
      />

      <DocH2 id="stream">Streaming with async iteration</DocH2>
      <DocCode
        title="typescript"
        code={`for await (const chunk of cache.stream(
  "Explain vector caches",
  async (prompt) => myModelStream(prompt),
  { ttl: 3600 },
)) {
  process.stdout.write(typeof chunk === "string" ? chunk : chunk.toString());
}`}
      />

      <DocH2 id="langchain">LangChain.js</DocH2>
      <DocP>
        Matches on meaning, so rephrased prompts hit, unlike an exact-match cache. Drops into
        LangChain&apos;s <code className="inline">cache</code> option, no chain changes.
      </DocP>
      <DocCode
        title="typescript"
        code={`import { CrowkisCache } from "@crowkis/client/langchain";
import { OpenAI } from "@langchain/openai";

const llm = new OpenAI({ cache: new CrowkisCache({ tenant: "my-app", ttl: 3600 }) });`}
      />

      <DocH2 id="memory">Agent memory</DocH2>
      <DocP>
        Durable, semantic, per-user memory for agents (LangGraph.js or any loop). Every recall is
        scoped to its agent and user.
      </DocP>
      <DocCode
        title="typescript"
        code={`import { CrowkisMemory } from "@crowkis/client/memory";

const mem = new CrowkisMemory("support-bot", { user: "alice" });
await mem.remember("Alice prefers email over phone");
await mem.recall("how should I contact Alice?");   // semantic recall`}
      />

      <DocH2 id="reference">Method reference</DocH2>
      <DocP>
        Grouped by purpose. The high-level methods cover most apps; the rest are on the{" "}
        <code className="inline">Crowkis</code> client for direct control.
      </DocP>

      <DocCode
        title="caching, model-agnostic"
        code={`cache.cached(fn, { ttl, threshold })   // wrap any async model call in a semantic cache
cache.ask(prompt, compute, opts)       // recall, else run compute() and cache it
cache.stream(prompt, compute, opts)    // same, as an async iterator of chunks
cache.lookup(prompt)                   // → { text, similarity, confidence } | null
cache.store(prompt, answer, { ttl })   // write an answer for a prompt
cache.similar(prompt, { k })           // k most similar cached prompts
cache.embed(text)                      // raw embedding vector
cache.flush()                          // clear this tenant's cache`}
      />

      <DocCode
        title="agent memory, new CrowkisMemory(agent, { user })"
        code={`mem.remember(fact, { ttl })   // store a fact
mem.recall(query, { k })      // semantic recall
mem.extract(conversation)     // pull facts from a transcript
mem.history(query, { k })     // recall including superseded versions
mem.forget({ query })         // forget matching facts
mem.link(subj, rel, obj)      // knowledge-graph edge
mem.graph(entity, { depth })  // walk the graph`}
      />

      <DocCode
        title="sessions · quality · cost · ops"
        code={`cache.csessionAdd(session, role, text)   cache.csessionRecent(session, { n })
cache.cpin(query, answer)                cache.cflag(query, badAnswer)
cache.cguard(text)                       cache.coutcheck(text)
cache.cbudgetSet(tenant, { dailyUsd })   cache.ckeylimitSet(tenant, { rpm })
cache.cpiiReport(tenant)                 cache.csave(dest)   cache.creload()`}
      />

      <DocNote>
        Ships <code className="inline">index.d.ts</code> typings; the RESP reader handles partial
        and RESP3 push frames. Sensible timeout/retry/backoff defaults match the Python SDK. The
        embedding model lives server-side, so the client uses whatever model the server runs.
      </DocNote>

      <DocPager
        prev={["Python SDK", "/docs/sdk-python"]}
        next={["LangChain, LangGraph & Shell", "/docs/frameworks"]}
      />
    </article>
  );
}
