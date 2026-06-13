import { ClaimBlock } from "@/lib/content/types";

export const benchmarkNotes: ClaimBlock[] = [
  {
    title: "Current benchmark posture",
    body: "Crowkis benchmarking documents focus on proving measurable value while avoiding overclaims beyond tested scope.",
    source: "crowkis/crowkis.docs/CROWKIS_VECTOR_BENCHMARKING.md",
    confidence: "medium",
    tone: "claim-safe",
  },
  {
    title: "Methodology-first communication",
    body: "Benchmark narratives emphasize dataset/workload/machine transparency and staged benchmark goals.",
    source: "crowkis/crowkis.docs/CROWKIS_MARKET_LEADER_STRATEGY.md",
    confidence: "high",
    tone: "claim-safe",
  },
];

export const proofBlocks = [
  "Docker smoke and release gate scripts exist for pre-ship confidence checks.",
  "Deep test matrix explicitly tracks covered, partial, and needed validation areas.",
  "Release gates enforce feature boundaries and hardening discipline on every build.",
];
