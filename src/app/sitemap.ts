import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://crowkis.com";
  const routes = [
    "",
    "/why",
    "/murder",
    "/product",
    "/enterprise",
    "/about",
    "/docker",
    "/use-cases",
    "/security",
    "/benchmarks",
    "/docs",
    "/docs/docker",
    "/docs/commands",
    "/docs/configuration",
    "/docs/security",
    "/docs/sdk-python",
    "/docs/sdk-node",
    "/docs/frameworks",
    "/docs/mcp",
    "/mcp",
    "/features",
    "/agent-memory",
    "/integrations",
    "/changelog",
    "/roadmap",
    "/faq",
    "/feedback",
    "/app/dashboard",
  ];

  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  return staticEntries;
}
