import { Metadata } from "next";
import {
  DocTitle,
  DocH2,
  DocP,
  DocCode,
  DocNote,
  DocTable,
  DocPager,
} from "@/components/layout/docs-shell";

export const metadata: Metadata = {
  title: "Quickstart",
  description:
    "Get a Crowkis instance running and serve your first semantic cache hit in under five minutes. Free Community edition, no license required.",
};

export default function QuickstartPage() {
  return (
    <article>
      <DocTitle
        eyebrow="Getting started"
        title="Quickstart"
        lead="From zero to a semantic cache hit in about five minutes. You need Docker, everything else, including the CLI, ships inside the image. Community edition is free and needs no license."
      />

      <DocH2 id="run">1. Pull and run</DocH2>
      <DocCode
        code={`docker pull crowkis/crowkis:latest

docker run -d --name crowkis \\
  -p 127.0.0.1:6379:6379 \\
  -p 127.0.0.1:6380:6380 \\
  -p 127.0.0.1:6381:6381 \\
  -v crowkis-data:/data \\
  crowkis/crowkis:latest`}
      />
      <DocTable
        head={["Endpoint", "Port", "What it is"]}
        rows={[
          [<strong key="r">RESP3 (Redis protocol)</strong>, "127.0.0.1:6379", "crowkis cli and any Redis client"],
          [<strong key="d">Dashboard + REST</strong>, "127.0.0.1:6380", "live verdict feed, management API, /health"],
          [<strong key="g">gRPC (h2c)</strong>, "127.0.0.1:6381", "protobuf surface"],
        ]}
      />
      <DocNote>
        No environment variables are required to boot, defaults are sensible and the data volume
        persists your cache across restarts. Hardening and every knob:{" "}
        <a href="/docker" className="font-semibold text-crow underline underline-offset-2">
          the Docker guide
        </a>
        .
      </DocNote>

      <DocH2 id="first-commands">2. Talk to it</DocH2>
      <DocP>
        The image ships the interactive REPL, <code className="inline">crowkis cli</code>, which
        connects like redis-cli does. Standard Redis commands work, and the{" "}
        <code className="inline">C*</code> family adds the semantic layer:
      </DocP>
      <DocCode
        title="docker exec -it crowkis crowkis cli"
        code={`PING
CSET "Explain vector caches" "Vector caches store embeddings of past queries so similar questions can reuse answers." EX 86400 MODEL gpt-4o TENANT demo
CGET "Explain vector caches" TENANT demo
CGET "what are vector caches?" TENANT demo
CSIM "France capital city" K 5
CVECCOUNT`}
      />
      <DocP>
        The fourth line is the point: a <em>paraphrase</em> of the stored question still hits,
        because Crowkis matches meaning and structure, not bytes. Already a Redis shop? Your
        existing client connects to port 6379 unmodified.
      </DocP>

      <DocH2 id="dashboard">3. Watch it decide</DocH2>
      <DocP>
        Open the dashboard and you&apos;ll see every verdict streaming live, hits by type, misses,
        safety blocks, latency, and an estimate of what the cache saved you:
      </DocP>
      <DocCode code={`open http://127.0.0.1:6380`} />

      <DocH2 id="sdk">4. Wire it into your app</DocH2>
      <DocP>
        The SDKs wrap the whole cache-or-compute loop in one call. If the answer is cached and safe
        to reuse, you never touch the model:
      </DocP>
      <DocCode
        title="pip install crowkis"
        code={`from crowkis import CrowkisClient

cache = CrowkisClient(host="127.0.0.1", port=6379, tenant="demo", model="gpt-4o")

answer = cache.get_or_compute(
    "Explain vector caches",
    lambda query: call_llm(query),
    ttl=3600,
)`}
      />
      <DocNote>
        Node shop? <code className="inline">npm install crowkis</code> and{" "}
        <code className="inline">getOrCompute</code>, same pattern. Using Claude Code or agents?
        See{" "}
        <a href="/docs/mcp" className="font-semibold text-crow underline underline-offset-2">
          MCP for AI apps
        </a>
        .
      </DocNote>

      <DocPager next={["Docker deployment", "/docs/docker"]} />
    </article>
  );
}
