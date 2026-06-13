import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "Where Crowkis goes next: Kubernetes packaging, deeper observability, and the workloads coming to the cache.",
};

const roadmapBlocks = [
  {
    title: "Kubernetes, first-class",
    body: "A Helm chart with sane values — replicas, persistence size, license secret, probes wired to /health — so the path Enterprise teams already take becomes a one-line install.",
  },
  {
    title: "Deeper observability",
    body: "OpenTelemetry trace export for per-query timelines, and the Reasoning DAG inspector so operators can see exactly which reasoning skeleton served a hit.",
  },
  {
    title: "Multi-region replication",
    body: "Replicated clusters with the same trust guarantees, so a warm cache in one region warms the next one.",
  },
  {
    title: "New cacheable workloads",
    body: "Audio caching, agent checkpointing, request coalescence, and RAG-specialized paths — extending the same five-veto reuse discipline to more of the LLM stack.",
  },
  {
    title: "What we won't do",
    body: "No phone-home, no usage metering, no cloud-account requirement, and no feature that requires trusting us with your traffic. The offline, self-hosted contract is permanent.",
  },
];

export default function RoadmapPage() {
  return (
    <ContentPage
      eyebrow="Roadmap"
      title="Where Crowkis goes next"
      intro="The direction of travel — and the lines we've committed never to cross."
      sections={roadmapBlocks}
    />
  );
}
