export const docsSections = [
  {
    title: "Getting Started",
    items: ["Local Rust quick start", "Docker quick start", "First CSET/CGET flow"],
    source: "crowkis/README.md",
  },
  {
    title: "Core Concepts",
    items: ["Hit types", "Confidence and freshness", "Safe miss vs unsafe hit"],
    source: "crowkis/crowkis.docs/CROWKIS_USP_AND_FEATURE_POSITIONING.md",
  },
  {
    title: "API Surfaces",
    items: ["RESP commands", "gRPC h2c", "Management API endpoints"],
    source: "crowkis/README.md",
  },
  {
    title: "SDKs",
    items: ["Python SDK", "Node SDK", "Framework examples"],
    source: "crowkis/sdk/python/README.md + crowkis/sdk/node/README.md",
  },
  {
    title: "Deployment and Hardening",
    items: ["Auth defaults", "Memory and capacity knobs", "Production Docker test gates"],
    source: "crowkis/DOCKER_USER_GUIDE.md",
  },
  {
    title: "Testing and Release",
    items: ["Deep test matrix", "Beta launch checklist", "Release gate script"],
    source: "crowkis/crowkis.docs/CROWKIS_DEEP_TEST_MATRIX.md",
  },
];
