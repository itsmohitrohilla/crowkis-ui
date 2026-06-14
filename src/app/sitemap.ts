import { MetadataRoute } from "next";
import { allRoostPosts } from "@/lib/content/library";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://crowkis.io";
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
    "/docs/mcp",
    "/roost",
    "/mcp",
    ...allRoostPosts.map((post) => `/roost/${post.slug}`),
    "/integrations",
    "/changelog",
    "/roadmap",
    "/faq",
    "/app/dashboard",
  ];

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
