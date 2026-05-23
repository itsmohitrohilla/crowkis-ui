import { ClaimBlock } from "@/lib/content/types";

export const heroNarrative: ClaimBlock = {
  title: "The safe, intelligent cache layer between your app and your LLM",
  body: "Crowkis is Redis-compatible, built in Rust, and designed to reuse responses only when confidence, structure, freshness, and safety checks pass.",
  source: "crowkis/README.md",
  confidence: "high",
  tone: "claim-safe",
};

export const positioningClaims: ClaimBlock[] = [
  {
    title: "Semantic plus structural matching",
    body: "Crowkis combines semantic similarity with structure-aware matching to reduce unsafe cache reuse.",
    source: "crowkis/crowkis.docs/CROWKIS_USP_AND_FEATURE_POSITIONING.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "Reasoning reuse",
    body: "Crowkis can reuse reasoning patterns in addition to response values for deeper savings opportunities.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "Migration and canary workflows",
    body: "Crowkis includes canary and migration controls to help preserve warm cache value during model transitions.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "Enterprise-safe control plane",
    body: "Security controls include RBAC, API keys, tenant isolation, PII handling paths, and compliance reporting surfaces.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
];

export const personaStrips = [
  {
    persona: "Developer",
    value: "Drop-in Redis ergonomics, SDK quickstarts, RESP/gRPC integration paths.",
  },
  {
    persona: "Operator",
    value: "Live dashboard metrics, tenant views, migrations, canary controls, and fallback routing.",
  },
  {
    persona: "Security",
    value: "Anti-poisoning checks, PII controls, access boundaries, and audit/compliance evidence.",
  },
  {
    persona: "Executive",
    value: "Cost saved, hit quality, blocked-risk visibility, and deployment confidence signals.",
  },
];
