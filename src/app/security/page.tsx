import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { securityClaims } from "@/lib/content/security";

export const metadata: Metadata = {
  title: "Security",
  description: "Claim-safe overview of Crowkis security posture, access controls, and compliance-facing surfaces.",
};

export default function SecurityPage() {
  return (
    <ContentPage
      eyebrow="Security"
      title="Security and compliance posture"
      intro="Crowkis security messaging based on present documentation, with no roadmap-only guarantees."
      sections={securityClaims.map((item) => ({
        title: item.title,
        body: item.body,
        source: item.source,
      }))}
    />
  );
}
