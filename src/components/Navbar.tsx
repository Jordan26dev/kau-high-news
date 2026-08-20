"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "News", href: "/categories/News" },
  { label: "Sports", href: "/categories/Sports" },
  { label: "Clubs", href: "/categories/Clubs" },
  { label: "Authors", href: "/authors/jordan-virgo" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className={`site-header border-b border-[#5b1212] bg-[#fffdf7] text-[#5b1212] ${isHome ? "site-header-home" : ""}`}>
      <div className="site-header-inner mx-auto flex w-full max-w-7xl flex-col px-4 sm:px-6">
        <div className="flex items-center justify-between border-b border-[#d9c7ae] py-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#7f1919]">
          <span>Kau High School newsroom</span>
          <span className="hidden sm:inline">Student journalism • Hawaiʻi</span>
          <span>Today&apos;s paper</span>
        </div>

        <Link href="/" className={`block text-center ${isHome ? "site-header-title-home" : "py-5"}`}>
          <span className="masthead-title masthead-gradient block font-serif font-black uppercase">
            KAU HIGH NEWS
          </span>
        </Link>

        <nav className="border-t-2 border-b border-[#5b1212] py-2">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-wider sm:gap-x-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="inline-block px-1 py-1 transition hover:text-amber-700">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
