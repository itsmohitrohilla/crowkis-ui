import { ClaimBlock } from "@/lib/content/types";

export const featurePillars: ClaimBlock[] = [
  {
    title: "Cache Core",
    body: "Durable engine with WAL, memtable, SSTables, compaction, TTL, and block cache primitives.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "Intelligence Layer",
    body: "HNSW retrieval, intent/template signals, confidence/freshness checks, and semantic dedup paths.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "Protocol Surface",
    body: "RESP command support plus management HTTP and gRPC h2c APIs for platform integration.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "Operations",
    body: "Dashboard insights, migration controls, federation fallback routes, and release gate scripts.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
];

export const howItWorksDeep = [
  "Intercept requests between app and LLM endpoint using Redis-compatible patterns.",
  "Compute semantic + structural + policy confidence signals.",
  "Serve trusted reuse on hit, or route safely to provider/fallback on miss.",
  "Record operational evidence for savings, risk, and migration status.",
];
