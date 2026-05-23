import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://crowkis.io";
  const routes = [
    "",
    "/product",
    "/use-cases",
    "/security",
    "/benchmarks",
    "/docs",
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
