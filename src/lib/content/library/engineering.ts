import { PostSpec } from "./builder";

const TAG = "engineering";

export const engineeringSpecs: PostSpec[] = [
  {
    slug: "why-rust",
    title: "Why Crowkis is Rust all the way down",
    date: "2026-06-09",
    tag: TAG,
    summary:
      "A cache lives in the hot path of every request. The language choice isn't aesthetic, it's the difference between predictable microseconds and mystery pauses.",
    paras: [
      "A cache is the one component that touches every single request, which means its worst-case latency becomes your product's personality. Garbage-collected runtimes carry a structural risk in that position: the collector eventually runs during someone's request, and your beautiful p50 hides a p99.9 that support tickets discover. Rust's ownership model deletes the collector, and with it, the entire genre of pause.",
      "The benefits compound beyond latency. No GC pressure means memory limits are real limits, CROWKIS_MEMORY_LIMIT means what it says, which matters when you're the disciplined tenant inside a container. Fearless concurrency means the actor architecture and lock discipline are compiler-enforced rather than code-review-enforced. And the binary compiles to one static file with zero runtime dependencies.",
      "That last property became a security headline in 2026: no interpreter, no package tree, no supply chain in the runtime image. The language choice and the security posture turn out to be the same decision wearing two hats.",
      "Rust cost us development speed up front, the borrow checker tutors everyone eventually, and repaid it in a category where the product promise is literally 'sub-millisecond, every time.' Some promises you can only make in some languages.",
    ],
    plain:
      "Languages with garbage collectors occasionally stop to clean up, during your user's request. Crowkis's language never stops, so the cache's speed is a promise, not an average.",
    chart: "supply-chain",
  },
  {
    slug: "hnsw-in-process",
    title: "HNSW without the network hop: why the vector index lives inside the engine",
    date: "2026-06-01",
    tag: TAG,
    summary:
      "Most semantic caches call out to a vector database. Crowkis embeds the HNSW graph in-process, and that placement decision is worth more than any algorithm tweak.",
    paras: [
      "HNSW, hierarchical navigable small worlds, is the workhorse of approximate nearest-neighbour search: a layered graph you descend from sparse highways to dense streets, finding semantic neighbours in logarithmic hops. Everyone uses some variant. The differentiating decision isn't the algorithm; it's where it runs.",
      "The standard architecture puts vectors in a separate service, which taxes every lookup with serialization, a network round trip, and a second system's tail latency, then taxes the design again, because confidence gating needs the candidates' metadata, which means more round trips or denormalized copies drifting out of sync.",
      "Crowkis embeds the graph in the same process as the LSM store and the scoring engines: a lookup walks the graph, reads neighbour metadata, and runs all five gates without crossing a process boundary. That's how the entire read path, embed, search, template-check, score, trust-check, fits inside a millisecond. The graph persists alongside the store and recovers with it, covered by the same crash tests.",
      "Distributed vector databases earn their complexity at billions of vectors. A cache's working set is millions, which fits in one process's memory with room to spare. Choosing the boring placement bought us the headline number.",
    ],
    chart: "read-path",
  },
  {
    slug: "wal-design",
    title: "The write-ahead log: how the cache survives a kill -9",
    date: "2026-05-29",
    tag: TAG,
    summary:
      "Durability isn't a checkbox, it's a sequence of writes in the right order with checksums at every step. Here's the boring machinery that makes restarts uneventful.",
    paras: [
      "Caches traditionally shrug at durability, 'it's just a cache', but an LLM cache's contents cost real money to rebuild. Losing a warm corpus to a pod reschedule means re-purchasing it from your provider at full price. So CrowkisDB treats every entry as worth keeping: writes land in the write-ahead log before anything else, each record framed with a CRC32 checksum, fsynced according to policy.",
      "Recovery is the payoff: on startup the engine replays the log from the last checkpoint, validating every checksum, rebuilding the memtable to the exact pre-crash state. A torn write at the tail, the classic power-cut artifact, fails its checksum and truncates cleanly instead of poisoning the replay. The vector index recovers alongside, so semantic search resumes where it stopped.",
      "We don't trust this machinery; we attack it. The integration suite kills the process mid-write and verifies every acknowledged entry survives; the Docker smoke test does the same to the whole container. Durability claims that aren't tested by murder are marketing.",
      "The result is operationally liberating: deploys, reschedules, and crashes are non-events. The cache you had is the cache you have. Boring, by design, provably.",
    ],
    plain:
      "Everything is written to a crash-proof journal first. Pull the plug mid-write and Crowkis replays the journal on restart, your cache comes back exactly as it was.",
    chart: "write-trust",
  },
  {
    slug: "bloom-filters",
    title: "Bloom filters: how the engine knows what it doesn't know",
    date: "2026-05-27",
    tag: TAG,
    summary:
      "The fastest disk read is the one that never happens. A few bits per key let Crowkis skip files that can't contain your answer, at a 1% false-positive cost we chose on purpose.",
    paras: [
      "LSM trees scatter data across many sorted files, so a naive lookup might probe each one, and most probes would find nothing. Bloom filters fix the economics: a compact bit-array per SSTable answers 'could this key be here?' with no false negatives and a tunable false-positive rate. A 'no' skips the file entirely; only plausible files get touched.",
      "Crowkis tunes its filters to roughly 1% false positives, a deliberate spot on the memory/IO curve. Tighter filters buy little (the occasional wasted probe costs one read) while meaningfully inflating memory; looser ones start leaking real IO. One percent keeps filters small enough to live comfortably in RAM, where they make misses nearly free.",
      "Cheap misses matter more in a cache than anywhere: every genuinely novel question is a guaranteed miss on its way to the model, and that miss shouldn't pay a disk-tour tax before the model call it was always going to make. Filters keep the miss path as fast as the hit path is famous for.",
      "It's twelve bytes of math per key standing between you and a pile of pointless reads, the kind of unglamorous engineering that compounds into the latency numbers on the homepage.",
    ],
    chart: "read-path",
  },
  {
    slug: "intent-classification-design",
    title: "Twelve intents: why the cache treats a poem differently from a fact",
    date: "2026-05-24",
    tag: TAG,
    summary:
      "One similarity threshold for all traffic is how caches embarrass themselves. Crowkis classifies every query into one of twelve intents, each with its own rules of reuse.",
    paras: [
      "The single-threshold semantic cache has a structural flaw: 0.85 similarity means entirely different things for different queries. For 'capital of France?' it's a safe hit; for 'write my wedding toast' it's a plagiarism machine; for 'should I take this medication with alcohol?' it's a liability. Reuse safety isn't a number, it's a number per kind of question.",
      "Crowkis classifies every query into one of twelve intent classes, factual, conceptual, transactional, creative, personal, temporal, and friends, before any matching happens. Each class carries its own base threshold, freshness expectations, and reuse posture: factual content reuses aggressively at high confidence; creative and personal intents face strict bars or no-reuse rules; temporal queries inherit tight TTLs by default.",
      "Classification feeds everything downstream: confidence gates read the intent's threshold, adaptive tuning adjusts per class rather than globally, eviction values entries by class economics, and the dashboard breaks down hits by intent so you can see where the cache earns. It's the routing layer of the whole intelligence stack.",
      "The classifier itself is fast, deterministic, rule-grounded, and clamped, boring on purpose, because everything trusts it. Twelve buckets sounds simple. Most production incidents in naive caches trace back to not having them.",
    ],
    plain:
      "A fact can be reused freely; a poem or personal advice can't. Crowkis sorts every question by kind first, so each kind gets its own safety rules.",
    chart: "read-path",
  },
  {
    slug: "template-matching-deep-dive",
    title: "Structural templates: the matching layer vectors can't see",
    date: "2026-05-21",
    tag: TAG,
    summary:
      "Embeddings blur exactly where caches need precision, numbers, dates, entities. Template abstraction catches what cosine similarity structurally cannot.",
    paras: [
      "Embeddings have a known blind spot: they compress meaning into geometry, and small tokens with huge semantic weight, negations, identifiers, quantities, barely bend the vector. 'Invoice #4412' and 'invoice #9981' embed nearly identically, which is correct for similarity and catastrophic for a cache that might serve one customer's invoice status to another.",
      "Crowkis's template engine attacks the problem from the structural side: numbers, dates, IDs, and entities are lifted out of the query into typed slots, and the remaining skeleton, 'status of invoice <ID>', is hashed. Two queries match structurally when their skeletons agree; their slots are then compared explicitly, where <ID>=4412 versus 9981 is an unmistakable mismatch rather than a rounding error in cosine space.",
      "The dual requirement is the safety story: a hit needs the vector to say 'same meaning' and the template to say 'same structure, compatible slots.' Each side covers the other's blindness, vectors catch paraphrase that templates can't, templates catch precision that vectors can't. Single-signal caches choose one blindness; we declined.",
      "Templates also multiply hit rates on parametric traffic: one cached skeleton serves infinite slot variations of commands, lookups, and form-letter queries. The layer that protects you is the same layer that pays you.",
    ],
    chart: "read-path",
  },
  {
    slug: "reasoning-reuse-internals",
    title: "Reasoning reuse: caching how the model thinks, not just what it says",
    date: "2026-05-18",
    tag: TAG,
    summary:
      "Chain-of-thought tokens are the most expensive ones you buy. Crowkis extracts the thought's skeleton, abstracts the specifics, and recomposes it for the next input that shares its shape.",
    paras: [
      "Response-level caching has a ceiling: it only saves when the final answer transfers. But look at where the tokens actually go in hard queries, the reasoning. Step-by-step derivations, plan decompositions, structured analyses. Different inputs constantly share identical reasoning shapes with different specifics, and response caching can't see the kinship.",
      "Crowkis's reasoning store parses chain-of-thought output into typed steps, abstracts the particulars, numbers, dates, entities, into slots, and signs the step-type sequence. That signature is the reasoning's fingerprint: when a new query's shape matches a stored skeleton, the recomposer substitutes the new slots into the proven structure instead of re-purchasing the derivation.",
      "The worked-example case makes it concrete: the solution structure for one amortization calculation is the solution structure for all of them. First solve costs full reasoning tokens; every structural sibling after costs a recomposition. Math help, troubleshooting trees, policy analyses, anywhere thinking has a repeatable shape, the shape is now an asset.",
      "It ships in every edition, gated by the same confidence machinery as everything else, a skeleton only serves where the match clears the bar. The deepest savings in the product, hiding in the step between question and answer.",
    ],
    plain:
      "The expensive part of a hard answer is the thinking. When two questions need the same thinking with different numbers, Crowkis reuses the thinking and swaps the numbers.",
    chart: "read-path",
  },
  {
    slug: "smart-eviction-design",
    title: "Eviction with a ledger: why LRU is the wrong instinct for an LLM cache",
    date: "2026-05-15",
    tag: TAG,
    summary:
      "LRU evicts by recency and nothing else. But cache entries have wildly different replacement costs, and forgetting a $0.40 answer to keep a $0.0004 one is just bad accounting.",
    paras: [
      "LRU is a beautiful default for caches whose entries cost the same to rebuild. LLM cache entries violate that premise spectacularly: a one-line factual answer cost a fraction of a cent; a long chain-of-thought analysis cost half a dollar and four seconds. Evicting them by recency alone treats a banknote and a receipt as the same paper.",
      "Crowkis scores eviction candidates on four equal axes: recency, frequency, isolation (does anything else depend on it?), and, the LLM-specific one, compute cost, what you'd pay the provider to regenerate it. An expensive, occasionally-hit reasoning answer outranks a cheap, recently-hit triviality, because the cache's job is maximizing saved spend, not maximizing recentness.",
      "The economics are intuitive once stated: under memory pressure, the engine sheds the entries that are cheapest to re-buy, holding the portfolio of answers whose regeneration would hurt. Your cache literally optimizes for the shape of your provider bill.",
      "It's accounting, applied to memory management, and like most good accounting, invisible until you compare end-of-month numbers against the naive policy. The dashboard makes the comparison unnecessary; the saved-spend counter already chose sides.",
    ],
    chart: "budget-wall",
  },
  {
    slug: "freshness-policies",
    title: "Five TTL policies: engineering the shelf life of truth",
    date: "2026-05-12",
    tag: TAG,
    summary:
      "Answers age at different speeds, prices in days, math never. A single TTL knob can't express that, so Crowkis ships five policies plus version pinning and webhooks.",
    paras: [
      "TTL design usually gets one integer and a shrug. But cached truth has genres: the Pythagorean theorem never expires, your pricing page expires on marketing's whim, 'today's status' expires at midnight, and policy answers expire exactly when the policy document revs. One number flattens all of that into a single wrong compromise.",
      "Crowkis ships five TTL policies covering the genres, from never-expire through fixed windows to event-driven invalidation, assignable per entry and defaulted sensibly per intent class (temporal intents inherit short windows automatically). Version pinning ties entries to a document or config version; invalidation webhooks let your pricing pipeline or CMS kill affected entries the moment upstream truth changes.",
      "The subtle layer is freshness decay inside confidence: an entry approaching staleness doesn't cliff from served-to-dead, its freshness signal sags, dragging the composite score toward the threshold, so borderline-old answers start losing to recomputation before they can mislead. Expiry becomes a gradient with a deadline, not a trap door.",
      "Staleness is the failure mode users forgive least, a wrong price reads as a lie, not a bug. Engineering shelf life explicitly is what separates a cache you trust from a cache you audit.",
    ],
    plain:
      "Math never expires; prices expire when marketing says so. Crowkis lets every answer carry the right expiry, and old answers fade out gracefully instead of failing suddenly.",
    chart: "write-trust",
  },
  {
    slug: "resp3-protocol-choice",
    title: "Why we kept the Redis protocol instead of inventing an API",
    date: "2026-05-09",
    tag: TAG,
    summary:
      "Every new API is a tax on adoption: clients, docs, muscle memory, tooling. RESP3 meant inheriting twenty years of all four on day one.",
    paras: [
      "The tempting move for any new infrastructure product is a bespoke API, clean, modern, yours. The cost hides in the ecosystem: every language needs a client, every client needs maintenance, every team needs to learn error semantics, and every debugging session starts from zero tooling. Protocol invention is a decade of work cosplaying as a design choice.",
      "Speaking RESP3 bought all of it back: redis-py, ioredis, Lettuce, and dozens of mature clients connect to Crowkis unmodified; existing health checks, dashboards, and operational reflexes mostly just work; and the crowkis cli feels familiar to anyone who's typed redis-cli. Adoption friction drops to 'change the port.'",
      "The protocol carries the semantic extensions gracefully, CSET, CGET, CSIM and family are ordinary commands with ordinary arguments, negotiated over the same HELLO handshake, with hard frame caps and constant-time auth at the door. Redis-compatibility never meant inheriting Redis's matching; the brain behind the protocol is entirely ours.",
      "For shops with different tastes, gRPC, REST, and MCP front the same engine. But RESP is the people-mover: the fastest path from 'heard of it' to 'first hit in the dashboard' is a protocol your stack already speaks.",
    ],
    chart: "drop-in",
  },
  {
    slug: "actor-architecture",
    title: "One actor, no locks across await: the concurrency design",
    date: "2026-05-06",
    tag: TAG,
    summary:
      "Crowkis serves thousands of connections through async IO, then funnels every cache decision through a single deterministic actor. Here's why that's a feature.",
    paras: [
      "The architecture splits where architectures should: thousands of connections live on Tokio's async runtime, parsing frames and buffering responses concurrently, IO scales out. But every actual cache command funnels through a bounded channel into one actor thread that owns all engine state and applies commands in strict sequence. Reads and writes never race, because there's nothing to race.",
      "The discipline this buys is easiest to state as an invariant: no locks held across await points, because the hot path holds no locks at all. The classic concurrency bestiary, deadlocks, lock contention spirals, subtle read-write interleavings under load, is absent by construction rather than by vigilance. Tail latency stays flat when concurrency climbs, because the engine's critical section is a queue, not a lock graph.",
      "Determinism is the quiet superpower: identical command sequences produce identical states, which makes the 347-test suite honest, crash-recovery and stress tests replay scenarios exactly, with no 'flaky under scheduler' asterisks. Debugging production means reasoning about a sequence, not a poset.",
      "Single-writer designs trade theoretical parallel writes for actual predictability. A cache's writes are cheap and its correctness is sacred, the trade signs itself.",
    ],
    chart: "read-path",
  },
  {
    slug: "mcp-server-design",
    title: "Designing the MCP server: a cache as a tool the model can hold",
    date: "2026-05-03",
    tag: TAG,
    summary:
      "MCP turns Crowkis into something an AI assistant can use deliberately, check the cache, store the answer, over plain stdio, with the banner silenced so JSON-RPC stays clean.",
    paras: [
      "The Model Context Protocol reframes integration: instead of your code calling the cache around the model, the model itself holds cache operations as tools. crowkis mcp speaks JSON-RPC over stdio, the MCP transport, and registers lookup, store, and stats surfaces that any MCP-capable assistant can invoke mid-conversation.",
      "Small design decisions carry the production weight. The mcp subcommand boots silently, the startup banner every other verb prints would corrupt a JSON-RPC stream, so it's the one silent door. Tool results are structured for model consumption: a hit returns the answer with its confidence; a miss returns a clean signal the model can act on, not an error to hallucinate around.",
      "Crucially, MCP traffic gets no trust shortcuts: an assistant's store request walks the same five-stage pipeline as RESP and SDK writes, with the assistant as a ledger-tracked source. An agent that stores garbage earns a higher bar automatically, the immune system doesn't care who's writing.",
      "The result is agents that remember as a behavior rather than an architecture diagram: Claude Code checks before spending tokens, banks what it computes, and the whole team's assistants share the dividend. One config block; the binary was already running.",
    ],
    chart: "agent-fanout",
  },
  {
    slug: "compaction-strategy",
    title: "Three levels, one strategy: compaction without the tuning PhD",
    date: "2026-04-30",
    tag: TAG,
    summary:
      "LSM compaction is where storage engines breed complexity. Crowkis ships exactly one strategy across three levels, chosen for cache workloads, closed for configuration.",
    paras: [
      "Mature LSM engines offer compaction styles the way menus offer wine: leveled, tiered, universal, FIFO, hybrid, each with a tuning surface that consumes operator careers. The flexibility exists because those engines serve every workload imaginable. A cache's workload isn't imaginable; it's known: write-heavy on misses, read-critical on hits, values that expire, sizes that stay modest.",
      "So CrowkisDB ships one strategy over three levels, L0 absorbing memtable flushes, folding down through L1 and L2, with thresholds chosen for that known shape. Read amplification stays bounded for the latency promise; write amplification stays sane for SSD longevity; TTL-expired entries die during folding, making expiry cleanup a side effect rather than a chore.",
      "The operator-facing consequence is an empty config section, deliberately. No compaction strategy to mischoose, no tuning guide to misread at 3 a.m., no foot-gun shaped like flexibility. The invariant list the compactor maintains is tested by the heaviest part of the suite instead of documented as your responsibility.",
      "Configurability is a cost paid by users to cover a vendor's uncertainty. We weren't uncertain about the workload, Crowkis only has one, so we spent the certainty on your behalf.",
    ],
    chart: "read-path",
  },
  {
    slug: "streaming-hits",
    title: "Streaming cache hits: instant answers that still feel like typing",
    date: "2026-04-27",
    tag: TAG,
    summary:
      "Users expect LLM answers to arrive as a typing stream. CGETSTREAM serves cached answers chunk by chunk, so a sub-millisecond hit doesn't break the interface's rhythm.",
    paras: [
      "Caching collides with a UX convention: every LLM interface streams tokens, and users have learned to read the typing rhythm as 'the AI is thinking.' Return a cached answer as one instantaneous block and the experience goes uncanny, the seam between hit and miss becomes visible, and visible seams erode trust in both halves.",
      "CGETSTREAM and the SDKs' streaming helpers serve hits in configurable chunks with configurable pacing, chunk_tokens and delay_ms, so a cache hit walks onto the screen with the same gait as a model response. Your frontend keeps one rendering path; users keep one mental model; the seam disappears.",
      "Behind the curtain it composes with real streams: stream_get_or_compute passes a genuine model stream through on a miss, captures it for the write pipeline, and replays the banked version for every future paraphrase. First asker gets the live stream; everyone after gets the recording, indistinguishable at a fraction of a millisecond's cost.",
      "It's a small feature with an honest insight inside: latency wins must be spent carefully in interfaces built around latency. We give you the win and the dimmer switch.",
    ],
    plain:
      "Cached answers arrive instantly, but they're typed out like the model is answering, so the speed-up never makes the interface feel weird or broken.",
    chart: "drop-in",
  },
  {
    slug: "test-suite-philosophy",
    title: "347 tests and a murder weapon: how the suite is organized",
    date: "2026-04-24",
    tag: TAG,
    summary:
      "Bottom-heavy by design: the layers that hold your data get the most hostile coverage, and the smoke suite's signature move is killing the process to prove a point.",
    paras: [
      "The suite's shape encodes a belief: bug severity scales with stack depth, so coverage should too. The base layers get the bulk, 64 tests on KV operations, 37 on the engine's WAL replay, flush, compaction, and batches, because a storage bug costs data, and data here costs literal dollars to rebuild. Above them, vector persistence, semantic gating, and 18 stress scenarios cover the intelligence; the smoke suite crowns it end to end.",
      "The smoke suite's character is adversarial: it writes entries, kills the container without ceremony, restarts, and demands everything back; it probes the management API unauthenticated and expects rejection; it checks that gRPC and RESP agree about the same cache and that migration leases survive the violence. Happy paths are table stakes, the suite specializes in unhappy ones.",
      "Every release passes the identical gate: full suite, Docker build, boot, health, auth boundary, durability drill. The rule has no exception process, which is the only kind of rule that survives deadline pressure. A release that lowers any bar isn't a release; it's a regression with version numbers.",
      "Test counts are a vanity metric; test hostility isn't. Ours are hostile where your data lives, which is the only place hostility pays.",
    ],
    chart: "write-trust",
  },
];
