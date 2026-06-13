export type RoostBlock =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "code"; title?: string; code: string }
  | { kind: "diagram"; title: string; chart: string; caption?: string }
  | {
      kind: "venn";
      title: string;
      left: string;
      right: string;
      overlap: string;
      leftItems?: string[];
      rightItems?: string[];
      caption?: string;
    }
  | { kind: "plain"; text: string }
  | { kind: "quote"; text: string };

export type RoostPost = {
  slug: string;
  title: string;
  date: string;
  readMinutes: number;
  tag: string;
  summary: string;
  blocks: RoostBlock[];
};

export const roostPosts: RoostPost[] = [
  {
    slug: "why-we-wrote-our-own-lsm-tree",
    title: "Why we wrote our own LSM tree instead of bolting onto RocksDB",
    date: "2026-05-18",
    readMinutes: 11,
    tag: "engineering",
    summary:
      "Every sane checklist says don't write your own storage engine. We did it anyway. Here's the actual reasoning, the architecture, and the parts that were painful.",
    blocks: [
      {
        kind: "p",
        text: "The standard advice is correct: do not write your own storage engine. RocksDB exists, it is battle-tested, and the people who built it are smarter about compaction than you will ever need to be. We started there too.",
      },
      {
        kind: "plain",
        text: "If you're not a database person: a storage engine is the part of a system that decides how data physically lands on disk and how it's found again. Most products borrow one off the shelf. We built ours, and this post is the why.",
      },
      {
        kind: "p",
        text: "The problem is that a semantic LLM cache is not a generic key-value workload. Every entry carries an embedding, a structural template hash, an intent class, a confidence history, and a trust score. The interesting reads are not 'get key' — they are 'find the neighbours of this vector, then check whether their templates agree, then check their trust ledger entries.' With a generic engine, every one of those becomes a separate lookup with its own serialization boundary.",
      },
      {
        kind: "h2",
        text: "The shape of CrowkisDB",
      },
      {
        kind: "p",
        text: "CrowkisDB is a deliberately small LSM tree. Writes land in a write-ahead log first — that's the crash-safety guarantee — then in an in-memory table that flushes to sorted, compressed files on disk once it reaches 64 MB. A three-level compactor folds those files together in the background. The HNSW vector index lives beside the tree and persists with it.",
      },
      {
        kind: "diagram",
        title: "the write path",
        chart: `flowchart TD
  W["client write — CSET"] --> WAL["write-ahead log<br/>crash-safe append · CRC32 per record"]
  WAL --> MT["MemTable<br/>sorted, in-memory"]
  MT -- "flush at 64 MB" --> SST["SSTables — L0 → L1 → L2<br/>LZ4 blocks · bloom filters ~1% FP"]
  W --> HNSW["HNSW vector index<br/>persists with the store"]`,
        caption: "One write, three durable destinations — log, tree, vector index.",
      },
      {
        kind: "h2",
        text: "Why owning the engine pays",
      },
      {
        kind: "p",
        text: "Owning the engine means the scoring pipeline reads index data without crossing a serialization boundary, and compaction understands that an entry's value includes its vector. The read path can interleave the five reuse checks with storage lookups instead of round-tripping a foreign API five times per query.",
      },
      {
        kind: "diagram",
        title: "the read path — five gates, every one can veto",
        chart: `flowchart TD
  Q["query: 'how long do refunds take?'"] --> I["intent classifier"]
  I -- factual --> T["template match"]
  T -- "refunds + ‹DURATION›" --> V["HNSW neighbours"]
  V -- "3 candidates" --> C["confidence gate ≥ 0.88"]
  C -- "0.94 — pass" --> TR["trust + freshness"]
  TR -- pass --> A["answer · 0.4 ms"]
  I -. veto .-> M["(nil) → your model"]
  T -. veto .-> M
  V -. veto .-> M
  C -. veto .-> M
  TR -. veto .-> M
  style A fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style M fill:#f3eee5`,
        caption: "All local, all sub-millisecond — a miss costs almost nothing.",
      },
      {
        kind: "p",
        text: "It also means our test suite covers crash recovery on our own WAL format. Of the 347 integration tests in the suite, the deepest coverage sits exactly here: WAL replay, flush correctness, compaction invariants, write batches, and HNSW persistence across restarts.",
      },
      {
        kind: "h2",
        text: "The honest costs",
      },
      {
        kind: "p",
        text: "It was not free. We spent weeks on problems RocksDB solved a decade ago — manifest atomicity, bloom filter tuning, compaction scheduling. The discipline that made it survivable was ruthless scope-cutting: three levels, not seven; one compaction strategy, not five; and a written invariant list that every storage PR is checked against.",
      },
      {
        kind: "quote",
        text: "We would not recommend this path to anyone who can express their workload in a generic engine. We couldn't, and that's the whole story.",
      },
      {
        kind: "p",
        text: "The payoff shows up in the numbers users actually feel: cache hits served from a single process in well under a millisecond, no GC pauses because there's no garbage collector, and a binary you can drop on a laptop or an air-gapped server with zero external dependencies.",
      },
    ],
  },
  {
    slug: "cache-poisoning-is-the-whole-problem",
    title: "Cache poisoning is the whole problem",
    date: "2026-04-30",
    readMinutes: 9,
    tag: "security",
    summary:
      "Semantic caching has an obvious failure mode nobody likes to talk about: one bad write, served forever to everyone nearby. This is how Crowkis decides what to trust.",
    blocks: [
      {
        kind: "p",
        text: "Here is the uncomfortable math of semantic caching. A normal cache serves a bad entry to exactly the requests that match its key. A semantic cache serves a bad entry to every request that lands near it in embedding space. Poison doesn't sit in one cell — it radiates.",
      },
      {
        kind: "diagram",
        title: "the blast radius of one bad entry",
        chart: `flowchart LR
  subgraph EX["exact-match cache"]
    K["☠ one poisoned key"] --> V1["one victim"]
  end
  subgraph SC["semantic cache, unguarded"]
    P["☠ one poisoned entry"] --> N1["every paraphrase"]
    P --> N2["every near-neighbour"]
    P --> N3["every 'similar enough' query"]
  end
  style P fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style K fill:#f3eee5`,
        caption: "Semantic reach is the feature — and, untreated, the vulnerability.",
      },
      {
        kind: "plain",
        text: "In plain words: a smart cache that matches by meaning will also spread a wrong answer by meaning. If one bad response gets in, everyone who asks anything similar gets it back. That's why write-time defense matters more than read-time speed.",
      },
      {
        kind: "p",
        text: "And LLM systems produce bad writes constantly. Hallucinations. Prompt injections that smuggle instructions into what looks like an answer. A response computed for tenant A that would be a data leak if tenant B ever saw it. If your cache trusts every write, your cache is an amplifier for your worst outputs.",
      },
      {
        kind: "h2",
        text: "Five stages, every write",
      },
      {
        kind: "diagram",
        title: "the write-trust pipeline",
        chart: `flowchart TD
  W["candidate write"] --> S1["stage 1 · coherence — does the answer fit the question? · weight 0.30"]
  S1 --> S2["stage 2 · content heuristics · weight 0.10"]
  S2 --> S3["stage 3 · source trust — ledger history · weight 0.30"]
  S3 --> S4["stage 4 · tenant isolation · weight 0.15"]
  S4 --> S5["stage 5 · neighbourhood agreement · weight 0.15"]
  S5 --> G{"composite ≥ 0.75?"}
  G -- yes --> OK["accepted into the cache"]
  G -- no --> NO["refused + trust-ledger entry"]
  style OK fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style NO fill:#f3eee5`,
        caption: "Weighted, not unanimous — but heavily tilted toward coherence and history.",
      },
      {
        kind: "p",
        text: "The two heavyweights are coherence and source trust, and that's deliberate. Coherence catches injected content that doesn't actually answer the question. Source trust means a writer that produced garbage before has to earn its way back — every accept and refuse lands in an append-only ledger, so trust has memory.",
      },
      {
        kind: "h2",
        text: "Trust has memory",
      },
      {
        kind: "code",
        title: "trust ledger, conceptually",
        code: `2026-04-29T14:02:11  writer=svc-support  ACCEPT  composite=0.91
2026-04-29T14:02:38  writer=svc-support  ACCEPT  composite=0.88
2026-04-29T14:03:02  writer=ext-webhook  REFUSE  stage=1 coherence=0.31
2026-04-29T14:03:05  writer=ext-webhook  REFUSE  stage=3 trust=0.22
# ext-webhook now faces a higher bar on every future write`,
      },
      {
        kind: "quote",
        text: "A cache that can't say no isn't infrastructure. It's a liability with a hit rate.",
      },
      {
        kind: "h2",
        text: "Refusal is a feature you can see",
      },
      {
        kind: "p",
        text: "Blocked writes show up in the dashboard's live feed with the stage that vetoed them, and the rejection counters break down by stage so you can see what kind of poison your system actually attracts. That visibility matters more than it sounds: the first question every operator asks about a safety system is 'what is it actually doing?' — and the answer should never be 'trust us.'",
      },
      {
        kind: "p",
        text: "Tenant isolation deserves the last word. It isn't only an access-control rule at read time — it's a scored stage at write time. An entry that smells like it crossed a tenant boundary doesn't get a chance to be mis-served later, because it never enters the cache at all.",
      },
    ],
  },
  {
    slug: "how-crowkis-earned-production",
    title: "How Crowkis earned the right to sit in your critical path",
    date: "2026-06-02",
    readMinutes: 8,
    tag: "engineering",
    summary:
      "347 integration tests, a smoke suite that kills the process on purpose, and a Docker image hardened before anyone asked. The receipts behind 'production-ready.'",
    blocks: [
      {
        kind: "p",
        text: "Infrastructure earns trust one boring proof at a time. This post is the receipts: what we test, what we break on purpose, and what ships hardened by default — so 'production-ready' is a claim you can audit rather than a vibe.",
      },
      {
        kind: "h2",
        text: "The test pyramid is bottom-heavy on purpose",
      },
      {
        kind: "diagram",
        title: "where the 347 tests live",
        chart: `flowchart TD
  SMOKE["smoke suite — end to end<br/>RESP + gRPC + auth + restart durability"]
  MID["semantic cache · 13 — vector index · 16 — stress · 18"]
  BASE["kv operations · 64 — db engine · 37<br/>WAL replay, flush, compaction, batches"]
  SMOKE --> MID --> BASE
  style BASE fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
        caption: "The further down the stack a bug could hide, the more tests sit on top of it.",
      },
      {
        kind: "plain",
        text: "In plain words: the part of Crowkis that holds your data is the most-tested part of Crowkis. The flashy features sit on top of a foundation that gets hammered hardest.",
      },
      {
        kind: "h2",
        text: "We kill it on purpose",
      },
      {
        kind: "p",
        text: "The smoke suite doesn't just check happy paths. It writes data, kills the container, restarts it, and verifies every entry survived — WAL replay proven end to end, not assumed. It checks that unauthenticated management reads bounce when auth is on, that migration leases hold across restarts, and that gRPC and RESP agree about the same cache.",
      },
      {
        kind: "code",
        title: "the durability drill, abbreviated",
        code: `CSET "k1" "v1" ... → OK
docker kill crowkis            # no graceful shutdown
docker start crowkis
CGET "k1"                      # → "v1" or the gate fails
curl -i :6380/api/metrics      # unauthenticated → rejected`,
      },
      {
        kind: "h2",
        text: "Hardened because defaults are destiny",
      },
      {
        kind: "p",
        text: "Most security incidents in self-hosted software are default-configuration incidents. So the stock deployment is the hardened one: non-root user, read-only filesystem, every Linux capability dropped, no-new-privileges, pids limit, localhost-only published ports, and a health endpoint wired into the image. If you expose Crowkis past loopback without auth configured, it locks the management plane rather than opening it — misconfiguration fails closed.",
      },
      {
        kind: "diagram",
        title: "what's actually in the image",
        chart: `flowchart LR
  subgraph IMG["crowkis/crowkis:latest"]
    B["/usr/local/bin/crowkis<br/>one stripped Rust binary"]
    D["/data — your cache, on a volume"]
    U["user: crowkis · non-root"]
  end
  subgraph NOT["deliberately absent"]
    N1["no shell tooling"]
    N2["no package manager"]
    N3["no source code"]
    N4["no Python · no PyPI"]
  end
  IMG ~~~ NOT
  style IMG fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
        caption: "The whole supply-chain argument, in one box.",
      },
      {
        kind: "h2",
        text: "The standing rule",
      },
      {
        kind: "p",
        text: "Every release passes the same gate: full Rust suite, Docker build, boot, health, auth boundary, durability drill. A release that lowers any of those bars doesn't ship. That rule is the product as much as any feature is — because a cache is only worth using if you stop thinking about it.",
      },
    ],
  },
];
