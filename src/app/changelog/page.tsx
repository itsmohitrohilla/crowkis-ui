import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Documented progress themes across hardening, control-plane depth, and testing discipline.",
};

const changelogBlocks = [
  {
    title: "Beta hardening focus",
    body: "Current direction emphasizes correctness, auth safety, memory behavior, Docker confidence, and SDK polish.",
    source: "crowkis/README.md",
  },
  {
    title: "Control-plane depth",
    body: "Management API and dashboard surfaces continue to expand around migration, compliance, and tenant governance.",
    source: "crowkis/crowkis.docs/CROWKIS_DASHBOARD_PLAN.md",
  },
  {
    title: "Testing discipline",
    body: "Deep test matrix and release gate docs highlight explicit covered and remaining validation work.",
    source: "crowkis/crowkis.docs/CROWKIS_DEEP_TEST_MATRIX.md",
  },
];

export default function ChangelogPage() {
  return (
    <ContentPage
      eyebrow="Changelog"
      title="Recent project direction"
      intro="High-level updates based on documented progress and hardening priorities."
      sections={changelogBlocks}
    />
  );
}
