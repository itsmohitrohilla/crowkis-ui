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
  title: {
    default: "Crowkis — the LLM cache that knows when to say no",
    template: "%s | Crowkis",
  },
  description:
    "Crowkis is a Redis-compatible cache built in Rust for LLM workloads. It understands what a query means, checks whether a cached answer is safe to reuse, and only then serves it.",
  keywords: [
    "Crowkis",
    "LLM cache",
    "semantic cache",
    "Redis compatible",
    "Rust",
    "LLM infrastructure",
    "cache poisoning",
  ],
  icons: {
    icon: "/fav.png",
  },
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
