import { MetadataRoute } from "next";
import { allRoostPosts } from "@/lib/content/library";

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
    "/roost",
    "/mcp",
    "/features",
    "/agent-memory",
    "/integrations",
    "/changelog",
    "/roadmap",
    "/faq",
    "/app/dashboard",
  ];

  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  // Blog posts carry their real publish date, so crawlers see accurate freshness.
  const postEntries: MetadataRoute.Sitemap = allRoostPosts.map((post) => ({
    url: `${base}/roost/${post.slug}`,
    lastModified: new Date(`${post.date}T00:00:00Z`),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
