import { Metadata } from "next";
import { ContentPage } from "@/components/marketing/content-page";

export const metadata: Metadata = {
  title: "Integrations",
  description: "SDK, protocol, and automation integration paths currently documented for Crowkis.",
};

const integrationSections = [
  {
    title: "Python SDK",
    body: "Python client supports semantic caching workflows, migration-aware options, and framework-oriented examples.",
    source: "crowkis/sdk/python/README.md",
  },
  {
    title: "Node SDK",
    body: "Node SDK includes typed client patterns and cache hit metadata for application-level integration.",
    source: "crowkis/sdk/node/README.md",
  },
  {
    title: "Protocol options",
    body: "Integration surfaces include RESP commands, management HTTP API, and gRPC h2c.",
    source: "crowkis/README.md",
  },
  {
    title: "Operational automation",
    body: "Docker smoke and release-gate scripts provide automation paths for CI and pre-release confidence checks.",
    source: "crowkis/scripts/crowkis_release_gate.sh",
  },
];

export default function IntegrationsPage() {
  return (
    <ContentPage
      eyebrow="Integrations"
      title="SDK and protocol integrations"
      intro="Crowkis exposes several integration paths for application teams and platform engineers."
      sections={integrationSections}
    />
  );
}
