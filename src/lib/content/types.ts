export type ClaimTone = "claim-safe";
export type ClaimConfidence = "high" | "medium";

export type ClaimBlock = {
  title: string;
  body: string;
  source: string;
  confidence: ClaimConfidence;
  tone: ClaimTone;
};
