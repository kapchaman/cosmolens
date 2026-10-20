import Link from "next/link";
import { Search, Sparkles } from "lucide-react";
import { SearchCommand } from "@/components/search/SearchCommand";

const navItems = [
  { href: "/", label: "Explore" },
  { href: "/atlas", label: "Atlas" },
  { href: "/compare", label: "Compare" },
  { href: "/journeys", label: "Journeys" },
  { href: "/lab", label: "Lab" },
  { href: "/observe", label: "Observe" },
  { href: "/my-cosmos", label: "My Cosmos" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-shell">
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

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="button button-ghost min-h-9 px-3 text-sm">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <SearchCommand
              trigger={
                <button className="button button-ghost min-h-9 px-3" type="button">
                  <Search aria-hidden="true" size={16} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              }
            />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[color:var(--border)] py-8">
        <div className="app-container flex flex-col justify-between gap-3 text-sm text-[color:var(--muted)] md:flex-row">
          <span>CosmoLens is built around sourced astronomy, explicit uncertainty, and contextual AI.</span>
          <span>Phase 1 foundation</span>
        </div>
      </footer>
    </div>
  );
}
