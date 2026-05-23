import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";
import { benchmarkNotes } from "@/lib/content/benchmarks";

export const metadata: Metadata = {
  title: "Benchmarks",
  description: "Methodology-first benchmark positioning for Crowkis with claim-safe scope boundaries.",
};

export default function BenchmarksPage() {
  return (
    <ContentPage
      eyebrow="Benchmarks"
      title="Evidence and measurement posture"
      intro="Benchmark narratives are positioned as methodology-led and scope-limited to avoid inflated performance claims."
      sections={benchmarkNotes.map((item) => ({
        title: item.title,
        body: item.body,
        source: item.source,
      }))}
    />
  );
}
