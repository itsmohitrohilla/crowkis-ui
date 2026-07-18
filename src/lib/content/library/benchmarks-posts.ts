import { RoostPost } from "@/lib/content/roost";

/**
 * Benchmark write-ups, authored as full posts (not builder specs) because each
 * one needs its own bar charts. Numbers come from the independent harness in the
 * crowkis-testing-scripts repo, run on a CPU-only laptop against the published
 * Docker image. Ratios matter more than absolutes; every claim here is reproducible.
 */

const TAG = "benchmarks";

export const benchmarkPosts: RoostPost[] = [
  {
    slug: "agent-memory-benchmarks",
    title: "How good is Crowkis agent memory, really? The LoCoMo and LongMemEval numbers",
    date: "2026-06-24",
    readMinutes: 9,
    tag: TAG,
    summary:
      "We ran Crowkis memory against two public, hostile retrieval benchmarks, SNAP's LoCoMo and LongMemEval, on a laptop with no cloud calls. Here are the recall numbers, by question type, with the reranker on and off.",
    blocks: [
      {
        kind: "p",
        text: "Agent memory is easy to demo and hard to measure. Anyone can store a fact and read it back; the real question is whether the right fact surfaces when the question is phrased differently, asked months later, or buried under fifty other sessions. So we stopped trusting our own demos and ran the two benchmarks the memory field actually argues about: SNAP Research's LoCoMo and LongMemEval.",
      },
      {
        kind: "plain",
        text: "Recall@k asks: when the agent searches its memory, does the correct fact show up in the top k results? Higher is better. It's the number that decides whether your agent answers from memory or hallucinates.",
      },
      {
        kind: "p",
        text: "LoCoMo is 10 multi-session dialogues with 1,986 question-answer pairs, each tagged with the exact conversation turns that contain the evidence. It is deliberately nasty: single-hop lookups, temporal reasoning, multi-hop chains, and open-domain questions. Here is Crowkis retrieval recall@10, with the bi-encoder alone versus the bi-encoder plus the bundled cross-encoder reranker.",
      },
      {
        kind: "bars",
        title: "LoCoMo recall@10, with cross-encoder rerank",
        unit: "% recall@10",
        series: [
          { label: "Overall", value: 70.4, accent: true },
          { label: "Single-hop", value: 73.7 },
          { label: "Temporal", value: 71.3 },
          { label: "Multi-hop", value: 67.0 },
          { label: "Open-domain", value: 47.8 },
        ],
        caption:
          "Reranking lifts overall recall from ~25% (bi-encoder only) to 70.4%, roughly a 3× gain.",
      },
      {
        kind: "p",
        text: "That reranker delta is the whole story of why Crowkis memory ships a second model. A bi-encoder embeds the query and the facts independently and compares them, fast, but blunt. The cross-encoder reads the query and each candidate together, which is slower but far sharper; Crowkis runs it only over the top candidates so the cost stays bounded. The result is the difference between a memory that mostly works and one you can build on.",
      },
      {
        kind: "h2",
        text: "LongMemEval: the harder, longer test",
      },
      {
        kind: "p",
        text: "LongMemEval stretches the context to breaking: its hard split averages ~49 sessions and ~500 turns per question. We measured recall@5 by question type, the kinds of recall an actual assistant needs.",
      },
      {
        kind: "bars",
        title: "LongMemEval-S (hard) recall@5 by question type",
        unit: "% recall@5",
        series: [
          { label: "Temporal reasoning", value: 95.5, accent: true },
          { label: "Knowledge update", value: 90.9, accent: true },
          { label: "Single-session user", value: 81.8 },
          { label: "Multi-session", value: 76.2 },
          { label: "Single-session preference", value: 60.0 },
        ],
        caption:
          "84.3% recall@5 on the stratified hard split; 92.7% in oracle mode over 479 focused questions.",
      },
      {
        kind: "p",
        text: "The shape of these numbers is honest and useful. Temporal reasoning and knowledge-update score highest because consolidation is doing its job, when a fact changes, Crowkis retires the old version, so 'what's true now' is a clean lookup. Preference questions score lowest because preferences are subtle and rarely restated; that's the frontier we're working on, and we'd rather show you the 60% than hide it.",
      },
      {
        kind: "quote",
        text: "Every number here was produced on a developer laptop with the bundled ONNX models. Nothing left the machine. No API key was involved.",
      },
      {
        kind: "p",
        text: "That last point is the part that matters for adoption. Hosted memory services post comparable recall, but they read your users' conversations to do it. Crowkis hits these numbers with a self-hosted binary and two small bundled models, which means agent memory is now something you can run in an air-gapped environment, under a compliance regime, or just without wiring your private conversations through someone else's servers.",
      },
    ],
  },
  {
    slug: "latency-profile-where-the-milliseconds-go",
    title: "Where the milliseconds go: an honest latency profile",
    date: "2026-06-16",
    readMinutes: 7,
    tag: TAG,
    summary:
      "A semantic cache hit isn't free, it has to embed your query first. We measured every operation's percentiles so you know exactly what you're paying for, and where the cache engine itself is microsecond-fast.",
    blocks: [
      {
        kind: "p",
        text: "Marketing says 'sub-millisecond cache.' The truth has an asterisk worth understanding, because it tells you exactly when Crowkis is fast and when it isn't. A plain key-value GET, no embedding, no semantics, returns in about a quarter of a millisecond, a true Redis-class drop-in. A semantic CGET is a different animal: before it can search, it has to turn your query into a vector.",
      },
      {
        kind: "bars",
        title: "Operation latency, p50 (v0.2.2, CPU-only laptop)",
        unit: "ms (p50)",
        series: [
          { label: "Plain GET (no embed)", value: 0.26, accent: true },
          { label: "CGET hit", value: 114.5 },
          { label: "CGET miss", value: 114.8 },
          { label: "CSET (store)", value: 118.8 },
        ],
        caption:
          "The ~115 ms on every semantic op is the ONNX embedding cost, not the cache engine, which resolves in microseconds.",
      },
      {
        kind: "plain",
        text: "p50 is the median, half of requests are faster. The embedding step dominates every semantic operation, so a hit and a miss cost almost the same: the work is in understanding the query, not in the lookup.",
      },
      {
        kind: "p",
        text: "Once you see that the embedding is the cost, the optimization writes itself: don't embed what you've already embedded. Crowkis added a micro-cache that remembers recent embeddings, and for exact-repeat queries, which dominate real agent and chatbot traffic, the embedding step disappears entirely.",
      },
      {
        kind: "bars",
        title: "Exact-repeat CGET, before and after the embedding micro-cache",
        unit: "ms",
        series: [
          { label: "Before (re-embed every time)", value: 19.5 },
          { label: "After (micro-cache hit)", value: 0.16, accent: true },
        ],
        caption: "122× faster on the path that real workloads hit most: the same question, again.",
      },
      {
        kind: "p",
        text: "The tail tells the same story honestly. CGET-hit p99 sits at 136 ms, tight, because hits do predictable work. CGET-miss p99 stretches to 347 ms, because a miss occasionally does more work confirming there's nothing to serve. Neither number is a mystery pause; both are the embedding model under load, which is why the micro-cache and, on faster hardware, a GPU embedder move them so dramatically.",
      },
      {
        kind: "quote",
        text: "We publish the p99, not just the p50. A latency claim that only quotes the median is hiding the number that pages you at 3 a.m.",
      },
      {
        kind: "p",
        text: "The practical takeaway: Crowkis is microsecond-fast at being a cache and millisecond-fast at being a semantic one, with the embedding as the dial you can turn, micro-cache for repeats, a stronger embedder host for throughput, or plain KV when you don't need meaning at all. Know which operation you're calling and the latency stops being a surprise.",
      },
    ],
  },
  {
    slug: "the-throughput-ceiling-we-wont-hide",
    title: "The throughput ceiling we won't hide, and the fix",
    date: "2026-06-12",
    readMinutes: 6,
    tag: TAG,
    summary:
      "On v0.2.2, throwing 16 threads at Crowkis got the same throughput as one. That's a real ceiling, we found it in our own harness, and here's both why it happened and how the embedding-deferral work lifts it.",
    blocks: [
      {
        kind: "p",
        text: "Here's a benchmark result most vendors would quietly drop: on v0.2.2, single-threaded semantic throughput was about 9 operations per second, and sixteen threads delivered… about 9 operations per second. A scaling factor of 1.0. We're publishing it because the reason is instructive and the fix is real.",
      },
      {
        kind: "bars",
        title: "Semantic CGET throughput vs thread count (v0.2.2)",
        unit: "ops/sec",
        series: [
          { label: "1 thread", value: 9 },
          { label: "16 threads", value: 9 },
        ],
        caption: "Two bottlenecks stacked: a single-writer actor and a synchronous embed on the hot path.",
      },
      {
        kind: "plain",
        text: "Throughput is how many requests per second the server handles. Scaling means more threads should mean more throughput. A flat line means something is serializing the work, only one thing happens at a time.",
      },
      {
        kind: "p",
        text: "Two things stacked up. First, Crowkis funnels cache decisions through a single-writer actor, a deliberate design that makes correctness and crash-recovery provable, but means writes don't run in parallel. Second, and dominant here, every semantic op ran the ONNX embedding inline, so each thread spent ~115 ms in the same synchronous model call. Sixteen threads waiting on the same serial embed is sixteen threads in a line.",
      },
      {
        kind: "p",
        text: "The fix is to get embedding off the hot path: cache embeddings for repeats and defer the rest so the actor isn't blocked on the model. With that work, exact-repeat throughput jumps from ~51 ops/sec to ~3,550 ops/sec single-threaded, a 70× improvement, and the multi-thread number finally moves above the floor.",
      },
      {
        kind: "bars",
        title: "Single-thread throughput after embedding deferral",
        unit: "ops/sec",
        series: [
          { label: "v0.2.2 (inline embed)", value: 51 },
          { label: "after deferral", value: 3550, accent: true },
        ],
        caption: "70× on the repeat path. The single-writer actor remains the next ceiling to lift.",
      },
      {
        kind: "quote",
        text: "A benchmark you only run to win isn't a benchmark, it's an ad. We run ours to find the ceiling, then we go raise it.",
      },
      {
        kind: "p",
        text: "Concurrent reads against the single-writer actor are the next infrastructure step, and we're honest that distributed throughput is not where Crowkis competes today. For the workload it's built for, agent fan-out and chatbot traffic, where the same handful of questions repeat constantly, the repeat path is the one that matters, and that's the one the deferral work transforms.",
      },
    ],
  },
  {
    slug: "84-of-84-correctness-under-fire",
    title: "84 of 84: correctness and isolation under a hostile harness",
    date: "2026-06-08",
    readMinutes: 6,
    tag: TAG,
    summary:
      "Empty strings, 100 KB values, null bytes, emoji, 16 threads hammering across tenants. The stress harness throws 84 nasty checks at Crowkis and counts the cross-tenant leaks. The leak count is zero.",
    blocks: [
      {
        kind: "p",
        text: "Speed is negotiable; correctness is not. A cache that occasionally serves tenant A's answer to tenant B isn't a fast cache, it's a data breach with good latency. So the harshest part of our harness isn't about performance at all, it's 84 correctness and robustness checks designed to make Crowkis misbehave.",
      },
      {
        kind: "bars",
        title: "Stress harness results (v0.2.2)",
        unit: "checks",
        series: [
          { label: "Checks passed", value: 84, accent: true },
          { label: "Checks failed", value: 0 },
          { label: "Cross-tenant leaks (16 threads)", value: 0 },
        ],
        caption: "Robustness, correctness, concurrency, and benchmark sections, all green.",
      },
      {
        kind: "p",
        text: "The robustness checks feed Crowkis the inputs that break naive servers: empty and whitespace-only queries, 100 KB values, Unicode and emoji, embedded CRLF and null bytes, absurd thresholds, extreme TTLs. None crash it, none corrupt a neighbouring entry. The correctness checks verify the invariants that actually matter: exact round-trips, negative-cache behaviour, pinning, and agent-memory isolation.",
      },
      {
        kind: "plain",
        text: "A cross-tenant leak is when one customer's cached answer is served to another. For a semantic cache it's the cardinal sin, because entries match by meaning, a leak doesn't stay in one cell, it spreads to every similar question.",
      },
      {
        kind: "p",
        text: "The concurrency check is the one we lose sleep over: 16 threads running 60 operations each, deliberately interleaving reads and writes across tenant boundaries, then auditing whether anything crossed. Zero leaks. That result isn't an accident of timing, it's the single-writer actor making races structurally impossible, validated under exactly the load that would expose them.",
      },
      {
        kind: "quote",
        text: "We score ourselves 9 out of 10 on correctness and isolation, and 4 out of 10 on hot-path latency. The point of a brutal scorecard is that you can trust the high numbers because you can see the low ones.",
      },
      {
        kind: "p",
        text: "That honesty is the product. The same harness that returns 84/84 on correctness flags CDEDUP's latency stall and the throughput ceiling without flinching, because a scorecard you can only pass isn't measuring anything. The cache earns the critical path by being boring exactly where boring is the whole job: never the wrong answer, never the wrong tenant.",
      },
    ],
  },
  {
    slug: "the-dedup-stall-we-found-in-our-own-bench",
    title: "The 150-second stall we found in our own benchmark",
    date: "2026-06-04",
    readMinutes: 5,
    tag: TAG,
    summary:
      "CDEDUP works, and at 1,340 vectors it froze the whole server for 150 seconds in our harness. Here's the honest finding, why it happens, and what it means for how you should run dedup.",
    blocks: [
      {
        kind: "p",
        text: "Most of this blog is Crowkis winning. This post is Crowkis losing a benchmark, on purpose, in public, because the harness found a real ceiling and burying it would make every other number less trustworthy.",
      },
      {
        kind: "p",
        text: "CDEDUP runs semantic deduplication: it finds cache entries that mean the same thing and collapses them, reclaiming memory. It works correctly. But on a loaded instance, about 1,340 vectors, it took roughly 150 seconds to complete, and because it runs on the single-writer actor, the entire server was blocked for that whole time. Every other command waited in line behind it.",
      },
      {
        kind: "bars",
        title: "Operator command latency on a loaded instance (v0.2.2)",
        unit: "ms",
        series: [
          { label: "CVECCOUNT", value: 0.4 },
          { label: "CINFO", value: 2.1 },
          { label: "CDEDUP", value: 149687, accent: true },
        ],
        caption: "CVECCOUNT and CINFO are instant; CDEDUP is ~150,000 ms and blocks the actor throughout.",
      },
      {
        kind: "plain",
        text: "The single-writer actor processes one command at a time. That makes correctness easy to prove, but a slow command holds the line, and everything behind it waits.",
      },
      {
        kind: "p",
        text: "The root cause is the same actor design that makes isolation bulletproof: a long-running maintenance command shouldn't share the lane with live traffic. The bounded, batched dedup path improves this, capping how much one pass does, but the honest operational guidance today is simple: treat CDEDUP as scheduled maintenance, run it off-peak, and don't wire it into a hot loop.",
      },
      {
        kind: "quote",
        text: "We scored CDEDUP 3 out of 10 in our own report. A vendor's benchmark that never embarrasses the vendor is a brochure.",
      },
      {
        kind: "p",
        text: "Publishing this costs us a clean scorecard and buys us the thing that actually matters: when we tell you correctness is 9/10 and isolation never leaks, you have a reason to believe it, because you've watched us mark our own homework with a red pen.",
      },
    ],
  },
  {
    slug: "does-the-vector-index-go-cold",
    title: "Does the vector index go cold under churn? We tried to break it",
    date: "2026-05-31",
    readMinutes: 5,
    tag: TAG,
    summary:
      "A v0.2.1 bug let the HNSW index go cold under heavy write-and-flush churn, semantic search silently stopped finding neighbours. Here's the soak test that reproduces it and proves v0.2.2 fixed it.",
    blocks: [
      {
        kind: "p",
        text: "The worst bugs are the silent ones. A crash pages you; a cache that quietly stops finding semantic neighbours just slowly stops saving you money, and nobody notices until the bill arrives. That was the shape of a P0 we hit in v0.2.1: under heavy churn, the HNSW vector index could go 'cold', still up, still answering, but no longer returning the neighbours it should.",
      },
      {
        kind: "p",
        text: "So we wrote a soak test designed to trigger exactly that condition: 24 tenants, 120 operations each, three rounds, roughly 1,200 stores interleaved with flushes, driving the live vector count up past 2,200. Before each round and after the churn, it asks the same similarity question and counts the neighbours found.",
      },
      {
        kind: "bars",
        title: "CSIM neighbours found, through heavy churn (v0.2.2)",
        unit: "neighbours",
        series: [
          { label: "Baseline (before churn)", value: 1 },
          { label: "After ~1,200 ops + flushes", value: 1, accent: true },
        ],
        caption: "The index stayed warm: same neighbour found before and after. P0 fixed in v0.2.2.",
      },
      {
        kind: "plain",
        text: "A 'cold' index is one that has lost track of its vectors, it's running, but semantic search comes back empty. The danger is that nothing errors; you just stop getting hits.",
      },
      {
        kind: "p",
        text: "The fix tied the HNSW index's lifecycle to the store's flush-and-compaction cycle properly, so vectors survive the churn that previously orphaned them. The soak test is now a permanent part of the harness, the bug that hid in silence has a loud, automated witness that runs on every image.",
      },
      {
        kind: "quote",
        text: "The cure for a silent failure is a noisy test. We don't trust the index to stay warm; we make a robot try to freeze it on every build.",
      },
    ],
  },
  {
    slug: "a-million-vectors-on-a-laptop",
    title: "A million vectors on a laptop: the honest vector-search numbers",
    date: "2026-05-26",
    readMinutes: 6,
    tag: TAG,
    summary:
      "Crowkis is a cache with a vector index, not a vector database, but it should still hold up at scale. We indexed 100K and 1M vectors and measured build time, search latency, and recall. Including where dedicated vector DBs still win.",
    blocks: [
      {
        kind: "p",
        text: "Crowkis embeds an HNSW vector index in-process, which raises a fair question: how far does that scale before you'd want a real vector database? We measured it honestly at two sizes, 100,000 and 1,000,000 vectors, on the same CPU-only laptop everything else here ran on.",
      },
      {
        kind: "bars",
        title: "Average search latency by index size",
        unit: "ms",
        series: [
          { label: "100K vectors", value: 9.2, accent: true },
          { label: "1M vectors", value: 94.0 },
        ],
        caption: "Recall@10 was 100% at both sizes, the neighbours it should find, it finds.",
      },
      {
        kind: "p",
        text: "At 100K vectors, comfortably larger than most caches' working sets, search averages 9.2 ms with perfect recall in our test. At 1M, latency rises to 94 ms, still with full recall. Index build throughput holds around 3,000-3,800 vectors per second, so a million vectors indexes in a few minutes.",
      },
      {
        kind: "plain",
        text: "Recall@10 of 100% means every query in the test found its correct nearest neighbours in the top ten. Latency is how long one search takes; it grows with the index, as expected.",
      },
      {
        kind: "p",
        text: "Now the honest part. These are beta-quality proof points, not a challenge to Qdrant, Pinecone, or Weaviate. Dedicated vector databases lead decisively on raw scale, on operational maturity, and on the billion-vector workloads they're built for. Crowkis's in-process index earns its place by removing a network hop for cache-sized working sets, millions, not billions, where keeping vectors beside the cache engine buys the sub-millisecond read path.",
      },
      {
        kind: "quote",
        text: "Use the right tool. Crowkis is a semantic cache that happens to search vectors well at cache scale, not a vector DB pretending to be a cache.",
      },
      {
        kind: "p",
        text: "If your working set is a few million entries and you want them next to the cache that uses them, the in-process index is a feature. If you're indexing a billion documents for retrieval, that's a vector database's job, and Crowkis will happily sit in front of it as the cache. Knowing which problem you have is the whole decision.",
      },
    ],
  },
];
