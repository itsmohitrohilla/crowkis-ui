import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg is a native-ish Node module; keep it out of the bundle (server-only).
  serverExternalPackages: ["pg"],
};

export default nextConfig;
