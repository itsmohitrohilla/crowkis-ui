import { SiteShell } from "@/components/layout/site-shell";
import {
  HeroSection,
  FactStrip,
  UspTrio,
  ProblemTeaser,
  UseCasesSection,
  DropInSection,
  DockerMcpStrip,
  FounderSection,
  FinalCta,
} from "@/components/marketing/marketing-sections";

export default function Home() {
  return (
    <SiteShell>
      <HeroSection />
      <FactStrip />
      <UspTrio />
      <ProblemTeaser />
      <UseCasesSection />
      <DropInSection />
      <DockerMcpStrip />
      <FounderSection />
      <FinalCta />
    </SiteShell>
  );
}
