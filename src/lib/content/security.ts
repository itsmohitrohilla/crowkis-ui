import { ClaimBlock } from "@/lib/content/types";

export const securityClaims: ClaimBlock[] = [
  {
    title: "Anti-poisoning pipeline",
    body: "Crowkis treats write safety as a core product concern with multi-stage checks before reuse.",
    source: "crowkis/crowkis.docs/CROWKIS_USP_AND_FEATURE_POSITIONING.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "PII and tenant boundaries",
    body: "PII scrubbing, tenant isolation, and erasure-oriented management surfaces are part of current scope.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
  {
    title: "Access and control",
    body: "RBAC users, API keys, sessions, and SAML config surface are available in management workflows.",
    source: "crowkis/README.md",
    confidence: "high",
    tone: "claim-safe",
  },
];

export const securityDefaults = [
  "Local bind defaults for safer local development posture.",
  "Management auth required on non-loopback deployments by default.",
  "Prompt preview logging disabled by default for safer operations.",
];
