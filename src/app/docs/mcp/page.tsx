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
  title: "MCP for AI apps",
  description:
    "Use Crowkis as an MCP server with Claude Code and other MCP-capable AI apps: cache lookups become a tool the model calls before spending tokens.",
};

export default function McpPage() {
  return (
    <article>
      <DocTitle
        eyebrow="SDKs & integrations"
        title="Crowkis MCP"
        lead="The Crowkis binary doubles as an MCP server. Claude Code, agent frameworks, and any MCP-capable app can check the cache before calling the model — and store what they compute."
      />

      <DocH2 id="why">Why this exists</DocH2>
      <DocP>
        AI coding assistants and agents repeat themselves: the same documentation lookups, the
        same explanations, the same boilerplate reasoning, dozens of times a day, billed at full
        token price every time. With Crowkis behind MCP, the model gains two tools — roughly
        &quot;check the cache&quot; and &quot;store this answer&quot; — and repeated work becomes a
        local sub-millisecond hit instead of a paid round-trip.
      </DocP>
      <DocNote>
        In plain words: your AI assistant gets a memory that lives on your machine. Questions it
        has already answered stop costing you money. Nothing is sent anywhere except to the model
        you were already using — and only for genuinely new questions.
      </DocNote>

      <DocH2 id="setup">Set it up</DocH2>
      <DocP>
        <code className="inline">crowkis mcp</code> speaks JSON-RPC over stdio — the standard MCP
        transport. It boots silently (no banner) so the protocol stream stays clean. Register it
        in your client&apos;s MCP configuration:
      </DocP>
      <DocCode
        title="claude code — .mcp.json"
        code={`{
  "mcpServers": {
    "crowkis": {
      "command": "crowkis",
      "args": ["mcp"]
    }
  }
}`}
      />
      <DocP>Or add it from the command line:</DocP>
      <DocCode code={`claude mcp add crowkis -- crowkis mcp`} />
      <DocP>
        Running Crowkis in Docker? Point MCP at the container instead:
      </DocP>
      <DocCode
        title="docker variant"
        code={`{
  "mcpServers": {
    "crowkis": {
      "command": "docker",
      "args": ["exec", "-i", "crowkis", "crowkis", "mcp"]
    }
  }
}`}
      />

      <DocH2 id="behavior">What the model sees</DocH2>
      <DocTable
        head={["Tool surface", "What it does"]}
        rows={[
          ["Cache lookup", "Semantic CGET against the running server — paraphrases of previously answered questions hit, with the same confidence and safety gates as every other client."],
          ["Cache store", "CSET with model and tenant attribution, so agent answers pass the same anti-poisoning pipeline before they're trusted."],
          ["Stats", "Hit rate and savings, so the agent (and you) can see what the cache is worth."],
        ]}
      />
      <DocP>
        Every MCP-originated entry goes through the identical five-stage trust pipeline as RESP or
        SDK traffic. An agent can&apos;t poison the cache any more easily than a human can.
      </DocP>

      <DocH2 id="tips">Patterns that pay off</DocH2>
      <DocTable
        head={["Workload", "Why it caches well"]}
        rows={[
          ["Doc & API lookups", "The same 'how does X work' questions recur across a team all day."],
          ["Code explanation", "Explanations of stable code are stable — cache until the file changes, then invalidate."],
          ["Agent tool results", "Deterministic tool calls (search, schema fetch) are pure savings on replay."],
          ["Multi-agent fan-out", "Five agents asking variants of one question become one model call and four hits."],
        ]}
      />

      <DocPager prev={["Node.js / TypeScript SDK", "/docs/sdk-node"]} />
    </article>
  );
}
