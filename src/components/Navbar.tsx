import Link from "next/link";

const navItems = [
  { label: "Home", href: "/" },
  { label: "News", href: "/categories/News" },
  { label: "Sports", href: "/categories/Sports" },
  { label: "Clubs", href: "/categories/Clubs" },
  { label: "Authors", href: "/authors/jordan-virgo" },
];

export default function Navbar() {
  return (
    <header className="bg-slate-950 text-white shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight sm:text-3xl">
          Kau High News
        </Link>

        <nav>
          <ul className="flex flex-wrap gap-3 text-sm font-medium sm:gap-6 sm:text-base">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="transition hover:text-blue-300">
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
