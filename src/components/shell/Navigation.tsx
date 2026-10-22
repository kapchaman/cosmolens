"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const items = [
  { href: "/", label: "Explore" }, { href: "/atlas", label: "Atlas" },
  { href: "/compare", label: "Compare" }, { href: "/journeys", label: "Journeys" },
  { href: "/lab", label: "Lab" }, { href: "/observe", label: "Observe" },
  { href: "/discoveries", label: "Discoveries" }, { href: "/my-cosmos", label: "My Cosmos" },
];
export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`) || (href === "/atlas" && pathname.startsWith("/objects/"));
  return <div onKeyDown={(event) => { if (event.key === "Escape" && open) { setOpen(false); button.current?.focus(); } }}>
    <nav className="hidden items-center gap-1 xl:flex" aria-label="Main navigation">
      {items.map((item) => <Link key={item.href} href={item.href} className="button button-ghost min-h-11 px-2 text-sm" aria-current={active(item.href) ? "page" : undefined}>{item.label}</Link>)}
    </nav>
    <button ref={button} className="button button-ghost min-h-11 px-3 xl:hidden" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}</button>
    <nav id="mobile-navigation" hidden={!open} className="absolute inset-x-0 top-full max-h-[70dvh] overflow-y-auto border-b border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-xl xl:hidden" aria-label="Mobile navigation">
      <div className="app-container grid grid-cols-2 gap-2">{items.map((item) => <Link key={item.href} href={item.href} className="button button-ghost min-h-12 justify-start" aria-current={active(item.href) ? "page" : undefined} onClick={() => setOpen(false)}>{item.label}</Link>)}</div>
    </nav>
  </div>;
}
