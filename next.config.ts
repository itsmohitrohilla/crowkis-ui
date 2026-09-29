import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg is a native-ish Node module; keep it out of the bundle (server-only).
  serverExternalPackages: ["pg"],
  // The blog (The Roost) was removed; send old indexed URLs home.
  async redirects() {
    return [
      { source: "/roost", destination: "/", permanent: true },
      { source: "/roost/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
