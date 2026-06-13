import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "What shipped in Crowkis: the engine, the protocol surface, the control plane, MCP, and the hardening that backs them.",
};

const changelogBlocks = [
  {
    title: "The full engine, shipped",
    body: "CrowkisDB LSM store with WAL durability, HNSW vector index, and all seven intelligence systems — semantic + structural matching, anti-poisoning, adaptive thresholds, reasoning reuse, smart eviction, confidence scoring, freshness control — live in every edition.",
  },
  {
    title: "Four protocol surfaces",
    body: "RESP3 for drop-in Redis clients, gRPC h2c for protobuf shops, the REST management API, and the MCP server for Claude Code and agent frameworks. One cache behind all four.",
  },
  {
    title: "Hardened Docker distribution",
    body: "Single binary-only image on Docker Hub and GHCR, amd64 + arm64, non-root, read-only filesystem, dropped capabilities, built-in health checks. Upgrades are a pull and a restart.",
  },
  {
    title: "The control plane",
    body: "Dashboard with live verdict feed, per-tenant budgets, canary and migration workflows, PII and compliance reporting, RBAC and API keys — auditable through the same REST API it runs on.",
  },
  {
    title: "Release discipline",
    body: "Every release passes the same gate: the 347-test Rust suite, Docker build, boot, health, auth boundary, and a restart-durability drill. A release that lowers any bar doesn't ship.",
  },
  {
    title: "Enterprise unlocks",
    body: "Virtual API keys with budgets and rate limits, Crowkis Replay, prompt management, agent and tool-call caches, Provider Arbitrage Router, cross-provider cache bridge, compliance modes, SSO, and audit export — all license-gated in the same image.",
  },
];

export default function ChangelogPage() {
  return (
    <ContentPage
      eyebrow="Changelog"
      title="What's shipped"
      intro="The short version of what's inside the image you pull today — and the discipline behind how it got there."
      sections={changelogBlocks}
    />
  );
}
