import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://crowkis.com"),
  title: {
    default: "Crowkis, the semantic LLM cache & agent memory layer, in Rust",
    template: "%s | Crowkis",
  },
  description:
    "Crowkis is a Redis-compatible semantic cache and long-term agent memory layer built in Rust for LLM and agentic AI workloads. It understands what a query means, gives agents memory that survives restarts, blocks cache poisoning, and cuts LLM cost, self-hosted, zero-egress.",
  keywords: [
    "Crowkis",
    "LLM cache",
    "semantic cache",
    "semantic caching",
    "agent memory",
    "long-term memory for LLM agents",
    "agentic AI",
    "AI agents",
    "MCP server",
    "Model Context Protocol",
    "RAG cache",
    "prompt caching",
    "vector cache",
    "AI gateway",
    "LLM cost reduction",
    "LLM infrastructure",
    "Redis compatible",
    "GPTCache alternative",
    "cache poisoning",
    "Rust",
  ],
  applicationName: "Crowkis",
  authors: [{ name: "Crowkis" }],
  creator: "Crowkis",
  category: "technology",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: "Crowkis",
    url: "https://crowkis.com",
    title: "Crowkis, the semantic LLM cache & agent memory layer, in Rust",
    description:
      "Redis-compatible semantic cache and long-term agent memory for LLM and agentic AI workloads. Self-hosted, zero-egress, built in Rust.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Crowkis" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crowkis, semantic LLM cache & agent memory",
    description:
      "Redis-compatible semantic cache and long-term agent memory for LLM & agentic AI. Self-hosted, zero-egress, in Rust.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/fav.png",
  },
};

// Structured data so search engines understand Crowkis as a product, an
// organization, and a website — strengthens the brand entity + sitelinks.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://crowkis.com/#software",
      name: "Crowkis",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "LLM cache & agent memory",
      operatingSystem: "macOS, Linux, Windows, Docker",
      description:
        "Redis-compatible semantic cache and long-term agent memory layer built in Rust for LLM and agentic AI workloads.",
      url: "https://crowkis.com",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      keywords:
        "LLM cache, semantic cache, agent memory, agentic AI, MCP server, RAG cache, prompt caching, LLM cost reduction, Rust",
      publisher: { "@id": "https://crowkis.com/#org" },
    },
    {
      "@type": "Organization",
      "@id": "https://crowkis.com/#org",
      name: "Crowkis",
      url: "https://crowkis.com",
      logo: "https://crowkis.com/logo.png",
      description:
        "Crowkis builds a Redis-compatible semantic cache and long-term agent memory layer in Rust for LLM and agentic AI workloads.",
    },
    {
      "@type": "WebSite",
      "@id": "https://crowkis.com/#website",
      name: "Crowkis",
      url: "https://crowkis.com",
      publisher: { "@id": "https://crowkis.com/#org" },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* set theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem('crowkis-theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className="antialiased">
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4DQX8X4HM0"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-4DQX8X4HM0');`}
        </Script>
        {children}
      </body>
    </html>
  );
}
