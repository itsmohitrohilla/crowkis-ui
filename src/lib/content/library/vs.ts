import { PostSpec } from "./builder";

const TAG = "vs the field";

export const vsSpecs: PostSpec[] = [
  {
    slug: "crowkis-vs-redis",
    title: "Crowkis vs Redis: same protocol, different century",
    date: "2026-06-08",
    tag: TAG,
    summary:
      "Redis is magnificent infrastructure for exact-match workloads. LLM traffic isn't one. Here's why speaking the same protocol doesn't mean solving the same problem.",
    paras: [
      "Let's start with respect: Redis is one of the best pieces of infrastructure ever shipped, and Crowkis deliberately speaks its protocol because the ergonomics are unbeatable. But Redis was designed for a world where a key is a key. GET user:42 either exists or it doesn't. LLM traffic broke that assumption, the same question now arrives in fifty phrasings, and Redis sees fifty unrelated keys.",
      "Run a Redis cache in front of an LLM app and watch the hit rate: it rounds to zero. Not because Redis is slow, it's blisteringly fast at missing. Every paraphrase is a different byte string, every byte string is a different key, and every miss is a full-price model call. You've added a network hop to a system that still pays for every answer twice.",
      "Crowkis keeps everything you love about the Redis workflow, the wire protocol, the CLI ergonomics, the single-binary deployment, and replaces the matching brain entirely. Queries are classified by intent, abstracted into structural templates, embedded into an HNSW index, and matched by meaning with a confidence gate. 'How do refunds work?' and 'what's your refund window?' finally resolve to the same answer.",
      "If your keys are exact, sessions, counters, queues, keep Redis; we would. The moment your keys are human language, exact matching is the wrong tool, elegantly executed. Crowkis is what the cache looks like when it's designed for the traffic you actually have.",
    ],
    plain:
      "Redis matches spelling. Crowkis matches meaning. For LLM traffic, spelling never repeats, meaning always does.",
    venn: {
      left: "Redis",
      overlap: "RESP protocol\nsub-ms reads\nops ergonomics",
      leftItems: ["exact keys", "byte matching"],
      rightItems: ["semantic hits", "trust pipeline"],
      caption: "Everything operators love, plus a brain for language.",
    },
  },
  {
    slug: "crowkis-vs-gptcache",
    title: "Crowkis vs GPTCache: the difference between a library and infrastructure",
    date: "2026-06-05",
    tag: TAG,
    summary:
      "GPTCache proved developers want semantic caching. Crowkis is what happens when that idea grows up, moves out of your Python process, and gets a security model.",
    paras: [
      "GPTCache deserves credit for popularizing the idea that LLM responses are cacheable by similarity. But it lives inside your Python process: its state shares your app's lifecycle, its storage bolts together external pieces, and its matching is similarity-first with thin guardrails. That's a fine experiment. It's a hard thing to put in a production path.",
      "The architectural difference is stark. Crowkis is a standalone Rust binary with its own durable storage engine, WAL, SSTables, vector index, that survives restarts, serves every app in your fleet, and exposes RESP3, gRPC, REST, and MCP. Your cache stops being a per-process trick and becomes shared infrastructure with one dashboard and one truth.",
      "Then there's the part most similarity caches skip entirely: deciding when not to answer. Crowkis runs intent classification, structural template checks, a five-signal confidence gate, and a five-stage anti-poisoning pipeline on every operation. A similarity score alone serves 'cancel my subscription' for 'pause my subscription'. Production traffic deserves a system that knows the difference.",
      "If you're prototyping on a weekend, a library is fine. If real users and real invoices flow through it, you want a cache that's a process, not an import, durable, multi-tenant, observable, and paranoid about what it serves. That's the entire design brief of Crowkis.",
    ],
    venn: {
      left: "GPTCache",
      overlap: "semantic\ncaching idea",
      leftItems: ["in-process library", "similarity-first"],
      rightItems: ["Rust binary", "trust pipeline", "4 protocols"],
      caption: "Same insight, industrial execution.",
    },
  },
  {
    slug: "crowkis-vs-litellm",
    title: "Crowkis vs LiteLLM-style gateways: caching is not a checkbox",
    date: "2026-06-01",
    tag: TAG,
    summary:
      "Python gateways treat caching as one feature among forty. Crowkis treats it as the product, and ships it without a Python supply chain attached.",
    paras: [
      "LLM gateways like LiteLLM do a real job: one API across providers, with caching available as a flag you can turn on. But a checkbox cache is an exact-match or naive-similarity cache, and it inherits the gateway's architecture, a large Python application with a sprawling dependency tree sitting in your hottest path.",
      "The events of March 2026 made the architectural argument better than we ever could: a supply-chain compromise of a major Python LLM gateway exposed tens of millions of monthly downloads and triggered national cyber alerts. Every package in a dependency tree is attack surface. Crowkis ships as one signed Rust binary with zero runtime dependencies, the attack class doesn't apply, by construction.",
      "On the caching itself, the depth difference shows immediately. Gateways cache responses; Crowkis understands them. Intent classes, structural templates, confidence gating, reasoning reuse, anti-poisoning, per-tenant isolation, migration workflows, these aren't gateway features, they're a cache engine's entire reason to exist. You can even keep your gateway for routing and put Crowkis behind it as the memory layer.",
      "Use a gateway for what gateways are good at: API normalization. Use a cache built by people who think about nothing else for the thing that actually cuts your bill. They compose beautifully, and only one of them needs to be trusted with reuse decisions.",
    ],
    chart: "supply-chain",
  },
  {
    slug: "crowkis-vs-portkey",
    title: "Crowkis vs Portkey: the gateway routes, the cache remembers",
    date: "2026-05-28",
    tag: TAG,
    summary:
      "Portkey is a control panel for LLM calls. Crowkis is the memory underneath them. Confusing the two costs you the savings both promise.",
    paras: [
      "Portkey positions itself as an AI gateway: routing, retries, observability, and a 'semantic cache' line item on the feature grid. The pattern is familiar, when caching is one of forty features, it gets one team's sprint, not an architecture. Crowkis is the inverse: the cache is the whole product, and everything in the binary exists to make reuse safe.",
      "Look at where the intelligence lives. A gateway cache typically embeds, compares similarity, and serves above a threshold. Crowkis runs twelve intent classes with separate reuse policies, structural template matching, a geometric-mean confidence gate, a five-stage write-trust pipeline with an append-only ledger, cost-aware eviction, and freshness policies with version pinning. That's not a longer feature list, it's the difference between matching strings-ish and understanding queries.",
      "There's also the deployment philosophy. Cloud gateways meter your traffic and sit between you and your provider as a service. Crowkis is a flat-priced binary on your hardware: no usage meter, no phone-home, air-gap friendly. Your cache, the thing holding your customers' answered questions, never leaves your network.",
      "If you like your gateway, keep it; Crowkis happily sits behind any router as the memory layer. But let the component whose only job is safe reuse make the reuse decisions. Specialists beat feature grids in the critical path, every time.",
    ],
    venn: {
      left: "Portkey",
      overlap: "lower LLM\nspend goal",
      leftItems: ["routing & retries", "cloud metered"],
      rightItems: ["deep reuse engine", "self-host flat"],
      caption: "Router in front, memory behind, just don't confuse the roles.",
    },
  },
  {
    slug: "crowkis-vs-helicone",
    title: "Crowkis vs Helicone-style observability: seeing the waste isn't saving it",
    date: "2026-05-25",
    tag: TAG,
    summary:
      "Observability tools show you beautiful charts of money leaving. Crowkis is the component that makes the chart go down.",
    paras: [
      "LLM observability products earned their place: they showed teams, often for the first time, how much of their traffic was repetitive and what it cost. But a dashboard is a diagnosis. After the chart says '61% of your queries are paraphrases of earlier ones,' something still has to act on that, and a proxy that logs requests isn't built to.",
      "Crowkis closes the loop. The same process that observes traffic also serves it: paraphrases become sub-millisecond hits, repeated reasoning gets reused, poisoned writes get refused, and budgets get enforced per key. The dashboard isn't a report about your spend, it's a live ledger of spend that didn't happen.",
      "And because observation and action live in one engine, the feedback is automatic. Hit/miss outcomes tune the adaptive thresholds. Trust scores update with every accept and refuse. Top-miss analytics tell you exactly which queries to pre-warm. An observability tool can tell you all of this; Crowkis does something about it before the next request lands.",
      "Keep your tracing stack, Crowkis exports Prometheus and OpenTelemetry into it happily. But when the maintenance-mode fate of standalone observability tools is a market lesson, the safer bet is the component that owns the savings, not just the screenshots.",
    ],
    plain:
      "An observability tool is a smoke detector. Crowkis is the sprinkler system, with the smoke detector built in.",
    chart: "repeat-bill",
  },
  {
    slug: "crowkis-vs-pinecone",
    title: "Crowkis vs Pinecone: a vector database is not a cache",
    date: "2026-05-22",
    tag: TAG,
    summary:
      "Pinecone answers 'what's similar?'. A production cache must answer 'is this safe to serve?'. Those are different questions with different architectures.",
    paras: [
      "Teams keep trying to build semantic caches out of vector databases, and the demo always works. Embed the query, search Pinecone, serve the top hit above 0.85 similarity. Then production arrives: 'cancel my subscription' retrieves the cached 'pause my subscription' answer at 0.91, and a customer gets exactly the wrong instruction with full confidence.",
      "The gap isn't Pinecone's fault, retrieval is its job, and it does it well. The gap is everything a cache needs that retrieval doesn't provide: intent-aware thresholds, structural validation, confidence gating, TTLs and freshness, tenant isolation as a hard boundary, write-time trust scoring, cost-aware eviction, and an audit trail for every decision. That's not a wrapper script; that's a product.",
      "Crowkis ships all of it in one binary, with the vector index embedded where it belongs, inside the engine, next to the template store and the trust ledger, behind a five-gate read path. No second service to operate, no per-query API bill for cache lookups, no network hop between 'similar' and 'safe'.",
      "Keep your vector database for what it's for: RAG retrieval over your documents. Put Crowkis in front of the model calls. One finds context; the other prevents you from paying for, or serving, the same answer badly, twice.",
    ],
    venn: {
      left: "Pinecone",
      overlap: "vector\nsimilarity",
      leftItems: ["RAG retrieval", "per-query billing"],
      rightItems: ["5-gate reuse", "TTL · trust · tenancy"],
      caption: "Similarity is one gate of five.",
    },
  },
  {
    slug: "crowkis-vs-weaviate-qdrant-milvus",
    title: "Crowkis vs Weaviate, Qdrant, and Milvus: stop assembling your cache from parts",
    date: "2026-05-19",
    tag: TAG,
    summary:
      "Every DIY semantic cache is a vector database, a Redis, a cron job, and a prayer. Crowkis is the version where the parts were designed for each other.",
    paras: [
      "The DIY semantic cache has a standard recipe: Qdrant or Weaviate or Milvus for vectors, Redis for the actual payloads, glue code for TTLs, more glue for tenant separation, and a backlog ticket that says 'handle bad cache entries someday.' Three services, two network hops per lookup, and the hardest problems still unsolved.",
      "Consider what the glue can't give you. Eviction that knows what an entry cost to compute. Thresholds that differ for factual versus creative queries. A write refused because its answer doesn't cohere with its question. Migration of warm entries when you swap models. Each of these needs the vector index, the payload store, and the scoring state in one place, which is precisely what a parts-built system never has.",
      "Crowkis collapses the whole stack into one Rust process: LSM storage, HNSW index, template store, trust ledger, scoring engines, and four protocol surfaces. One service to deploy, one dashboard to watch, one binary to upgrade. The read path crosses zero network boundaries on its way to a five-gate decision.",
      "Vector databases are excellent at their actual job, large-scale retrieval. A cache is a different machine that happens to contain a small vector index. Buy the machine that was built whole, and give your glue code an honorable retirement.",
    ],
    chart: "read-path",
  },
  {
    slug: "crowkis-vs-pgvector",
    title: "Crowkis vs pgvector: your database deserves better than your cache traffic",
    date: "2026-05-16",
    tag: TAG,
    summary:
      "pgvector is a lovely extension for storing embeddings next to your data. Routing every LLM query through Postgres is how lovely things die.",
    paras: [
      "pgvector made vector search approachable: it's right there in Postgres, next to your tables, with SQL you already know. For RAG over modest corpora it's a genuinely good answer. But a cache lookup happens on every single LLM request, and pointing that firehose at your primary database couples your AI traffic to the same connection pool, vacuum schedule, and failover story as your orders table.",
      "Caches and databases want opposite things. A cache wants sub-millisecond reads, aggressive memory use, cheap misses, and the freedom to evict; a relational database wants durability ceremonies, MVCC, and careful locks. An IVFFlat scan plus a payload join plus connection acquisition is a fine query, it's just not a cache hit. And nothing in SQL refuses to serve an answer because its source has a bad trust history.",
      "Crowkis is the purpose-built path: an in-process HNSW index over an LSM store engineered for exactly this access pattern, with the intelligence layered where SQL can't reach, intent classes, confidence gates, poisoning checks, tenant walls. Your Postgres keeps doing what it's great at, unbothered by ten thousand cache probes a minute.",
      "The rule of thumb is old and still right: don't make your system of record absorb your traffic spikes. Cache in a cache. Keep pgvector for the data that belongs beside your data.",
    ],
    plain:
      "Postgres is your filing cabinet. Don't make the filing cabinet answer the phone every time a customer asks a question.",
    chart: "drop-in",
  },
  {
    slug: "crowkis-vs-momento",
    title: "Crowkis vs Momento: your cache shouldn't bill like the thing it's saving you from",
    date: "2026-05-13",
    tag: TAG,
    summary:
      "Serverless caches meter every operation. A cache that charges per request in front of an API that charges per request is a strange kind of savings.",
    paras: [
      "Momento's pitch is real: a cache with zero servers to manage, billed per operation. For spiky generic workloads that trade can make sense. But think about what an LLM cache is for, eliminating a per-request bill, and the irony of solving it with another per-request bill becomes hard to unsee. Your savings now have a meter on them.",
      "LLM cache traffic is also the worst case for metered pricing: it's your entire query stream. Every user message probes the cache. At scale, the cache line item starts competing with the model line item, and your finance team starts asking why the cost-reduction component has variable cost. Crowkis is flat, free for Community, per-cluster for Enterprise, so the hundredth million lookup costs what the first did: nothing.",
      "Architecture follows the billing model. A metered cloud cache is an exact-match key-value store over the network; semantic understanding, intent thresholds, poisoning defense, and reasoning reuse aren't on the menu, because the menu is GET and SET. Crowkis spends its entire engine on the question metered caches can't afford to ask: should this answer be reused at all?",
      "There's a deeper point about data gravity, too: your cache contains every question your customers ask. Crowkis keeps that corpus on your hardware, offline-licensed, phoning home to no one. Predictable cost, private data, smarter hits, the meter never had a chance.",
    ],
    venn: {
      left: "Momento",
      overlap: "managed-feel\ncaching",
      leftItems: ["per-op billing", "exact match"],
      rightItems: ["flat per cluster", "semantic + trust"],
      caption: "A cost-saving layer should have a fixed cost.",
    },
  },
  {
    slug: "crowkis-vs-elasticache",
    title: "Crowkis vs ElastiCache: managed Redis is still Redis",
    date: "2026-05-10",
    tag: TAG,
    summary:
      "AWS will happily run an exact-match cache for you at any scale. It will miss your LLM traffic at any scale, too.",
    paras: [
      "ElastiCache answers an operational question, who patches and scales my Redis?, and answers it well. What it cannot change is the matching model inside. Managed or not, multi-AZ or not, the engine compares bytes. Put it in front of an LLM application and you've built a highly available system for missing paraphrases.",
      "There's a quieter cost problem as well: node-hours. An ElastiCache cluster bills around the clock whether it's hitting or missing, and for LLM workloads it will mostly miss. You pay AWS for the cache, then pay your model provider for all the answers the cache couldn't recognize it already had. Two bills, one of them pure overhead.",
      "Crowkis deploys with the same operational ease, one hardened container, health checks, binary-swap upgrades, but every cycle it burns goes toward hits that actually land: semantic matching, structural templates, confidence gates, reasoning reuse. The dashboard shows saved dollars, not just memory pressure, because saved dollars are the entire point.",
      "If you need a managed exact-match cache for sessions and queues, ElastiCache remains a fine choice. For the LLM path, run the cache that understands the traffic. It's one docker pull, your platform team will cope.",
    ],
    chart: "repeat-bill",
  },
  {
    slug: "crowkis-vs-memcached",
    title: "Crowkis vs Memcached: a beautiful fossil meets a new workload",
    date: "2026-05-07",
    tag: TAG,
    summary:
      "Memcached is the purest cache ever written, and purity is exactly the problem when your keys are sentences.",
    paras: [
      "Memcached deserves a monument: decades of faithfully storing bytes under keys with magnificent simplicity. No persistence, no types, no opinions. That minimalism is perfect when keys are deterministic, and useless when keys are human language, where the same intent never spells itself the same way twice.",
      "LLM traffic exposes every gap at once. No semantic matching, so paraphrases miss. No persistence, so a restart torches the corpus your users spent weeks warming. No tenancy, no auth story to speak of, no analytics on what's missing. None of this is criticism, Memcached never claimed otherwise. It simply predates the question.",
      "Crowkis answers the question directly: durable storage that survives restarts, an embedded vector index for meaning, templates for structure, gates for confidence and trust, tenancy as a hard wall, and a dashboard that prices every hit. The operational simplicity survives, one binary, one container, but the engine inside was born in the right decade.",
      "Replace nothing that works: Memcached can keep serving your session blobs forever. Just don't ask 1999's sharpest tool to recognize that two sentences mean the same thing. That job has an owner now.",
    ],
    plain:
      "Memcached remembers exactly what you told it. Crowkis remembers what you meant, and that's the difference between a miss and a hit on LLM traffic.",
    chart: "drop-in",
  },
  {
    slug: "crowkis-vs-dragonfly-valkey-keydb",
    title: "Crowkis vs Dragonfly, Valkey, and KeyDB: faster exact-matching is still exact-matching",
    date: "2026-05-04",
    tag: TAG,
    summary:
      "The new Redis-compatibles race each other on throughput. On LLM traffic they all hit the same wall at full speed: the keys never repeat.",
    paras: [
      "Dragonfly, Valkey, and KeyDB are genuinely impressive engineering, multithreaded cores, modern memory layouts, benchmark charts that embarrass their ancestors. If your bottleneck is operations per second on exact keys, they're worthy upgrades. But speed multiplies hit rate, and on LLM traffic the exact-match hit rate is approximately zero. A million misses per second is still a miss.",
      "This is the uncomfortable structural truth of the Redis-compatible race: they compete on how fast they can do the matching model that LLM workloads break. Paraphrase arrives, bytes differ, miss fires, model bills. No amount of multithreading touches the actual problem, because the problem is in the comparison, not the throughput.",
      "Crowkis took the other fork: keep RESP compatibility (your clients connect to any of these, and to us, unchanged) but rebuild the matching brain, embeddings, templates, intents, confidence, trust. A 0.4ms semantic hit beats a 0.04ms miss by exactly the price of one model call, which is to say: by everything.",
      "Pick your fast exact-match engine for exact-match jobs; they're all good. For the traffic where meaning repeats but spelling doesn't, throughput was never the metric. Hit rate is. That's the race Crowkis entered.",
    ],
    venn: {
      left: "Dragonfly / Valkey",
      overlap: "RESP\ncompatibility",
      leftItems: ["raw ops/sec", "exact keys"],
      rightItems: ["semantic hit rate", "reuse safety"],
      caption: "Fast misses are still misses.",
    },
  },
  {
    slug: "crowkis-vs-openai-prompt-caching",
    title: "Crowkis vs OpenAI prompt caching: a discount is not a cache",
    date: "2026-05-01",
    tag: TAG,
    summary:
      "Provider prompt caching discounts your repeated prefixes. You still call the model, still wait, and still pay, just slightly less. There's a bigger idea available.",
    paras: [
      "OpenAI's prompt caching is a good deal worth taking: repeat the same long prefix and the repeated tokens bill at a discount. But notice what it actually is, a pricing tier, not a cache. Every request still travels to the provider, still runs inference on the new tokens, still takes seconds, and still costs real money. The discount applies to inputs only; the expensive output tokens are regenerated at full price, every time.",
      "It also only triggers on exact prefix repetition. Your system prompt qualifies; your users' questions don't, because users paraphrase. The traffic that actually dominates your bill, the same question asked fifty ways, gets no discount at all, because no two phrasings share a prefix.",
      "Crowkis operates one level up: when the question means the same thing, the answer doesn't get regenerated at all. No round-trip, no inference, no output tokens, a sub-millisecond local hit, gated by confidence and trust. And it works identically across providers, so your savings don't evaporate the day you switch models.",
      "Stack them, by all means: prefix discounts for the calls that must happen, Crowkis to eliminate the calls that needn't. Just be clear about which one changes the shape of the bill and which one shaves its edges.",
    ],
    plain:
      "Provider caching makes repeat calls cheaper. Crowkis makes repeat calls disappear. Cheaper is a coupon; disappear is a strategy.",
    chart: "repeat-bill",
  },
  {
    slug: "crowkis-vs-anthropic-prompt-caching",
    title: "Crowkis vs Anthropic prompt caching: cache writes that bill you are telling you something",
    date: "2026-04-28",
    tag: TAG,
    summary:
      "Anthropic's prompt caching is excellent at its actual job, cheap long contexts. It was never designed to be your response cache, and the pricing says so.",
    paras: [
      "Anthropic's prompt caching shines for what it was built for: agents and chat apps re-sending a large stable context get the repeated prefix at a steep discount, with cache writes billed at a premium and entries expiring in minutes. Take that deal for your long system prompts, we do. But read the design closely and it tells you its scope: short-lived, prefix-exact, input-side, single-provider.",
      "Five-minute TTLs mean your cache evaporates between user sessions. Prefix-exactness means paraphrased questions never qualify. Input-side means the answer, the expensive part, is regenerated every time. And provider-side means your accumulated cache value is a feature of someone else's pricing page, revocable and non-portable.",
      "Crowkis is the durable, output-side complement: answers persist on your disk for as long as your TTL policy says, match by meaning rather than prefix, survive restarts and model swaps, and serve in under a millisecond without touching the API at all. Your cache becomes an asset you own rather than a discount you receive.",
      "The composition is clean: Anthropic's caching cuts the cost of calls Crowkis decides must happen; Crowkis eliminates the rest. One optimizes the pipe, the other installs a reservoir.",
    ],
    chart: "drop-in",
  },
  {
    slug: "crowkis-vs-gemini-context-caching",
    title: "Crowkis vs Gemini context caching: renting memory by the hour",
    date: "2026-04-25",
    tag: TAG,
    summary:
      "Google bills cached context per token per hour, a parking meter for your own prompts. Compare that with a cache you simply own.",
    paras: [
      "Gemini's context caching has a distinctive billing model: you pay to store cached tokens per hour, like a parking meter running on your own context. For mega-prompts reused heavily within a window, the math can work. But it frames the relationship clearly, your cache is a rental, priced and bounded by the provider, gone when you stop feeding the meter.",
      "As with every provider-side scheme, the scope is inputs: the model still runs, latency is still seconds, output tokens still bill at full price, and only verbatim context qualifies. The dominant waste in production apps, semantically repeated questions with different words, passes through untouched.",
      "Crowkis inverts the ownership. The cache lives on your disk, in your container, with no hourly meter and no provider lock. It stores answers, not just contexts, and matches them by meaning with confidence and trust gates. When you change providers, or run three at once, the corpus comes with you, and the cross-provider bridge keeps serving it.",
      "Pay the parking meter when a giant context genuinely earns it. For everything else, owning your memory beats renting it, especially when the owned version is also the smarter one.",
    ],
    venn: {
      left: "Gemini caching",
      overlap: "cheaper repeated\ncontext",
      leftItems: ["per-token-hour rent", "input-side only"],
      rightItems: ["owned corpus", "answer-level hits"],
      caption: "A reservoir you own vs a meter you feed.",
    },
  },
  {
    slug: "crowkis-vs-vllm-prefix-caching",
    title: "Crowkis vs vLLM prefix caching: different layers, different physics",
    date: "2026-04-22",
    tag: TAG,
    summary:
      "vLLM's prefix caching saves GPU work inside one inference server. Crowkis saves the inference itself. You probably want both, but only one cuts the bill to zero on a hit.",
    paras: [
      "If you self-host models, vLLM's automatic prefix caching is straight-up good engineering: shared prompt prefixes reuse KV-cache blocks on the GPU, throughput rises, latency falls. Run it. But understand its layer, it accelerates inference that is still happening, on one server, for requests sharing literal prefixes, with state that lives and dies with GPU memory.",
      "The ceiling is physics: even a perfectly prefix-cached request still decodes output tokens, still occupies GPU, still takes its hundreds of milliseconds, and on hosted APIs you can't deploy vLLM at all, that layer belongs to your provider. Paraphrases share no prefix, so the semantic repetition dominating real traffic gets nothing.",
      "Crowkis sits above the inference layer entirely: when meaning matches and the gates pass, no inference happens anywhere, not on your GPUs, not on theirs. The answer returns in under a millisecond from a durable local store that survives restarts and works identically whether the model behind it is self-hosted, hosted, or both on alternating Tuesdays.",
      "Layered correctly: Crowkis eliminates the repeated questions; vLLM accelerates the novel ones that remain. The GPU does less work twice over, and the bill notices both.",
    ],
    chart: "read-path",
  },
  {
    slug: "crowkis-vs-langsmith",
    title: "Crowkis vs LangSmith: tracing the waste vs deleting it",
    date: "2026-04-19",
    tag: TAG,
    summary:
      "LangSmith shows you every span of every chain, beautifully. The spans are still billed. There's a component whose job is making the spans not happen.",
    paras: [
      "LangSmith is a polished developer experience: traces, evals, prompt playgrounds, a microscope for LLM applications, priced per seat and per trace at unicorn-company rates. Use it to debug; it's good at that. But a microscope examines the waste in exquisite detail without removing a token of it. Every repeated query it traces was still purchased.",
      "There's also the platform gravity to weigh: deep LangSmith adoption couples your observability to one framework's ecosystem and one vendor's cloud, with traffic metadata leaving your network as a feature. Reasonable trade for some teams; involuntary for none, ideally.",
      "Crowkis approaches the same traffic from the savings side. The live verdict feed is observability with consequences: each line is a hit that cost nothing, a refusal that protected a user, or a miss that, uniquely, was worth paying for. Top-miss analytics double as a to-do list. And it exports Prometheus and OTel, so your existing dashboards inherit everything.",
      "Trace with whatever delights you. But the chart your CFO wants isn't 'requests observed', it's 'requests eliminated.' Only a cache draws that one.",
    ],
    plain:
      "Observability tells you the story of your spend. Crowkis edits the story so most of the expensive chapters never happen.",
    chart: "repeat-bill",
  },
  {
    slug: "crowkis-vs-cloudflare-ai-gateway",
    title: "Crowkis vs Cloudflare AI Gateway: the edge is the wrong place for trust decisions",
    date: "2026-04-16",
    tag: TAG,
    summary:
      "Cloudflare's gateway adds caching at the CDN layer, exact-match, eventually-evicted, on someone else's network. Useful plumbing; not a reuse brain.",
    paras: [
      "Cloudflare AI Gateway does what Cloudflare does well: put a proxy near your users with analytics, rate limiting, and a cache toggle. The cache is what edge caches are, keyed on exact request bytes, evicted on the edge's schedule, holding your customers' questions and answers in CDN infrastructure you don't control. For static assets that's the whole point. For LLM responses it's three problems wearing a feature's coat.",
      "Exact-match keying means the paraphrase traffic that dominates LLM workloads sails through unmatched. Edge residency means your most sensitive corpus, everything your users ask, is cached outside your network boundary, with whatever multi-tenancy story the edge has that week. And there's no concept of reuse safety: no intent gates, no confidence floor, no poisoning defense. Whatever was stored gets served.",
      "Crowkis runs where your data already lives, behind your own firewall, with the entire trust machinery between storage and serving: five read gates, five write stages, tenant walls, audit trails. Latency is sub-millisecond from local disk, the edge's one advantage evaporates when the cache is in the same rack as the app.",
      "Use Cloudflare for the things edges are for. The decision about whether a cached LLM answer is safe to show a user belongs inside your perimeter, made by an engine that was built to make it.",
    ],
    chart: "write-trust",
  },
  {
    slug: "crowkis-vs-kong-ai-gateway",
    title: "Crowkis vs Kong AI Gateway: plugins are not engines",
    date: "2026-04-13",
    tag: TAG,
    summary:
      "Kong added AI plugins to a great API gateway. A semantic-cache plugin in a proxy is a feature; a semantic cache engine is a product. The difference shows in production.",
    paras: [
      "Kong is excellent infrastructure, if you already run it as your API gateway, its AI plugins give you provider routing and a semantic-cache plugin riding the proxy. The convenience is real. But examine the plugin architecture: the cache logic runs inside the gateway's request lifecycle, backed by external vector and KV stores, doing embed-compare-serve with a threshold. The hard 20%, the part that makes semantic caching production-safe, isn't in a plugin's budget.",
      "That hard 20% is most of Crowkis: intent classes that change reuse rules per query type, structural templates that catch what cosine misses, geometric-mean confidence gating, five-stage write trust with a ledger, cost-aware eviction, freshness with version pinning, cache migration across model upgrades. Plugins wrap; engines decide.",
      "Operationally the split is clean and complementary. Keep Kong at the boundary doing gateway things, auth, routing, rate limits. Point its upstream at Crowkis. Now the proxy proxies and the cache caches, each owned by software whose entire existence is that one job.",
      "The history of infrastructure keeps teaching the same seminar: the checkbox version of a hard problem works until traffic arrives. Caching LLM answers safely is a hard problem. Bring an engine.",
    ],
    venn: {
      left: "Kong AI Gateway",
      overlap: "sits in the\nrequest path",
      leftItems: ["proxy + plugins", "external stores"],
      rightItems: ["one-process engine", "trust + migration"],
      caption: "Gateway at the boundary, engine behind it.",
    },
  },
  {
    slug: "crowkis-vs-diy",
    title: "Crowkis vs building it yourself: a love letter to the repo you'll abandon",
    date: "2026-04-10",
    tag: TAG,
    summary:
      "Every team builds the in-house semantic cache once. The prototype takes a week. The production version takes the year you didn't budget. We know, we budgeted it.",
    paras: [
      "The weekend version is genuinely seductive: an embeddings call, a vector store, a similarity threshold, and a demo that makes everyone clap. We're not going to pretend otherwise, that demo is why Crowkis exists. The distance between that demo and production is the entire product, and it's invisible until users arrive.",
      "Then the real backlog writes itself. Why did it serve a 'pause' answer for a 'cancel' query? (You need intent classes and structural matching.) Why is a hallucination being served to everyone? (You need write-time trust scoring and a ledger.) Why did the cache survive the restart but not the model upgrade? (You need persistence and migration leasing.) Why is tenant B seeing tenant A's answer? (You need isolation as a scored, hard boundary.) Each 'why' is a quarter of engineering.",
      "Crowkis is that backlog, finished: ~33,000 lines of Rust, 347 integration tests, a custom LSM engine, five-gate reads, five-stage writes, four protocol surfaces, a dashboard with receipts. It deploys in five minutes and is free at Community scale, strictly less effort than the prototype, including the clapping.",
      "Build things that differentiate your product. A safe semantic cache differentiates ours. Pull the image, keep your year.",
    ],
    plain:
      "The demo is a weekend. The edge cases are a year. We already spent the year so you can have the weekend back.",
    chart: "read-path",
  },
  {
    slug: "crowkis-vs-redis-langcache",
    title: "Crowkis vs Redis LangCache: when the incumbent validates the category",
    date: "2026-04-07",
    tag: TAG,
    summary:
      "Redis shipping a semantic cache service confirms the problem is real. Their answer is a managed add-on; ours is a from-scratch engine. The difference is in the bones.",
    paras: [
      "When Redis introduced LangCache, the message to the market was clear: exact-match caching genuinely doesn't serve LLM traffic, even by the incumbent's own assessment. Validation appreciated. Their solution bolts semantic matching onto the Redis ecosystem as a managed service, embeddings, similarity search, serve on threshold. Familiar recipe, famous logo.",
      "Bolted-on shows in the architecture. The intelligence is similarity-centric, the known failure mode of which is over-serving near-neighbours that mean different things. The write path trusts what arrives. The deployment is their cloud, holding your customers' question corpus, metered accordingly. None of this is wrong; it's just what retrofit looks like versus design.",
      "Crowkis was born for this single workload: storage engine, vector index, template store, intent classifier, confidence and trust gates all co-designed in one Rust process, self-hosted behind your firewall, flat-priced, offline-licensed. The wire protocol is Redis-compatible, adoption feels identical, but every layer underneath was chosen for safe semantic reuse rather than inherited from a different decade's design goals.",
      "The incumbent entering your category is flattering. Losing to them would require forgetting why specialists exist. The bones are the product; ours were grown for this.",
    ],
    venn: {
      left: "Redis LangCache",
      overlap: "semantic caching\nfor LLM apps",
      leftItems: ["managed add-on", "similarity-led"],
      rightItems: ["purpose-built engine", "self-host · flat"],
      caption: "Retrofit vs born-for-it.",
    },
  },
  {
    slug: "crowkis-vs-semantic-kernel-caching",
    title: "Crowkis vs framework caches: your framework should not own your memory",
    date: "2026-04-04",
    tag: TAG,
    summary:
      "LangChain, LlamaIndex, and Semantic Kernel all offer cache hooks. Framework caches live and die with the framework. Infrastructure shouldn't.",
    paras: [
      "Every LLM framework ships a caching interface, LangChain's llm_cache, LlamaIndex hooks, Semantic Kernel's memory connectors. They're conveniences: in-process, per-framework, backed by whatever store you wire in, with matching as naive as the default embedder. Switch frameworks (teams do, constantly) and your cache strategy resets to zero. That's not memory; that's a session variable with ambitions.",
      "The deeper issue is scope. A framework cache sees one app's traffic. The same question answered in your support bot yesterday gets re-purchased by your docs assistant today, because their caches are strangers. Cache value compounds with shared scope, which is an infrastructure property, not a library import.",
      "Crowkis is framework-agnostic infrastructure: one process serving every app over RESP, gRPC, REST, and MCP, with adapters that plug into LangChain and LlamaIndex in a line. The frameworks keep doing orchestration; the cache outlives them all, accumulating value across every app, agent, and rewrite.",
      "Choose frameworks freely and abandon them guiltlessly, that's what they're for. Put the memory in a layer that doesn't care, and never pay to relearn what your stack already knew.",
    ],
    chart: "drop-in",
  },
  {
    slug: "crowkis-vs-bedrock-caching",
    title: "Crowkis vs AWS Bedrock prompt caching: the cloud's cache serves the cloud",
    date: "2026-04-01",
    tag: TAG,
    summary:
      "Bedrock's caching cuts repeated-prefix costs inside one cloud's model garden. Your cache strategy deserves a longer horizon than a vendor's feature page.",
    paras: [
      "Bedrock prompt caching follows the provider playbook: repeated prompt prefixes within a short window bill cheaper on supported models. Inside an all-in AWS stack it's a sensible discount to collect. But inventory what it is, input-side, prefix-exact, minutes-lived, model-gated, and bound to one cloud's catalog. Four adjectives and a leash.",
      "The strategic cost is the leash. Build your savings around one cloud's caching semantics and you've added gravity to a decision, model choice, that the last two years have proven you'll revisit quarterly. The best model for your workload keeps changing vendors; a cache that can't follow is a sunk cost waiting to be recognized.",
      "Crowkis is deliberately provider-promiscuous: it fronts Bedrock, OpenAI, Anthropic, Gemini, and your local vLLM with the same engine, persists answers durably on your disk, and, at the Enterprise tier, bridges cached answers across providers, so switching models doesn't cold-start your memory. The cache becomes the stable layer in a stack where everything else churns.",
      "Collect every provider discount; they stack with us happily. Just keep the institution's memory in something the institution owns.",
    ],
    plain:
      "Provider caches are loyalty cards. Crowkis is your own wallet, it works in every store, and nobody can cancel it.",
    chart: "migration",
  },
  {
    slug: "crowkis-vs-langchain-in-memory",
    title: "Crowkis vs LangChain InMemoryCache: the default that quietly costs the most",
    date: "2026-03-29",
    tag: TAG,
    summary:
      "One import gives you LangChain's in-memory exact cache. It's the caching equivalent of a sticky note, gone on restart, blind to paraphrase, local to one process.",
    paras: [
      "set_llm_cache(InMemoryCache()) is one line, and one line feels like progress. Here's what the line buys: an exact-match dictionary in one Python process. Restart the pod, deploys do that, and it's empty. Scale to three replicas and each warms its own private copy. Phrase the question differently and it's a miss. It's caching as a gesture.",
      "Gestures have real costs at LLM prices. The cache that forgets on every deploy re-purchases its entire contents continuously. The cache that can't see across replicas multiplies that by your replica count. The cache that needs exact bytes misses the basically-all-of-it fraction of traffic that arrives paraphrased. The line was free; the gaps bill monthly.",
      "Crowkis replaces the gesture with infrastructure and keeps the one-line ergonomics: the SDK's get_or_compute wraps your model call, and behind it sits a shared, durable, semantic, trust-gated engine serving every replica and every app. Survives deploys, matches meaning, refuses poison, shows receipts.",
      "Defaults are for demos. The moment a workload earns replicas, it has earned a real memory. Promotion takes five minutes.",
    ],
    chart: "agent-fanout",
  },
  {
    slug: "crowkis-vs-upstash",
    title: "Crowkis vs Upstash: pay-per-request caching meets the request firehose",
    date: "2026-03-26",
    tag: TAG,
    summary:
      "Serverless Redis with per-request pricing is elegant for occasional workloads. An LLM cache is the opposite of an occasional workload.",
    paras: [
      "Upstash made serverless Redis real: HTTP-friendly, globally replicated, billed per request. For a cron job's state or a low-traffic app's sessions, lovely. But an LLM cache is interrogated on every single user message, it is definitionally your highest-request component. Metered pricing puts your savings layer on a treadmill that speeds up exactly when the savings grow.",
      "Underneath the billing, it's Redis semantics: exact keys, byte matching. The paraphrase problem arrives intact, the hit rate stays near zero on language traffic, and you're now paying per request for the misses too. The economics compound in precisely the wrong direction.",
      "Crowkis flips both axes at once: flat cost (free Community, per-cluster Enterprise, the lookup volume is irrelevant) and semantic matching with safety gates, so the lookups actually land. Self-hosted in one container, your question corpus stays home, and the millionth probe costs what the first did.",
      "Serverless pricing rewards components you rarely call. Caches are components you always call. Match the billing model to the call pattern, and the conclusion writes itself.",
    ],
    venn: {
      left: "Upstash",
      overlap: "easy global\ncaching",
      leftItems: ["per-request meter", "exact keys"],
      rightItems: ["flat cost", "semantic hits"],
      caption: "Always-called components want fixed costs.",
    },
  },
  {
    slug: "crowkis-vs-prompt-dedup-scripts",
    title: "Crowkis vs the dedup script: the cron job that thinks it's a cache",
    date: "2026-03-23",
    tag: TAG,
    summary:
      "Somewhere in your repo is a script that hashes prompts and skips duplicates. It's doing its best. Here's everything it can't see.",
    paras: [
      "The dedup script is folk engineering at its most charming: normalize the prompt, hash it, skip the call if the hash repeats. It catches the easiest tenth of the waste, verbatim repeats inside one process's window, and it does so with a confidence its design cannot justify. Lowercasing and whitespace-stripping is not semantics; 'refund timeline?' and 'how long do refunds take?' hash to different planets.",
      "The script also has no opinion about safety, because hashing has no opinions at all. Whatever response got stored gets replayed: the hallucination, the answer computed for a different tenant, the instruction that was true before Tuesday's pricing change. No confidence floor, no trust history, no freshness, no audit trail when someone asks why.",
      "Crowkis is what the script wishes it were when it grows up: normalization plus templates plus embeddings plus intent classes on the matching side; confidence, trust, tenancy, and TTL policies on the safety side; durability, dashboards, and four protocols on the infrastructure side. The integration is the same size as the script's, one wrapper call.",
      "Retire the cron job with honors. It identified the right problem; it was just never going to be the answer. The answer needed an engine.",
    ],
    plain:
      "Hashing catches questions spelled the same. Real users never spell anything the same. You need matching that survives contact with humans.",
    chart: "read-path",
  },
  {
    slug: "crowkis-vs-chroma",
    title: "Crowkis vs Chroma: the prototype's best friend meets the production path",
    date: "2026-03-20",
    tag: TAG,
    summary:
      "Chroma is wonderful for getting embeddings working before lunch. The qualities that make it great for prototypes are the ones a cache in production can't keep.",
    paras: [
      "Chroma earned its popularity honestly: pip install, three lines, and embeddings work. For notebooks, demos, and small RAG experiments it's the right grab. A production LLM cache, though, asks questions a prototype-first vector store was never built to answer, about durability guarantees under crash, multi-tenant isolation under audit, and write-trust under adversarial traffic.",
      "Even granting the storage layer matures, the category gap remains: a vector store retrieves similar things; a cache decides whether serving them is safe and profitable. Intent-dependent thresholds, structural validation, confidence floors, poisoning pipelines, cost-aware eviction, model-migration leasing, none of this is retrieval, and all of it is the actual job.",
      "Crowkis ships the actual job as one hardened binary: WAL-backed storage that provably survives kill -9, an embedded HNSW index, the full gate stack, and operational receipts in a live dashboard. The deployment is a docker pull, lighter than most prototypes, paradoxically.",
      "Keep Chroma in the notebook where it shines, and let the production path run on machinery that was designed under production assumptions from line one.",
    ],
    chart: "write-trust",
  },
  {
    slug: "crowkis-vs-doing-nothing",
    title: "Crowkis vs doing nothing: the most expensive cache is no cache",
    date: "2026-03-17",
    tag: TAG,
    summary:
      "The default strategy, every query goes to the model, has a precise cost. It's on your invoice, itemized as everything.",
    paras: [
      "Doing nothing is a choice with a price tag. Every production LLM workload we've replayed shows the same shape: a long tail of novel questions and a fat head of repeats, the same intents, rephrased endlessly, each one purchased fresh at full price and full latency. The head is commonly a third to two-thirds of all traffic. That's the doing-nothing tax, compounding monthly.",
      "The tax has a latency component too, and it's arguably crueler: your users wait seconds for answers your system produced yesterday. Speed is a feature users feel on every interaction; paying premium prices to be slow at repetition is a strange position to defend in a roadmap review.",
      "Crowkis exists to make the head of the distribution nearly free: semantic hits in under a millisecond, gated for safety, with the dashboard pricing the savings in real time. The tail still goes to the model, that's what models are for, but the repeats stop billing.",
      "Community edition is free, deployment is five minutes, and the worst case is a pass-through that cost you an afternoon. The status quo charges more than that every day. Few infrastructure decisions are this asymmetric.",
    ],
    plain:
      "You're already paying for a cache, you're just paying the model provider to be one, at a markup of several thousand x per hit.",
    chart: "repeat-bill",
  },
  {
    slug: "crowkis-vs-fine-tuning-for-cost",
    title: "Crowkis vs fine-tuning your way to cheaper inference",
    date: "2026-03-14",
    tag: TAG,
    summary:
      "Fine-tuning a smaller model is a months-long bet on cheaper tokens. Caching is a five-minute bet on zero tokens. One of these compounds weekly.",
    paras: [
      "The fine-tuning cost play goes: distill your workload onto a smaller model, accept slightly worse quality, pocket the per-token spread. Sometimes it's right! But tally the true invoice, data curation, training runs, eval suites, regression monitoring, re-tuning every time the base model or your product shifts. It's a standing engineering program whose savings cap out at the small model's price, which is still a price on every single call.",
      "Caching attacks the same bill from a different axis: the repeated fraction of traffic stops costing anything at all. No training data, no quality trade, the cached answer is the good model's answer, and the 'program' is a docker pull. Savings start the first hour and grow as the corpus warms.",
      "They compose, too, and in the right order: cache first, so you only consider distilling the genuinely novel residue; then Crowkis's Enterprise arbitrage router can send easy residual queries to your small model and hard ones upstream, with the quality bar enforced per intent.",
      "Months of ML engineering or five minutes of deployment, start with the one that pays this week, then decide if you still need the other. Most teams find the residue too small to bother.",
    ],
    chart: "migration",
  },
  {
    slug: "crowkis-vs-the-bigger-context-window",
    title: "Crowkis vs stuffing the context window: memory is not a prompt",
    date: "2026-03-11",
    tag: TAG,
    summary:
      "Million-token contexts tempt teams to ship the whole knowledge base with every call. That's not memory, that's paying to re-read the library daily.",
    paras: [
      "Huge context windows created a seductive anti-pattern: skip retrieval, skip caching, just send everything every time and let the model sort it out. It works, in the sense that a limousine works as a grocery cart. Input tokens bill linearly, latency grows with context, and you're purchasing the same comprehension of the same documents on every single request.",
      "Note what's being recomputed: not just the answer, but the reading. The model re-ingests your unchanged handbook ten thousand times a day. Provider prefix-caching discounts soften this; they don't change its nature. The architecture is 'no memory, infinite re-reading', the most expensive possible implementation of remembering.",
      "Crowkis gives the system actual memory: the answer to a question, once computed from however much context, is stored, gated, and served in under a millisecond to every future paraphrase. Reasoning reuse goes further, recycling the thought-structure for inputs that share its shape. The context window goes back to its real job, novel synthesis, instead of impersonating a database.",
      "Big contexts are a wonderful capability and a terrible default. Memory belongs in a memory layer. Rent the model's attention for new problems only.",
    ],
    plain:
      "Re-sending your docs with every question is like re-reading the manual every time the phone rings. Crowkis writes down the answer the first time.",
    chart: "repeat-bill",
  },
];
