import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { useCases } from "@/lib/content/useCases";

export const metadata: Metadata = {
  title: "Use Cases",
  description: "Use-case patterns for deploying Crowkis in support platforms, copilots, and migration-heavy environments.",
};

export default function UseCasesPage() {
  return (
    <ContentPage
      eyebrow="Use Cases"
      title="Where Crowkis fits best"
      intro="Use-case patterns derived from Crowkis positioning and currently documented capability boundaries."
      sections={useCases.map((item) => ({
        title: item.title,
        body: item.summary,
        source: "crowkis/README.md",
      }))}
    />
  );
}
