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
  title: "Python SDK",
  description:
    "The official Crowkis Python client: get_or_compute, semantic cache commands, async streaming, and multimodal lookups.",
};

export default function PythonSdkPage() {
  return (
    <article>
      <DocTitle
        eyebrow="SDKs"
        title="Python SDK"
        lead="Sync and async clients with full RESP3 coverage, plus the get_or_compute pattern that makes caching a one-liner. Working in 60 seconds."
      />

      <DocH2 id="install">Install</DocH2>
      <DocCode code={`pip install crowkis`} />

      <DocH2 id="quickstart">Quick start</DocH2>
      <DocP>
        <code className="inline">get_or_compute</code> is the core pattern: serve from cache when
        Crowkis judges reuse safe, otherwise run your function and store the result.
      </DocP>
      <DocCode
        title="python"
        code={`from crowkis import CrowkisClient

cache = CrowkisClient(host="127.0.0.1", port=6383, tenant="demo", model="gpt-4o")

answer = cache.get_or_compute(
    "Explain vector caches",
    lambda query: call_llm(query),
    ttl=3600,
)

print(answer.decode("utf-8", errors="replace"))
cache.close()`}
      />

      <DocH2 id="semantic">Explicit semantic commands</DocH2>
      <DocP>When you want direct control over what gets stored and when:</DocP>
      <DocCode
        title="python"
        code={`cache.cset(
    "Explain vector caches",
    "Vector caches store embeddings so similar questions reuse answers.",
    ttl=3600,
)

cached = cache.cget("Explain vector caches")
print(cached.decode() if cached else "miss")`}
      />

      <DocH2 id="streaming">Async streaming</DocH2>
      <DocP>
        The async client streams cached answers in chunks, so a cache hit feels like live model
        output — including when the underlying compute is itself a stream:
      </DocP>
      <DocCode
        title="python"
        code={`from crowkis import AsyncCrowkisClient

async with AsyncCrowkisClient(
    host="127.0.0.1", port=6383, tenant="demo", model="gpt-4o"
) as cache:
    async for chunk in cache.stream_get_or_compute(
        "Explain vector caches",
        lambda query: openai_stream(query),
        ttl=3600,
        chunk_tokens=4,
        delay_ms=20,
    ):
        print(chunk.decode() if isinstance(chunk, bytes) else chunk, end="")`}
      />

      <DocH2 id="frameworks">LangChain and LlamaIndex</DocH2>
      <DocP>
        First-class adapters for LangChain and LlamaIndex ship with the SDK — the pattern is the
        same <code className="inline">get_or_compute</code> wrapped around your chain&apos;s LLM
        call, so the framework never knows a cache exists.
      </DocP>
      <DocNote>
        The client ships with sensible <code className="inline">timeout_sec</code>,{" "}
        <code className="inline">max_retries</code>, and backoff defaults — all overridable in the
        constructor when your latency budget is stricter.
      </DocNote>

      <DocPager prev={["Security model", "/docs/security"]} next={["Node.js / TypeScript SDK", "/docs/sdk-node"]} />
    </article>
  );
}
