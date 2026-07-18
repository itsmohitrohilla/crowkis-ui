import { RoostPost } from "@/lib/content/roost";
import {
  ART_MEANING,
  ART_PAYTWICE,
  ART_GRAPH,
  ART_LANES,
  ART_GATE,
  ART_DROPIN,
} from "./art";

/**
 * "Proof" series, batch two. Humanized, SEO-aware, healthy competitor positioning.
 * Nothing internal is revealed; every claim tracks something we measured or shipped.
 */
export const proofPosts2: RoostPost[] = [
  {
    slug: "the-3am-bill-runaway-agent-loops",
    title: "The 3am bill: how a runaway agent loop quietly torches your LLM budget",
    date: "2026-07-09",
    readMinutes: 5,
    tag: "economics",
    summary:
      "Agents don't fail loudly. They loop, politely, expensively, and you find out on the invoice. A budget wall that's enforced before the spend, not discovered after it.",
    blocks: [
      { kind: "p", text: "The scariest LLM bills don't come from traffic spikes. They come from a single agent that got stuck in a loop at 2am, asking the model the same near-identical question a few thousand times, each call a few cents, all night, until someone wakes up to a five-figure surprise. Nobody meant to spend it. There was just no wall to stop it." },
      { kind: "plain", text: "Crowkis lets you set a spend budget and rate limits per API key or tenant. When a workload crosses the line, the calls stop and an alert fires, before the invoice, not on it." },
      { kind: "diagram", title: "the budget wall, enforced locally", chart: `flowchart LR
  LOOP["runaway agent loop"] --> KEY["virtual key<br/>budget + rate limits"]
  KEY -- "under budget" --> CK["crowkis → provider"]
  KEY -- "wall hit" --> STOP["blocked · alert fired"]
  style STOP fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`, caption: "The limit is enforced at the cache, before a single extra token is bought." },
      { kind: "p", text: "And here's the compounding part: most of those looped questions are near-duplicates, which means the semantic cache absorbs the bulk of them for free long before the budget wall is even in play. The cache flattens the cost; the wall caps the worst case. Together they turn a category of terrifying bills into a non-event." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "You shouldn't learn your agent misbehaved from your credit card statement. Put the wall where the spend happens, at the cache, and sleep through the loop." },
    ],
  },
  {
    slug: "prompt-caching-vs-semantic-caching",
    title: "Prompt caching vs semantic caching: what the provider feature doesn't cover",
    date: "2026-07-08",
    readMinutes: 6,
    tag: "engineering",
    summary:
      "OpenAI and Anthropic added prompt caching, and it's genuinely useful. But it only discounts the prefix you repeat verbatim. The moment the wording changes, you pay full price again.",
    blocks: [
      { kind: "p", text: "Provider-side prompt caching is a real win and you should use it, repeating a long system prompt gets cheaper. But read the fine print: it discounts the exact prefix you send byte-for-byte. Change a word in the user's question and the discount evaporates, because the provider is matching tokens, not meaning." },
      { kind: "plain", text: "Prompt caching = 'you sent me these exact tokens before, here's a discount on them.' Semantic caching = 'someone already asked this in different words, here's the whole answer, free.'" },
      { kind: "art", title: "different words, same intent", svg: ART_MEANING, caption: "Prompt caching can't see that these three are the same question. A semantic cache can." },
      { kind: "p", text: "The two stack, and they solve different halves of the bill. Prompt caching trims the cost of the context you resend. Semantic caching removes the call entirely when the question, however it's phrased, has already been answered. One discounts the input; the other deletes the request. For repetitive workloads, deleting the request is where the real money is." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Turn on your provider's prompt caching. Then put a semantic cache in front of it, so the rephrased questions never reach the provider at all. Belt and suspenders, and the suspenders save more." },
    ],
  },
  {
    slug: "cut-your-openai-bill-without-changing-prompts",
    title: "How to cut your OpenAI bill by 60% without touching your prompts",
    date: "2026-07-07",
    readMinutes: 5,
    tag: "economics",
    summary:
      "No prompt engineering, no model downgrade, no accuracy trade. Just stop sending the model questions it has already answered in slightly different words.",
    blocks: [
      { kind: "p", text: "Most cost-cutting advice for LLM apps asks you to give something up, a smaller model, terser prompts, fewer tokens, worse answers. There's a fatter, lazier win hiding in plain sight that costs you nothing: a huge share of your traffic is the same questions, reworded. You're paying full freight to answer them again and again." },
      { kind: "art", title: "the repeat bill", svg: ART_PAYTWICE, caption: "The same answer, billed four times, until the cache understands the wording is irrelevant." },
      { kind: "plain", text: "Point your existing Redis client at Crowkis, and reads on repeated-or-rephrased questions come back instantly, for free. Your prompts don't change. Your model doesn't change. The bill does." },
      { kind: "p", text: "On a workload that's roughly two-thirds repetitive, support bots, FAQs, agents re-asking for the same schema, that's a 60-70% cut, and it arrives without a single change to how you write prompts. It's the rare optimization that's also less work: you delete calls instead of engineering them." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "The cheapest token is the one you never send. Stop paying twice, keep your prompts exactly as they are, and let the cache quietly eat the duplicates." },
    ],
  },
  {
    slug: "gptcache-proved-it-we-rebuilt-the-engine",
    title: "GPTCache proved the idea. We went and rebuilt the engine underneath.",
    date: "2026-07-06",
    readMinutes: 6,
    tag: "engineering",
    summary:
      "Credit where it's due: the first semantic caches showed the world this works. Then we asked what a production-grade version would look like if you owned every layer.",
    blocks: [
      { kind: "p", text: "The early semantic-cache projects deserve real credit, they proved that matching questions by meaning could slash LLM costs, and they got a lot of people to try the idea. We started there too. But 'proof of concept' and 'sits in the hot path of every call in production' are different engineering problems, and the gap is where we spent our time." },
      { kind: "art", title: "the engine we own end to end", svg: ART_GRAPH, caption: "A vector index we wrote ourselves, so the reuse checks live right next to the data." },
      { kind: "plain", text: "Owning the whole stack, the storage engine, the vector index, the embedder, the reranker, means the read path doesn't round-trip five external services to decide whether one answer is reusable." },
      { kind: "p", text: "Concretely: a bolted-together cache asks a vector library for neighbours, then a separate store for metadata, then maybe an API for a rerank, each a serialization boundary, each a latency tax. Crowkis does it in one process, in Rust, with the model bundled in. That's how you get sub-millisecond search that also checks trust, freshness, and a second opinion without feeling it." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "The idea was proven. What was missing was an engine built like infrastructure, owned end to end, fast under load, safe enough to trust. That's the part we built." },
    ],
  },
  {
    slug: "langchain-cache-is-exact-match-heres-the-upgrade",
    title: "LangChain's cache is exact-match. Here's the two-line upgrade.",
    date: "2026-07-05",
    readMinutes: 4,
    tag: "features",
    summary:
      "LangChain's built-in caches are great until a user rephrases the question. Swap in a semantic cache and the paraphrases start hitting, without changing a line of your chains.",
    blocks: [
      { kind: "p", text: "LangChain ships caching out of the box, and it works, as long as the prompt matches the last one exactly. In the real world it rarely does. Users reword, agents template, and the exact-match cache quietly misses almost everything, sending each variation back to the model at full cost." },
      { kind: "plain", text: "Crowkis plugs into LangChain's own cache interface. You set it once, and every model call in your app, and inside any LangGraph you run, starts matching on meaning." },
      { kind: "code", title: "python", code: `from langchain_core.globals import set_llm_cache
from crowkis.integrations.langchain import CrowkisCache

set_llm_cache(CrowkisCache(tenant="my-app", ttl=3600))
# that's it, rephrased prompts now hit the cache` },
      { kind: "p", text: "Nothing else changes. Your chains, your prompts, your models all stay exactly as they are. The only difference is that 'how do I cancel?' and 'where's the cancel button?' now share one answer instead of two bills. It's the smallest possible diff for the biggest slice of your caching wins." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Keep LangChain. Swap the cache. Two lines, and the paraphrases you were paying for turn into cache hits." },
    ],
  },
  {
    slug: "restart-safe-by-design",
    title: "Restart-safe by design: a cache that survives a crash without losing a thing",
    date: "2026-07-04",
    readMinutes: 5,
    tag: "engineering",
    summary:
      "A cache that forgets everything on restart isn't much of a memory. Crowkis writes durably first, so a crash, a deploy, or a reboot never costs you a single learned answer.",
    blocks: [
      { kind: "p", text: "There's a quiet assumption baked into a lot of caches: it's fine to lose everything on restart, because it's 'just a cache.' For an LLM cache that assumption is expensive. Every lost entry is an answer you'll pay the model to regenerate, and every deploy becomes a cold-start tax on your bill and your latency." },
      { kind: "plain", text: "Crowkis writes to a crash-safe log before it acknowledges a write, then keeps that data in sorted files on disk. Pull the plug and it replays the log on the way back up, nothing learned is lost." },
      { kind: "diagram", title: "the durable write path", chart: `flowchart TD
  W["CSET"] --> WAL["write-ahead log<br/>append · CRC per record"]
  WAL --> MT["in-memory table"]
  MT -- "flush" --> SST["sorted files on disk"]
  W --> HNSW["vector index persists too"]
  style WAL fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`, caption: "Log first, then memory, then disk, a reboot replays the log and picks up where it left off." },
      { kind: "p", text: "This is what lets Crowkis double as durable agent memory, not just a volatile cache. Years of an agent's learned context can live on disk and come back warm after a restart, because durability was the starting assumption, not a feature bolted on later." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "A restart should be a non-event, not a bill. Write durably first, and your cache, and your agents' memory, outlives every crash and every deploy." },
    ],
  },
  {
    slug: "five-gates-every-write-passes",
    title: "The five gates every write passes before it can poison your cache",
    date: "2026-07-03",
    readMinutes: 6,
    tag: "security",
    summary:
      "In any shared cache, one crafted answer could get served to thousands. So every write runs a five-stage gauntlet before it's ever eligible to be reused.",
    blocks: [
      { kind: "p", text: "Here's an attack most people never consider. In a multi-tenant cache, if an attacker can get a poisoned answer stored, it doesn't hit one victim, it gets served to everyone who asks a similar question. The blast radius is the whole user base. A cache that reuses answers has to treat every write as a potential attack." },
      { kind: "plain", text: "Before any answer becomes reusable, Crowkis scores it through five independent checks. If the composite score is too low, the write is refused and logged, it never gets a chance to be served." },
      { kind: "diagram", title: "the write-trust pipeline", chart: `flowchart TD
  W["candidate write"] --> S1["coherence"]
  S1 --> S2["content policy"]
  S2 --> S3["source trust"]
  S3 --> S4["tenant isolation"]
  S4 --> S5["neighbourhood check"]
  S5 --> G{"trusted enough?"}
  G -- yes --> OK["eligible to serve"]
  G -- no --> NO["refused + ledgered"]
  style OK fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style NO fill:#f3eee5`, caption: "Coherence, content, source trust, isolation, and a neighbourhood outlier check, every write earns its place." },
      { kind: "p", text: "The point isn't any single gate; it's that they're independent. An attacker might fool one, but slipping a poisoned, incoherent, low-trust, out-of-distribution answer past all five at once is a genuinely hard problem, and every failed attempt leaves a trail in the ledger." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "A shared cache is a shared attack surface. Score every write like it might be hostile, and cache poisoning stops being a headline waiting to happen." },
    ],
  },
  {
    slug: "freshness-hamlet-vs-stock-price",
    title: "Why 'who wrote Hamlet' and 'today's stock price' can't share a TTL",
    date: "2026-07-02",
    readMinutes: 5,
    tag: "features",
    summary:
      "A single time-to-live for every cached answer is a bug in disguise. Some facts are true for a decade; some are stale in minutes. Freshness has to know the difference.",
    blocks: [
      { kind: "p", text: "Pick one TTL for your whole cache and you've guaranteed you're wrong for most of it. Set it long and you'll serve last week's price as today's. Set it short and you'll pay the model to re-derive that Shakespeare wrote Hamlet, a fact that hasn't changed since 1600. One number can't be right for both." },
      { kind: "plain", text: "Crowkis picks a freshness window based on what kind of question it is. Timeless facts get long lives; fast-moving ones expire quickly; and a source can push an update that invalidates entries the instant the underlying data changes." },
      { kind: "bars", title: "sensible lifetimes by question type", unit: "", series: [
        { label: "settled facts (history, definitions)", value: 100, sub: "up to a year", accent: true },
        { label: "docs & policies", value: 40, sub: "days" },
        { label: "software versions", value: 12, sub: "hours" },
        { label: "prices & real-time", value: 2, sub: "minutes" },
      ], caption: "Relative lifetimes, the cache matches the answer's shelf life to the question." },
      { kind: "p", text: "And when freshness can't be guessed, it can be told: a data source can fire a signal that purges every entry tied to it, so a cache hit is never stale by more than the moment your source changed. Freshness stops being a gamble and becomes a rule." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "The right TTL is not a number, it's a function of the question. Match the lifetime to the fact, and you keep the savings without ever serving something out of date." },
    ],
  },
  {
    slug: "a-cache-hit-is-not-a-correct-answer",
    title: "A cache hit is not the same as a correct answer",
    date: "2026-07-01",
    readMinutes: 5,
    tag: "features",
    summary:
      "Most caches treat every hit as equally trustworthy, a binary yes. But LLM answers are probabilistic and time-sensitive. Crowkis scores its confidence before it serves.",
    blocks: [
      { kind: "p", text: "Traditional caches have exactly two states: hit or miss. That's fine when you're caching a database row that's simply true. It's dangerous when you're caching a language model's answer, which was probabilistic when it was generated and may have quietly gone stale since. A confident 'hit' on a wrong answer is worse than a miss." },
      { kind: "plain", text: "Before serving, Crowkis computes a confidence score from several signals, how close the match is, how fresh it is, how trusted its source was, how well it's held up historically. Below your threshold, it declines to serve and asks the model instead." },
      { kind: "diagram", title: "the read path, every gate can say no", chart: `flowchart TD
  Q["query"] --> M["meaning match"]
  M --> N["nearest neighbours"]
  N --> C["confidence score"]
  C -- "high enough" --> A["serve · ~ms"]
  C -- "too low" --> MISS["→ ask the model"]
  style A fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style MISS fill:#f3eee5`, caption: "A borderline match doesn't get served on faith, it has to clear a confidence bar." },
      { kind: "p", text: "This is the difference between a cache that saves you money and a cache you can actually leave on in production. The confidence gate means the failure mode is a safe miss, a slightly slower, correct answer, not a fast, confident, wrong one. In enterprise software, that asymmetry is everything." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Serve the hits you trust; quietly miss the ones you don't. A cache that knows the difference is one you can turn on and forget about." },
    ],
  },
  {
    slug: "lru-throws-away-your-most-expensive-knowledge",
    title: "LRU throws away your most expensive knowledge",
    date: "2026-06-30",
    readMinutes: 5,
    tag: "engineering",
    summary:
      "Least-recently-used eviction is semantically blind. It happily discards the rare, costly answer you'll pay dearly to regenerate, and keeps the cheap trivia everyone asks. There's a smarter way.",
    blocks: [
      { kind: "p", text: "Every cache eventually fills up and has to throw something away. The default rule, evict whatever was used least recently, sounds reasonable until you notice what it optimizes for. It keeps the cheap, popular questions and discards the rare, expensive ones. But the expensive answer is exactly the one you don't want to pay the model to regenerate." },
      { kind: "plain", text: "Crowkis decides what to evict using more than recency: how often it's used, how unique the knowledge is, and how much it cost to produce in the first place. Rare, costly answers are the last to go, and some can be pinned so they never leave." },
      { kind: "bars", title: "what a smart eviction score weighs", unit: "", series: [
        { label: "how costly the answer was to generate", value: 90, accent: true },
        { label: "how unique the knowledge is", value: 80, accent: true },
        { label: "how often it's asked", value: 55 },
        { label: "how recently it was used", value: 40 },
      ], caption: "Recency is one input, not the whole rule, cost and uniqueness matter more." },
      { kind: "p", text: "The effect is a cache that gets smarter as it fills, not dumber. It protects the long-tail domain knowledge that's painful to recompute and lets the cheap, easily-regenerated trivia churn. You keep the answers that would hurt to lose." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Eviction is a value judgment, so make it about value. Keep the expensive, rare knowledge; let the cheap stuff go. Blind LRU has it exactly backwards." },
    ],
  },
  {
    slug: "reasoning-reuse-stop-paying-for-the-same-chain",
    title: "Reasoning reuse: stop paying for the same chain of thought twice",
    date: "2026-06-29",
    readMinutes: 6,
    tag: "features",
    summary:
      "Chain-of-thought costs several times more tokens than the answer it produces, and it's usually thrown away. For structurally similar problems, most of that reasoning can be reused.",
    blocks: [
      { kind: "p", text: "Reasoning is the most expensive thing a model does. A chain of thought can burn several times more tokens than the final answer, and then it's discarded. The next structurally identical problem starts from a blank page and pays the whole cost again, even though the shape of the solution is the same, only the numbers changed." },
      { kind: "plain", text: "Crowkis can cache the structure of a reasoning chain, not just the answer. When a new problem matches that structure, it reuses the steps and only asks the model for the final synthesis, a fraction of the original cost." },
      { kind: "diagram", title: "reasoning, cached by shape", chart: `flowchart LR
  P1["problem A<br/>full reasoning · $$$"] --> G["cached step-graph<br/>values abstracted out"]
  P2["problem B<br/>same shape"] --> G
  G --> S["substitute values<br/>ask model only to synthesize · $"]
  style S fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`, caption: "Reuse the shape of the reasoning; pay only for the last mile." },
      { kind: "p", text: "It's the difference between re-deriving a method from scratch and applying a method you already worked out. For workloads full of structurally repetitive problems, the same kind of calculation, lookup, or multi-step task with different inputs, reusing the reasoning is where the deepest savings hide, well beyond simple answer caching." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "You already paid to figure out how to solve this shape of problem. Reuse that work, and let the model spend tokens only on what's genuinely new." },
    ],
  },
  {
    slug: "one-similarity-cutoff-is-always-wrong",
    title: "One similarity cutoff is always wrong",
    date: "2026-06-28",
    readMinutes: 5,
    tag: "features",
    summary:
      "'What's 2+2?' needs a near-exact match to reuse safely. 'Give me creative ideas for X' can tolerate a loose one. A single global threshold guarantees you're too strict somewhere and too loose somewhere else.",
    blocks: [
      { kind: "p", text: "Every semantic cache has to draw a line: how similar is similar enough to reuse an answer? The tempting move is to pick one number and apply it everywhere. It's also a guaranteed mistake. A factual lookup needs an almost-exact match before you dare reuse it. A brainstorming prompt can share an answer with a much looser cousin. One line can't serve both." },
      { kind: "plain", text: "Crowkis sets the reuse threshold by the kind of question. Factual questions demand a tight match; open-ended ones allow a looser one, and the thresholds adjust over time from real feedback." },
      { kind: "bars", title: "how strict a match should be, by intent", unit: "", series: [
        { label: "factual lookup ('what's the refund window?')", value: 96, sub: "very strict", accent: true },
        { label: "comparison / how-to", value: 86 },
        { label: "recommendation", value: 80 },
        { label: "creative / open-ended", value: 72, sub: "looser" },
      ], caption: "The bar for reuse moves with the question, strict where correctness is binary, relaxed where it isn't." },
      { kind: "p", text: "And it isn't static. When users correct an answer or regenerate one, that's a signal the threshold for that kind of question was too loose, and it tightens. The cache tunes its own caution per category instead of forcing you to pick one compromise that's wrong everywhere." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Similarity isn't one bar; it's many. Match the strictness to the stakes of the question, and you stop trading correctness for hit rate, or hit rate for correctness." },
    ],
  },
  {
    slug: "tenant-isolation-you-test-not-claim",
    title: "Tenant isolation is a feature you test, not a checkbox you claim",
    date: "2026-06-27",
    readMinutes: 5,
    tag: "security",
    summary:
      "Every multi-tenant product says its tenants are isolated. The ones you can trust are the ones that try to break it on purpose. Here's how we prove no tenant can read another's data.",
    blocks: [
      { kind: "p", text: "Ask any multi-tenant vendor if tenants are isolated and the answer is always yes. It has to be, it's table stakes. But 'isolated' is a claim until someone deliberately tries to cross the boundary and fails. In a shared semantic cache, where answers are reused across similar questions, the temptation for data to leak between tenants is real and the stakes are a breach." },
      { kind: "art", title: "memory that never crosses lanes", svg: ART_LANES, caption: "Every read is scoped to its tenant and user, the walls are enforced, not assumed." },
      { kind: "plain", text: "In Crowkis, every stored answer and every recalled memory is tagged to its tenant, and the read path enforces the tag. A query from tenant B cannot match tenant A's data, even when the questions are identical." },
      { kind: "p", text: "We test this the way an attacker would think about it: store a fact under one tenant, then ask for it as another. The correct result is nothing, not a filtered-after-the-fact result, but a boundary the query can't cross in the first place. Isolation that's only enforced by remembering to filter is isolation waiting to be forgotten. It has to be structural." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Don't trust an isolation claim; trust an isolation test. Ours says a tenant asking for another tenant's data gets exactly what it should, nothing." },
    ],
  },
  {
    slug: "one-container-zero-dependencies",
    title: "One container, zero dependencies: what's deliberately absent from our image",
    date: "2026-06-26",
    readMinutes: 5,
    tag: "engineering",
    summary:
      "The most secure dependency is the one that isn't there. Crowkis ships as a single stripped binary with the model baked in, no Python, no package manager, nothing to poison at runtime.",
    blocks: [
      { kind: "p", text: "Every dependency in your runtime is a door someone else can walk through. The supply-chain attacks that make headlines don't break your code, they slip something into a package your code trusts. So when we packaged Crowkis, we asked a different question than 'what should we add?' We asked 'what can we leave out?'" },
      { kind: "diagram", title: "what's in the runtime image", chart: `flowchart LR
  subgraph IMG["crowkis/crowkis:latest"]
    B["one stripped Rust binary"]
    M["the embedder, baked in"]
    U["non-root user"]
  end
  subgraph NOT["deliberately absent"]
    N1["no Python runtime"]
    N2["no package manager"]
    N3["no dependency tree"]
  end
  IMG ~~~ NOT
  style IMG fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`, caption: "One file to review. No supply chain to compromise." },
      { kind: "plain", text: "The whole product is a single compiled binary with the embedding model bundled inside it. There's no interpreter to exploit, no package index to typo-squat, nothing to download when it starts." },
      { kind: "p", text: "For a security team, this changes the review from auditing a dependency tree of thousands of packages to reviewing one artifact. For an air-gapped or regulated deployment, it means the thing runs with no network at all, the model is already inside. The absence is the feature." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "You can't be compromised through a dependency you don't ship. One binary, one model, no runtime supply chain, the smallest attack surface we could build." },
    ],
  },
  {
    slug: "the-agentic-era-needs-a-memory-layer",
    title: "The agentic era needs a memory layer. Here's what it looks like.",
    date: "2026-06-25",
    readMinutes: 6,
    tag: "features",
    summary:
      "We gave agents tools, planning, and the ability to act. We forgot to give them a place to remember. That gap is why your agents feel brilliant and amnesiac at the same time.",
    blocks: [
      { kind: "p", text: "The last two years gave agents everything except a memory. They can call tools, plan, reason, and act, and then a session ends and it's all gone. The next run reintroduces itself, re-asks what it already knew, and re-pays the model to reconstruct context it had an hour ago. We built agents that are simultaneously capable and amnesiac." },
      { kind: "plain", text: "A memory layer is a place agents write what they learn and read it back by meaning, durable across sessions, scoped per user, fast enough to consult on every step." },
      { kind: "art", title: "memory, per agent, per tenant", svg: ART_LANES, caption: "Durable, semantic, isolated, the layer agents were missing." },
      { kind: "p", text: "The requirements are specific and unglamorous, which is probably why it got skipped. It has to be durable, so a restart doesn't wipe a year of context. It has to be semantic, so 'how does Alice like to be contacted?' finds the fact you stored as 'Alice prefers email.' It has to scale to millions of memories without slowing down. And it has to be isolated, so one user's agent never reads another's. That's the layer, and it's the same engine that powers the cache." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Tools made agents capable. Memory makes them coherent. The agentic era doesn't need a smarter model as much as it needs somewhere to remember, durable, semantic, and strictly its own." },
    ],
  },
  {
    slug: "five-agents-one-question-one-answer",
    title: "Five agents asking one question should cost one answer",
    date: "2026-06-24",
    readMinutes: 4,
    tag: "economics",
    summary:
      "Multi-agent systems fan out, and they ask overlapping questions constantly. Without a shared cache, that overlap is pure waste, the same answer, bought once per agent.",
    blocks: [
      { kind: "p", text: "The moment you go multi-agent, a new cost appears that single-agent apps never see: overlap. Five agents working a problem will independently ask for the same schema, the same policy, the same definition, phrased a little differently each time. Without something in the middle, that's five model calls for one piece of knowledge." },
      { kind: "diagram", title: "agent fan-out, cached", chart: `flowchart TD
  A1["agent 1: 'what's the schema?'"] --> CK["crowkis"]
  A2["agent 2: 'schema for orders?'"] --> CK
  A3["agent 3: 'show orders schema'"] --> CK
  CK -- "1 model call" --> LLM["provider"]
  CK -- "2 semantic hits · ~ms" --> DONE["answers"]
  style CK fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`, caption: "The first agent pays; the rest reuse the answer for free." },
      { kind: "plain", text: "Put Crowkis between your agents and the model, and the first agent's answer is instantly available to the rest, by meaning, so the different phrasings still match." },
      { kind: "p", text: "As you add agents, this only gets better. More agents means more overlap, and more overlap means a higher cache hit rate. The architecture that scales your costs the fastest, fan-out, is exactly the one a shared semantic cache tames the best." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "In a multi-agent system, shared knowledge should be a shared cost. One answer, reused across the swarm, instead of one bill per agent." },
    ],
  },
  {
    slug: "what-is-an-embedding-really",
    title: "What is an embedding, really? A plain-English guide",
    date: "2026-06-23",
    readMinutes: 5,
    tag: "features",
    summary:
      "Embeddings sound like math you need a PhD for. The core idea is simpler and more useful than that, and it's the reason a cache can tell that two different sentences mean the same thing.",
    blocks: [
      { kind: "p", text: "If you've heard the word 'embedding' and nodded along without quite knowing what it meant, this is for you. Strip away the jargon and it's a beautifully simple idea: turn a piece of text into a point in space, positioned so that things with similar meanings land near each other. 'Cancel my subscription' and 'stop my plan' end up as neighbours; 'what's the weather' lands far away." },
      { kind: "art", title: "words become points, meaning becomes distance", svg: ART_MEANING, caption: "An embedding places a sentence in space so nearby points mean nearby things." },
      { kind: "plain", text: "That's the whole trick. Once meaning is a location, 'do these mean the same thing?' becomes 'are these points close?', a question a computer can answer instantly, millions of times a second." },
      { kind: "p", text: "This is the quiet engine under semantic search, recommendation, RAG, and semantic caching. When Crowkis decides that a new question matches an answer it already has, it's placing the question in this space and checking who its neighbours are. The model that draws this map, turning text into a point, is the embedding model. Ours is called crowsight, and it runs on your own machine." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "An embedding is meaning with coordinates. Once you can measure the distance between two ideas, a cache can finally tell that 'reset my password' and 'forgot my login' are the same request." },
    ],
  },
  {
    slug: "hnsw-explained-needle-in-a-million-haystacks",
    title: "HNSW explained: finding the needle in a million haystacks",
    date: "2026-06-22",
    readMinutes: 6,
    tag: "engineering",
    summary:
      "Once meaning is a point in space, the hard part is finding the nearest point out of millions, fast. HNSW is the elegant trick that makes it feel instant, here's the intuition.",
    blocks: [
      { kind: "p", text: "Say you've turned a million questions into a million points, and a new question arrives. To reuse an answer, you need its nearest neighbour, the closest existing point. The naive way is to measure the distance to all million and take the smallest. That's correct, and it's far too slow to sit in front of a live request. You need the answer in under a millisecond." },
      { kind: "art", title: "a few hops, not a million comparisons", svg: ART_GRAPH, caption: "Start anywhere, walk toward the query, arrive in a handful of steps." },
      { kind: "plain", text: "HNSW builds a graph where each point is linked to its neighbours, with a few long-range shortcuts layered on top. To search, you start somewhere and keep hopping to whichever neighbour is closer to your query, arriving in a few steps instead of a million comparisons." },
      { kind: "p", text: "The magic is in those layers. The top layer has sparse, long-range links that get you into the right neighbourhood in a couple of jumps; lower layers have dense, local links that home in on the exact nearest point. It's like using highways to reach the right city, then streets to find the address. That structure is why vector search can be both accurate and effectively instant, and why we built our own to keep it that fast under real load." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "HNSW turns 'compare against everything' into 'take a few smart hops.' It's the reason a cache can find the nearest meaning among millions before your model would have even started typing." },
    ],
  },
  {
    slug: "the-hidden-cost-of-rag",
    title: "The hidden cost of RAG nobody puts on the slide",
    date: "2026-06-21",
    readMinutes: 5,
    tag: "economics",
    summary:
      "Retrieval-augmented generation stuffs context into every prompt to make answers better. It also makes every repeated question dramatically more expensive, and repeated questions are most of them.",
    blocks: [
      { kind: "p", text: "RAG earns its popularity, grounding answers in your own documents genuinely helps. But there's a line item nobody puts on the architecture slide: every RAG call is a big call. You're not sending a short question; you're sending the question plus pages of retrieved context, every time. And when users ask the same thing in different words, you resend all that context and pay for it again." },
      { kind: "art", title: "the repeat bill, with extra context", svg: ART_PAYTWICE, caption: "In RAG, each repeated question is an expensive call, the context rides along every time." },
      { kind: "plain", text: "A semantic cache in front of your RAG pipeline serves the whole answer for a repeated-or-rephrased question, so the retrieval and the big context-stuffed prompt never run at all." },
      { kind: "p", text: "The savings are larger than for plain chat, precisely because each avoided call is bigger. You're not just skipping a model call; you're skipping the retrieval, the reranking, and the long prompt that came with it. For a knowledge assistant where the same questions dominate, caching the answers is often the single biggest lever on the bill." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "RAG makes every answer richer and every repeat pricier. Cache the answers by meaning, and the expensive part only runs for questions you've genuinely never seen." },
    ],
  },
  {
    slug: "give-your-coding-agent-a-memory",
    title: "Give your coding agent a memory",
    date: "2026-06-20",
    readMinutes: 5,
    tag: "features",
    summary:
      "Coding agents re-read the same schema, re-derive the same conventions, and re-ask the same architecture questions on every run. A shared memory turns that repeated context into a one-time cost.",
    blocks: [
      { kind: "p", text: "Watch a coding agent work across a big repo and you'll see the same expensive moves on repeat. It re-reads the schema. It re-figures-out your naming conventions. It re-asks what that service does. Each run, from scratch, at full token cost, because it has nowhere to write down what it learned last time." },
      { kind: "art", title: "shared, isolated memory for agents", svg: ART_LANES, caption: "What the agent learned about your codebase, remembered and reused, never leaked across projects." },
      { kind: "plain", text: "Crowkis gives a coding agent a memory and a shared cache: the schema it looked up, the conventions it inferred, the answers it already got, recalled by meaning on the next run, scoped to that project." },
      { kind: "p", text: "The payoff compounds over a session and across sessions. Facts about the codebase get established once and reused; repeated questions across multiple agents or multiple runs collapse into a single model call. And because memory is scoped per project, one repo's context never bleeds into another's, the agent is sharp about your code without confusing it for someone else's." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "A coding agent without memory relearns your codebase every morning. Give it one, and last week's understanding is this week's starting point, for a fraction of the tokens." },
    ],
  },
  {
    slug: "memcached-walked-so-semantic-caches-could-think",
    title: "Memcached walked so semantic caches could think",
    date: "2026-06-19",
    readMinutes: 5,
    tag: "engineering",
    summary:
      "Classic caches taught the industry a durable lesson: never compute the same thing twice. LLMs just changed what 'the same thing' means, from identical bytes to identical meaning.",
    blocks: [
      { kind: "p", text: "Memcached and Redis taught a generation of engineers a reflex: if you computed it once, don't compute it again. That lesson built the fast web. It rested on one quiet assumption, that 'the same request' means the same bytes. For twenty years that assumption was fine, because database queries and rendered pages really are identical or they aren't." },
      { kind: "art", title: "the same clients, a cache that understands", svg: ART_DROPIN, caption: "The wire protocol you know, matching on meaning instead of exact bytes." },
      { kind: "plain", text: "LLMs broke the assumption. Two prompts can be 'the same request' while sharing almost no bytes, because they mean the same thing. So the cache had to learn to match meaning, not text." },
      { kind: "p", text: "That's the whole evolution in one sentence: classic caches matched bytes; a semantic cache matches meaning. Everything else, embeddings, vector search, confidence, freshness, is engineering in service of that one upgrade. We kept the part that worked, including the Redis wire protocol so your clients don't change, and taught the cache to understand the question instead of just recognizing it." },
      { kind: "h2", text: "The bottom line" },
      { kind: "p", text: "Don't compute the same thing twice, the oldest rule in caching, finally extended from identical bytes to identical meaning. That's the whole idea, and it's why the classics walked so this could run." },
    ],
  },
];
