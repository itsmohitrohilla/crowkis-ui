import { RoostPost } from "@/lib/content/roost";

/**
 * Code-first guides, authored as full posts so they can carry real `code`
 * blocks. Every command, flag, and SDK call here matches the shipped product.
 */

const TAG = "guides";

export const codePosts: RoostPost[] = [
  {
    slug: "the-crowkis-cli-tour",
    title: "The crowkis CLI: every subcommand, with the flags that matter",
    date: "2026-06-23",
    readMinutes: 8,
    tag: TAG,
    summary:
      "The binary is the whole product, server, REPL, doctor, bench, and the inspect tools. A tour of the crowkis command line, from cold start to debugging a missed hit.",
    blocks: [
      {
        kind: "p",
        text: "Crowkis ships as one binary, and that binary is also your toolbox. There's no separate CLI package to install, no client library required to poke at a running instance, `crowkis` is the server, the REPL, the benchmark harness, and the debugger, all behind subcommands. Here's the tour.",
      },
      {
        kind: "h2",
        text: "Start it, talk to it",
      },
      {
        kind: "code",
        title: "cold start to first hit",
        code: `# start the cache, RESP on :6379, dashboard on :6380, gRPC on :6381
crowkis server --port 6379 --data ./crowkis.data

# in another shell, open the built-in REPL
crowkis cli 127.0.0.1:6379

> CSET "how do refunds work?" "Refunds take 5-7 business days."
OK
> CGET "what's the refund timeline?"   # a paraphrase
"Refunds take 5-7 business days."      # semantic hit`,
      },
      {
        kind: "p",
        text: "The REPL feels like redis-cli on purpose, every Redis command works, and the C* semantic commands sit right beside them. You can also point any Redis client at the same port; the CLI is just the one that ships in the box.",
      },
      {
        kind: "h2",
        text: "Check its health, prove it's fast",
      },
      {
        kind: "code",
        title: "doctor + bench",
        code: `# health check & diagnostics, config, ports, model, data dir
crowkis doctor

# built-in benchmarks: latency, throughput, paraphrase hit-rate, reasoning reuse
crowkis bench latency
crowkis bench throughput
crowkis bench paraphrase`,
      },
      {
        kind: "p",
        text: "`crowkis doctor` is the first thing to run when something feels off, it reports the bind addresses, the embedding model in use, the data directory, and whether auth is configured. `crowkis bench` runs the same harnesses we publish numbers from, against your hardware, so you can see your own latency rather than ours.",
      },
      {
        kind: "h2",
        text: "Debug a miss you didn't expect",
      },
      {
        kind: "code",
        title: "dump + why + tail",
        code: `# inspect a cache entry, embedding, template, intent, trust
crowkis dump "how do refunds work?"

# explain a hit-or-miss decision, which gate vetoed, and the scores
crowkis why "can I get my money back?"

# follow the structured JSON log, colour-coded, live
crowkis tail`,
      },
      {
        kind: "p",
        text: "`crowkis why` is the one you'll reach for most: when a query you expected to hit comes back a miss, it walks the five gates and tells you which one vetoed, similarity too low, template mismatch, confidence under the bar, trust or freshness failing, with the actual scores. The cache stops being a black box.",
      },
      {
        kind: "h2",
        text: "Back it up, move it",
      },
      {
        kind: "code",
        title: "backup + restore",
        code: `crowkis backup ./snapshots          # write a .crowkbak snapshot
crowkis restore ./snapshots/latest  # load one back

# Enterprise verbs, same binary:
crowkis suggest        # cache-optimization suggestions from real traffic
crowkis replay         # replay a workload to size savings
crowkis export-audit   # ship the audit log to your SIEM`,
      },
      {
        kind: "quote",
        text: "One binary you can drop on a laptop or an air-gapped box. The server, the client, the doctor, and the debugger are the same file.",
      },
    ],
  },
  {
    slug: "cache-an-llm-call-python-sdk",
    title: "Cache an LLM call in three lines: the Python SDK",
    date: "2026-06-21",
    readMinutes: 5,
    tag: TAG,
    summary:
      "The Python SDK wraps the semantic cache in an ergonomic client, get-or-compute, streaming, tenants, models. Here's the three-line version and the production version.",
    blocks: [
      {
        kind: "p",
        text: "The fastest way to feel the savings is the get-or-compute pattern: ask the cache first, and only call the model on a miss, banking the result for every future paraphrase. The Python SDK makes it three lines around your existing model call.",
      },
      {
        kind: "code",
        title: "the three-line version",
        code: `from crowkis import CrowkisClient

cache = CrowkisClient(host="127.0.0.1", port=6379, tenant="demo", model="gpt-4o")

answer = cache.get_or_compute(
    "Explain vector caches in one paragraph",
    compute=lambda: call_your_model(prompt),  # only runs on a miss
)`,
      },
      {
        kind: "p",
        text: "On the first call, `compute` runs and the answer is stored with the full anti-poisoning pipeline. On every semantically similar call after, the cache returns the stored answer in well under a millisecond, no model call, no token cost.",
      },
      {
        kind: "code",
        title: "the production version, explicit set/get with confidence",
        code: `# store, with a TTL and the model that produced it
cache.cset("Explain vector caches", answer, ttl=3600)

# read, gated on confidence, fall back to the model if unsure
hit = cache.cget("what is a semantic cache?", with_confidence=True)
if hit and hit.confidence >= 0.88:
    return hit.value
return call_your_model(prompt)

cache.close()`,
      },
      {
        kind: "plain",
        text: "Ask the cache first; only pay the model on a real miss. The second time anyone asks the same thing, even worded differently, it's free and instant.",
      },
      {
        kind: "p",
        text: "Install is `pip install crowkis` (or `pip install ./sdk/python` from the repo). The client is sync or async, supports per-call `tenant` and `model` overrides for isolation and accounting, and exposes the streaming helpers so a cached answer can be typed out like a live one.",
      },
    ],
  },
  {
    slug: "cached-openai-node-sdk",
    title: "A drop-in CachedOpenAI for Node, in one wrapper",
    date: "2026-06-19",
    readMinutes: 5,
    tag: TAG,
    summary:
      "The Node SDK ships a typed client and a CachedOpenAI wrapper, keep your OpenAI calls exactly as they are, and a semantic cache slips in underneath.",
    blocks: [
      {
        kind: "p",
        text: "The lowest-friction integration in TypeScript is the one that doesn't change your call sites. The Node SDK's CachedOpenAI wrapper presents the same surface as the OpenAI client, and quietly checks Crowkis before spending a token.",
      },
      {
        kind: "code",
        title: "wrap once, cache everywhere",
        code: `import { CrowkisClient, CachedOpenAI } from "crowkis";
import OpenAI from "openai";

const cache = new CrowkisClient({ host: "127.0.0.1", port: 6379, tenant: "web" });
const openai = new CachedOpenAI(new OpenAI(), cache);

// identical to the OpenAI SDK, but paraphrases hit the cache
const res = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: "What's your refund policy?" }],
});
console.log(res.choices[0].message.content, res.cached); // res.cached: boolean`,
      },
      {
        kind: "p",
        text: "Every response carries a `cached` flag so you can measure your hit rate from the application side, not just the dashboard. The wrapper handles the embedding, the semantic lookup, and the write-back on a miss, your code keeps thinking it's just calling OpenAI.",
      },
      {
        kind: "code",
        title: "or the raw client, with retry/backoff",
        code: `const hit = await cache.cget("when do refunds arrive?", { withConfidence: true });
if (hit && hit.confidence >= 0.88) return hit.value;

const answer = await callModel(prompt);
await cache.cset("when do refunds arrive?", answer, { ttl: 3600 });
return answer;`,
      },
      {
        kind: "plain",
        text: "Keep your OpenAI code exactly as it is. The wrapper checks the cache first, so repeated questions stop hitting the API, and every response tells you whether it was cached.",
      },
    ],
  },
  {
    slug: "agent-memory-from-python",
    title: "Giving an agent memory from Python: CMEM in practice",
    date: "2026-06-17",
    readMinutes: 5,
    tag: TAG,
    summary:
      "The memory commands from application code, store facts, recall them semantically, and watch consolidation retire the stale ones. A worked example in Python.",
    blocks: [
      {
        kind: "p",
        text: "Agent memory is a few commands, and from Python it's a few method calls. The pattern: extract durable facts from a conversation, store them scoped to (agent, user), and recall them by meaning on the next turn, letting consolidation keep the picture current.",
      },
      {
        kind: "code",
        title: "store, consolidate, recall",
        code: `from crowkis import CrowkisClient

mem = CrowkisClient(host="127.0.0.1", port=6379)
AGENT, USER = "support", "u_42"

# learn three things across a conversation
mem.cmemset(AGENT, USER, "prefers email over phone")
mem.cmemset(AGENT, USER, "moved to Berlin in March")
mem.cmemset(AGENT, USER, "no longer in Munich")   # retires the old location

# recall by meaning, top-3, recency-blended
facts = mem.cmemget(AGENT, USER, "where does this customer live?", k=3)
print(facts[0])   # -> "moved to Berlin in March"`,
      },
      {
        kind: "p",
        text: "Because memory consolidates, you don't have to hunt down and delete the stale fact, storing the contradicting one retires it automatically. The recall is ranked by relevance blended with recency, so the current answer surfaces first.",
      },
      {
        kind: "code",
        title: "extract facts, and honour erasure",
        code: `# pull durable facts straight out of a transcript (deterministic, no model call)
mem.cmemextract(AGENT, USER, transcript_text)

# bi-temporal: what did we believe on April 1st?
mem.cmemasof(AGENT, USER, "address", at="2026-04-01")

# right to be forgotten
mem.cmemforget(AGENT, USER, "payment details")`,
      },
      {
        kind: "plain",
        text: "Tell the agent facts, ask by meaning, and let it retire what changed. Storing 'moved to Berlin' quietly forgets 'lives in Munich', no manual cleanup.",
      },
    ],
  },
  {
    slug: "guardrails-in-your-request-path",
    title: "Guardrails in your request path: CGUARD and COUTCHECK in code",
    date: "2026-06-14",
    readMinutes: 5,
    tag: TAG,
    summary:
      "Two commands wrap your model call in an input and an output gate, prompt-injection scanning before, PII and toxicity scanning after. No second model, no egress.",
    blocks: [
      {
        kind: "p",
        text: "Safety is two checks bracketing your model call: scan the input for injection before you trust it, and scan the output for leaks before you ship it. CGUARD and COUTCHECK are those checks, as commands, running locally with no second model.",
      },
      {
        kind: "code",
        title: "gate the input, gate the output",
        code: `from crowkis import CrowkisClient
cache = CrowkisClient(host="127.0.0.1", port=6379)

def answer(user_prompt: str) -> str:
    # --- input gate: catch jailbreaks, even leetspeak / zero-width tricks ---
    verdict = cache.cguard(user_prompt)
    if verdict.blocked:
        return "I can't help with that request."   # verdict.category tells you why

    raw = call_your_model(user_prompt)

    # --- output gate: PII leak, toxicity, optional JSON validity ---
    out = cache.coutcheck(raw)
    if out.pii or out.toxic:
        raw = redact(raw, out.pii)                  # or regenerate / refuse
    return raw`,
      },
      {
        kind: "p",
        text: "The verdicts are structured for action: CGUARD returns a verdict, a category, and the matched span; COUTCHECK returns a pass/fail with the PII entities and toxic spans it found. You decide the policy, block, redact, or regenerate, per failure mode.",
      },
      {
        kind: "plain",
        text: "Check what comes in before you trust it, and what goes out before you send it. Both checks run on your machine, no moderation API, no data leaving.",
      },
    ],
  },
  {
    slug: "rag-with-cdoc-in-twenty-lines",
    title: "Self-hosted RAG in twenty lines with CDOC",
    date: "2026-06-10",
    readMinutes: 5,
    tag: TAG,
    summary:
      "Add documents, auto-chunk them, search with metadata filters and reranking, a working retrieval pipeline without a separate vector database.",
    blocks: [
      {
        kind: "p",
        text: "If your corpus fits a cache, you don't need a separate vector database to do retrieval. CDOC gives you add, chunk, filter, and rerank inside Crowkis, sharing the bundled embedder, so a RAG pipeline is twenty lines, not a second service.",
      },
      {
        kind: "code",
        title: "ingest with auto-chunking + metadata",
        code: `from crowkis import CrowkisClient
db = CrowkisClient(host="127.0.0.1", port=6379, tenant="docs")

# auto-chunk a long doc into overlapping passages, attach metadata
db.cdoc_add(
    id="policy-2026",
    text=long_policy_text,
    chunk=512, overlap=64,
    meta={"team": "legal", "year": "2026"},
)`,
      },
      {
        kind: "code",
        title: "search with a filter + rerank",
        code: `# filtered ANN search, reranked by the bundled cross-encoder
results = db.cdoc_search(
    "how long is the refund window?",
    k=5,
    filter={"team": "legal"},
    rerank=True,
)
for r in results:
    print(r.score, r.id, r.text[:80])   # [id, text, score] triples`,
      },
      {
        kind: "p",
        text: "Field-level filters narrow the search before it runs, and the optional rerank pass, the same cross-encoder that lifts the memory benchmarks, sharpens the ordering. Your documents are embedded and searched locally, which matters when the documents are contracts or tickets you can't ship to a hosted API.",
      },
      {
        kind: "plain",
        text: "Add documents, search them by meaning with filters, get reranked results, all inside Crowkis, with nothing leaving your machine and no separate vector DB to run.",
      },
    ],
  },
  {
    slug: "prompt-ab-testing-with-cprompt",
    title: "A/B testing prompts in production with CPROMPT",
    date: "2026-06-06",
    readMinutes: 5,
    tag: TAG,
    summary:
      "Version a prompt, split traffic across versions with sticky per-user bucketing, render variables, and roll back, without a deploy or a feature-flag service.",
    blocks: [
      {
        kind: "p",
        text: "Prompts are production logic, and CPROMPT lets you treat them like it: versioned, A/B-split, and rollback-able. The experiment is sticky per user, so a given subject always sees the same variant instead of flickering per request.",
      },
      {
        kind: "code",
        title: "version, split, render",
        code: `from crowkis import CrowkisClient
c = CrowkisClient(host="127.0.0.1", port=6379)

# two versions of a support prompt
c.cprompt_set("support_reply", "You are terse. Answer: {{q}}")        # v1
c.cprompt_set("support_reply", "You are warm and concise. Answer: {{q}}")  # v2

# 50/50 weighted split across the two versions
c.cprompt_abset("support_reply", [["1", 50], ["2", 50]])

# sticky per user, same subject, same variant, every time
version = c.cprompt_ab("support_reply", subject=user_id)
prompt = c.cprompt_render("support_reply", version=version, vars={"q": question})`,
      },
      {
        kind: "p",
        text: "Every write creates a new version, so the prompt you shipped last week is still retrievable. If v2 underperforms, `cprompt_rollback` reverts it; the whole thing survives restarts, so a reschedule doesn't reset your experiment.",
      },
      {
        kind: "plain",
        text: "Store prompts like versioned code, split traffic between versions per user, and roll back a bad one, without a deploy or a separate feature-flag tool.",
      },
    ],
  },
  {
    slug: "let-claude-code-use-the-cache-mcp",
    title: "Let Claude Code use the cache: Crowkis over MCP",
    date: "2026-06-02",
    readMinutes: 4,
    tag: TAG,
    summary:
      "One config block turns Crowkis into a tool an AI assistant can hold, check the cache, store the answer, over MCP, with the same trust pipeline as every other write.",
    blocks: [
      {
        kind: "p",
        text: "The Model Context Protocol flips the integration: instead of your code calling the cache around the model, the assistant itself holds cache operations as tools. `crowkis mcp` speaks JSON-RPC over stdio and registers lookup, store, and stats surfaces any MCP-capable assistant can invoke mid-conversation.",
      },
      {
        kind: "code",
        title: "register it with Claude Code",
        code: `// .mcp.json  (or your client's MCP config)
{
  "mcpServers": {
    "crowkis": {
      "command": "crowkis",
      "args": ["mcp", "--host", "127.0.0.1", "--port", "6379"]
    }
  }
}`,
      },
      {
        kind: "p",
        text: "The mcp subcommand boots silently, the startup banner every other verb prints would corrupt a JSON-RPC stream, so it's the one quiet door. A hit returns the answer with its confidence; a miss returns a clean signal the assistant can act on rather than hallucinate around.",
      },
      {
        kind: "p",
        text: "Crucially, MCP writes get no trust shortcut: an assistant's store request walks the same five-stage anti-poisoning pipeline as RESP and SDK writes, tracked in the ledger as its own source. An agent that stores garbage earns a higher bar automatically. The result is agents that remember as a behaviour, Claude Code checks before spending tokens, banks what it computes, and the whole team's assistants share the dividend.",
      },
      {
        kind: "quote",
        text: "One config block, and the cache your services already share becomes a tool your agents can hold too.",
      },
    ],
  },
];
