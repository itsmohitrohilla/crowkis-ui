import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg is a native-ish Node module; keep it out of the bundle (server-only).
  serverExternalPackages: ["pg"],
  // /product was merged into /features; keep old links and search results working.
  redirects: async () => [{ source: "/product", destination: "/features", permanent: true }],
};

export default nextConfig;
