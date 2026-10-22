import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";
import { getSiteUrl, isIndexingEnabled } from "@/lib/site";
import localFont from "next/font/local";

const inter = localFont({ src: "../../public/fonts/inter-latin-wght-normal.woff2", variable: "--font-inter", display: "swap", weight: "100 900", fallback: ["Arial", "sans-serif"] });
const space = localFont({ src: "../../public/fonts/space-grotesk-latin-wght-normal.woff2", variable: "--font-space", display: "swap", weight: "300 700", fallback: ["Arial", "sans-serif"] });
const mono = localFont({ src: "../../public/fonts/ibm-plex-mono-latin-400-normal.woff2", variable: "--font-science", display: "swap", fallback: ["Courier New", "monospace"] });

export const metadata: Metadata = {
  title: "CosmoLens",
  description: "Explore the universe. Understand the unknown.",
  applicationName: "CosmoLens",
  metadataBase: getSiteUrl(),
  robots: { index: isIndexingEnabled(), follow: isIndexingEnabled() },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080C14",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${space.variable} ${mono.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
