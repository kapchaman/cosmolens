import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Navigation } from "@/components/shell/Navigation";
import { SearchCommand } from "@/components/search/SearchCommand";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-[color:var(--border)] bg-[rgba(5,6,7,0.82)] backdrop-blur-xl">
        <div className="app-container flex min-h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label="CosmoLens home">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--border)] bg-[color:var(--surface)]">
              <Sparkles aria-hidden="true" size={17} color="var(--accent)" />
            </span>
            <span>
              <span className="block text-sm font-bold tracking-[0.18em]">COSMOLENS</span>
              <span className="hidden text-xs text-[color:var(--muted)] sm:block">
                Explore the universe. Understand the unknown.
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Navigation />
            <SearchCommand />
          </div>
        </div>
      </header>
      <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">{children}</main>
      <footer className="border-t border-[color:var(--border)] py-8">
        <div className="app-container flex flex-col justify-between gap-3 text-sm text-[color:var(--muted)] md:flex-row">
          <span>CosmoLens is built around sourced astronomy, explicit uncertainty, and contextual AI.</span>
          <span>Sourced exploration • AI temporarily offline</span>
        </div>
      </footer>
    </div>
  );
}
