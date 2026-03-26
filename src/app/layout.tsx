import type { Metadata } from "next";
import { Pinyon_Script } from "next/font/google";
import "./globals.css";

const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
});

export const metadata: Metadata = {
  title: "Crowkis — The intelligent LLM response router",
  description:
    "The intelligent brain that decides how LLM responses are reused – safely, efficiently, and at scale. Built in Rust.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pinyonScript.variable}>
      <body>{children}</body>
    </html>
  );
}
