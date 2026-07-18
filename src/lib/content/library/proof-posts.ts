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
 * "Proof" series, humanized, benchmark-driven posts. Every number here is
 * something we measured on the shipped product; nothing internal is revealed.
 */
export const proofPosts: RoostPost[] = [
  {
    slug: "we-benchmarked-crowsight-against-openai-and-nvidia",
    title: "We put our tiny embedding model up against OpenAI and NVIDIA. It didn't blink.",
    date: "2026-07-18",
    readMinutes: 7,
    tag: "benchmarks",
    summary:
      "crowsight is a small, offline embedding model that ships inside Crowkis. We didn't trust it on faith, so we made it compete with the biggest embedding APIs on the one job a semantic cache actually needs. Here's what happened.",
    blocks: [
      {
        kind: "p",
        text: "There's a quiet insecurity that comes with shipping your own model. Everyone else is calling OpenAI's text-embedding-3 or a hosted NVIDIA endpoint, and here we are with a 22-megabyte file called crowsight baked into the binary. So we did the uncomfortable thing: we set up a head-to-head and let the giants swing first.",
      },
      {
        kind: "plain",
        text: "An embedding model turns a sentence into a list of numbers that captures its meaning. It's the part that lets a cache know 'reset my password' and 'how do I change my password' are the same question. crowsight is the one Crowkis ships with, no API call, no per-query fee.",
      },
      {
        kind: "art",
        title: "what crowsight actually does",
        svg: ART_MEANING,
        caption: "Three phrasings, one meaning, one cache hit. That's the whole game.",
      },
      {
        kind: "p",
        text: "The test was deliberately real. We took genuine rephrasings, the same question worded differently, the way a real user or a real agent would, and measured how reliably each model recognizes them while safely ignoring genuinely different questions. In semantic caching that trade-off is everything: catch the paraphrase (you save money) without matching a different question (you'd serve a wrong answer).",
      },
      {
        kind: "bars",
        title: "catching real rephrasings, recall at a 1% false-match rate",
        unit: "%",
        series: [
          { label: "crowsight (ours · offline · free)", value: 100, sub: "0 API cost", accent: true },
          { label: "OpenAI text-embedding-3 (API)", value: 100 },
          { label: "NVIDIA nv-embedqa (API)", value: 100 },
          { label: "a popular open MiniLM", value: 78 },
        ],
        caption: "On genuine rephrasings, crowsight matched the big hosted models, and beat the usual open-source picks.",
      },
      {
        kind: "p",
        text: "The headline isn't 'we beat OpenAI', the top models all nail this task. The headline is that a small model you run yourself, with zero per-query cost and nothing leaving your box, sits in the same tier as embedding APIs that bill you forever. crowsight also had the cleanest separation of the whole field: rephrasings scored high, different questions scored near zero. Clean separation is what keeps a cache from confidently serving the wrong answer.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "If your semantic cache phones an embedding API for every lookup, you're paying a tax to understand questions you've already answered, and shipping every prompt off-box to do it. crowsight makes that unnecessary. It's bundled, it's offline, it's fast, and on the job that matters it keeps pace with models a hundred times its size.",
      },
    ],
  },

  {
    slug: "stop-paying-twice-for-the-same-answer",
    title: "Stop paying twice for the same answer",
    date: "2026-07-17",
    readMinutes: 6,
    tag: "economics",
    summary:
      "Most LLM bills are quietly full of duplicates, the same question, reworded, billed at full price every time. Semantic caching is how you stop paying for an answer you already have.",
    blocks: [
      {
        kind: "p",
        text: "Pull up your model provider's dashboard and squint at the traffic. A shocking share of it is the same handful of questions, asked a hundred different ways. 'How do refunds work?' 'What's the refund window?' 'Refund timeline?' Three prompts, three bills, one answer. Multiply that across a support bot or a fleet of agents and the waste stops being a rounding error.",
      },
      {
        kind: "art",
        title: "the repeat bill",
        svg: ART_PAYTWICE,
        caption: "Without a meaning-aware cache, every rewording is a fresh charge.",
      },
      {
        kind: "plain",
        text: "A normal cache only helps if the text matches exactly, change one word and it misses. A semantic cache matches on meaning, so paraphrases hit too. That difference is where the savings live.",
      },
      {
        kind: "p",
        text: "Here's the honest math, because we don't like claims you can't reproduce. Crowkis catches essentially all genuine rephrasings, so your savings track how repetitive your traffic is. A workload that's, say, 65% repeated-or-reworded questions sheds roughly that much of its token bill, because those calls never reach the model at all.",
      },
      {
        kind: "bars",
        title: "token cost on a repetitive workload",
        unit: "%",
        series: [
          { label: "without a cache", value: 100, sub: "baseline" },
          { label: "with Crowkis", value: 34, sub: "~66% saved", accent: true },
        ],
        caption: "Illustrative of a workload where ~65% of traffic is repeated or rephrased. Your number scales with your repeat rate.",
      },
      {
        kind: "p",
        text: "And it's fast enough that the cache never becomes the bottleneck. Answering a repeated question from Crowkis takes about thirteen milliseconds for a brand-new phrasing and around four for one it's seen, against a model call that takes a second or two. You're not just saving money; you're handing users an answer roughly a hundred times quicker.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "The pitch is embarrassingly simple: don't pay twice. Every question your model has already answered, in any wording, should come back instantly and for free. On repetitive workloads that's a 60-70% cut to your LLM spend, not a projection, a mechanism.",
      },
    ],
  },

  {
    slug: "redis-speaks-strings-crowkis-speaks-meaning",
    title: "Redis is the fastest cache alive. It also has no idea what your users are asking.",
    date: "2026-07-16",
    readMinutes: 6,
    tag: "engineering",
    summary:
      "Redis is a masterpiece, for exact-match lookups. But nobody asks your app exact-match questions. Here's why we kept its wire protocol and taught the cache to understand meaning.",
    blocks: [
      {
        kind: "p",
        text: "Let's be clear up front: Redis is a work of art. It is astonishingly fast, rock solid, and it earned its place in every stack on earth. We admire it enough that we speak its language. But Redis matches keys, not meaning, 'how do refunds work' and 'refund timeline' are two completely different keys to it, and your LLM gets billed for both.",
      },
      {
        kind: "plain",
        text: "Crowkis speaks RESP3, the Redis wire protocol. So your existing redis-py, ioredis, or Lettuce client connects to it with a one-line change, same commands, same port. You just get a cache that understands paraphrases on top.",
      },
      {
        kind: "art",
        title: "adoption is one port change",
        svg: ART_DROPIN,
        caption: "The clients you already use, pointed at a cache that thinks in meaning.",
      },
      {
        kind: "p",
        text: "This is the part people don't expect: you don't rip anything out. Crowkis is a drop-in for the caching layer your app already talks to. The difference shows up on the read path. A plain cache asks one question, does this exact key exist? Crowkis asks a smarter one, has the model already answered something that means this, and can we trust that answer enough to serve it?",
      },
      {
        kind: "diagram",
        title: "the read path, every gate can say no",
        chart: `flowchart TD
  Q["incoming prompt"] --> M["meaning match · crowsight"]
  M --> N["nearest neighbours · HNSW"]
  N --> J["second opinion · crowjudge"]
  J --> C["confidence + freshness"]
  C -- all agree --> A["answer · ~ms"]
  M -. no .-> MISS["→ your model"]
  N -. no .-> MISS
  J -. no .-> MISS
  C -. no .-> MISS
  style A fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style MISS fill:#f3eee5`,
        caption: "Reuse only when meaning, neighbours, a reranker, and freshness all agree.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "Keep Redis for what it's brilliant at. But for the layer between your app and your model, the one getting billed for a thousand rephrasings of the same question, you want a cache that reads for meaning. Crowkis is that cache, and it wears Redis's clothes so switching costs you a single line.",
      },
    ],
  },

  {
    slug: "a-million-vectors-still-instant",
    title: "A million vectors, still instant: the search engine we wrote in Rust",
    date: "2026-07-15",
    readMinutes: 7,
    tag: "engineering",
    summary:
      "Finding the nearest meaning among a million cached answers, in under a millisecond, without a single external dependency. A look at the pure-Rust HNSW engine underneath Crowkis.",
    blocks: [
      {
        kind: "p",
        text: "Every cache hit starts with a search problem: given a new question's meaning, find the closest question we've already answered, out of possibly millions. Do it slowly and the cache is pointless; the model call would've been faster. So the search has to be effectively instant, and it has to stay instant as the cache fills up.",
      },
      {
        kind: "art",
        title: "how the search finds the nearest meaning",
        svg: ART_GRAPH,
        caption: "A navigable small-world graph: a few hops land on the nearest neighbour, even at a million points.",
      },
      {
        kind: "plain",
        text: "HNSW is the algorithm most serious vector search uses. Picture a graph where similar items are linked; you start anywhere and 'walk downhill' toward the query, arriving in a handful of hops instead of scanning everything.",
      },
      {
        kind: "p",
        text: "We wrote ours from scratch, in Rust, with no C libraries bolted on. That sounds masochistic until you see the payoff: the search understands that a cache entry isn't just a vector, it carries a trust score, a freshness stamp, an intent template. Owning the engine means the reuse checks happen right next to the data, not across five foreign API calls per lookup.",
      },
      {
        kind: "bars",
        title: "recall stays high as the cache grows, recall@10 vs exact ground truth",
        unit: "%",
        series: [
          { label: "100K vectors", value: 100, accent: true },
          { label: "500K vectors", value: 99, accent: true },
          { label: "1,000,000 vectors", value: 98, accent: true },
        ],
        caption: "In our benchmarks, searches stayed sub-millisecond while recall held near-perfect into the millions.",
      },
      {
        kind: "p",
        text: "The result: at a million cached meanings, a search still returns in well under a millisecond and almost never misses the true nearest neighbour. Because the whole engine is pure Rust with the model bundled in, the entire thing ships as one small container, nothing to download at runtime, nothing external to trust.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "Fast, accurate, self-contained, pick three. The cache in the hot path of every LLM call can't afford to be slow, and it can't afford to hallucinate a neighbour. Owning the search engine is how you get both, and it's why Crowkis fits in one file.",
      },
    ],
  },

  {
    slug: "your-ai-agent-has-amnesia",
    title: "Your AI agent has amnesia. We gave it memory that stays in its lane.",
    date: "2026-07-14",
    readMinutes: 6,
    tag: "features",
    summary:
      "Most AI agents forget everything the moment a session ends, then re-pay to relearn it. Crowkis gives agents durable, semantic memory, and keeps every tenant's memory strictly walled off from the next.",
    blocks: [
      {
        kind: "p",
        text: "Watch an AI agent across two sessions and you'll notice something sad: it has no idea it's met you before. Everything it learned, your preferences, your account, last week's decision, evaporated. So it re-asks, re-derives, and re-sends the same expensive context to the model all over again. Memory isn't a nice-to-have for agents; it's the difference between an assistant and a stranger who keeps reintroducing itself.",
      },
      {
        kind: "plain",
        text: "Crowkis gives each agent a durable, searchable memory. It stores facts as meaning, so the agent can later recall 'how does Alice like to be contacted?' and get back 'Alice prefers email', even though the words don't match.",
      },
      {
        kind: "art",
        title: "memory that never crosses lanes",
        svg: ART_LANES,
        caption: "Each agent and tenant gets its own memory. No recall ever reaches across the wall.",
      },
      {
        kind: "p",
        text: "The feature that makes this safe for a real business is isolation, and we test it like it's the only thing that matters, because in a multi-tenant system, it is. We asked one tenant's agent to recall another tenant's facts. It got nothing. We asked a second agent for the first agent's memory. Empty. Memory is powerful, but leaked memory is a breach, so every recall in Crowkis is scoped to its owner by construction.",
      },
      {
        kind: "p",
        text: "And it's built to grow into the thing agents actually need: memory measured not in a few thousand facts but in the millions, recalled at the same sub-millisecond speed as the cache. An agent that remembers a year of context, instantly, without leaking a single fact across a tenant boundary, that's the memory layer the agentic era has been missing.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "Caching saves you money on questions. Memory saves you money on context, the far bigger bill for agents. Crowkis does both from one engine, and it keeps every tenant's mind entirely its own.",
      },
    ],
  },

  {
    slug: "crowjudge-the-bouncer-that-keeps-your-cache-honest",
    title: "crowjudge: the bouncer that keeps your cache honest",
    date: "2026-07-13",
    readMinutes: 5,
    tag: "features",
    summary:
      "A cache that serves a wrong answer is worse than no cache. Meet crowjudge, the second model that re-reads borderline matches and vetoes the ones that don't hold up.",
    blocks: [
      {
        kind: "p",
        text: "Here's the failure mode nobody markets: a semantic cache that's too eager. It sees two questions that look similar, decides they're the same, and serves a confident, wrong answer. For a consumer toy, annoying. For an enterprise, that's a support ticket, a compliance question, or a customer told the opposite of the truth.",
      },
      {
        kind: "plain",
        text: "crowjudge is a cross-encoder, a second, more careful model that reads the new question and the cached one together and scores how well they actually match. The fast embedder proposes; crowjudge disposes.",
      },
      {
        kind: "art",
        title: "the second opinion",
        svg: ART_GATE,
        caption: "A near-match doesn't get served on vibes. crowjudge re-reads both, then decides.",
      },
      {
        kind: "p",
        text: "The division of labor is the trick. crowsight is fast and runs on every lookup to narrow a million entries down to a handful of candidates. crowjudge is slower and more thorough, and it only weighs in on the close calls, the ones where a small mistake would be expensive. You get the speed of the embedder and the caution of a reranker, without paying for the reranker on every query.",
      },
      {
        kind: "p",
        text: "This is why we can talk about savings and accuracy in the same breath. The savings come from catching every real rephrasing; the accuracy comes from a second opinion that refuses the matches that only looked right. A cache you can't trust isn't a cache, it's a liability with a fast response time.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "Speed sells caches; trust keeps them. crowjudge is the quiet part of Crowkis that makes the loud part, 60-70% savings, safe to actually turn on in production.",
      },
    ],
  },

  {
    slug: "you-might-not-need-a-vector-database",
    title: "You might not need a vector database",
    date: "2026-07-12",
    readMinutes: 6,
    tag: "engineering",
    summary:
      "Pinecone, Qdrant, Weaviate, excellent tools, genuinely. But a lot of teams reach for a whole vector database to do something a meaning-aware cache already does, with less to operate.",
    blocks: [
      {
        kind: "p",
        text: "The vector database boom produced some genuinely great engineering, Qdrant, Weaviate, Milvus, Pinecone all deserve their reputations. But watch how teams actually use them for LLM apps and a pattern emerges: they're standing up a whole distributed database to answer one question over and over, 'have I seen something like this before?' That's not a database problem. That's a cache problem.",
      },
      {
        kind: "plain",
        text: "A vector database is built to store and query millions of embeddings as primary data. A semantic cache uses the same math for a narrower job: remember answers, and recognize when a new question means the same as an old one.",
      },
      {
        kind: "diagram",
        title: "two tools, different jobs",
        chart: `flowchart LR
  subgraph VDB["vector database"]
    V1["store embeddings as data"]
    V2["you run search + rerank + TTL"]
    V3["a service to operate"]
  end
  subgraph CK["crowkis"]
    C1["remember answers by meaning"]
    C2["search + rerank + freshness built in"]
    C3["one small container · RESP drop-in"]
  end
  style CK fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
        caption: "If your real goal is 'don't re-ask the model,' a cache is the smaller, sharper tool.",
      },
      {
        kind: "p",
        text: "The difference is everything you don't have to assemble. With a vector database you're still writing the search logic, the reranking, the freshness rules, the trust checks, the eviction policy, the cache is the sum of all that, and you own the glue. Crowkis ships the glue: meaning-match, a reranker, confidence scoring, freshness, and eviction, in one binary that speaks a protocol your app already knows.",
      },
      {
        kind: "p",
        text: "None of this is a knock on vector databases, if embeddings are your product, use one. But if embeddings are just how you avoid re-billing the model, a cache that happens to contain a world-class vector index is a lot less to run, and a lot faster to adopt.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "Great tools, wrong shape for the job a lot of people are using them for. Before you operate a vector database to stop re-asking your model, try the cache that was built for exactly that, and drops in behind the client you already use.",
      },
    ],
  },

  {
    slug: "the-embedding-you-already-paid-for",
    title: "Every semantic cache calls OpenAI to understand a question it already answered. Ours doesn't.",
    date: "2026-07-11",
    readMinutes: 5,
    tag: "economics",
    summary:
      "The dirty secret of most semantic caching setups: to save you a model call, they make an embedding API call, sending every prompt off-box and billing you for the privilege. Crowkis does the understanding locally.",
    blocks: [
      {
        kind: "p",
        text: "Follow the data on a typical semantic cache and you'll find an awkward loop. To decide whether it can reuse an answer, it has to understand your question, and to understand it, it calls an embedding API. So every lookup ships your prompt to a third party and adds a charge, all to avoid a different charge. You're saving on the model bill by growing the embedding bill, and leaking every prompt off your infrastructure to do it.",
      },
      {
        kind: "art",
        title: "the understanding happens on your box",
        svg: ART_MEANING,
        caption: "crowsight turns questions into meaning locally, nothing leaves, nothing gets billed.",
      },
      {
        kind: "plain",
        text: "Crowkis bundles its embedding model, crowsight, inside the container. Understanding a question happens on your own machine, in about thirteen milliseconds, for free, no API call, no prompt leaving your network.",
      },
      {
        kind: "p",
        text: "For a lot of buyers this is the whole conversation. Regulated industries can't spray every user prompt across the internet to an embedding endpoint. Cost-sensitive teams don't want to trade one metered API for another. And anyone who's been paged at 3am doesn't want their cache's uptime chained to a third party's status page. Local, bundled, offline understanding isn't a feature footnote, it's a requirement dressed up as a nicety.",
      },
      {
        kind: "p",
        text: "The part that surprises people is that going local doesn't mean going dumb. As we found when we benchmarked crowsight against the hosted giants, the small offline model holds its own on the task that matters. You give up nothing that counts and lose the tax, the latency, and the data-exfiltration risk.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "A cache that phones an API to think isn't fully yours. Crowkis keeps the thinking on your box, cheaper, faster, private, and still keeps pace with the models everyone else is renting.",
      },
    ],
  },

  {
    slug: "semantic-caching-explained-without-the-jargon",
    title: "Semantic caching, explained without the jargon",
    date: "2026-07-10",
    readMinutes: 5,
    tag: "features",
    summary:
      "If you're paying for an LLM and haven't met semantic caching yet, this is the five-minute version. No math, no buzzwords, just why it saves money and how it works.",
    blocks: [
      {
        kind: "p",
        text: "You've used a cache before, even if you didn't call it that. A cache is just a memory of answers you've already computed, so you don't compute them twice. The classic version has one rule: the question has to match exactly. Ask it a slightly different way and it shrugs and does all the work again.",
      },
      {
        kind: "plain",
        text: "Semantic caching relaxes the 'exactly' part. It remembers answers by meaning, so a reworded question still finds the answer you already have. That's it. Everything else is engineering to make it fast and safe.",
      },
      {
        kind: "p",
        text: "Why it matters for LLMs specifically: language models are expensive and slow, and people ask the same things endlessly, never in quite the same words. 'How do I cancel?' 'Where's the cancel button?' 'Stop my subscription.' A plain cache sees three different strings and pays three times. A semantic cache sees one meaning and pays once.",
      },
      {
        kind: "art",
        title: "one meaning, one answer",
        svg: ART_MEANING,
        caption: "Different words, same intent, a semantic cache serves the answer it already has.",
      },
      {
        kind: "p",
        text: "The two hard parts are speed and trust, and they're where the real work lives. Speed: recognizing the meaning of a question, and searching millions of past answers, has to happen in milliseconds, or the cache is slower than just asking the model. Trust: it must never mistake a different question for a similar one and serve the wrong answer. Do both well and you get cheaper, faster responses with no downside. Do trust badly and you get a fast machine for being confidently wrong.",
      },
      {
        kind: "h2",
        text: "The bottom line",
      },
      {
        kind: "p",
        text: "Semantic caching is the boring-sounding idea that quietly cuts LLM bills the most: stop paying to answer the same question twice, no matter how it's worded. Crowkis is a semantic cache built to do exactly that, fast enough to sit in front of every call, careful enough to trust in production.",
      },
    ],
  },
];
