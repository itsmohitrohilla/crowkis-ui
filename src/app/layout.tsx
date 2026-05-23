import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Crowkis",
    template: "%s | Crowkis",
  },
  description:
    "Crowkis is the safe, infrastructure-grade LLM cache that understands meaning, reuses reasoning, and helps teams upgrade models without losing cache value.",
  keywords: ["Crowkis", "LLM cache", "semantic cache", "Redis compatible", "LLM infrastructure"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
