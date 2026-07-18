import { RoostBlock, RoostPost } from "@/lib/content/roost";

/**
 * The Roost library: ~100 posts are authored as compact specs and assembled
 * into full posts here. Every spec carries its own prose; the builder only
 * arranges blocks and attaches the chosen diagram.
 */

export type ChartKey =
  | "repeat-bill"
  | "read-path"
  | "write-trust"
  | "migration"
  | "supply-chain"
  | "drop-in"
  | "agent-fanout"
  | "budget-wall";

export type PostSpec = {
  slug: string;
  title: string;
  date: string;
  tag: string;
  summary: string;
  /** 4+ paragraphs of body prose, in order */
  paras: string[];
  /** optional "In plain words" callout, placed after the first paragraph */
  plain?: string;
  /** venn comparison, left circle label (right is always Crowkis) */
  venn?: { left: string; overlap: string; leftItems?: string[]; rightItems?: string[]; caption?: string };
  /** or a shared mermaid chart */
  chart?: ChartKey;
  /** heading for the closing paragraph */
  closing?: string;
};

const CHARTS: Record<ChartKey, { title: string; chart: string; caption: string }> = {
  "repeat-bill": {
    title: "what repeated traffic costs without crowkis",
    chart: `flowchart TD
  Q1["'how do refunds work?'"] --> L1["model call · $$ · 2s"]
  Q2["'what's the refund window?'"] --> L2["model call · $$ · 2s"]
  Q3["'refund timeline?'"] --> L3["model call · $$ · 2s"]
  L1 --> A["the same answer, three times"]
  L2 --> A
  L3 --> A
  style A fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
    caption: "Every paraphrase is a fresh bill, unless the cache understands meaning.",
  },
  "read-path": {
    title: "the crowkis read path, five gates, every one can veto",
    chart: `flowchart TD
  Q["incoming query"] --> I["intent classifier"]
  I --> T["template match"]
  T --> V["HNSW neighbours"]
  V --> C["confidence gate"]
  C --> TR["trust + freshness"]
  TR -- pass --> A["answer · <1ms"]
  I -. veto .-> M["(nil) → your model"]
  T -. veto .-> M
  V -. veto .-> M
  C -. veto .-> M
  TR -. veto .-> M
  style A fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style M fill:#f3eee5`,
    caption: "Reuse only when meaning, structure, confidence, and trust all agree.",
  },
  "write-trust": {
    title: "the write-trust pipeline",
    chart: `flowchart TD
  W["candidate write"] --> S1["coherence · 0.30"]
  S1 --> S2["content · 0.10"]
  S2 --> S3["source trust · 0.30"]
  S3 --> S4["isolation · 0.15"]
  S4 --> S5["neighbourhood · 0.15"]
  S5 --> G{"composite ≥ 0.75?"}
  G -- yes --> OK["accepted"]
  G -- no --> NO["refused + ledger entry"]
  style OK fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px
  style NO fill:#f3eee5`,
    caption: "Five stages score every write before it can ever be served.",
  },
  migration: {
    title: "model upgrades without the cold start",
    chart: `flowchart LR
  OLD["gpt-4o cache · warm"] --> CAN["canary: slice of traffic<br/>on the new model"]
  CAN --> CMP{"quality holds?"}
  CMP -- yes --> MIG["migrate entries with leasing"]
  MIG --> NEW["new model · cache still warm"]
  CMP -- no --> STAY["stay, nothing lost"]
  style NEW fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
    caption: "The upgrade is a workflow, not a leap of faith.",
  },
  "supply-chain": {
    title: "what's in the runtime image",
    chart: `flowchart LR
  subgraph IMG["crowkis/crowkis:latest"]
    B["one stripped Rust binary"]
    D["/data volume"]
    U["non-root user"]
  end
  subgraph NOT["deliberately absent"]
    N1["no Python · no PyPI"]
    N2["no package manager"]
    N3["no dependency tree"]
  end
  IMG ~~~ NOT
  style IMG fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
    caption: "One file to security-review. No supply chain to poison.",
  },
  "drop-in": {
    title: "adoption is one port change",
    chart: `flowchart LR
  APP["your app<br/>redis-py · ioredis · Lettuce"] -- "RESP3 :6379" --> CK["crowkis"]
  AGENT["claude code · agents"] -- MCP --> CK
  SVC["services"] -- gRPC --> CK
  CK -- "only on a miss" --> LLM["your LLM provider"]
  style CK fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
    caption: "Four doors in, one cache, and the model only sees genuinely new questions.",
  },
  "agent-fanout": {
    title: "agent fan-out, cached",
    chart: `flowchart TD
  A1["agent 1: 'what's the schema?'"] --> CK["crowkis"]
  A2["agent 2: 'schema for orders?'"] --> CK
  A3["agent 3: 'show orders schema'"] --> CK
  A4["agent 4: 'orders table layout?'"] --> CK
  CK -- "1 model call" --> LLM["provider"]
  CK -- "3 semantic hits · <1ms" --> DONE["answers"]
  style CK fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
    caption: "Five agents asking one question should cost one answer.",
  },
  "budget-wall": {
    title: "the budget wall, enforced locally",
    chart: `flowchart LR
  LOOP["runaway agent loop"] --> KEY["virtual API key<br/>budget + TPM/RPM limits"]
  KEY -- "under budget" --> CK["crowkis → provider"]
  KEY -- "wall hit" --> STOP["blocked · alert fired"]
  style STOP fill:#fbe9e8,stroke:#d62221,stroke-width:2.5px`,
    caption: "The wall is enforced before the invoice, not discovered on it.",
  },
};

export function buildPosts(specs: PostSpec[]): RoostPost[] {
  return specs.map((spec) => {
    const blocks: RoostBlock[] = [];
    blocks.push({ kind: "p", text: spec.paras[0] });
    if (spec.plain) blocks.push({ kind: "plain", text: spec.plain });
    if (spec.paras[1]) blocks.push({ kind: "p", text: spec.paras[1] });

    if (spec.venn) {
      blocks.push({
        kind: "venn",
        title: `${spec.venn.left.toLowerCase()} vs crowkis`,
        left: spec.venn.left,
        right: "Crowkis",
        overlap: spec.venn.overlap,
        leftItems: spec.venn.leftItems,
        rightItems: spec.venn.rightItems,
        caption: spec.venn.caption,
      });
    } else if (spec.chart) {
      const c = CHARTS[spec.chart];
      blocks.push({ kind: "diagram", title: c.title, chart: c.chart, caption: c.caption });
    }

    for (const para of spec.paras.slice(2, -1)) {
      blocks.push({ kind: "p", text: para });
    }
    blocks.push({ kind: "h2", text: spec.closing ?? "The bottom line" });
    blocks.push({ kind: "p", text: spec.paras[spec.paras.length - 1] });

    const words =
      spec.paras.join(" ").split(/\s+/).length +
      (spec.plain?.split(/\s+/).length ?? 0) +
      spec.summary.split(/\s+/).length;

    return {
      slug: spec.slug,
      title: spec.title,
      date: spec.date,
      readMinutes: Math.max(3, Math.round(words / 200)),
      tag: spec.tag,
      summary: spec.summary,
      blocks,
    };
  });
}
