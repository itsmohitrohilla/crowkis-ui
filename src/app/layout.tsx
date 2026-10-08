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
  metadataBase: new URL("https://www.crowkis.com"),
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
  alternates: { canonical: "./" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    siteName: "Crowkis",
    url: "./",
  },
  // title, description and image are left to each page (and opengraph-image.tsx)
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/fav.svg", type: "image/svg+xml" },
      { url: "/fav.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/fav.png",
  },
};

// Structured data so search engines understand Crowkis as a product, an
// organization, and a website — strengthens the brand entity + sitelinks.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.crowkis.com/#software",
      name: "Crowkis",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "LLM cache & agent memory",
      operatingSystem: "macOS, Linux, Windows, Docker",
      description:
        "Redis-compatible semantic cache and long-term agent memory layer built in Rust for LLM and agentic AI workloads.",
      url: "https://www.crowkis.com",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      keywords:
        "LLM cache, semantic cache, agent memory, agentic AI, RAG cache, prompt caching, LLM cost reduction, Rust",
      publisher: { "@id": "https://www.crowkis.com/#org" },
    },
    {
      "@type": "Organization",
      "@id": "https://www.crowkis.com/#org",
      name: "Crowkis",
      url: "https://www.crowkis.com",
      logo: "https://www.crowkis.com/logo.png",
      description:
        "Crowkis builds a Redis-compatible semantic cache and long-term agent memory layer in Rust for LLM and agentic AI workloads.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.crowkis.com/#website",
      name: "Crowkis",
      url: "https://www.crowkis.com",
      publisher: { "@id": "https://www.crowkis.com/#org" },
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
