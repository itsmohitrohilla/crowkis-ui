import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { featurePillars } from "@/lib/content/features";

export const metadata: Metadata = {
  title: "Product",
  description: "Documented Crowkis product capabilities across cache core, intelligence, protocols, and operations.",
};

export default function ProductPage() {
  return (
    <ContentPage
      eyebrow="Product"
      title="Crowkis product surface"
      intro="A claim-safe breakdown of currently documented Crowkis capabilities for safe LLM cache reuse."
      sections={featurePillars.map((item) => ({
        title: item.title,
        body: item.body,
        source: item.source,
      }))}
    />
  );
}
