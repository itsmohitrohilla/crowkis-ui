export const navLinks = [
  { label: "Product", href: "/product" },
  { label: "Use Cases", href: "/use-cases" },
  { label: "Security", href: "/security" },
  { label: "Benchmarks", href: "/benchmarks" },
  { label: "Docs", href: "/docs" },
];

export const heroStats = [
  { label: "Median cache latency", value: "Sub-1ms" },
  { label: "Model spend reduced", value: "30-70%" },
  { label: "Protocols", value: "RESP + gRPC + HTTP" },
];

export const uspCards = [
  {
    title: "Safe semantic cache",
    body: "Combines semantic plus structural matching so similar does not mean unsafe reuse.",
  },
  {
    title: "Reasoning reuse",
    body: "Stores and reuses reasoning patterns to save beyond response-only caching.",
  },
  {
    title: "Migration without cold starts",
    body: "Canary and migration workflows preserve warm cache value during model upgrades.",
  },
  {
    title: "Enterprise-safe control plane",
    body: "PII scrubbing, RBAC, API keys, tenant isolation, and compliance reporting built in.",
  },
];

export const howItWorksSteps = [
  {
    title: "1. Intercept",
    text: "Crowkis sits between your app and LLM provider with Redis-compatible ergonomics.",
  },
  {
    title: "2. Understand",
    text: "Each request gets semantic, structural, confidence, freshness, and safety analysis.",
  },
  {
    title: "3. Decide",
    text: "Crowkis either serves a trusted reuse hit or routes to provider fallback safely.",
  },
  {
    title: "4. Learn",
    text: "Dashboard and APIs expose hit quality, cost saved, blocks, and migration status.",
  },
];

export const featureRows = [
  ["Cache core", "RESP commands + CSET/CGET/CSIM, WAL + SSTables + TTL"],
  ["Intelligence", "HNSW vector index, template extraction, intent + confidence scoring"],
  ["Security", "Anti-poisoning pipeline, PII scrubbing, tenant isolation"],
  ["Operations", "Dashboard, management APIs, canary/migration, federation fallback"],
  ["Developer adoption", "Python and Node SDKs, Redis-like integration model"],
];

export const appMetrics = [
  { label: "Saved today", value: "$1,240.80", delta: "+12.4%" },
  { label: "Hit rate", value: "67.9%", delta: "+4.1%" },
  { label: "Tokens saved", value: "2.1M", delta: "+320K" },
  { label: "Security blocked", value: "12", delta: "-3" },
];

export const hitBreakdown = [
  { kind: "Dual hit", value: "1,821", tint: "text-brand-mint" },
  { kind: "Vector", value: "923", tint: "text-brand-neon" },
  { kind: "Structural", value: "441", tint: "text-brand-violet" },
  { kind: "Reasoning", value: "89", tint: "text-pink-300" },
];

export const tenantRows = [
  ["acme-corp", "2,841", "71.2%", "1.4M", "$21.00", "3"],
  ["demo-tenant", "980", "52.1%", "380K", "$5.70", "0"],
  ["internal", "1,000", "58.0%", "490K", "$7.35", "9"],
];

export const modelRows = [
  ["gpt-4o", "2,341", "1.2M", "$18.00"],
  ["gpt-4o-mini", "1,840", "620K", "$0.93"],
  ["claude-sonnet", "420", "280K", "$4.20"],
  ["gemini-pro", "220", "145K", "$2.18"],
];

export const liveFeed = [
  '12:04:33  acme-corp   DUAL HIT     gpt-4o      conf 0.94   "What are tax implications..."',
  '12:04:31  demo        VECTOR       mini        conf 0.89   "List remote work benefits..."',
  '12:04:29  acme-corp   MISS         gpt-4o      conf --     "Explain quantum entanglement..."',
  '12:04:27  internal    BLOCKED      --          stage3      "Ignore previous instructions..."',
];
