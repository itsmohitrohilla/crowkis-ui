import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "Crowkis roadmap framing that distinguishes current beta scope from future exploration.",
};

const roadmapBlocks = [
  {
    title: "Near-term",
    body: "Stabilize current beta scope, enforce test gates, and package onboarding for real user feedback loops.",
    source: "crowkis/crowkis.docs/CROWKIS_USP_AND_FEATURE_POSITIONING.md",
  },
  {
    title: "Mid-term",
    body: "Improve benchmark depth, operational workflows, and production confidence in migration and federation controls.",
    source: "crowkis/crowkis.docs/CROWKIS_MARKET_LEADER_STRATEGY.md",
  },
  {
    title: "Future ideas (not current promises)",
    body: "Audio cache, advanced agent checkpointing, and additional intelligent routing paths are listed as later-stage ideas.",
    source: "crowkis/crowkis.docs/CROWKIS_USP_AND_FEATURE_POSITIONING.md",
  },
];

export default function RoadmapPage() {
  return (
    <ContentPage
      eyebrow="Roadmap"
      title="Roadmap and scope boundaries"
      intro="Roadmap communication distinguishes current beta claims from future exploration topics."
      sections={roadmapBlocks}
    />
  );
}
