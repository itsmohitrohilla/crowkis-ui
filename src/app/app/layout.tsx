import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";

// The /app console is an interactive product demo, not content to rank.
// Give it a title and keep it out of the index so crawl budget goes to real pages.
export const metadata: Metadata = {
  title: "Console",
  robots: { index: false, follow: true },
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
