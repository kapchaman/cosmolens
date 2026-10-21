import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/shell/AppShell";
import "./globals.css";
import { getSiteUrl, isIndexingEnabled } from "@/lib/site";

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
  themeColor: "#050607",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
