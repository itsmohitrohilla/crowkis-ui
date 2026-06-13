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
    "The official Crowkis Node client: getOrCompute, semantic cache commands, async iteration for streaming, with TypeScript typings included.",
};

export default function NodeSdkPage() {
  return (
    <article>
      <DocTitle
        eyebrow="SDKs"
        title="Node.js / TypeScript SDK"
        lead="A fully async client with TypeScript typings, buffered RESP3 frame parsing, and streaming via async iteration. Working in 60 seconds."
      />

      <DocH2 id="install">Install</DocH2>
      <DocCode code={`npm install crowkis`} />

      <DocH2 id="quickstart">Quick start</DocH2>
      <DocCode
        title="typescript"
        code={`import { CrowkisClient } from "@crowkis/client";

const cache = new CrowkisClient({
  host: "127.0.0.1",
  port: 6383,
  tenant: "demo",
  model: "gpt-4o",
});

const answer = await cache.getOrCompute(
  "Explain vector caches",
  async (query) => callLLM(query),
  { ttl: 3600 },
);

console.log(Buffer.isBuffer(answer) ? answer.toString() : answer);
cache.close();`}
      />

      <DocH2 id="semantic">Explicit semantic commands</DocH2>
      <DocCode
        title="typescript"
        code={`await cache.cset(
  "Explain vector caches",
  "Vector caches store embeddings so similar questions reuse answers.",
  { ttl: 3600 },
);

const cached = await cache.cget("Explain vector caches");
console.log(cached ? cached.toString() : "miss");`}
      />

      <DocH2 id="streaming">Streaming with async iteration</DocH2>
      <DocP>
        Cached answers stream chunk by chunk through a regular{" "}
        <code className="inline">for await</code> loop:
      </DocP>
      <DocCode
        title="typescript"
        code={`for await (const chunk of cache.streamGetOrCompute(
  "Explain vector caches",
  async (query) => openAIStream(query),
  { ttl: 3600, chunkTokens: 4, delayMs: 20 },
)) {
  process.stdout.write(Buffer.isBuffer(chunk) ? chunk.toString() : String(chunk));
}`}
      />

      <DocH2 id="typings">TypeScript support</DocH2>
      <DocP>
        The package ships <code className="inline">index.d.ts</code> typings, and the RESP reader
        handles partial frames and RESP3 push frames, so long answers and live notifications both
        arrive intact.
      </DocP>
      <DocNote>
        The client ships sensible timeout, retry, and backoff defaults, matching the Python SDK.
        Run Crowkis on a trusted network segment or behind your service mesh — TLS termination
        belongs to your proxy, like most data-plane infrastructure.
      </DocNote>

      <DocPager prev={["Python SDK", "/docs/sdk-python"]} next={["MCP for AI apps", "/docs/mcp"]} />
    </article>
  );
}
