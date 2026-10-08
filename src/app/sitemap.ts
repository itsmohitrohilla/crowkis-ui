import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.crowkis.com";
  const routes = [
    "",
    "/why",
    "/murder",
    "/enterprise",
    "/about",
    "/docker",
    "/use-cases",
    "/security",
    "/benchmarks",
    "/docs",
    "/docs/quickstart",
    "/docs/docker",
    "/docs/commands",
    "/docs/configuration",
    "/docs/security",
    "/docs/sdk-python",
    "/docs/sdk-node",
    "/docs/frameworks",
    "/features",
    "/agent-memory",
    "/integrations",
    "/changelog",
    "/roadmap",
    "/faq",
    "/feedback",
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
